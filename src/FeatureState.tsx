import { insert, remove, elem, intersection, fromArray } from "fp-ts/lib/Set";
import * as React from "react";
import { eqString } from "fp-ts/lib/Eq";
import { some, none } from "fp-ts/lib/Option";
import { filterMap } from "fp-ts/lib/Array";

export const fromStrArray = fromArray(eqString);
const insertStr = insert(eqString);
const removeStr = remove(eqString);
export const elemStr = elem(eqString);
const intersectStr = intersection(eqString);

export interface FeatureState {
  readonly features: Feature[];
  readonly forceEnable: Set<string>;
  readonly forceDisable: Set<string>;
  readonly defaultActive: Set<string>;
  readonly currentEnabled: Set<string>;
}

export interface Feature {
  readonly name: string;
  readonly description?: string;
}

interface DisableFeature {
  type: "disable";
  readonly feature: string;
}

interface ToggleFeature {
  type: "toggle";
  readonly feature: string;
}

interface SetDefaultFeatures {
  type: "set-default";
  readonly defaultEnabled: string[];
}

interface EnableFeature {
  type: "enable";
  readonly feature: string;
}

interface SetActiveFeatures {
  type: "set-active";
  readonly values: {
    on: string[];
    off: string[];
  };
}

export type EnableAction =
  | EnableFeature
  | DisableFeature
  | ToggleFeature
  | SetDefaultFeatures
  | SetActiveFeatures;

function getTest(state: FeatureState): (feature: string) => boolean {
  return feature => {
    const defaultEnabled = elemStr(feature, state.defaultActive);
    const forceOn = elemStr(feature, state.forceEnable);
    const forceOff = elemStr(feature, state.forceDisable);
    return forceOn || (defaultEnabled && !forceOff);
  };
}

function computeEnabled(state: FeatureState): FeatureState {
  const test = getTest(state);
  const getEnabledFeatures = filterMap<Feature, string>(a =>
    test(a.name) ? some(a.name) : none
  );
  return {
    ...state,
    currentEnabled: fromStrArray(getEnabledFeatures(state.features))
  };
}

export const reducer: React.Reducer<FeatureState, EnableAction> = (
  state,
  action
) => {
  // console.debug("REDUCE: \n++> %o\n++>%o\n ==> %o", state.forceDisable, state.forceDisable, action)
  switch (action.type) {
    case "enable": {
      if (!state.features.some(x => x.name === action.feature)) {
        return state;
      }
      const enableAction = state.defaultActive.has(action.feature)
        ? removeStr(action.feature)
        : insertStr(action.feature);
      const disableAction = removeStr(action.feature);
      return computeEnabled({
        ...state,
        forceEnable: enableAction(state.forceEnable),
        forceDisable: disableAction(state.forceEnable)
      });
    }

    case "disable": {
      if (!state.features.some(x => x.name === action.feature)) {
        return state;
      }
      return computeEnabled({
        ...state,
        forceEnable: removeStr(action.feature)(state.forceEnable),
        forceDisable: insertStr(action.feature)(state.forceEnable)
      });
    }

    case "toggle": {
      if (!state.features.some(x => x.name === action.feature)) {
        return state;
      }
      const current = elemStr(action.feature, state.defaultActive)
        ? !elemStr(action.feature, state.forceDisable)
        : elemStr(action.feature, state.forceEnable);
      return reducer(state, {
        type: current ? "disable" : "enable",
        feature: action.feature
      });
    }

    case "set-default": {
      return computeEnabled({
        ...state,
        defaultActive: fromStrArray(action.defaultEnabled)
      });
    }

    case "set-active": {
      const proposedOn = fromStrArray(action.values.on);
      const proposedOff = fromStrArray(action.values.off);
      const possible = fromStrArray(state.features.map(x => x.name));
      return computeEnabled({
        ...state,
        forceEnable: intersectStr(proposedOn, possible),
        forceDisable: intersectStr(proposedOff, possible)
      });
    }

    default:
      throw new Error("Unsupported action");
  }
};

export type DispatchFeature = React.Dispatch<EnableAction>;

import * as React from "react";
import { insert, remove, elem, intersection, fromArray } from "fp-ts/lib/Set";
import { eqString } from "fp-ts/lib/Eq";
export { ToggleFeatures } from "./ToggleFeatures";

type EnableContextType = (feature: string) => boolean;

/**
 * Contained function can check whether a given feature is enabled.
 */
export const EnableContext = React.createContext<EnableContextType>(
  _s => false
);

// Helper: get rid of some boilerplate.
// just input mashing and sanitation, removing extra renders, and getting test function
function testAndConvert(input?: string | string[] | null) : [EnableContextType, string[]] {
  if (Array.isArray(input) && input.length === 0 || input == null) {
    throw new Error("Can't have empty array of features")
  }
  const test = React.useContext(EnableContext);
  // We memoize just to prevent re-renders since this could be at the leaf of a tree
  const converted = React.useMemo(() => Array.isArray(input) ? input : [input], [input])
  return [test, converted]
}

/**
 * returns true iff all specified features are enabled
 */
export function useAllEnabled(allFeatures: string | string[]) {
  let [test, queryAllPresent] = testAndConvert(allFeatures)
  return queryAllPresent.every(test)
}

/**
 * returns true iff all specified features are disabled
 */
export function useAllDisabled(withoutAll: string | string[]) {
  let [test, queryAllWithout] = testAndConvert(withoutAll)
  return queryAllWithout.every(x => !test(x))
}

/**
 * returns true iff any specified feature is enabled
 */
export function useEnabled(feature: string | string[]) {
  let [test, queryAnyPresent] = testAndConvert(feature)
  return queryAnyPresent.some(test)
}

/**
 * returns true iff any specified feature is disabled
 */
export function useDisabled(without: string | string[]) {
  let [test, queryAnyWithout] = testAndConvert(without)
  return queryAnyWithout.some(x => !test(x))
}

interface EnableProps {
  readonly feature?: string | string[];
  readonly without?: string | string[];

  readonly allFeatures?: string[];
  readonly withoutAll?: string[];
}
/**
 * Feature will be enabled if any feature in the list are enabled, unless some negative query also matches.
 * This allows you to enable things except if some other feature is active, for instance.
 */
export const Enable: React.FC<EnableProps> = ({
  feature = [],
  without = [],
  allFeatures = [],
  withoutAll = [],
  children
}) => {
  const isAny = useEnabled(feature);
  const isAll = useAllEnabled(allFeatures);
  const isNoAll = useAllDisabled(withoutAll);
  const isNoAny = useDisabled(without);


  if ((isAny || isAll) && !(isNoAll || isNoAny)) {
    return <>{children}</>;
  }

  return null;
};

export interface Feature {
  readonly name: string;
  readonly description?: string;
}

interface EnableState {
  readonly features: Feature[];
  readonly forceEnable: Set<string>;
  readonly forceDisable: Set<string>;
  readonly defaultActive: Set<string>;
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
  readonly values: {on: string[], off: string[]};
}

type EnableAction =
  | EnableFeature
  | DisableFeature
  | ToggleFeature
  | SetDefaultFeatures
  | SetActiveFeatures;

const fromStrArray = fromArray(eqString);
const insertStr = insert(eqString);
const removeStr = remove(eqString);
const elemStr = elem(eqString);
const intersectStr = intersection(eqString);

const reducer: React.Reducer<EnableState, EnableAction> = (state, action) => {
  // console.debug("REDUCE: \n++> %o\n++>%o\n ==> %o", state.forceDisable, state.forceDisable, action)
  switch (action.type) {
    case "enable": {
      if (!state.features.some(x => x.name === action.feature)) {
        return state;
      }

			const enableAction = state.defaultActive.has(action.feature) ? removeStr(action.feature) : insertStr(action.feature)
			const disableAction = removeStr(action.feature)
      return {
        ...state,
        forceEnable:  enableAction(state.forceEnable),
        forceDisable: disableAction(state.forceEnable)
      };
    }

    case "disable": {
      if (!state.features.some(x => x.name === action.feature)) {
        return state;
      }
      return {
        ...state,
        forceEnable: removeStr(action.feature)(state.forceEnable),
        forceDisable: insertStr(action.feature)(state.forceEnable)
      };
    }

    case "toggle": {
      if (!state.features.some(x => x.name === action.feature)) {
        return state;
      }

      const current = elemStr(action.feature, state.defaultActive) ?
        !elemStr(action.feature, state.forceDisable) :
        elemStr(action.feature, state.forceEnable)

      return reducer(state, {type: current ? 'disable' : 'enable', feature: action.feature})
    }

    case 'set-default': {
        return {...state, defaultActive: fromStrArray(action.defaultEnabled)}
    }

    case "set-active": {
      const proposedOn = fromStrArray(action.values.on);
      const proposedOff = fromStrArray(action.values.off);
      const possible = fromStrArray(state.features.map(x => x.name));
      return {
        ...state,
        forceEnable: intersectStr(proposedOn, possible),
        forceDisable: intersectStr(proposedOff, possible),
      };
    }

    default:
      throw new Error("Unsupported action");
  }
};

interface FeatureProps {
  readonly features: Feature[];
  readonly defaultEnabled: string[];
  readonly consoleOverride?: boolean;
  readonly storage?: Storage;
}

class GlobalEnable {
  private readonly dispatch: React.Dispatch<EnableAction>;

  constructor(dispatch: React.Dispatch<EnableAction>) {
    this.dispatch = dispatch;
  }

  public toggle(feature: string) {
    this.dispatch({ type: "toggle", feature });
  }

  public enable(feature: string) {
    this.dispatch({ type: "enable", feature });
  }

  public disable(feature: string) {
    this.dispatch({ type: "disable", feature });
  }
}

declare global {
  interface Window {
    feature?: GlobalEnable;
  }
}

interface FeatureContextType {
  dispatch: React.Dispatch<EnableAction>;
  state: EnableState;
}

export const FeatureContext = React.createContext<FeatureContextType | null>(
  null
);

/**
 * A more batteries-enabled parent component that keeps track of feature state
 * internally, and creates window.feature.enable("f") and window.feature.disable("f").
 */
export const Features: React.FC<FeatureProps> = ({
  features,
  defaultEnabled,
  consoleOverride = false,
  storage,
  children
}) => {
  const initial: EnableState = { features, forceDisable: fromStrArray([]), forceEnable: fromStrArray([]), defaultActive: fromStrArray(defaultEnabled) };
  const [state, dispatch] = React.useReducer(reducer, initial);
  // console.debug("State: \n##> %o\n##> %o\n##> %o", state.forceEnable, state.forceDisable, state.defaultActive)

  useLoad(storage, dispatch);
  usePersist(state.forceEnable, state.forceDisable, storage);
  useConsoleOverride(consoleOverride, dispatch);

  React.useEffect(() => {
    if (Array.isArray(defaultEnabled)) {
      dispatch({ type: "set-default", defaultEnabled });
    }
  }, [dispatch, defaultEnabled])

  const featureValue = React.useMemo(() => ({ dispatch, state }), [
    dispatch,
    state,
    state.defaultActive,
    state.forceEnable,
    state.forceDisable,
  ]);

  const testCallback = React.useCallback((f: string) => elemStr(f, state.forceEnable) ||
      (elemStr(f, state.defaultActive) && !elemStr(f, state.forceDisable)),
    [
      state,
      state.defaultActive, state.forceEnable, state.forceDisable
    ]);

  return (
    <FeatureContext.Provider value={featureValue}>
      <EnableContext.Provider value={testCallback}>
        {children}
      </EnableContext.Provider>
    </FeatureContext.Provider>
  );
};

function useConsoleOverride(
  consoleOverride: boolean,
  dispatch: React.Dispatch<EnableAction>
) {

  React.useEffect(() => {
    if (!consoleOverride) {
      return () => {
        /* empty */
      };
    }
    window.feature = new GlobalEnable(dispatch);
    return () => {
      window.feature = undefined;
    };
  }, [dispatch]);

}

function useLoad(
  storage: Storage | undefined,
  dispatch: React.Dispatch<EnableAction>
) {
  React.useEffect(() => {
    if (storage != null) {
      try {
        const value = storage.getItem("react-enable:features");
        if (value != null) {
          const result = JSON.parse(value);
          if (Array.isArray(result.on) && Array.isArray(result.off) && typeof result.on[0] === "string" && typeof result.off[0] === "string" ) {
            dispatch({ type: "set-active", values: result });
          }
        }
      } catch (e) {
        // Can't parse or get
      }
    }
  }, [storage]);
}

function usePersist(forceEnable: Set<string>, forceDisable: Set<string>, storage: Storage | undefined) {
  const strState =
    storage == null ? undefined : JSON.stringify({on: Array.from(forceEnable).sort(), off: Array.from(forceDisable).sort()});

  React.useEffect(() => {
    if (strState != null && storage != null) {
      try {
        storage.setItem("react-enable:features", strState);
      } catch (e) {
        // Can't set for some reason
      }
    }
  }, [storage, strState]);
}

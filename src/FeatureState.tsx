import type { Dispatch } from 'react';

/**
 * Feature is either on, off, or 'unset',
 * which means it will go to the default value or the less specific value.
 */
export type FeatureValue = false | true | undefined;

export type FeatureStateValue =
  | 'initial'
  | 'enabled'
  | 'disabled'
  | 'unspecified'
  | 'asyncEnabled'
  | 'asyncDisabled'
  | 'asyncUnspecified';

export interface FeatureState {
  value: FeatureStateValue;
  featureDesc?: FeatureDescription;
}

export type FeatureDispatch = Dispatch<FeatureAction>;

/// Given a featurestate, determine the value (on, off, or unset)
export function valueForState(
  featureState: FeatureState,
): [FeatureValue, boolean] {
  return [
    featureState.value === 'enabled' || featureState.value === 'asyncEnabled'
      ? true
      : featureState.value === 'disabled' ||
          featureState.value === 'asyncDisabled'
        ? false
        : undefined,
    featureState.featureDesc?.force ?? false,
  ];
}

/**
 * Definition of a feature that can be enabled or disabled.
 * K is the type of the key that is used to identify the feature.
 */
export interface FeatureDescription<K extends string = string> {
  readonly name: K;
  readonly description?: string;

  /// If set, will be used to update the feature default state instead of simply overriding.
  /// For example, you might use this to update a feature flag on a backend server.
  /// when set, the feature will be updated on the backend server, and the result of the async
  /// will be used for the final state after the change. while changing, the feature will be
  /// in the 'changing' state. Also note that the feature will be changed at the "default" layer.
  readonly onChangeDefault?: (
    name: K,
    newValue: FeatureValue,
  ) => Promise<FeatureValue>;

  /// if set true, will force the field to what it is set here through layers of states.
  /// useful to invert the layers, similar to !important in CSS.
  readonly force?: boolean;

  /// If set to true, the feature will not be overridable by the user.
  readonly noOverride?: boolean;

  /// can be used to specify what should happen if the feature is not set to a particular value.
  readonly defaultValue?: FeatureValue;

  /// Percentage-based rollout (0-1). If set, the feature will be enabled for a percentage of users
  /// based on a stable identifier. For example, 0.3 means 30% of users will see this feature enabled.
  /// Requires a rolloutStableId to be provided to the Features component.
  readonly enableFor?: number;
}

/**
 * Actions that can be performed on a feature.
 */
export type FeatureAction =
  | { type: 'DISABLE' }
  | { type: 'ENABLE' }
  | { type: 'INIT'; feature: FeatureDescription }
  | { type: 'SET'; value: FeatureValue }
  | { type: 'TOGGLE' }
  | { type: 'UNSET' }
  | { type: 'ASYNC_DONE'; value: FeatureValue };

export const initialFeatureState: FeatureState = {
  value: 'initial',
};

/**
 * Reducer for managing individual feature state
 */
export function featureReducer(
  state: FeatureState,
  action: FeatureAction,
): FeatureState {
  switch (action.type) {
    case 'INIT': {
      const { feature } = action;
      const value =
        feature.defaultValue === true
          ? 'enabled'
          : feature.defaultValue === false
            ? 'disabled'
            : 'unspecified';
      return {
        value: value as FeatureStateValue,
        featureDesc: feature,
      };
    }

    case 'ENABLE': {
      if (state.featureDesc?.onChangeDefault != null) {
        return { ...state, value: 'asyncEnabled' };
      }
      return { ...state, value: 'enabled' };
    }

    case 'DISABLE': {
      if (state.featureDesc?.onChangeDefault != null) {
        return { ...state, value: 'asyncDisabled' };
      }
      return { ...state, value: 'disabled' };
    }

    case 'TOGGLE': {
      if (state.featureDesc?.onChangeDefault != null) {
        return { ...state, value: 'asyncEnabled' };
      }
      return { ...state, value: 'enabled' };
    }

    case 'UNSET': {
      if (state.featureDesc?.onChangeDefault != null) {
        return { ...state, value: 'asyncUnspecified' };
      }
      return { ...state, value: 'unspecified' };
    }

    case 'SET': {
      const { value } = action;
      if (state.featureDesc?.onChangeDefault != null) {
        if (value === true) {
          return { ...state, value: 'asyncEnabled' };
        }
        if (value === false) {
          return { ...state, value: 'asyncDisabled' };
        }
        return { ...state, value: 'asyncUnspecified' };
      }
      if (value === true) {
        return { ...state, value: 'enabled' };
      }
      if (value === false) {
        return { ...state, value: 'disabled' };
      }
      return { ...state, value: 'unspecified' };
    }

    case 'ASYNC_DONE': {
      const { value } = action;
      if (value === true) {
        return { ...state, value: 'enabled' };
      }
      if (value === false) {
        return { ...state, value: 'disabled' };
      }
      return { ...state, value: 'unspecified' };
    }

    default:
      return state;
  }
}

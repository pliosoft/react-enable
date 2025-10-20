import type { Dispatch } from 'react';

import {
  type FeatureDescription,
  type FeatureState,
  type FeatureValue,
  valueForState,
} from './FeatureState';

export interface FeaturesContext {
  // features are layered:
  //  - defaults: if nothing else matches, provided a value for feature
  //  - browser: browser-local values for features (kept in local storage, etc)
  //  - user: values from the user's profile, if any
  //  - org: value from the org's profile, if any
  features: { [x: string]: FeatureState };
}

export type FeaturesAction =
  | { type: 'DE_INIT' }
  | { type: 'DISABLE'; name: string }
  | { type: 'ENABLE'; name: string }
  | { type: 'INIT'; features: readonly FeatureDescription[] }
  | { type: 'SET_ALL'; features: { [key: string]: FeatureValue } }
  | { type: 'SET'; name: string; value: FeatureValue }
  | { type: 'TOGGLE'; name: string }
  | { type: 'UNSET'; name: string }
  | { type: 'ASYNC_DONE'; name: string; value: FeatureValue };

export interface FeaturesState {
  value: 'idle' | 'ready';
  context: FeaturesContext;
}

export type FeaturesDispatch = Dispatch<FeaturesAction>;

export function valueOfFeature(
  featuresState: FeaturesState,
  feature: string,
): [FeatureValue, boolean] {
  if (featuresState.context.features[feature] == null) {
    return [undefined, false];
  }
  const featureState = featuresState.context.features[feature];
  if (featureState != null) {
    return valueForState(featureState);
  }
  return [undefined, false];
}

export const initialFeaturesState: FeaturesState = {
  value: 'idle',
  context: {
    features: {},
  },
};

/**
 * Reducer for managing a collection of features
 */
export function featuresReducer(
  state: FeaturesState,
  action: FeaturesAction,
): FeaturesState {
  switch (action.type) {
    case 'INIT': {
      if (action.features.length === 0) {
        return state;
      }

      const features: { [x: string]: FeatureState } = {};
      for (const feature of action.features) {
        // Initialize each feature
        const featureState = {
          value:
            feature.defaultValue === true
              ? ('enabled' as const)
              : feature.defaultValue === false
                ? ('disabled' as const)
                : ('unspecified' as const),
          featureDesc: feature,
        };
        features[feature.name] = featureState;
      }

      return {
        value: 'ready',
        context: { features },
      };
    }

    case 'DE_INIT': {
      return initialFeaturesState;
    }

    case 'SET_ALL': {
      if (state.value !== 'ready') {
        return state;
      }

      const features = { ...state.context.features };
      Object.keys(features).forEach((name) => {
        const value = action.features[name] ?? undefined;
        const currentFeature = features[name];

        if (currentFeature.featureDesc?.onChangeDefault != null) {
          if (value === true) {
            features[name] = { ...currentFeature, value: 'asyncEnabled' };
          } else if (value === false) {
            features[name] = { ...currentFeature, value: 'asyncDisabled' };
          } else {
            features[name] = { ...currentFeature, value: 'asyncUnspecified' };
          }
        } else {
          if (value === true) {
            features[name] = { ...currentFeature, value: 'enabled' };
          } else if (value === false) {
            features[name] = { ...currentFeature, value: 'disabled' };
          } else {
            features[name] = { ...currentFeature, value: 'unspecified' };
          }
        }
      });

      return {
        ...state,
        context: { features },
      };
    }

    case 'SET': {
      if (state.value !== 'ready') {
        return state;
      }

      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }

      const { value } = action;
      let newValue: FeatureState['value'];

      if (feature.featureDesc?.onChangeDefault != null) {
        if (value === true) {
          newValue = 'asyncEnabled';
        } else if (value === false) {
          newValue = 'asyncDisabled';
        } else {
          newValue = 'asyncUnspecified';
        }
      } else {
        if (value === true) {
          newValue = 'enabled';
        } else if (value === false) {
          newValue = 'disabled';
        } else {
          newValue = 'unspecified';
        }
      }

      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue },
          },
        },
      };
    }

    case 'TOGGLE': {
      if (state.value !== 'ready') {
        return state;
      }

      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }

      const newValue =
        feature.featureDesc?.onChangeDefault != null
          ? 'asyncEnabled'
          : 'enabled';

      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue },
          },
        },
      };
    }

    case 'ENABLE': {
      if (state.value !== 'ready') {
        return state;
      }

      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }

      const newValue =
        feature.featureDesc?.onChangeDefault != null
          ? 'asyncEnabled'
          : 'enabled';

      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue },
          },
        },
      };
    }

    case 'DISABLE': {
      if (state.value !== 'ready') {
        return state;
      }

      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }

      const newValue =
        feature.featureDesc?.onChangeDefault != null
          ? 'asyncDisabled'
          : 'disabled';

      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue },
          },
        },
      };
    }

    case 'UNSET': {
      if (state.value !== 'ready') {
        return state;
      }

      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }

      const newValue =
        feature.featureDesc?.onChangeDefault != null
          ? 'asyncUnspecified'
          : 'unspecified';

      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue },
          },
        },
      };
    }

    case 'ASYNC_DONE': {
      if (state.value !== 'ready') {
        return state;
      }

      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }

      const { value } = action;
      const newValue =
        value === true
          ? 'enabled'
          : value === false
            ? 'disabled'
            : 'unspecified';

      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue },
          },
        },
      };
    }

    default:
      return state;
  }
}

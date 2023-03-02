import { ActorRefFrom, InterpreterFrom, StateFrom, assign, createMachine, spawn } from 'xstate';

import { FeatureMachine, FeatureDescription, FeatureValue, valueForState } from './FeatureState';

export interface FeaturesContext {
  // features are layered:
  //  - defaults: if nothing else matches, provided a value for feature
  //  - browser: browser-local values for features (kept in local storage, etc)
  //  - user: values from the user's profile, if any
  //  - org: value from the org's profile, if any
  features: { [x: string]: ActorRefFrom<typeof FeatureMachine> };
}

export type FeaturesAction =
  | { type: 'DE_INIT' }
  | { type: 'DISABLE'; name: string }
  | { type: 'ENABLE'; name: string }
  | { type: 'INIT'; features: readonly FeatureDescription[] }
  | { type: 'SET_ALL'; features: { [key: string]: FeatureValue } }
  | { type: 'SET'; name: string; value: FeatureValue }
  | { type: 'TOGGLE'; name: string }
  | { type: 'UNSET'; name: string };

export interface FeaturesTypeState {
  value: 'ready';
  context: FeaturesContext;
}

export type FeaturesState = StateFrom<typeof FeaturesMachine>;
export type FeaturesDispatch = InterpreterFrom<typeof FeaturesMachine>['send'];

export function valueOfFeature(featuresState: FeaturesState, feature: string): [FeatureValue, boolean] {
  if (featuresState.context.features[feature] == null) {
    return [undefined, false];
  }
  const featureState = featuresState.context.features[feature].getSnapshot();
  if (featureState != null) {
    return valueForState(featureState);
  }
  return [undefined, false];
}

/// state machine that manages a set of features with user, org, and local overrides
export const FeaturesMachine = createMachine<FeaturesContext, FeaturesAction, FeaturesTypeState>({
  id: 'features',
  initial: 'idle',
  predictableActionArguments: true,
  context: {
    features: {},
  },
  states: {
    idle: {
      on: {
        INIT: {
          target: 'ready',
          cond: (_, e) => e.features.length > 0,
          actions: assign({
            features: (context, event) => {
              const features: typeof context.features = {};

              for (const feature of event.features) {
                features[feature.name] = spawn(FeatureMachine, {
                  name: feature.name,
                  sync: true,
                });
                features[feature.name].send({ type: 'INIT', feature });
              }
              return features;
            },
          }),
        },
      },
    },

    // the features are loaded and ready to be used
    ready: {
      on: {
        DE_INIT: { target: 'idle', actions: assign({ features: (_, __) => ({}) }) },
        SET_ALL: {
          actions: assign({
            features: (ctx, e) => {
              const features = { ...ctx.features };
              // All configured features are set to on/off or undefined
              Object.keys(features).forEach((name) => {
                features[name].send({ type: 'SET', value: e.features[name] ?? undefined });
              });
              return features;
            },
          }),
        },

        // Set a feature to a value
        SET: {
          actions: (ctx, e) => {
            const feature = ctx.features[e.name];
            if (feature != null) {
              feature.send({ type: 'SET', value: e.value });
            }
          },
        },

        // toggle a feature
        TOGGLE: {
          actions: (ctx, e) => {
            const feature = ctx.features[e.name];
            if (feature != null) {
              feature.send({ type: 'TOGGLE' });
            }
          },
        },

        // when a feature is enabled, send the enable message to the actor
        ENABLE: {
          actions: (ctx, e) => {
            const feature = ctx.features[e.name];
            if (feature != null) {
              feature.send({ type: 'ENABLE' });
            }
          },
        },

        // when a feature is disabled, send the disable message to the actor
        DISABLE: {
          actions: (ctx, e) => {
            const feature = ctx.features[e.name];
            if (feature != null) {
              feature.send({ type: 'DISABLE' });
            }
          },
        },

        // when a feature is unset, send the unset message to the actor
        UNSET: {
          actions: (ctx, e) => {
            const feature = ctx.features[e.name];
            if (feature != null) {
              feature.send({ type: 'UNSET' });
            }
          },
        },
      },
    },
  },
});

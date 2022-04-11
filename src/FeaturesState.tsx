import { ActorRefFrom, InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine, spawn } from 'xstate';
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
  | { type: 'ENABLE'; name: string }
  | { type: 'TOGGLE'; name: string }
  | { type: 'SET_ALL'; features: { [key: string]: FeatureValue } }
  | { type: 'INIT'; features: readonly FeatureDescription[] }
  | { type: 'DISABLE'; name: string }
  | { type: 'UNSET'; name: string }
  | { type: 'DE_INIT' };

export type FeaturesTypeState = { value: 'ready'; context: FeaturesContext };

export type FeaturesState = StateFrom<typeof FeaturesMachine>;
export type FeaturesDispatch = InterpreterFrom<typeof FeaturesMachine>['send'];

export function valueOfFeature(featuresState: FeaturesState, feature: string): [FeatureValue, boolean] {
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
                  name: 'feature-' + feature.name,
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

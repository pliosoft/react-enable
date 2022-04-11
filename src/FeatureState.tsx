import { assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';

/**
 * Feature is either on, off, or 'unset',
 * which means it will go to the default value or the less specific value.
 */
export type FeatureValue = true | false | undefined;

export type FeatureState = StateFrom<typeof FeatureMachine>;
export type FeatureDispatch = InterpreterFrom<typeof FeatureMachine>['send'];

/// Given a featurestate, determine the value (on, off, or unset)
export function valueForState(featureState: FeatureState): [FeatureValue, boolean] {
  return [
    featureState.matches('enabled') ? true : featureState.matches('disabled') ? false : undefined,
    featureState.context.featureDesc?.force ?? false,
  ];
}

/**
 * Definition of a feature that can be enabled or disabled.
 * K is the type of the key that is used to identify the feature.
 * T describes the type of tag that is used to organize the features.
 */
export interface FeatureDescription<K extends string = string> {
  readonly name: K;
  readonly description?: string;

  /// if set true, will force the field to what it is set here through layers of states.
  /// Has no effect if the features machine is not nested.
  /// For instance, the "dev" layer can force a dev feature on.
  /// Similar to !important in CSS.
  readonly force?: boolean;

  /// If set to true, the feature will not be overridable by the user.
  readonly noOverride?: boolean;

  /// can be used to specify what should happen if the feature is not set to a particular value.
  readonly defaultValue?: FeatureValue;
}

interface FeatureContext {
  featureDesc?: FeatureDescription;
}

type FeatureTypeState =
  | {
      value: 'initial';
      context: never;
    }
  | {
      value: 'unspecied';
      context: FeatureContext;
    }
  | {
      value: 'enabled';
      context: FeatureContext;
    }
  | {
      value: 'disabled';
      context: FeatureContext;
    };

/**
 * Actions that can be performed on a feature.
 */
export type FeatureAction =
  | { type: 'INIT'; feature: FeatureDescription }
  | { type: 'ENABLE' }
  | { type: 'DISABLE' }
  | { type: 'TOGGLE' }
  | { type: 'SET'; value: FeatureValue }
  | { type: 'UNSET' };

/**
 * Fully describe the states a feature can be in
 */
export const FeatureMachine = createMachine<FeatureContext, FeatureAction, FeatureTypeState>({
  id: 'feature',
  initial: 'initial',
  context: {},
  states: {
    initial: {
      on: {
        INIT: [
          {
            actions: assign({ featureDesc: (_, e) => e.feature }),
            target: 'enabled',
            cond: (_, e) => e.feature.defaultValue === true,
          },
          {
            actions: assign({ featureDesc: (_, e) => e.feature }),
            target: 'unspecified',
            cond: (_, e) => e.feature.defaultValue === undefined,
          },
          {
            actions: assign({ featureDesc: (_, e) => e.feature }),
            target: 'disabled',
            cond: (_, e) => e.feature.defaultValue === false,
          },
        ],
      },
    },

    unspecified: {
      on: {
        ENABLE: 'enabled',
        TOGGLE: 'enabled',
        DISABLE: 'disabled',
        UNSET: 'unspecified',
        SET: [
          {
            target: 'enabled',
            cond: (_, e) => e.value === true,
          },
          {
            target: 'disabled',
            cond: (_, e) => e.value === false,
          },
        ],
      },
    },

    disabled: {
      on: {
        ENABLE: 'enabled',
        TOGGLE: 'disabled',
        UNSET: 'unspecified',
        SET: [
          {
            target: 'enabled',
            cond: (_, e) => e.value === true,
          },
          {
            target: 'unspecified',
            cond: (_, e) => e.value === undefined,
          },
        ],
      },
    },

    enabled: {
      on: {
        DISABLE: 'disabled',
        TOGGLE: 'enabled',
        UNSET: 'unspecified',
        SET: [
          {
            target: 'disabled',
            cond: (_, e) => e.value === false,
          },
          {
            target: 'unspecified',
            cond: (_, e) => e.value === undefined,
          },
        ],
      },
    },
  },
});

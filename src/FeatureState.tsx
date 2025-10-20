import {
  assign,
  createMachine,
  type DoneInvokeEvent,
  type InterpreterFrom,
  type StateFrom,
} from 'xstate';

/**
 * Feature is either on, off, or 'unset',
 * which means it will go to the default value or the less specific value.
 */
export type FeatureValue = false | true | undefined;

export type FeatureState = StateFrom<typeof FeatureMachine>;
export type FeatureDispatch = InterpreterFrom<typeof FeatureMachine>['send'];

/// Given a featurestate, determine the value (on, off, or unset)
export function valueForState(
  featureState: FeatureState,
): [FeatureValue, boolean] {
  return [
    featureState.matches('enabled')
      ? true
      : featureState.matches('disabled')
        ? false
        : undefined,
    featureState.context.featureDesc?.force ?? false,
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
}

interface FeatureContext {
  featureDesc?: FeatureDescription;
}

type FeatureTypeState =
  | {
      value: 'asyncDenabled';
      context: FeatureContext;
    }
  | {
      value: 'asyncDisabled';
      context: FeatureContext;
    }
  | {
      value: 'asyncUnspecied';
      context: FeatureContext;
    }
  | {
      value: 'disabled';
      context: FeatureContext;
    }
  | {
      value: 'enabled';
      context: FeatureContext;
    }
  | {
      value: 'initial';
      context: never;
    }
  | {
      value: 'unspecied';
      context: FeatureContext;
    };

/**
 * Actions that can be performed on a feature.
 */
export type FeatureAction =
  | { type: 'DISABLE' }
  | { type: 'ENABLE' }
  | { type: 'INIT'; feature: FeatureDescription }
  | { type: 'SET'; value: FeatureValue }
  | { type: 'TOGGLE' }
  | { type: 'UNSET' };

/**
 * Fully describe the states a feature can be in
 */
export const FeatureMachine = createMachine<
  FeatureContext,
  FeatureAction,
  FeatureTypeState
>({
  id: 'feature',
  initial: 'initial',
  context: {},
  predictableActionArguments: true,
  on: {
    ENABLE: [
      {
        target: 'asyncEnabled',
        cond: (ctx) => ctx.featureDesc?.onChangeDefault != null,
      },
      { target: 'enabled' },
    ],

    TOGGLE: [
      {
        target: 'asyncEnabled',
        cond: (ctx) => ctx.featureDesc?.onChangeDefault != null,
      },
      { target: 'enabled' },
    ],

    DISABLE: [
      {
        target: 'asyncDisabled',
        cond: (ctx) => ctx.featureDesc?.onChangeDefault != null,
      },
      { target: 'disabled' },
    ],

    UNSET: [
      {
        target: 'asyncUnspecied',
        cond: (ctx) => ctx.featureDesc?.onChangeDefault != null,
      },
      { target: 'unspecified' },
    ],

    SET: [
      {
        target: 'asyncEnabled',
        cond: (ctx, e) =>
          e.value === true && ctx.featureDesc?.onChangeDefault != null,
      },
      {
        target: 'asyncDisabled',
        cond: (ctx, e) =>
          e.value === false && ctx.featureDesc?.onChangeDefault != null,
      },
      {
        target: 'asyncUnspecied',
        cond: (ctx, _e) => ctx.featureDesc?.onChangeDefault != null,
      },
      {
        target: 'enabled',
        cond: (_ctx, e) => e.value === true,
      },
      {
        target: 'disabled',
        cond: (_ctx, e) => e.value === false,
      },
      { target: 'unspecified' },
    ],
  },

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

    unspecified: {},
    disabled: {},
    enabled: {},

    asyncDisabled: {
      invoke: {
        id: 'set-off-upstream',
        src: async (ctx) => {
          const onchange = ctx.featureDesc?.onChangeDefault;
          if (onchange != null && ctx.featureDesc != null) {
            return onchange(ctx.featureDesc.name, false);
          }
          return undefined;
        },
        onDone: [
          {
            target: 'enabled',
            cond: (_ctx, e: DoneInvokeEvent<FeatureValue>) => e.data === true,
          },
          {
            target: 'disabled',
            cond: (_ctx, e: DoneInvokeEvent<FeatureValue>) => e.data === false,
          },
          { target: 'unspecified' },
        ],
        onError: 'unspecified',
      },
    },

    asyncUnspecied: {
      invoke: {
        id: 'set-unset-upstream',
        src: async (ctx) => {
          const onchange = ctx.featureDesc?.onChangeDefault;
          if (onchange != null && ctx.featureDesc != null) {
            return onchange(ctx.featureDesc.name, undefined);
          }
          return undefined;
        },
        onDone: [
          {
            target: 'enabled',
            cond: (_ctx, e: DoneInvokeEvent<FeatureValue>) => e.data === true,
          },
          {
            target: 'disabled',
            cond: (_ctx, e: DoneInvokeEvent<FeatureValue>) => e.data === false,
          },
          { target: 'unspecified' },
        ],
        onError: 'unspecified',
      },
    },

    asyncEnabled: {
      invoke: {
        id: 'set-on-upstream',
        src: async (ctx) => {
          const onchange = ctx.featureDesc?.onChangeDefault;
          if (onchange != null && ctx.featureDesc != null) {
            return onchange(ctx.featureDesc.name, true);
          }
          return undefined;
        },
        onDone: [
          {
            target: 'enabled',
            cond: (_ctx, e: DoneInvokeEvent<FeatureValue>) => e.data === true,
          },
          {
            target: 'disabled',
            cond: (_ctx, e: DoneInvokeEvent<FeatureValue>) => e.data === false,
          },
          { target: 'unspecified' },
        ],
        onError: 'unspecified',
      },
    },
  },
});

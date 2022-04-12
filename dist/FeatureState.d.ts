import { InterpreterFrom, StateFrom } from 'xstate';
export declare type FeatureValue = false | true | undefined;
export declare type FeatureState = StateFrom<typeof FeatureMachine>;
export declare type FeatureDispatch = InterpreterFrom<typeof FeatureMachine>['send'];
export declare function valueForState(featureState: FeatureState): [FeatureValue, boolean];
export interface FeatureDescription<K extends string = string> {
    readonly name: K;
    readonly description?: string;
    readonly onChangeDefault?: (name: K, newValue: FeatureValue) => Promise<FeatureValue>;
    readonly force?: boolean;
    readonly noOverride?: boolean;
    readonly defaultValue?: FeatureValue;
}
interface FeatureContext {
    featureDesc?: FeatureDescription;
}
declare type FeatureTypeState = {
    value: 'asyncDenabled';
    context: FeatureContext;
} | {
    value: 'asyncDisabled';
    context: FeatureContext;
} | {
    value: 'asyncUnspecied';
    context: FeatureContext;
} | {
    value: 'disabled';
    context: FeatureContext;
} | {
    value: 'enabled';
    context: FeatureContext;
} | {
    value: 'initial';
    context: never;
} | {
    value: 'unspecied';
    context: FeatureContext;
};
export declare type FeatureAction = {
    type: 'DISABLE';
} | {
    type: 'ENABLE';
} | {
    type: 'INIT';
    feature: FeatureDescription;
} | {
    type: 'SET';
    value: FeatureValue;
} | {
    type: 'TOGGLE';
} | {
    type: 'UNSET';
};
export declare const FeatureMachine: import("xstate").StateMachine<FeatureContext, any, FeatureAction, FeatureTypeState, import("xstate").BaseActionObject, import("xstate").ServiceMap, import("xstate").ResolveTypegenMeta<import("xstate").TypegenDisabled, FeatureAction, import("xstate").BaseActionObject, import("xstate").ServiceMap>>;
export {};

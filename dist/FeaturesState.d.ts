import { ActorRefFrom, InterpreterFrom, StateFrom } from 'xstate';
import { FeatureMachine, FeatureDescription, FeatureValue } from './FeatureState';
export interface FeaturesContext {
    features: {
        [x: string]: ActorRefFrom<typeof FeatureMachine>;
    };
}
export declare type FeaturesAction = {
    type: 'DE_INIT';
} | {
    type: 'DISABLE';
    name: string;
} | {
    type: 'ENABLE';
    name: string;
} | {
    type: 'INIT';
    features: readonly FeatureDescription[];
} | {
    type: 'SET_ALL';
    features: {
        [key: string]: FeatureValue;
    };
} | {
    type: 'SET';
    name: string;
    value: FeatureValue;
} | {
    type: 'TOGGLE';
    name: string;
} | {
    type: 'UNSET';
    name: string;
};
export interface FeaturesTypeState {
    value: 'ready';
    context: FeaturesContext;
}
export declare type FeaturesState = StateFrom<typeof FeaturesMachine>;
export declare type FeaturesDispatch = InterpreterFrom<typeof FeaturesMachine>['send'];
export declare function valueOfFeature(featuresState: FeaturesState, feature: string): [FeatureValue, boolean];
export declare const FeaturesMachine: import("xstate").StateMachine<FeaturesContext, any, FeaturesAction, FeaturesTypeState, import("xstate").BaseActionObject, import("xstate").ServiceMap, import("xstate").ResolveTypegenMeta<import("xstate").TypegenDisabled, FeaturesAction, import("xstate").BaseActionObject, import("xstate").ServiceMap>>;

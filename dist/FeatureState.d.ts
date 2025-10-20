import type { Dispatch } from 'react';
export declare type FeatureValue = false | true | undefined;
export declare type FeatureStateValue = 'initial' | 'enabled' | 'disabled' | 'unspecified' | 'asyncEnabled' | 'asyncDisabled' | 'asyncUnspecified';
export interface FeatureState {
    value: FeatureStateValue;
    featureDesc?: FeatureDescription;
}
export declare type FeatureDispatch = Dispatch<FeatureAction>;
export declare function valueForState(featureState: FeatureState): [FeatureValue, boolean];
export interface FeatureDescription<K extends string = string> {
    readonly name: K;
    readonly description?: string;
    readonly onChangeDefault?: (name: K, newValue: FeatureValue) => Promise<FeatureValue>;
    readonly force?: boolean;
    readonly noOverride?: boolean;
    readonly defaultValue?: FeatureValue;
}
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
} | {
    type: 'ASYNC_DONE';
    value: FeatureValue;
};
export declare const initialFeatureState: FeatureState;
export declare function featureReducer(state: FeatureState, action: FeatureAction): FeatureState;

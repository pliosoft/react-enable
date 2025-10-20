import type { Dispatch } from 'react';
import { type FeatureDescription, type FeatureState, type FeatureValue } from './FeatureState';
export interface FeaturesContext {
    features: {
        [x: string]: FeatureState;
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
} | {
    type: 'ASYNC_DONE';
    name: string;
    value: FeatureValue;
};
export interface FeaturesState {
    value: 'idle' | 'ready';
    context: FeaturesContext;
}
export declare type FeaturesDispatch = Dispatch<FeaturesAction>;
export declare function valueOfFeature(featuresState: FeaturesState, feature: string): [FeatureValue, boolean];
export declare const initialFeaturesState: FeaturesState;
export declare function featuresReducer(state: FeaturesState, action: FeaturesAction): FeaturesState;

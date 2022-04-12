/// <reference types="react" />
import { FeaturesDispatch, FeaturesState } from './FeaturesState';
import { FeatureDescription, FeatureValue } from './FeatureState';
export declare const FeatureContext: import("react").Context<FeatureContextType | null>;
export interface FeatureContextType {
    overridesSend: FeaturesDispatch;
    defaultsSend: FeaturesDispatch;
    featuresDescription: readonly FeatureDescription[];
    overridesState: FeaturesState;
    defaultsState: FeaturesState;
    test: (flag: string) => FeatureValue;
}

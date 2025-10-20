/// <reference types="react" />
import type { FeatureDescription, FeatureValue } from './FeatureState';
import type { FeaturesDispatch, FeaturesState } from './FeaturesState';
export declare const FeatureContext: import("react").Context<FeatureContextType | null>;
export interface FeatureContextType {
    overridesSend: FeaturesDispatch;
    defaultsSend: FeaturesDispatch;
    featuresDescription: readonly FeatureDescription[];
    overridesState: FeaturesState;
    defaultsState: FeaturesState;
    test: (flag: string) => FeatureValue;
}

import { FeaturesDispatch } from './FeaturesState';
import { FeatureDescription, FeatureValue } from './FeatureState';
export declare class GlobalEnable {
    private readonly featureDesc;
    private readonly dispatch;
    private readonly testFeature;
    constructor(dispatch: FeaturesDispatch, testFeature: (_: string) => FeatureValue, featureDesc: readonly FeatureDescription[]);
    toggle(feature: string): void;
    enable(feature: string): void;
    unset(feature: string): void;
    disable(feature: string): void;
    setAll(features: {
        [key: string]: FeatureValue;
    }): void;
    listFeatures(): readonly [string, FeatureValue][];
}
declare global {
    interface Window {
        feature?: GlobalEnable;
    }
}

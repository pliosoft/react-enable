import { FeaturesState } from './FeaturesState';
import { FeatureDescription } from './FeatureState';
export declare const KEY = "react-enable:feature-values";
export default function usePersist(storage: Storage | undefined, features: readonly FeatureDescription[], overrideState: FeaturesState): void;

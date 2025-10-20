import type { FeatureDescription } from './FeatureState';
import { type FeaturesState } from './FeaturesState';
export declare const KEY = "react-enable:feature-values";
export default function usePersist(storage: Storage | undefined, features: readonly FeatureDescription[], overrideState: FeaturesState): void;

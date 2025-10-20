import type { FeatureDescription, FeatureValue } from './FeatureState';
import type { FeaturesDispatch } from './FeaturesState';
export default function useConsoleOverride(consoleOverride: boolean, features: readonly FeatureDescription[], testFeature: (_: string) => FeatureValue, dispatch: FeaturesDispatch): void;

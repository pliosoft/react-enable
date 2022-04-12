import { FeaturesDispatch } from './FeaturesState';
import { FeatureDescription, FeatureValue } from './FeatureState';
export default function useConsoleOverride(consoleOverride: boolean, features: readonly FeatureDescription[], testFeature: (_: string) => FeatureValue, dispatch: FeaturesDispatch): void;

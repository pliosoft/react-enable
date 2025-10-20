import { useEffect } from 'react';
import type { FeatureDescription, FeatureValue } from './FeatureState';
import type { FeaturesDispatch } from './FeaturesState';
import { GlobalEnable } from './GlobalEnable';

export default function useConsoleOverride(
  consoleOverride: boolean,
  features: readonly FeatureDescription[],
  testFeature: (_: string) => FeatureValue,
  dispatch: FeaturesDispatch,
): void {
  useEffect(() => {
    if (!consoleOverride) {
      // Clean up window.feature immediately if consoleOverride is disabled
      if (window.feature != null) {
        window.feature = undefined;
      }
      return () => {
        if (window.feature != null) {
          window.feature = undefined;
        }
      };
    }
    window.feature = new GlobalEnable(dispatch, testFeature, features);
    return () => {
      if (window.feature != null) {
        window.feature = undefined;
      }
    };
  }, [features, dispatch, consoleOverride, testFeature]);
}

import { useEffect } from 'react';

import { FeaturesDispatch } from './FeaturesState';
import { FeatureDescription, FeatureValue } from './FeatureState';
import { GlobalEnable } from './GlobalEnable';

export default function useConsoleOverride(
  consoleOverride: boolean,
  features: readonly FeatureDescription[],
  testFeature: (_: string) => FeatureValue,
  dispatch: FeaturesDispatch
): void {
  useEffect(() => {
    if (!consoleOverride) {
      return () => {
        /* empty */
      };
    }
    window.feature = new GlobalEnable(dispatch, testFeature, features);
    return () => {
      if (window.feature != null) {
        delete window.feature;
      }
    };
  }, [features, dispatch, consoleOverride, testFeature]);
}

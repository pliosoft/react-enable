import * as React from 'react';
import { GlobalEnable } from './GlobalEnable';
import { FeatureDescription, FeatureValue } from './FeatureState';
import { FeaturesDispatch } from './FeaturesState';

export default function useConsoleOverride(
  consoleOverride: boolean,
  features: readonly FeatureDescription[],
  testFeature: (_: string) => FeatureValue,
  dispatch: FeaturesDispatch
) {
  React.useEffect(() => {
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
  }, [features, dispatch]);
}

import { useMemo, useEffect } from 'react';

import { FeaturesState, valueOfFeature } from './FeaturesState';
import { FeatureDescription, FeatureValue } from './FeatureState';

export const KEY = 'react-enable:feature-values';

export default function usePersist(
  storage: Storage | undefined,
  features: readonly FeatureDescription[],
  overrideState: FeaturesState
): void {
  const overrides = useMemo(() => {
    const newOverrides: { [key: string]: FeatureValue } = {};
    if (overrideState.matches('ready')) {
      for (const feature of features) {
        const [value] = valueOfFeature(overrideState, feature.name);
        if (value != null) {
          newOverrides[feature.name] = value;
        }
      }
    }
    return newOverrides;
  }, [features, overrideState]);

  const strState = Object.keys(overrides).length === 0 || storage == null ? '{}' : JSON.stringify({ overrides });

  useEffect(() => {
    try {
      if (storage != null && overrideState.matches('ready')) {
        storage.setItem(KEY, strState);
      }
    } catch (e) {
      // Can't set for some reason
    }
  }, [overrideState, storage, strState]);
}

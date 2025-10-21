import { useEffect, useMemo } from 'react';
import type { FeatureDescription, FeatureValue } from './FeatureState';
import { type FeaturesState, valueOfFeature } from './FeaturesState';

export const KEY = 'react-enable:feature-values';

export default function usePersist(
  storage: Storage | undefined,
  features: readonly FeatureDescription[],
  overrideState: FeaturesState,
): void {
  const overrides = useMemo(() => {
    const newOverrides: { [key: string]: FeatureValue } = {};
    if (overrideState.value === 'ready') {
      for (const feature of features) {
        const [value] = valueOfFeature(overrideState, feature.name);
        if (value != null) {
          newOverrides[feature.name] = value;
        }
      }
    }
    return newOverrides;
  }, [features, overrideState]);

  const strState =
    Object.keys(overrides).length === 0 || storage == null
      ? '{}'
      : JSON.stringify({ overrides });

  useEffect(() => {
    try {
      if (storage != null && overrideState.value === 'ready') {
        storage.setItem(KEY, strState);
      }
    } catch (_e) {
      // Can't set for some reason
    }
  }, [overrideState, storage, strState]);
}

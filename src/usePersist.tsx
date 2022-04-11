import * as React from 'react';
import { FeatureDescription, FeatureValue } from './FeatureState';
import { FeaturesDispatch, FeaturesState, valueOfFeature } from './FeaturesState';

const KEY = 'react-enable:feature-values';

export default function usePersist(
  storage: Storage | undefined,
  dispatch: FeaturesDispatch,
  features: readonly FeatureDescription[],
  overrideState: FeaturesState
) {
  useLoad(storage, dispatch);
  const overrides = React.useMemo(() => {
    const overrides: { [key: string]: FeatureValue } = {};
    for (const feature of features) {
      const [value] = valueOfFeature(overrideState, feature.name);
      if (value != null) {
        overrides[feature.name] = value;
      }
    }
    return overrides;
  }, [features, overrideState]);

  const strState = Object.keys(overrides).length === 0 || storage == null ? undefined : JSON.stringify({ overrides });

  React.useEffect(() => {
    try {
      if (strState != null && storage != null) {
        storage.setItem(KEY, strState);
      } else if (strState == null && storage != null) {
        storage.removeItem(KEY);
      }
    } catch (e) {
      // Can't set for some reason
    }
  }, [storage, strState]);
}

function useLoad(storage: Storage | undefined, dispatch: FeaturesDispatch) {
  React.useEffect(() => {
    if (storage != null) {
      try {
        const featuresJson = storage.getItem(KEY);
        if (featuresJson != null) {
          const features = JSON.parse(featuresJson);
          dispatch({ type: 'SET_ALL', features });
        }
      } catch (e) {
        // Can't parse or get or otherwise; ignore
      }
    }
  }, [dispatch, storage]);
}

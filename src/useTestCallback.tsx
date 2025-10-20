import { useCallback } from 'react';

import type { FeaturesState } from './FeaturesState';
import testFeature from './testFeature';

/// A callback that can be called to test if a feature is enabled or disabled
export default function useTestCallback(
  defaultsState: FeaturesState,
  overridesState: FeaturesState,
): (feature: string) => boolean | undefined {
  return useCallback(
    (f: string) => testFeature(f, [defaultsState, overridesState]),
    [defaultsState, overridesState],
  );
}

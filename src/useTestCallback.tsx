import { useCallback } from 'react';

import type { FeaturesState } from './FeaturesState';
import testFeature from './testFeature';

/// A callback that can be called to test if a feature is enabled or disabled
export default function useTestCallback(
  overridesState: FeaturesState,
  defaultsState: FeaturesState,
  rolloutStableId?: string,
): (feature: string) => boolean | undefined {
  return useCallback(
    (f: string) => testFeature(f, [overridesState, defaultsState], rolloutStableId),
    [overridesState, defaultsState, rolloutStableId],
  );
}

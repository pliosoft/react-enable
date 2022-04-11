import * as React from 'react';
import { FeaturesState } from './FeaturesState';
import testFeature from './testFeature';

/// A callback that can be called to test if a feature is enabled or disabled
export default function useTestCallback(currentStates: FeaturesState[]) {
  const stateRef = React.useRef(currentStates);
  stateRef.current = currentStates;
  return React.useCallback((f: string) => testFeature(f, stateRef.current), [stateRef]);
}

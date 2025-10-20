import { createContext } from 'react';
import type { FeatureDescription, FeatureValue } from './FeatureState';
import type { FeaturesDispatch, FeaturesState } from './FeaturesState';

export const FeatureContext = createContext<FeatureContextType | null>(null);

/// Give access to the overrides layer
export interface FeatureContextType {
  // Make changes to the overrides
  overridesSend: FeaturesDispatch;

  // Make changes to defaults
  defaultsSend: FeaturesDispatch;

  featuresDescription: readonly FeatureDescription[];

  // State is in layers; overrides and defaults
  overridesState: FeaturesState;
  defaultsState: FeaturesState;

  /// Test with proper fallback and respecting the user's force preference
  test: (flag: string) => FeatureValue;
}

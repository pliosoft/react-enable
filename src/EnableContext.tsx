import { createContext } from 'react';

import type { FeatureValue } from './FeatureState';

export type EnableContextType = (feature: string) => FeatureValue;

/**
 * Contained function can check whether a given feature is enabled.
 */
export const EnableContext = createContext<EnableContextType>((_s) => false);

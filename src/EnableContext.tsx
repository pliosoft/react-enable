import * as React from 'react';
import { FeatureValue } from './FeatureState';

export type EnableContextType = (feature: string) => FeatureValue;

/**
 * Contained function can check whether a given feature is enabled.
 */
export const EnableContext = React.createContext<EnableContextType>((_s) => false);

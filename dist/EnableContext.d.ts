/// <reference types="react" />
import type { FeatureValue } from './FeatureState';
export declare type EnableContextType = (feature: string) => FeatureValue;
export declare const EnableContext: import("react").Context<EnableContextType>;

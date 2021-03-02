import * as React from "react";
import { DispatchFeature, FeatureState } from "./FeatureState";
export declare const FeatureContext: React.Context<FeatureContextType | null>;
export interface FeatureContextType {
    dispatch: DispatchFeature;
    state: FeatureState;
}

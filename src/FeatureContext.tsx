import * as React from "react";
import { DispatchFeature, FeatureState } from "./FeatureState";

export const FeatureContext = React.createContext<FeatureContextType | null>(
  null
);

export interface FeatureContextType {
  dispatch: DispatchFeature;
  state: FeatureState;
}

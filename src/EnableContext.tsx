import * as React from "react";
export type EnableContextType = (feature: string) => boolean;

/**
 * Contained function can check whether a given feature is enabled.
 */
export const EnableContext = React.createContext<EnableContextType>(
  _s => false
);

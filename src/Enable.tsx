import * as React from "react";
import {
  useEnabled,
  useAllEnabled,
} from "./index";

export interface EnableProps {
  readonly feature?: string | string[];
  readonly without?: string | string[];
  readonly allFeatures?: string[];
  readonly withoutAll?: string[];
}

/**
 * Feature will be enabled if any feature in the list are enabled, unless some negative query also matches.
 * This allows you to enable things except if some other feature is active, for instance.
 */
export const Enable: React.FC<EnableProps> = ({
  feature = [],
  allFeatures = [],
  children
}) => {
  const isAny = useEnabled(feature);
  const isAll = useAllEnabled(allFeatures);

  if (isAny || isAll) {
    return <>{children}</>;
  }

  return null;
};

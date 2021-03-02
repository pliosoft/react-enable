import * as React from "react";
import { useDisabled } from "./useDisabled";
import { useAllDisabled } from "./useAllDisabled";
import { EnableProps } from "./Enable";

/**
 * Feature will be disabled if any in the list are enabled
 */
export const Disable: React.FC<EnableProps> = ({
  feature = [],
  allFeatures = [],
  children
}) => {
  const isAny = useDisabled(feature);
  const isAll = useAllDisabled(allFeatures);

  if (isAny || isAll) {
    return <>{children}</>;
  }

  return null;
};

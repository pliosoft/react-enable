import type * as React from 'react';

import type { EnableProps } from './Enable';
import { useAllDisabled } from './useAllDisabled';
import { useDisabled } from './useDisabled';

/**
 * Feature will be disabled if any in the list are enabled
 */
export const Disable: React.FC<EnableProps> = ({
  feature = [],
  allFeatures = [],
  children,
}) => {
  const isAny = useDisabled(feature);
  const isAll = useAllDisabled(allFeatures);

  if (isAny || isAll) {
    return <>{children}</>;
  }

  return null;
};

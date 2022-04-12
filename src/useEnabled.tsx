import { useTestAndConvert } from './utils';

/**
 * returns true iff any specified feature is enabled
 */
export function useEnabled(feature: string[] | string): boolean {
  const [test, queryAnyPresent] = useTestAndConvert(feature);
  return queryAnyPresent.some(test);
}

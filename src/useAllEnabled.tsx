import { useTestAndConvert } from './utils';

/**
 * returns true iff all specified features are enabled
 */
export function useAllEnabled(allFeatures: string[] | string): boolean {
  const [test, queryAllPresent] = useTestAndConvert(allFeatures);
  return queryAllPresent.length > 0 && queryAllPresent.every(test);
}

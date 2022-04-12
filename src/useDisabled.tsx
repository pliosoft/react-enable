import { useTestAndConvert } from './utils';

/**
 * returns true iff any specified feature is disabled
 */
export function useDisabled(without: string[] | string): boolean {
  const [test, queryAnyWithout] = useTestAndConvert(without);
  return queryAnyWithout.some((x) => !(test(x) ?? false));
}

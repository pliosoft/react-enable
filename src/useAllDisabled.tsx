import { useTestAndConvert } from './utils';

/**
 * returns true iff all specified features are disabled
 */
export function useAllDisabled(withoutAll: string[] | string): boolean {
  const [test, queryAllWithout] = useTestAndConvert(withoutAll);
  return (
    withoutAll.length > 0 && queryAllWithout.every((x) => !(test(x) ?? false))
  );
}

import { testAndConvert } from "./utils";

/**
 * returns true iff all specified features are disabled
 */

export function useAllDisabled(withoutAll: string | string[]) {
  let [test, queryAllWithout] = testAndConvert(withoutAll);
  return withoutAll.length > 0 && queryAllWithout.every(x => !test(x));
}

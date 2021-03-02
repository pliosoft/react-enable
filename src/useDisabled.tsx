import { testAndConvert } from "./utils";

/**
 * returns true iff any specified feature is disabled
 */

export function useDisabled(without: string | string[]) {
  let [test, queryAnyWithout] = testAndConvert(without);
  return queryAnyWithout.some(x => !test(x));
}

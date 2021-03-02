import { testAndConvert } from "./utils";

/**
 * returns true iff any specified feature is enabled
 */

export function useEnabled(feature: string | string[]) {
  let [test, queryAnyPresent] = testAndConvert(feature);
  return queryAnyPresent.some(test);
}

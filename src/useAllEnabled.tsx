import { testAndConvert } from "./utils";

/**
 * returns true iff all specified features are enabled
 */

export function useAllEnabled(allFeatures: string | string[]) {
  let [test, queryAllPresent] = testAndConvert(allFeatures);
  return queryAllPresent.length > 0 && queryAllPresent.every(test);
}

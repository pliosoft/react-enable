import { testAndConvert } from "./utils";

export type { EnableContextType } from "./EnableContext";
export type { FeatureContextType } from "./FeatureContext";
export { ToggleFeatures } from "./ToggleFeatures";
export { Features } from "./Features";
export { EnableContext } from "./EnableContext";

/**
 * returns true iff all specified features are enabled
 */
export function useAllEnabled(allFeatures: string | string[]) {
  let [test, queryAllPresent] = testAndConvert(allFeatures);
  return queryAllPresent.every(test);
}

/**
 * returns true iff all specified features are disabled
 */
export function useAllDisabled(withoutAll: string | string[]) {
  let [test, queryAllWithout] = testAndConvert(withoutAll);
  return queryAllWithout.every(x => !test(x));
}

/**
 * returns true iff any specified feature is enabled
 */
export function useEnabled(feature: string | string[]) {
  let [test, queryAnyPresent] = testAndConvert(feature);
  return queryAnyPresent.some(test);
}

/**
 * returns true iff any specified feature is disabled
 */
export function useDisabled(without: string | string[]) {
  let [test, queryAnyWithout] = testAndConvert(without);
  return queryAnyWithout.some(x => !test(x));
}

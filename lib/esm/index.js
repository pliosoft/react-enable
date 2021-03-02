import { testAndConvert } from "./utils";
export { ToggleFeatures } from "./ToggleFeatures";
export { Features } from "./Features";
export { EnableContext } from "./EnableContext";
export function useAllEnabled(allFeatures) {
    var _a = testAndConvert(allFeatures), test = _a[0], queryAllPresent = _a[1];
    return queryAllPresent.every(test);
}
export function useAllDisabled(withoutAll) {
    var _a = testAndConvert(withoutAll), test = _a[0], queryAllWithout = _a[1];
    return queryAllWithout.every(function (x) { return !test(x); });
}
export function useEnabled(feature) {
    var _a = testAndConvert(feature), test = _a[0], queryAnyPresent = _a[1];
    return queryAnyPresent.some(test);
}
export function useDisabled(without) {
    var _a = testAndConvert(without), test = _a[0], queryAnyWithout = _a[1];
    return queryAnyWithout.some(function (x) { return !test(x); });
}

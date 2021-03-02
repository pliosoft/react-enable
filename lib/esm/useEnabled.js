import { testAndConvert } from "./utils";
export function useEnabled(feature) {
    var _a = testAndConvert(feature), test = _a[0], queryAnyPresent = _a[1];
    return queryAnyPresent.some(test);
}

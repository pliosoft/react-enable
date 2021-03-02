import { testAndConvert } from "./utils";
export function useAllEnabled(allFeatures) {
    var _a = testAndConvert(allFeatures), test = _a[0], queryAllPresent = _a[1];
    return queryAllPresent.every(test);
}

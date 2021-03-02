import { testAndConvert } from "./utils";
export function useAllDisabled(withoutAll) {
    var _a = testAndConvert(withoutAll), test = _a[0], queryAllWithout = _a[1];
    return withoutAll.length > 0 && queryAllWithout.every(function (x) { return !test(x); });
}

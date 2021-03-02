import { testAndConvert } from "./utils";
export function useDisabled(without) {
    var _a = testAndConvert(without), test = _a[0], queryAnyWithout = _a[1];
    return queryAnyWithout.some(function (x) { return !test(x); });
}

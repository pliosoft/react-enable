"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAllDisabled = void 0;
var utils_1 = require("./utils");
function useAllDisabled(withoutAll) {
    var _a = utils_1.testAndConvert(withoutAll), test = _a[0], queryAllWithout = _a[1];
    return queryAllWithout.every(function (x) { return !test(x); });
}
exports.useAllDisabled = useAllDisabled;

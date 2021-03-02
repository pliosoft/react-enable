"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDisabled = void 0;
var utils_1 = require("./utils");
function useDisabled(without) {
    var _a = utils_1.testAndConvert(without), test = _a[0], queryAnyWithout = _a[1];
    return queryAnyWithout.some(function (x) { return !test(x); });
}
exports.useDisabled = useDisabled;

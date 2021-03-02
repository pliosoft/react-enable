"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnabled = void 0;
var utils_1 = require("./utils");
function useEnabled(feature) {
    var _a = utils_1.testAndConvert(feature), test = _a[0], queryAnyPresent = _a[1];
    return queryAnyPresent.some(test);
}
exports.useEnabled = useEnabled;

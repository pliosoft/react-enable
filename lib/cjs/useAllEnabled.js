"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAllEnabled = void 0;
var utils_1 = require("./utils");
function useAllEnabled(allFeatures) {
    var _a = utils_1.testAndConvert(allFeatures), test = _a[0], queryAllPresent = _a[1];
    return queryAllPresent.length > 0 && queryAllPresent.every(test);
}
exports.useAllEnabled = useAllEnabled;

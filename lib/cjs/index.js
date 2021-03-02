"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDisabled = exports.useEnabled = exports.useAllDisabled = exports.useAllEnabled = exports.EnableContext = exports.Features = exports.ToggleFeatures = void 0;
var utils_1 = require("./utils");
var ToggleFeatures_1 = require("./ToggleFeatures");
Object.defineProperty(exports, "ToggleFeatures", { enumerable: true, get: function () { return ToggleFeatures_1.ToggleFeatures; } });
var Features_1 = require("./Features");
Object.defineProperty(exports, "Features", { enumerable: true, get: function () { return Features_1.Features; } });
var EnableContext_1 = require("./EnableContext");
Object.defineProperty(exports, "EnableContext", { enumerable: true, get: function () { return EnableContext_1.EnableContext; } });
function useAllEnabled(allFeatures) {
    var _a = utils_1.testAndConvert(allFeatures), test = _a[0], queryAllPresent = _a[1];
    return queryAllPresent.every(test);
}
exports.useAllEnabled = useAllEnabled;
function useAllDisabled(withoutAll) {
    var _a = utils_1.testAndConvert(withoutAll), test = _a[0], queryAllWithout = _a[1];
    return queryAllWithout.every(function (x) { return !test(x); });
}
exports.useAllDisabled = useAllDisabled;
function useEnabled(feature) {
    var _a = utils_1.testAndConvert(feature), test = _a[0], queryAnyPresent = _a[1];
    return queryAnyPresent.some(test);
}
exports.useEnabled = useEnabled;
function useDisabled(without) {
    var _a = utils_1.testAndConvert(without), test = _a[0], queryAnyWithout = _a[1];
    return queryAnyWithout.some(function (x) { return !test(x); });
}
exports.useDisabled = useDisabled;

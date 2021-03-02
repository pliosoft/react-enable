"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enable = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var index_1 = require("./index");
var Enable = function (_a) {
    var _b = _a.feature, feature = _b === void 0 ? [] : _b, _c = _a.without, without = _c === void 0 ? [] : _c, _d = _a.allFeatures, allFeatures = _d === void 0 ? [] : _d, _e = _a.withoutAll, withoutAll = _e === void 0 ? [] : _e, children = _a.children;
    var isAny = index_1.useEnabled(feature);
    var isAll = index_1.useAllEnabled(allFeatures);
    var isNoAll = index_1.useAllDisabled(withoutAll);
    var isNoAny = index_1.useDisabled(without);
    if ((isAny || isAll) && !(isNoAll || isNoAny)) {
        return React.createElement(React.Fragment, null, children);
    }
    return null;
};
exports.Enable = Enable;

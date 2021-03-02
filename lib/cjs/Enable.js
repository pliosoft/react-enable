"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enable = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var index_1 = require("./index");
var Enable = function (_a) {
    var _b = _a.feature, feature = _b === void 0 ? [] : _b, _c = _a.allFeatures, allFeatures = _c === void 0 ? [] : _c, children = _a.children;
    var isAny = index_1.useEnabled(feature);
    var isAll = index_1.useAllEnabled(allFeatures);
    if (isAny || isAll) {
        return React.createElement(React.Fragment, null, children);
    }
    return null;
};
exports.Enable = Enable;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disable = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var useDisabled_1 = require("./useDisabled");
var useAllDisabled_1 = require("./useAllDisabled");
var Disable = function (_a) {
    var _b = _a.feature, feature = _b === void 0 ? [] : _b, _c = _a.allFeatures, allFeatures = _c === void 0 ? [] : _c, children = _a.children;
    var isAny = useDisabled_1.useDisabled(feature);
    var isAll = useAllDisabled_1.useAllDisabled(allFeatures);
    if (isAny || isAll) {
        return React.createElement(React.Fragment, null, children);
    }
    return null;
};
exports.Disable = Disable;

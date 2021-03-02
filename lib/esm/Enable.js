import * as React from "react";
import { useEnabled, useAllEnabled, } from "./index";
export var Enable = function (_a) {
    var _b = _a.feature, feature = _b === void 0 ? [] : _b, _c = _a.allFeatures, allFeatures = _c === void 0 ? [] : _c, children = _a.children;
    var isAny = useEnabled(feature);
    var isAll = useAllEnabled(allFeatures);
    if (isAny || isAll) {
        return React.createElement(React.Fragment, null, children);
    }
    return null;
};

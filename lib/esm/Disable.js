import * as React from "react";
import { useDisabled } from "./useDisabled";
import { useAllDisabled } from "./useAllDisabled";
export var Disable = function (_a) {
    var _b = _a.feature, feature = _b === void 0 ? [] : _b, _c = _a.allFeatures, allFeatures = _c === void 0 ? [] : _c, children = _a.children;
    var isAny = useDisabled(feature);
    var isAll = useAllDisabled(allFeatures);
    if (isAny || isAll) {
        return React.createElement(React.Fragment, null, children);
    }
    return null;
};

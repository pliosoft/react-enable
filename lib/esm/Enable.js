import * as React from "react";
import { useEnabled, useAllEnabled, useAllDisabled, useDisabled } from "./index";
export var Enable = function (_a) {
    var _b = _a.feature, feature = _b === void 0 ? [] : _b, _c = _a.without, without = _c === void 0 ? [] : _c, _d = _a.allFeatures, allFeatures = _d === void 0 ? [] : _d, _e = _a.withoutAll, withoutAll = _e === void 0 ? [] : _e, children = _a.children;
    var isAny = useEnabled(feature);
    var isAll = useAllEnabled(allFeatures);
    var isNoAll = useAllDisabled(withoutAll);
    var isNoAny = useDisabled(without);
    if ((isAny || isAll) && !(isNoAll || isNoAny)) {
        return React.createElement(React.Fragment, null, children);
    }
    return null;
};

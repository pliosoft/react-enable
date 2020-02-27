"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Set_1 = require("fp-ts/lib/Set");
var Eq_1 = require("fp-ts/lib/Eq");
exports.EnableContext = React.createContext(function (_s) { return false; });
function useEnabledFull(props) {
    var _a = props.feature, feature = _a === void 0 ? [] : _a, _b = props.without, without = _b === void 0 ? [] : _b, _c = props.allFeatures, allFeatures = _c === void 0 ? [] : _c, _d = props.withoutAll, withoutAll = _d === void 0 ? [] : _d;
    var test = React.useContext(exports.EnableContext);
    if (test == null) {
        return false;
    }
    var someFeatureList = Array.isArray(feature) ? feature : [feature];
    var maybeEnabled = someFeatureList.some(test) || allFeatures.length > 0 && allFeatures.every(test);
    if (!maybeEnabled && feature.length > 0) {
        return false;
    }
    var someWithoutList = Array.isArray(without) ? without : [without];
    var maybeDisabled = someWithoutList.some(test) || withoutAll.length > 0 && withoutAll.every(test);
    if (maybeDisabled) {
        return false;
    }
    return true;
}
exports.useEnabledFull = useEnabledFull;
function useAllEnabled(allFeatures) {
    return useEnabledFull({ allFeatures: allFeatures });
}
exports.useAllEnabled = useAllEnabled;
function useAllDisabled(withoutAll) {
    return useEnabledFull({ withoutAll: withoutAll });
}
exports.useAllDisabled = useAllDisabled;
function useEnabled(feature) {
    return useEnabledFull({ feature: feature });
}
exports.useEnabled = useEnabled;
function useDisabled(without) {
    return useEnabledFull({ without: without });
}
exports.useDisabled = useDisabled;
exports.Enable = function (_a) {
    var _b = _a.feature, feature = _b === void 0 ? [] : _b, _c = _a.without, without = _c === void 0 ? [] : _c, _d = _a.allFeatures, allFeatures = _d === void 0 ? [] : _d, _e = _a.withoutAll, withoutAll = _e === void 0 ? [] : _e, children = _a.children;
    if (useEnabledFull({ feature: feature, without: without, allFeatures: allFeatures, withoutAll: withoutAll })) {
        return React.createElement(React.Fragment, null, children);
    }
    return null;
};
var insertStr = Set_1.insert(Eq_1.eqString);
var removeStr = Set_1.remove(Eq_1.eqString);
var elemStr = Set_1.elem(Eq_1.eqString);
var reducer = function (state, action) {
    switch (action.type) {
        case 'enable': {
            return tslib_1.__assign(tslib_1.__assign({}, state), { active: insertStr(action.feature)(state.active) });
        }
        case 'disable': {
            return tslib_1.__assign(tslib_1.__assign({}, state), { active: removeStr(action.feature)(state.active) });
        }
        case 'toggle': {
            return tslib_1.__assign(tslib_1.__assign({}, state), { active: (elemStr(action.feature, state.active)) ?
                    removeStr(action.feature)(state.active) :
                    insertStr(action.feature)(state.active) });
        }
        case 'set-active': {
            return tslib_1.__assign(tslib_1.__assign({}, state), { active: Set_1.fromArray(Eq_1.eqString)(action.active) });
        }
        default:
            throw new Error("Unsupported action");
    }
};
var GlobalEnable = (function () {
    function GlobalEnable(dispatch) {
        this.dispatch = dispatch;
    }
    GlobalEnable.prototype.toggle = function (feature) {
        this.dispatch({ type: 'toggle', feature: feature });
    };
    GlobalEnable.prototype.enable = function (feature) {
        this.dispatch({ type: 'enable', feature: feature });
    };
    GlobalEnable.prototype.disable = function (feature) {
        this.dispatch({ type: 'disable', feature: feature });
    };
    return GlobalEnable;
}());
var FeatureContext = React.createContext(null);
exports.Features = function (_a) {
    var features = _a.features, defaultEnabled = _a.defaultEnabled, _b = _a.consoleOverride, consoleOverride = _b === void 0 ? false : _b, children = _a.children;
    var initial = { features: features, active: new Set(defaultEnabled) };
    var _c = React.useReducer(reducer, initial), state = _c[0], dispatch = _c[1];
    React.useEffect(function () {
        if (!consoleOverride) {
            return function () { };
        }
        window.feature = new GlobalEnable(dispatch);
        return function () {
            window.feature = undefined;
        };
    }, [dispatch]);
    var featureValue = React.useMemo(function () { return ({ dispatch: dispatch, state: state }); }, [dispatch, state, state.active]);
    var testCallback = React.useCallback(function (f) {
        return state.active.has(f);
    }, [state, state.active]);
    return (React.createElement(FeatureContext.Provider, { value: featureValue },
        React.createElement(exports.EnableContext.Provider, { value: testCallback }, children)));
};
exports.ToggleFeatures = function () {
    var _a = React.useState(false), hide = _a[0], setHide = _a[1];
    var _b = React.useState(false), dragging = _b[0], setDragging = _b[1];
    var dragElement = React.useRef(null);
    var _c = React.useState([100, 100]), start = _c[0], setStart = _c[1];
    var _d = React.useState([0, 0]), current = _d[0], setCurrent = _d[1];
    var context = React.useContext(FeatureContext);
    var handleMouseDown = React.useCallback(function (e) {
        e.preventDefault();
        setStart([e.clientX, e.clientY]);
        setDragging(true);
    }, [setDragging]);
    var handleMouseMove = React.useCallback(function (e) {
        e.preventDefault();
        setCurrent([e.clientX - start[0], e.clientY - start[1]]);
    }, [setCurrent, start[0], start[1]]);
    var handleMouseUp = React.useCallback(function (e) {
        e.preventDefault();
        setDragging(false);
    }, [setDragging]);
    React.useEffect(function () {
        var _a;
        (_a = dragElement.current) === null || _a === void 0 ? void 0 : _a.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        return function () {
            var _a;
            (_a = dragElement.current) === null || _a === void 0 ? void 0 : _a.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragElement, handleMouseDown, handleMouseUp]);
    React.useEffect(function () {
        if (!dragging) {
            return function () { };
        }
        document.addEventListener("mousemove", handleMouseMove);
        return function () { return document.removeEventListener("mousemove", handleMouseMove); };
    }, [dragging, handleMouseMove]);
    var position = React.useMemo(function () {
        return [start[0] + current[0], start[1] + current[1]];
    }, [start[0], start[1], current[0], current[1]]);
    if (context == null) {
        return null;
    }
    var dispatch = context.dispatch, state = context.state;
    return (React.createElement("aside", { className: "feature-flags", style: {
            position: "fixed",
            left: position[0] + "px",
            top: position[1] + "px",
            width: "200px",
            height: "100px",
            background: "white",
            border: "1px solid gray",
            zIndex: 100000,
            opacity: "0.7",
            display: hide ? "none" : "flex",
            flexDirection: "column"
        } },
        React.createElement("div", { style: {
                display: "flex",
                borderBottom: "1px solid gray",
                background: "#eee",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 0 0 10px"
            } },
            React.createElement("button", { onClick: function () { return setHide(true); } }, "Hide"),
            React.createElement("div", { ref: dragElement, style: {
                    fontSize: "20px",
                    cursor: "move",
                    width: "32px",
                    height: "32px"
                } }, "\u29B7")),
        state.features.map(function (feature) { return (React.createElement("div", null,
            React.createElement("label", null,
                React.createElement("input", { type: "checkbox", onChange: function () {
                        dispatch({ type: 'toggle', feature: feature.name });
                    }, checked: state.active.has(feature.name) }),
                feature.name),
            feature.description != null ? React.createElement("p", null, feature.description) : null)); })));
};

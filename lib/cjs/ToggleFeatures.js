"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleFeatures = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var FeatureContext_1 = require("./FeatureContext");
var ToggleFeatures = function () {
    var _a = react_1.default.useState(false), showDrawer = _a[0], setShowDrawer = _a[1];
    var context = react_1.default.useContext(FeatureContext_1.FeatureContext);
    if (context == null) {
        return null;
    }
    var dispatch = context.dispatch, state = context.state;
    if (state.features.length === 0) {
        return null;
    }
    return (react_1.default.createElement("aside", { className: "feature-flags", style: {
            left: showDrawer ? "0" : "-198px",
            top: "100px",
            width: "220px",
            height: "300px",
            color: "black",
            background: "white",
            border: "1px solid gray",
            zIndex: 100000,
            opacity: showDrawer ? "1" : "0.6",
            position: "fixed",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            alignItems: "stretch",
            alignContent: "stretch"
        } },
        react_1.default.createElement("main", { style: {
                flexGrow: 1,
                padding: "12px",
                overflow: "scroll"
            } }, state.features.map(function (feature) { return (react_1.default.createElement("div", { key: feature.name },
            react_1.default.createElement("label", null,
                react_1.default.createElement("input", { type: "checkbox", onChange: function () {
                        dispatch({ type: "toggle", feature: feature.name });
                    }, checked: state.currentEnabled.has(feature.name) }),
                feature.name),
            feature.description != null ? (react_1.default.createElement("p", { style: {
                    marginTop: "0",
                    marginLeft: "1.5em",
                    fontSize: "0.5rem",
                    lineHeight: "0.5rem"
                } }, feature.description)) : null)); })),
        react_1.default.createElement("div", { style: {
                background: "rgb(238, 238, 238)",
                padding: "10px 0",
                writingMode: "vertical-rl",
                flexGrow: 0,
                width: "24px",
                display: "flex",
                flexDirection: "row",
                cursor: "pointer",
                justifyContent: "space-between",
                alignItems: "center"
            }, onClick: function () { return setShowDrawer(!showDrawer); } },
            react_1.default.createElement("button", { style: {
                    border: "none",
                    fontSize: "8px",
                    background: "transparent",
                    padding: "2px",
                    cursor: "pointer"
                } }, showDrawer ? "🎛 Hide" : "🎛 Show"),
            react_1.default.createElement("span", null, "Dev Features Panel"))));
};
exports.ToggleFeatures = ToggleFeatures;

import React from "react";
import { FeatureContext } from "./FeatureContext";
export var ToggleFeatures = function () {
    var _a = React.useState(false), showDrawer = _a[0], setShowDrawer = _a[1];
    var context = React.useContext(FeatureContext);
    if (context == null) {
        return null;
    }
    var dispatch = context.dispatch, state = context.state;
    if (state.features.length === 0) {
        return null;
    }
    return (React.createElement("aside", { className: "feature-flags", style: {
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
        React.createElement("main", { style: {
                flexGrow: 1,
                padding: "12px",
                overflow: "scroll"
            } }, state.features.map(function (feature) { return (React.createElement("div", { key: feature.name },
            React.createElement("label", null,
                React.createElement("input", { type: "checkbox", onChange: function () {
                        dispatch({ type: "toggle", feature: feature.name });
                    }, checked: state.currentEnabled.has(feature.name) }),
                feature.name),
            feature.description != null ? (React.createElement("p", { style: {
                    marginTop: "0",
                    marginLeft: "1.5em",
                    fontSize: "0.5rem",
                    lineHeight: "0.5rem"
                } }, feature.description)) : null)); })),
        React.createElement("div", { style: {
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
            React.createElement("button", { style: {
                    border: "none",
                    fontSize: "8px",
                    background: "transparent",
                    padding: "2px",
                    cursor: "pointer"
                } }, showDrawer ? "🎛 Hide" : "🎛 Show"),
            React.createElement("span", null, "Dev Features Panel"))));
};

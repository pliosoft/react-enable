import * as React from "react";
import { EnableContext } from "./EnableContext";
import { fromStrArray, reducer, elemStr } from "./FeatureState";
import { GlobalEnable } from "./GlobalEnable";
import { FeatureContext } from "./FeatureContext";
export var Features = function (_a) {
    var features = _a.features, defaultEnabled = _a.defaultEnabled, _b = _a.consoleOverride, consoleOverride = _b === void 0 ? false : _b, storage = _a.storage, children = _a.children;
    var initial = {
        features: features,
        forceDisable: fromStrArray([]),
        forceEnable: fromStrArray([]),
        defaultActive: fromStrArray(defaultEnabled),
        currentEnabled: new Set()
    };
    var _c = React.useReducer(reducer, initial), state = _c[0], dispatch = _c[1];
    useLoad(storage, dispatch);
    usePersist(state.forceEnable, state.forceDisable, storage);
    useConsoleOverride(consoleOverride, dispatch);
    React.useEffect(function () {
        if (Array.isArray(defaultEnabled)) {
            dispatch({ type: "set-default", defaultEnabled: defaultEnabled });
        }
    }, [dispatch, defaultEnabled]);
    var featureValue = React.useMemo(function () { return ({ dispatch: dispatch, state: state }); }, [
        dispatch,
        state,
        state.defaultActive,
        state.forceEnable,
        state.forceDisable
    ]);
    var testCallback = React.useCallback(function (f) { return elemStr(f, state.currentEnabled); }, [state.currentEnabled]);
    return (React.createElement(FeatureContext.Provider, { value: featureValue },
        React.createElement(EnableContext.Provider, { value: testCallback }, children)));
};
function useConsoleOverride(consoleOverride, dispatch) {
    React.useEffect(function () {
        if (!consoleOverride) {
            return function () {
            };
        }
        window.feature = new GlobalEnable(dispatch);
        return function () {
            window.feature = undefined;
        };
    }, [dispatch]);
}
function useLoad(storage, dispatch) {
    React.useEffect(function () {
        if (storage != null) {
            try {
                var value = storage.getItem("react-enable:features");
                if (value != null) {
                    var result = JSON.parse(value);
                    if (Array.isArray(result.on) &&
                        Array.isArray(result.off) &&
                        typeof result.on[0] === "string" &&
                        typeof result.off[0] === "string") {
                        dispatch({ type: "set-active", values: result });
                    }
                }
            }
            catch (e) {
            }
        }
    }, [storage]);
}
function usePersist(forceEnable, forceDisable, storage) {
    var strState = storage == null
        ? undefined
        : JSON.stringify({
            on: Array.from(forceEnable).sort(),
            off: Array.from(forceDisable).sort()
        });
    React.useEffect(function () {
        if (strState != null && storage != null) {
            try {
                storage.setItem("react-enable:features", strState);
            }
            catch (e) {
            }
        }
    }, [storage, strState]);
}

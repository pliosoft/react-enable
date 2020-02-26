"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
exports.EnableContext = react_1.createContext((_s) => false);
function useEnabledFull(props) {
    const { feature = [], without = [], allFeatures = [], withoutAll = [] } = props;
    const test = react_1.useContext(exports.EnableContext);
    if (test == null) {
        return false;
    }
    let someFeatureList = Array.isArray(feature) ? feature : [feature];
    let maybeEnabled = someFeatureList.some(test) || allFeatures.every(test);
    if (!maybeEnabled) {
        return false;
    }
    let someWithoutList = Array.isArray(without) ? without : [without];
    let maybeDisabled = someWithoutList.some(test) || withoutAll.every(test);
    if (maybeDisabled) {
        return false;
    }
    return true;
}
exports.useEnabledFull = useEnabledFull;
function useAllEnabled(allFeatures) {
    return useEnabledFull({ allFeatures });
}
exports.useAllEnabled = useAllEnabled;
function useAllDisabled(withoutAll) {
    return useEnabledFull({ withoutAll });
}
exports.useAllDisabled = useAllDisabled;
function useEnabled(feature) {
    return useEnabledFull({ feature });
}
exports.useEnabled = useEnabled;
function useDisabled(without) {
    return useEnabledFull({ without });
}
exports.useDisabled = useDisabled;
exports.Enable = ({ feature = [], without = [], allFeatures = [], withoutAll = [], children }) => {
    if (useEnabledFull({ feature, without, allFeatures, withoutAll })) {
        return react_1.createElement(react_1.default.Fragment, null, children);
    }
    return null;
};
const reducer = (state, action) => {
    switch (action.type) {
        case 'enable': {
            state.active.add(action.feature);
            return Object.assign(Object.assign({}, state), { active: state.active });
        }
        case 'disable': {
            state.active.delete(action.feature);
            return Object.assign(Object.assign({}, state), { active: state.active });
        }
        case 'toggle': {
            if (state.active.has(action.feature)) {
                state.active.delete(action.feature);
            }
            else {
                state.active.add(action.feature);
            }
            return Object.assign(Object.assign({}, state), { active: state.active });
        }
        case 'set-active': {
            return Object.assign(Object.assign({}, state), { active: new Set(action.active) });
        }
        default:
            throw new Error("Unsupported action");
    }
};
class GlobalEnable {
    constructor(dispatch) {
        this.dispatch = dispatch;
    }
    toggle(feature) {
        this.dispatch({ type: 'toggle', feature });
    }
    enable(feature) {
        this.dispatch({ type: 'enable', feature });
    }
    disable(feature) {
        this.dispatch({ type: 'disable', feature });
    }
}
const FeatureContext = react_1.createContext(null);
exports.Features = ({ features, enabled, children }) => {
    const initial = { features, active: new Set(enabled) };
    const [state, dispatch] = react_1.useReducer(reducer, initial);
    react_1.useEffect(() => {
        dispatch({ type: 'set-active', active: enabled });
    }, [enabled]);
    react_1.useEffect(() => {
        window.feature = new GlobalEnable(dispatch);
        return () => {
            window.feature = undefined;
        };
    }, [dispatch]);
    const featureValue = react_1.useMemo(() => ({ dispatch, state }), [dispatch, state]);
    const testCallback = react_1.useCallback((f) => state.active.has(f), [state, state.active]);
    return (react_1.createElement(FeatureContext.Provider, { value: featureValue }, react_1.createElement(exports.EnableContext.Provider, { value: testCallback }, children)));
};
exports.ToggleFeatures = () => {
    const context = react_1.useContext(FeatureContext);
    if (context == null) {
        return null;
    }
    const { dispatch, state } = context;
    const handleChange = react_1.useCallback(feature => {
        dispatch({ type: 'toggle', feature });
    }, [dispatch]);
    return react_1.createElement("aside", { className: "toggle-features" }, state.features.map(feature => react_1.createElement("div", {}, [
        react_1.createElement("h4", {}, [
            react_1.createElement("main", {}, feature.name),
        ]),
        react_1.createElement("h5", {}, feature.description),
        react_1.createElement("input", {
            "type": "checkbox",
            onChange: () => handleChange(feature.name),
            value: state.active.has(feature.name)
        }, [])
    ])));
};

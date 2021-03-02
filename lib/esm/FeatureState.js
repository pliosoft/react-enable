import { __assign } from "tslib";
import { insert, remove, elem, intersection, fromArray } from "fp-ts/lib/Set";
import { eqString } from "fp-ts/lib/Eq";
import { some, none } from "fp-ts/lib/Option";
import { filterMap } from "fp-ts/lib/Array";
export var fromStrArray = fromArray(eqString);
var insertStr = insert(eqString);
var removeStr = remove(eqString);
export var elemStr = elem(eqString);
var intersectStr = intersection(eqString);
function getTest(state) {
    return function (feature) {
        var defaultEnabled = elemStr(feature, state.defaultActive);
        var forceOn = elemStr(feature, state.forceEnable);
        var forceOff = elemStr(feature, state.forceDisable);
        return forceOn || (defaultEnabled && !forceOff);
    };
}
function computeEnabled(state) {
    var test = getTest(state);
    var getEnabledFeatures = filterMap(function (a) {
        return test(a.name) ? some(a.name) : none;
    });
    return __assign(__assign({}, state), { currentEnabled: fromStrArray(getEnabledFeatures(state.features)) });
}
export var reducer = function (state, action) {
    switch (action.type) {
        case "enable": {
            if (!state.features.some(function (x) { return x.name === action.feature; })) {
                return state;
            }
            var enableAction = state.defaultActive.has(action.feature)
                ? removeStr(action.feature)
                : insertStr(action.feature);
            var disableAction = removeStr(action.feature);
            return computeEnabled(__assign(__assign({}, state), { forceEnable: enableAction(state.forceEnable), forceDisable: disableAction(state.forceEnable) }));
        }
        case "disable": {
            if (!state.features.some(function (x) { return x.name === action.feature; })) {
                return state;
            }
            return computeEnabled(__assign(__assign({}, state), { forceEnable: removeStr(action.feature)(state.forceEnable), forceDisable: insertStr(action.feature)(state.forceEnable) }));
        }
        case "toggle": {
            if (!state.features.some(function (x) { return x.name === action.feature; })) {
                return state;
            }
            var current = elemStr(action.feature, state.defaultActive)
                ? !elemStr(action.feature, state.forceDisable)
                : elemStr(action.feature, state.forceEnable);
            return reducer(state, {
                type: current ? "disable" : "enable",
                feature: action.feature
            });
        }
        case "set-default": {
            return computeEnabled(__assign(__assign({}, state), { defaultActive: fromStrArray(action.defaultEnabled) }));
        }
        case "set-active": {
            var proposedOn = fromStrArray(action.values.on);
            var proposedOff = fromStrArray(action.values.off);
            var possible = fromStrArray(state.features.map(function (x) { return x.name; }));
            return computeEnabled(__assign(__assign({}, state), { forceEnable: intersectStr(proposedOn, possible), forceDisable: intersectStr(proposedOff, possible) }));
        }
        default:
            throw new Error("Unsupported action");
    }
};

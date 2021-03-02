"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.elemStr = exports.fromStrArray = void 0;
var tslib_1 = require("tslib");
var Set_1 = require("fp-ts/lib/Set");
var Eq_1 = require("fp-ts/lib/Eq");
var Option_1 = require("fp-ts/lib/Option");
var Array_1 = require("fp-ts/lib/Array");
exports.fromStrArray = Set_1.fromArray(Eq_1.eqString);
var insertStr = Set_1.insert(Eq_1.eqString);
var removeStr = Set_1.remove(Eq_1.eqString);
exports.elemStr = Set_1.elem(Eq_1.eqString);
var intersectStr = Set_1.intersection(Eq_1.eqString);
function getTest(state) {
    return function (feature) {
        var defaultEnabled = exports.elemStr(feature, state.defaultActive);
        var forceOn = exports.elemStr(feature, state.forceEnable);
        var forceOff = exports.elemStr(feature, state.forceDisable);
        return forceOn || (defaultEnabled && !forceOff);
    };
}
function computeEnabled(state) {
    var test = getTest(state);
    var getEnabledFeatures = Array_1.filterMap(function (a) {
        return test(a.name) ? Option_1.some(a.name) : Option_1.none;
    });
    return tslib_1.__assign(tslib_1.__assign({}, state), { currentEnabled: exports.fromStrArray(getEnabledFeatures(state.features)) });
}
var reducer = function (state, action) {
    switch (action.type) {
        case "enable": {
            if (!state.features.some(function (x) { return x.name === action.feature; })) {
                return state;
            }
            var enableAction = state.defaultActive.has(action.feature)
                ? removeStr(action.feature)
                : insertStr(action.feature);
            var disableAction = removeStr(action.feature);
            return computeEnabled(tslib_1.__assign(tslib_1.__assign({}, state), { forceEnable: enableAction(state.forceEnable), forceDisable: disableAction(state.forceEnable) }));
        }
        case "disable": {
            if (!state.features.some(function (x) { return x.name === action.feature; })) {
                return state;
            }
            return computeEnabled(tslib_1.__assign(tslib_1.__assign({}, state), { forceEnable: removeStr(action.feature)(state.forceEnable), forceDisable: insertStr(action.feature)(state.forceEnable) }));
        }
        case "toggle": {
            if (!state.features.some(function (x) { return x.name === action.feature; })) {
                return state;
            }
            var current = exports.elemStr(action.feature, state.defaultActive)
                ? !exports.elemStr(action.feature, state.forceDisable)
                : exports.elemStr(action.feature, state.forceEnable);
            return exports.reducer(state, {
                type: current ? "disable" : "enable",
                feature: action.feature
            });
        }
        case "set-default": {
            return computeEnabled(tslib_1.__assign(tslib_1.__assign({}, state), { defaultActive: exports.fromStrArray(action.defaultEnabled) }));
        }
        case "set-active": {
            var proposedOn = exports.fromStrArray(action.values.on);
            var proposedOff = exports.fromStrArray(action.values.off);
            var possible = exports.fromStrArray(state.features.map(function (x) { return x.name; }));
            return computeEnabled(tslib_1.__assign(tslib_1.__assign({}, state), { forceEnable: intersectStr(proposedOn, possible), forceDisable: intersectStr(proposedOff, possible) }));
        }
        default:
            throw new Error("Unsupported action");
    }
};
exports.reducer = reducer;

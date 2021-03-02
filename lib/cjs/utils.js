"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAndConvert = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var EnableContext_1 = require("./EnableContext");
function testAndConvert(input) {
    if ((Array.isArray(input) && input.length === 0) || input == null) {
        throw new Error("Can't have empty array of features");
    }
    var test = React.useContext(EnableContext_1.EnableContext);
    var converted = React.useMemo(function () { return (Array.isArray(input) ? input : [input]); }, [input]);
    return [test, converted];
}
exports.testAndConvert = testAndConvert;

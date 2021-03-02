import * as React from "react";
import { EnableContext } from "./EnableContext";
export function testAndConvert(input) {
    var test = React.useContext(EnableContext);
    var converted = React.useMemo(function () { return (input == null ? [] : (Array.isArray(input) ? input : [input])); }, [input]);
    return [test, converted];
}

import * as React from "react";
import { EnableContext } from "./EnableContext";
export function testAndConvert(input) {
    if ((Array.isArray(input) && input.length === 0) || input == null) {
        throw new Error("Can't have empty array of features");
    }
    var test = React.useContext(EnableContext);
    var converted = React.useMemo(function () { return (Array.isArray(input) ? input : [input]); }, [input]);
    return [test, converted];
}

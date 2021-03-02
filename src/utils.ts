import * as React from "react";
import { EnableContextType, EnableContext } from "./EnableContext";

// Helper: get rid of some boilerplate.
// just input mashing and sanitation, removing extra renders, and getting test function
export function testAndConvert(
  input?: string | string[] | null
): [EnableContextType, string[]] {
  const test = React.useContext(EnableContext);
  // We memoize just to prevent re-renders since this could be at the leaf of a tree
  const converted = React.useMemo(
    () => (input == null ? [] : (Array.isArray(input) ? input : [input])),
    [input]
  );
  return [test, converted];
}

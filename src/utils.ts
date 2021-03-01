import * as React from "react";
import { EnableContextType, EnableContext } from "./EnableContext";

// Helper: get rid of some boilerplate.
// just input mashing and sanitation, removing extra renders, and getting test function
export function testAndConvert(
  input?: string | string[] | null
): [EnableContextType, string[]] {
  if ((Array.isArray(input) && input.length === 0) || input == null) {
    throw new Error("Can't have empty array of features");
  }
  const test = React.useContext(EnableContext);
  // We memoize just to prevent re-renders since this could be at the leaf of a tree
  const converted = React.useMemo(
    () => (Array.isArray(input) ? input : [input]),
    [input]
  );
  return [test, converted];
}

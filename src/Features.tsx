import * as React from "react";
import { EnableContext } from "./EnableContext";
import {
  Feature,
  DispatchFeature,
  FeatureState,
  fromStrArray,
  reducer,
  elemStr
} from "./FeatureState";
import { GlobalEnable } from "./GlobalEnable";
import { FeatureContext } from "./FeatureContext";

interface FeatureProps {
  readonly features: Feature[];
  readonly defaultEnabled: string[];
  readonly consoleOverride?: boolean;
  readonly storage?: Storage;
}

/**
 * A more batteries-enabled parent component that keeps track of feature state
 * internally, and creates window.feature.enable("f") and window.feature.disable("f").
 */
export const Features: React.FC<FeatureProps> = ({
  features,
  defaultEnabled,
  consoleOverride = false,
  storage,
  children
}) => {
  const initial: FeatureState = {
    features,
    forceDisable: fromStrArray([]),
    forceEnable: fromStrArray([]),
    defaultActive: fromStrArray(defaultEnabled),
    currentEnabled: new Set()
  };

  const [state, dispatch] = React.useReducer(reducer, initial);
  // console.debug("State: \n##> %o\n##> %o\n##> %o", state.forceEnable, state.forceDisable, state.defaultActive)

  useLoad(storage, dispatch);
  usePersist(state.forceEnable, state.forceDisable, storage);
  useConsoleOverride(consoleOverride, dispatch);

  React.useEffect(() => {
    if (Array.isArray(defaultEnabled)) {
      dispatch({ type: "set-default", defaultEnabled });
    }
  }, [dispatch, defaultEnabled]);

  const featureValue = React.useMemo(() => ({ dispatch, state }), [
    dispatch,
    state,
    state.defaultActive,
    state.forceEnable,
    state.forceDisable
  ]);

  const testCallback = React.useCallback(
    (f: string) => elemStr(f, state.currentEnabled),
    [state.currentEnabled]
  );

  return (
    <FeatureContext.Provider value={featureValue}>
      <EnableContext.Provider value={testCallback}>
        {children}
      </EnableContext.Provider>
    </FeatureContext.Provider>
  );
};

function useConsoleOverride(
  consoleOverride: boolean,
  dispatch: DispatchFeature
) {
  React.useEffect(() => {
    if (!consoleOverride) {
      return () => {
        /* empty */
      };
    }
    window.feature = new GlobalEnable(dispatch);
    return () => {
      window.feature = undefined;
    };
  }, [dispatch]);
}

function useLoad(storage: Storage | undefined, dispatch: DispatchFeature) {
  React.useEffect(() => {
    if (storage != null) {
      try {
        const value = storage.getItem("react-enable:features");
        if (value != null) {
          const result = JSON.parse(value);
          if (
            Array.isArray(result.on) &&
            Array.isArray(result.off) &&
            typeof result.on[0] === "string" &&
            typeof result.off[0] === "string"
          ) {
            dispatch({ type: "set-active", values: result });
          }
        }
      } catch (e) {
        // Can't parse or get
      }
    }
  }, [storage]);
}

function usePersist(
  forceEnable: Set<string>,
  forceDisable: Set<string>,
  storage: Storage | undefined
) {
  const strState =
    storage == null
      ? undefined
      : JSON.stringify({
          on: Array.from(forceEnable).sort(),
          off: Array.from(forceDisable).sort()
        });

  React.useEffect(() => {
    if (strState != null && storage != null) {
      try {
        storage.setItem("react-enable:features", strState);
      } catch (e) {
        // Can't set for some reason
      }
    }
  }, [storage, strState]);
}

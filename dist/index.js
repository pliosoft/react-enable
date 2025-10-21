// src/utils.ts
import { useContext, useMemo } from "react";

// src/EnableContext.tsx
import { createContext } from "react";
var EnableContext = createContext((_s) => false);

// src/utils.ts
function useTestAndConvert(input) {
  const test = useContext(EnableContext);
  const converted = useMemo(
    () => input == null ? [] : Array.isArray(input) ? input : [input],
    [input]
  );
  return [test, converted];
}

// src/useAllDisabled.tsx
function useAllDisabled(withoutAll) {
  const [test, queryAllWithout] = useTestAndConvert(withoutAll);
  return withoutAll.length > 0 && queryAllWithout.every((x) => !(test(x) ?? false));
}

// src/useDisabled.tsx
function useDisabled(without) {
  const [test, queryAnyWithout] = useTestAndConvert(without);
  return queryAnyWithout.some((x) => !(test(x) ?? false));
}

// src/Disable.tsx
import { Fragment, jsx } from "react/jsx-runtime";
var Disable = ({
  feature = [],
  allFeatures = [],
  children
}) => {
  const isAny = useDisabled(feature);
  const isAll = useAllDisabled(allFeatures);
  if (isAny || isAll) {
    return /* @__PURE__ */ jsx(Fragment, { children });
  }
  return null;
};

// src/useAllEnabled.tsx
function useAllEnabled(allFeatures) {
  const [test, queryAllPresent] = useTestAndConvert(allFeatures);
  return queryAllPresent.length > 0 && queryAllPresent.every(test);
}

// src/useEnabled.tsx
function useEnabled(feature) {
  const [test, queryAnyPresent] = useTestAndConvert(feature);
  return queryAnyPresent.some(test);
}

// src/Enable.tsx
import { Fragment as Fragment2, jsx as jsx2 } from "react/jsx-runtime";
function Enable({
  feature = [],
  allFeatures = [],
  children
}) {
  const isAny = useEnabled(feature);
  const isAll = useAllEnabled(allFeatures);
  if (isAny || isAll) {
    return /* @__PURE__ */ jsx2(Fragment2, { children });
  }
  return null;
}

// src/Features.tsx
import {
  useEffect as useEffect3,
  useLayoutEffect,
  useMemo as useMemo3,
  useReducer,
  useRef
} from "react";

// src/FeatureContext.tsx
import { createContext as createContext2 } from "react";
var FeatureContext = createContext2(null);

// src/FeatureState.tsx
function valueForState(featureState) {
  return [
    featureState.value === "enabled" || featureState.value === "asyncEnabled" ? true : featureState.value === "disabled" || featureState.value === "asyncDisabled" ? false : void 0,
    featureState.featureDesc?.force ?? false
  ];
}

// src/FeaturesState.tsx
function valueOfFeature(featuresState, feature) {
  if (featuresState.context.features[feature] == null) {
    return [void 0, false];
  }
  const featureState = featuresState.context.features[feature];
  if (featureState != null) {
    return valueForState(featureState);
  }
  return [void 0, false];
}
var initialFeaturesState = {
  value: "idle",
  context: {
    features: {}
  }
};
function featuresReducer(state, action) {
  switch (action.type) {
    case "INIT": {
      if (!action.features || action.features.length === 0) {
        return state;
      }
      const features = {};
      for (const feature of action.features) {
        const featureState = {
          value: feature.defaultValue === true ? "enabled" : feature.defaultValue === false ? "disabled" : "unspecified",
          featureDesc: feature
        };
        features[feature.name] = featureState;
      }
      return {
        value: "ready",
        context: { features }
      };
    }
    case "DE_INIT": {
      return initialFeaturesState;
    }
    case "SET_ALL": {
      if (state.value !== "ready") {
        return state;
      }
      const features = { ...state.context.features };
      Object.keys(features).forEach((name) => {
        const value = action.features[name] ?? void 0;
        const currentFeature = features[name];
        if (currentFeature.featureDesc?.onChangeDefault != null) {
          if (value === true) {
            features[name] = { ...currentFeature, value: "asyncEnabled" };
          } else if (value === false) {
            features[name] = { ...currentFeature, value: "asyncDisabled" };
          } else {
            features[name] = { ...currentFeature, value: "asyncUnspecified" };
          }
        } else {
          if (value === true) {
            features[name] = { ...currentFeature, value: "enabled" };
          } else if (value === false) {
            features[name] = { ...currentFeature, value: "disabled" };
          } else {
            features[name] = { ...currentFeature, value: "unspecified" };
          }
        }
      });
      return {
        ...state,
        context: { features }
      };
    }
    case "SET": {
      if (state.value !== "ready") {
        return state;
      }
      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }
      const { value } = action;
      let newValue;
      if (feature.featureDesc?.onChangeDefault != null) {
        if (value === true) {
          newValue = "asyncEnabled";
        } else if (value === false) {
          newValue = "asyncDisabled";
        } else {
          newValue = "asyncUnspecified";
        }
      } else {
        if (value === true) {
          newValue = "enabled";
        } else if (value === false) {
          newValue = "disabled";
        } else {
          newValue = "unspecified";
        }
      }
      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue }
          }
        }
      };
    }
    case "TOGGLE": {
      if (state.value !== "ready") {
        return state;
      }
      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }
      const newValue = feature.featureDesc?.onChangeDefault != null ? "asyncEnabled" : "enabled";
      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue }
          }
        }
      };
    }
    case "ENABLE": {
      if (state.value !== "ready") {
        return state;
      }
      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }
      const newValue = feature.featureDesc?.onChangeDefault != null ? "asyncEnabled" : "enabled";
      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue }
          }
        }
      };
    }
    case "DISABLE": {
      if (state.value !== "ready") {
        return state;
      }
      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }
      const newValue = feature.featureDesc?.onChangeDefault != null ? "asyncDisabled" : "disabled";
      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue }
          }
        }
      };
    }
    case "UNSET": {
      if (state.value !== "ready") {
        return state;
      }
      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }
      const newValue = feature.featureDesc?.onChangeDefault != null ? "asyncUnspecified" : "unspecified";
      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue }
          }
        }
      };
    }
    case "ASYNC_DONE": {
      if (state.value !== "ready") {
        return state;
      }
      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }
      const { value } = action;
      const newValue = value === true ? "enabled" : value === false ? "disabled" : "unspecified";
      return {
        ...state,
        context: {
          features: {
            ...state.context.features,
            [action.name]: { ...feature, value: newValue }
          }
        }
      };
    }
    default:
      return state;
  }
}

// src/useConsoleOverride.tsx
import { useEffect } from "react";

// src/GlobalEnable.tsx
var GlobalEnable = class {
  constructor(dispatch, testFeature2, featureDesc) {
    this.featureDesc = featureDesc;
    this.dispatch = dispatch;
    this.testFeature = testFeature2;
  }
  toggle(feature) {
    this.dispatch({ type: "TOGGLE", name: feature });
  }
  enable(feature) {
    this.dispatch({ type: "ENABLE", name: feature });
  }
  unset(feature) {
    this.dispatch({ type: "UNSET", name: feature });
  }
  disable(feature) {
    this.dispatch({ type: "DISABLE", name: feature });
  }
  setAll(features) {
    this.dispatch({ type: "SET_ALL", features });
  }
  listFeatures() {
    return this.featureDesc.map((f) => [f.name, this.testFeature(f.name)]);
  }
};

// src/useConsoleOverride.tsx
function useConsoleOverride(consoleOverride, features, testFeature2, dispatch) {
  useEffect(() => {
    if (!consoleOverride) {
      if (window.feature != null) {
        window.feature = void 0;
      }
      return () => {
        if (window.feature != null) {
          window.feature = void 0;
        }
      };
    }
    window.feature = new GlobalEnable(dispatch, testFeature2, features);
    return () => {
      if (window.feature != null) {
        window.feature = void 0;
      }
    };
  }, [features, dispatch, consoleOverride, testFeature2]);
}

// src/usePersist.tsx
import { useEffect as useEffect2, useMemo as useMemo2 } from "react";
var KEY = "react-enable:feature-values";
function usePersist(storage, features, overrideState) {
  const overrides = useMemo2(() => {
    const newOverrides = {};
    if (overrideState.value === "ready") {
      for (const feature of features) {
        const [value] = valueOfFeature(overrideState, feature.name);
        if (value != null) {
          newOverrides[feature.name] = value;
        }
      }
    }
    return newOverrides;
  }, [features, overrideState]);
  const strState = Object.keys(overrides).length === 0 || storage == null ? "{}" : JSON.stringify({ overrides });
  useEffect2(() => {
    try {
      if (storage != null && overrideState.value === "ready") {
        storage.setItem(KEY, strState);
      }
    } catch (e) {
    }
  }, [overrideState, storage, strState]);
}

// src/useTestCallback.tsx
import { useCallback } from "react";

// src/rolloutHash.tsx
function hashToPercentage(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) + hash + char | 0;
  }
  const unsigned = hash >>> 0;
  return unsigned / 4294967296;
}
function isInRollout(featureName, rolloutStableId, percentage) {
  if (percentage <= 0) return false;
  if (percentage >= 1) return true;
  const combinedKey = `${featureName}:${rolloutStableId}`;
  const hash = hashToPercentage(combinedKey);
  return hash < percentage;
}

// src/testFeature.tsx
function testFeature(feature, states, rolloutStableId) {
  const values = states.map((state) => valueOfFeature(state, feature));
  for (const [featureValue, featureForced] of values) {
    if (featureValue != null && featureForced) {
      return featureValue;
    }
  }
  for (const [featureValue] of values) {
    if (featureValue != null) {
      return featureValue;
    }
  }
  if (rolloutStableId != null) {
    for (const state of states) {
      if (state.value === "ready" && state.context.features[feature] != null) {
        const featureState = state.context.features[feature];
        const enableFor = featureState.featureDesc?.enableFor;
        if (enableFor != null) {
          return isInRollout(feature, rolloutStableId, enableFor);
        }
      }
    }
  }
  return void 0;
}

// src/useTestCallback.tsx
function useTestCallback(overridesState, defaultsState, rolloutStableId) {
  return useCallback(
    (f) => testFeature(f, [overridesState, defaultsState], rolloutStableId),
    [overridesState, defaultsState, rolloutStableId]
  );
}

// src/Features.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var ROLLOUT_ID_KEY = "react-enable:rollout-stable-id";
function Features({
  children,
  features,
  disableConsole = false,
  storage = window.sessionStorage,
  rolloutStableId
}) {
  const featuresRef = useRef(features);
  const stableId = useMemo3(() => {
    if (rolloutStableId != null) {
      return rolloutStableId;
    }
    if (storage != null) {
      try {
        const existingId = storage.getItem(ROLLOUT_ID_KEY);
        if (existingId != null) {
          return existingId;
        }
      } catch (e) {
      }
    }
    const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    if (storage != null) {
      try {
        storage.setItem(ROLLOUT_ID_KEY, newId);
      } catch (e) {
      }
    }
    return newId;
  }, [rolloutStableId, storage]);
  const [overridesState, overridesDispatch] = useReducer(
    featuresReducer,
    initialFeaturesState
  );
  const [defaultsState, defaultsDispatch] = useReducer(
    featuresReducer,
    initialFeaturesState
  );
  useLayoutEffect(() => {
    defaultsDispatch({ type: "INIT", features });
    return () => {
      defaultsDispatch({ type: "DE_INIT" });
    };
  }, [features]);
  useLayoutEffect(() => {
    let f = {};
    if (storage != null) {
      try {
        const featuresJson = storage.getItem(KEY);
        if (featuresJson != null) {
          const fh = JSON.parse(featuresJson);
          f = fh.overrides;
        }
      } catch (e) {
        console.error("error in localStorage", e);
      }
    }
    overridesDispatch({
      type: "INIT",
      features: (featuresRef.current ?? []).filter((x) => x.noOverride !== true).map((x) => ({
        name: x.name,
        description: x.description,
        defaultValue: f?.[x.name] ?? void 0
      }))
    });
    return () => {
      overridesDispatch({ type: "DE_INIT" });
    };
  }, [storage]);
  useEffect3(() => {
    if (defaultsState.value !== "ready") {
      return;
    }
    Object.entries(defaultsState.context.features).forEach(
      ([name, feature]) => {
        if (feature.value === "asyncEnabled" || feature.value === "asyncDisabled" || feature.value === "asyncUnspecified") {
          const targetValue = feature.value === "asyncEnabled" ? true : feature.value === "asyncDisabled" ? false : void 0;
          const onChangeDefault = feature.featureDesc?.onChangeDefault;
          if (onChangeDefault != null && feature.featureDesc != null) {
            onChangeDefault(feature.featureDesc.name, targetValue).then((result) => {
              defaultsDispatch({ type: "ASYNC_DONE", name, value: result });
            }).catch(() => {
              defaultsDispatch({
                type: "ASYNC_DONE",
                name,
                value: void 0
              });
            });
          }
        }
      }
    );
  }, [defaultsState]);
  usePersist(storage, featuresRef.current, overridesState);
  const testCallback = useTestCallback(overridesState, defaultsState, stableId);
  useConsoleOverride(
    !disableConsole,
    featuresRef.current,
    testCallback,
    defaultsDispatch
  );
  const featureValue = useMemo3(
    () => ({
      overridesSend: overridesDispatch,
      defaultsSend: defaultsDispatch,
      featuresDescription: featuresRef.current,
      overridesState,
      defaultsState,
      test: testCallback
    }),
    [overridesState, defaultsState, testCallback]
  );
  return /* @__PURE__ */ jsx3(FeatureContext.Provider, { value: featureValue, children: /* @__PURE__ */ jsx3(EnableContext.Provider, { value: testCallback, children }) });
}

// src/ToggleFeatures.tsx
import { RadioGroup } from "@headlessui/react";
import { useCallback as useCallback2, useContext as useContext2, useState } from "react";
import ReactDOM from "react-dom";

// src/tailwind.css
var tailwind_default = "*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgba(59, 130, 246, 0.5);\n  --tw-ring-offset-shadow: 0 0 rgba(0,0,0,0);\n  --tw-ring-shadow: 0 0 rgba(0,0,0,0);\n  --tw-shadow: 0 0 rgba(0,0,0,0);\n  --tw-shadow-colored: 0 0 rgba(0,0,0,0);\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n::-ms-backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgba(59, 130, 246, 0.5);\n  --tw-ring-offset-shadow: 0 0 rgba(0,0,0,0);\n  --tw-ring-shadow: 0 0 rgba(0,0,0,0);\n  --tw-shadow: 0 0 rgba(0,0,0,0);\n  --tw-shadow-colored: 0 0 rgba(0,0,0,0);\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgba(59, 130, 246, 0.5);\n  --tw-ring-offset-shadow: 0 0 rgba(0,0,0,0);\n  --tw-ring-shadow: 0 0 rgba(0,0,0,0);\n  --tw-shadow: 0 0 rgba(0,0,0,0);\n  --tw-shadow-colored: 0 0 rgba(0,0,0,0);\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n/*\n! tailwindcss v3.4.18 | MIT License | https://tailwindcss.com\n*/\n\n/*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  border-width: 0;\n  /* 2 */\n  border-style: solid;\n  /* 2 */\n  border-color: #e5e7eb;\n  /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n5. Use the user's configured `sans` font-feature-settings by default.\n6. Use the user's configured `sans` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n  -moz-tab-size: 4;\n  /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4;\n  /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  /* 4 */\n  -webkit-font-feature-settings: normal;\n          font-feature-settings: normal;\n  /* 5 */\n  font-variation-settings: normal;\n  /* 6 */\n  -webkit-tap-highlight-color: transparent;\n  /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0;\n  /* 1 */\n  line-height: inherit;\n  /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  border-top-width: 1px;\n  /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline;\n          -webkit-text-decoration: underline dotted currentColor;\n                  text-decoration: underline dotted currentColor;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font-family by default.\n2. Use the user's configured `mono` font-feature-settings by default.\n3. Use the user's configured `mono` font-variation-settings by default.\n4. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n  /* 1 */\n  -webkit-font-feature-settings: normal;\n          font-feature-settings: normal;\n  /* 2 */\n  font-variation-settings: normal;\n  /* 3 */\n  font-size: 1em;\n  /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0;\n  /* 1 */\n  border-color: inherit;\n  /* 2 */\n  border-collapse: collapse;\n  /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  -webkit-font-feature-settings: inherit;\n          font-feature-settings: inherit;\n  /* 1 */\n  font-variation-settings: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  font-weight: inherit;\n  /* 1 */\n  line-height: inherit;\n  /* 1 */\n  letter-spacing: inherit;\n  /* 1 */\n  color: inherit;\n  /* 1 */\n  margin: 0;\n  /* 2 */\n  padding: 0;\n  /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\ninput:where([type='button']),\ninput:where([type='reset']),\ninput:where([type='submit']) {\n  -webkit-appearance: button;\n  /* 1 */\n  background-color: transparent;\n  /* 2 */\n  background-image: none;\n  /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\n\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1;\n  /* 1 */\n  color: #9ca3af;\n  /* 2 */\n}\n\ninput::-webkit-input-placeholder, textarea::-webkit-input-placeholder {\n  opacity: 1;\n  /* 1 */\n  color: #9ca3af;\n  /* 2 */\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  opacity: 1;\n  /* 1 */\n  color: #9ca3af;\n  /* 2 */\n}\n\ninput::-ms-input-placeholder, textarea::-ms-input-placeholder {\n  opacity: 1;\n  /* 1 */\n  color: #9ca3af;\n  /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1;\n  /* 1 */\n  color: #9ca3af;\n  /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block;\n  /* 1 */\n  vertical-align: middle;\n  /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n\n[hidden]:where(:not([hidden=\"until-found\"])) {\n  display: none;\n}\n\n[type='text'],input:where(:not([type])),[type='email'],[type='url'],[type='password'],[type='number'],[type='date'],[type='datetime-local'],[type='month'],[type='search'],[type='tel'],[type='time'],[type='week'],[multiple],textarea,select {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  background-color: #fff;\n  border-color: #6b7280;\n  border-width: 1px;\n  border-radius: 0px;\n  padding-top: 0.5rem;\n  padding-right: 0.75rem;\n  padding-bottom: 0.5rem;\n  padding-left: 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5rem;\n  --tw-shadow: 0 0 rgba(0,0,0,0);\n}\n\n[type='text']:focus, input:where(:not([type])):focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, textarea:focus, select:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: #2563eb;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  -webkit-box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n  border-color: #2563eb;\n}\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  color: #6b7280;\n  opacity: 1;\n}\n\ninput::-webkit-input-placeholder, textarea::-webkit-input-placeholder {\n  color: #6b7280;\n  opacity: 1;\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  color: #6b7280;\n  opacity: 1;\n}\n\ninput::-ms-input-placeholder, textarea::-ms-input-placeholder {\n  color: #6b7280;\n  opacity: 1;\n}\n\ninput::placeholder,textarea::placeholder {\n  color: #6b7280;\n  opacity: 1;\n}\n\n::-webkit-datetime-edit-fields-wrapper {\n  padding: 0;\n}\n\n::-webkit-date-and-time-value {\n  min-height: 1.5em;\n  text-align: inherit;\n}\n\n::-webkit-datetime-edit {\n  display: -webkit-inline-box;\n  display: inline-flex;\n}\n\n::-webkit-datetime-edit,::-webkit-datetime-edit-year-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-meridiem-field {\n  padding-top: 0;\n  padding-bottom: 0;\n}\n\nselect {\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\");\n  background-position: right 0.5rem center;\n  background-repeat: no-repeat;\n  background-size: 1.5em 1.5em;\n  padding-right: 2.5rem;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n}\n\n[multiple],[size]:where(select:not([size=\"1\"])) {\n  background-image: none;\n  background-image: initial;\n  background-position: 0 0;\n  background-position: initial;\n  background-repeat: repeat;\n  background-repeat: initial;\n  background-size: auto auto;\n  background-size: initial;\n  padding-right: 0.75rem;\n  -webkit-print-color-adjust: unset;\n          print-color-adjust: inherit;\n}\n\n[type='checkbox'],[type='radio'] {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  padding: 0;\n  -webkit-print-color-adjust: exact;\n          print-color-adjust: exact;\n  display: inline-block;\n  vertical-align: middle;\n  background-origin: border-box;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          -ms-user-select: none;\n      user-select: none;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  height: 1rem;\n  width: 1rem;\n  color: #2563eb;\n  background-color: #fff;\n  border-color: #6b7280;\n  border-width: 1px;\n  --tw-shadow: 0 0 rgba(0,0,0,0);\n}\n\n[type='checkbox'] {\n  border-radius: 0px;\n}\n\n[type='radio'] {\n  border-radius: 100%;\n}\n\n[type='checkbox']:focus,[type='radio']:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 2px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: #2563eb;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  -webkit-box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n}\n\n[type='checkbox']:checked,[type='radio']:checked {\n  border-color: transparent;\n  background-color: currentColor;\n  background-size: 100% 100%;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n[type='checkbox']:checked {\n  background-image: url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\");\n}\n\n@media (forced-colors: active)  {\n  [type='checkbox']:checked {\n    -webkit-appearance: auto;\n       -moz-appearance: auto;\n            appearance: auto;\n  }\n}\n\n[type='radio']:checked {\n  background-image: url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e\");\n}\n\n@media (forced-colors: active)  {\n  [type='radio']:checked {\n    -webkit-appearance: auto;\n       -moz-appearance: auto;\n            appearance: auto;\n  }\n}\n\n[type='checkbox']:checked:hover,[type='checkbox']:checked:focus,[type='radio']:checked:hover,[type='radio']:checked:focus {\n  border-color: transparent;\n  background-color: currentColor;\n}\n\n[type='checkbox']:indeterminate {\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e\");\n  border-color: transparent;\n  background-color: currentColor;\n  background-size: 100% 100%;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n@media (forced-colors: active)  {\n  [type='checkbox']:indeterminate {\n    -webkit-appearance: auto;\n       -moz-appearance: auto;\n            appearance: auto;\n  }\n}\n\n[type='checkbox']:indeterminate:hover,[type='checkbox']:indeterminate:focus {\n  border-color: transparent;\n  background-color: currentColor;\n}\n\n[type='file'] {\n  background: transparent none repeat 0 0 / auto auto padding-box border-box scroll;\n  background: initial;\n  border-color: inherit;\n  border-width: 0;\n  border-radius: 0;\n  padding: 0;\n  font-size: inherit;\n  line-height: inherit;\n}\n\n[type='file']:focus {\n  outline: 1px solid ButtonText;\n  outline: 1px auto -webkit-focus-ring-color;\n}\n\n.container {\n  width: 100%;\n}\n\n@media (min-width: 640px) {\n  .container {\n    max-width: 640px;\n  }\n}\n\n@media (min-width: 768px) {\n  .container {\n    max-width: 768px;\n  }\n}\n\n@media (min-width: 1024px) {\n  .container {\n    max-width: 1024px;\n  }\n}\n\n@media (min-width: 1280px) {\n  .container {\n    max-width: 1280px;\n  }\n}\n\n@media (min-width: 1536px) {\n  .container {\n    max-width: 1536px;\n  }\n}\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.pointer-events-none {\n  pointer-events: none;\n}\n\n.invisible {\n  visibility: hidden;\n}\n\n.fixed {\n  position: fixed;\n}\n\n.absolute {\n  position: absolute;\n}\n\n.relative {\n  position: relative;\n}\n\n.-inset-px {\n  top: -1px;\n  right: -1px;\n  bottom: -1px;\n  left: -1px;\n}\n\n.inset-0 {\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n\n.bottom-0 {\n  bottom: 0px;\n}\n\n.left-0 {\n  left: 0px;\n}\n\n.z-10 {\n  z-index: 10;\n}\n\n.mx-4 {\n  margin-left: 1rem;\n  margin-right: 1rem;\n}\n\n.mx-8 {\n  margin-left: 2rem;\n  margin-right: 2rem;\n}\n\n.my-4 {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n}\n\n.mt-1 {\n  margin-top: 0.25rem;\n}\n\n.mt-4 {\n  margin-top: 1rem;\n}\n\n.mt-5 {\n  margin-top: 1.25rem;\n}\n\n.mt-6 {\n  margin-top: 1.5rem;\n}\n\n.inline-block {\n  display: inline-block;\n}\n\n.flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.inline-flex {\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n}\n\n.grid {\n  display: grid;\n}\n\n.hidden {\n  display: none;\n}\n\n.h-4 {\n  height: 1rem;\n}\n\n.h-5 {\n  height: 1.25rem;\n}\n\n.h-6 {\n  height: 1.5rem;\n}\n\n.h-7 {\n  height: 1.75rem;\n}\n\n.h-8 {\n  height: 2rem;\n}\n\n.min-h-6 {\n  min-height: 1.5rem;\n}\n\n.min-h-screen {\n  min-height: 100vh;\n}\n\n.w-4 {\n  width: 1rem;\n}\n\n.w-5 {\n  width: 1.25rem;\n}\n\n.w-6 {\n  width: 1.5rem;\n}\n\n.w-8 {\n  width: 2rem;\n}\n\n.min-w-4 {\n  min-width: 1rem;\n}\n\n.min-w-6 {\n  min-width: 1.5rem;\n}\n\n.max-w-full {\n  max-width: 100%;\n}\n\n.shrink {\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n}\n\n.grow {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n}\n\n.transform {\n  -webkit-transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n          transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n\n.cursor-not-allowed {\n  cursor: not-allowed;\n}\n\n.cursor-pointer {\n  cursor: pointer;\n}\n\n.grid-cols-1 {\n  grid-template-columns: repeat(1, minmax(0, 1fr));\n}\n\n.flex-row {\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n}\n\n.flex-col {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n\n.flex-nowrap {\n  -ms-flex-wrap: nowrap;\n      flex-wrap: nowrap;\n}\n\n.items-end {\n  -webkit-box-align: end;\n      -ms-flex-align: end;\n          align-items: flex-end;\n}\n\n.items-center {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n.justify-center {\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n.gap-1 {\n  gap: 0.25rem;\n}\n\n.gap-2 {\n  gap: 0.5rem;\n}\n\n.gap-4 {\n  gap: 1rem;\n}\n\n.gap-9 {\n  gap: 2.25rem;\n}\n\n.gap-y-6 {\n  row-gap: 1.5rem;\n}\n\n.overflow-hidden {\n  overflow: hidden;\n}\n\n.overflow-y-auto {\n  overflow-y: auto;\n}\n\n.rounded-full {\n  border-radius: 9999px;\n}\n\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n\n.rounded-sm {\n  border-radius: 0.125rem;\n}\n\n.border {\n  border-width: 1px;\n}\n\n.border-2 {\n  border-width: 2px;\n}\n\n.border-blue-500 {\n  --tw-border-opacity: 1;\n  border-color: rgba(59, 130, 246, 1);\n  border-color: rgba(59, 130, 246, var(--tw-border-opacity, 1));\n}\n\n.border-gray-300 {\n  --tw-border-opacity: 1;\n  border-color: rgba(209, 213, 219, 1);\n  border-color: rgba(209, 213, 219, var(--tw-border-opacity, 1));\n}\n\n.border-gray-500 {\n  --tw-border-opacity: 1;\n  border-color: rgba(107, 114, 128, 1);\n  border-color: rgba(107, 114, 128, var(--tw-border-opacity, 1));\n}\n\n.border-green-500 {\n  --tw-border-opacity: 1;\n  border-color: rgba(34, 197, 94, 1);\n  border-color: rgba(34, 197, 94, var(--tw-border-opacity, 1));\n}\n\n.border-orange-500 {\n  --tw-border-opacity: 1;\n  border-color: rgba(249, 115, 22, 1);\n  border-color: rgba(249, 115, 22, var(--tw-border-opacity, 1));\n}\n\n.border-red-500 {\n  --tw-border-opacity: 1;\n  border-color: rgba(239, 68, 68, 1);\n  border-color: rgba(239, 68, 68, var(--tw-border-opacity, 1));\n}\n\n.border-transparent {\n  border-color: transparent;\n}\n\n.bg-blue-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgba(37, 99, 235, 1);\n  background-color: rgba(37, 99, 235, var(--tw-bg-opacity, 1));\n}\n\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgba(255, 255, 255, 1);\n  background-color: rgba(255, 255, 255, var(--tw-bg-opacity, 1));\n}\n\n.p-1 {\n  padding: 0.25rem;\n}\n\n.p-3 {\n  padding: 0.75rem;\n}\n\n.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n\n.pb-0 {\n  padding-bottom: 0px;\n}\n\n.pb-10 {\n  padding-bottom: 2.5rem;\n}\n\n.pb-4 {\n  padding-bottom: 1rem;\n}\n\n.pl-4 {\n  padding-left: 1rem;\n}\n\n.pr-4 {\n  padding-right: 1rem;\n}\n\n.pt-0 {\n  padding-top: 0px;\n}\n\n.pt-4 {\n  padding-top: 1rem;\n}\n\n.pt-5 {\n  padding-top: 1.25rem;\n}\n\n.text-left {\n  text-align: left;\n}\n\n.align-middle {\n  vertical-align: middle;\n}\n\n.align-bottom {\n  vertical-align: bottom;\n}\n\n.text-base {\n  font-size: 1rem;\n  line-height: 1.5rem;\n}\n\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n\n.font-medium {\n  font-weight: 500;\n}\n\n.leading-6 {\n  line-height: 1.5rem;\n}\n\n.leading-7 {\n  line-height: 1.75rem;\n}\n\n.text-blue-500 {\n  --tw-text-opacity: 1;\n  color: rgba(59, 130, 246, 1);\n  color: rgba(59, 130, 246, var(--tw-text-opacity, 1));\n}\n\n.text-gray-500 {\n  --tw-text-opacity: 1;\n  color: rgba(107, 114, 128, 1);\n  color: rgba(107, 114, 128, var(--tw-text-opacity, 1));\n}\n\n.text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgba(17, 24, 39, 1);\n  color: rgba(17, 24, 39, var(--tw-text-opacity, 1));\n}\n\n.text-green-500 {\n  --tw-text-opacity: 1;\n  color: rgba(34, 197, 94, 1);\n  color: rgba(34, 197, 94, var(--tw-text-opacity, 1));\n}\n\n.text-orange-500 {\n  --tw-text-opacity: 1;\n  color: rgba(249, 115, 22, 1);\n  color: rgba(249, 115, 22, var(--tw-text-opacity, 1));\n}\n\n.text-red-500 {\n  --tw-text-opacity: 1;\n  color: rgba(239, 68, 68, 1);\n  color: rgba(239, 68, 68, var(--tw-text-opacity, 1));\n}\n\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgba(255, 255, 255, 1);\n  color: rgba(255, 255, 255, var(--tw-text-opacity, 1));\n}\n\n.shadow {\n  --tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  -webkit-box-shadow: 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), var(--tw-shadow);\n          box-shadow: 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), var(--tw-shadow);\n  -webkit-box-shadow: var(--tw-ring-offset-shadow, 0 0 rgba(0,0,0,0)), var(--tw-ring-shadow, 0 0 rgba(0,0,0,0)), var(--tw-shadow);\n          box-shadow: var(--tw-ring-offset-shadow, 0 0 rgba(0,0,0,0)), var(--tw-ring-shadow, 0 0 rgba(0,0,0,0)), var(--tw-shadow);\n}\n\n.shadow-sm {\n  --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);\n  -webkit-box-shadow: 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), var(--tw-shadow);\n          box-shadow: 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), var(--tw-shadow);\n  -webkit-box-shadow: var(--tw-ring-offset-shadow, 0 0 rgba(0,0,0,0)), var(--tw-ring-shadow, 0 0 rgba(0,0,0,0)), var(--tw-shadow);\n          box-shadow: var(--tw-ring-offset-shadow, 0 0 rgba(0,0,0,0)), var(--tw-ring-shadow, 0 0 rgba(0,0,0,0)), var(--tw-shadow);\n}\n\n.shadow-xl {\n  --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  -webkit-box-shadow: 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), var(--tw-shadow);\n          box-shadow: 0 0 rgba(0,0,0,0), 0 0 rgba(0,0,0,0), var(--tw-shadow);\n  -webkit-box-shadow: var(--tw-ring-offset-shadow, 0 0 rgba(0,0,0,0)), var(--tw-ring-shadow, 0 0 rgba(0,0,0,0)), var(--tw-shadow);\n          box-shadow: var(--tw-ring-offset-shadow, 0 0 rgba(0,0,0,0)), var(--tw-ring-shadow, 0 0 rgba(0,0,0,0)), var(--tw-shadow);\n}\n\n.ring-2 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  -webkit-box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), 0 0 rgba(0,0,0,0);\n          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), 0 0 rgba(0,0,0,0);\n  -webkit-box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 rgba(0,0,0,0));\n          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 rgba(0,0,0,0));\n}\n\n.ring-blue-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgba(59, 130, 246, var(--tw-ring-opacity, 1));\n}\n\n.ring-gray-500 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgba(107, 114, 128, var(--tw-ring-opacity, 1));\n}\n\n.invert {\n  --tw-invert: invert(100%);\n  -webkit-filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n          filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n\n.filter {\n  -webkit-filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n          filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n\n.transition-all {\n  -webkit-transition-property: all;\n  transition-property: all;\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-transition-duration: 150ms;\n          transition-duration: 150ms;\n}\n\n.focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n.focus\\:ring-2:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  -webkit-box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), 0 0 rgba(0,0,0,0);\n          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), 0 0 rgba(0,0,0,0);\n  -webkit-box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 rgba(0,0,0,0));\n          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 rgba(0,0,0,0));\n}\n\n.focus\\:ring-blue-600:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgba(37, 99, 235, var(--tw-ring-opacity, 1));\n}\n\n.focus\\:ring-offset-2:focus {\n  --tw-ring-offset-width: 2px;\n}\n\n@media (min-width: 640px) {\n  .sm\\:my-8 {\n    margin-top: 2rem;\n    margin-bottom: 2rem;\n  }\n\n  .sm\\:mt-3 {\n    margin-top: 0.75rem;\n  }\n\n  .sm\\:mt-6 {\n    margin-top: 1.5rem;\n  }\n\n  .sm\\:block {\n    display: block;\n  }\n\n  .sm\\:grid-cols-3 {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n\n  .sm\\:gap-x-4 {\n    -moz-column-gap: 1rem;\n         -webkit-column-gap: 1rem;\n            column-gap: 1rem;\n  }\n\n  .sm\\:p-0 {\n    padding: 0px;\n  }\n\n  .sm\\:p-6 {\n    padding: 1.5rem;\n  }\n\n  .sm\\:align-middle {\n    vertical-align: middle;\n  }\n\n  .sm\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n}\n\n@media (min-width: 1024px) {\n  .lg\\:max-w-\\[80\\%\\] {\n    max-width: 80%;\n  }\n\n  .lg\\:gap-4 {\n    gap: 1rem;\n  }\n}\n";

// src/ToggleFeatures.tsx
import { Fragment as Fragment3, jsx as jsx4, jsxs } from "react/jsx-runtime";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function ToggleFeature({
  feature
}) {
  const context = useContext2(FeatureContext);
  const handleChangeSelection = useCallback2(
    (value) => {
      if (context?.overridesSend != null) {
        switch (value) {
          case "true": {
            context.overridesSend({ type: "ENABLE", name: feature.name });
            break;
          }
          case "false": {
            context.overridesSend({ type: "DISABLE", name: feature.name });
            break;
          }
          case "unset": {
            context.overridesSend({ type: "UNSET", name: feature.name });
            break;
          }
        }
      }
    },
    [feature.name, context]
  );
  if (context == null) {
    return null;
  }
  const { overridesState, test: testFeature2, defaultsState } = context;
  const valueInDefaults = (valueOfFeature(defaultsState, feature.name)[0] ?? "unset").toString();
  const valueInOverrides = (valueOfFeature(overridesState, feature.name)[0] ?? "unset").toString();
  const actualChecked = testFeature2(feature.name);
  return /* @__PURE__ */ jsxs(
    RadioGroup,
    {
      disabled: feature.noOverride,
      onChange: handleChangeSelection,
      value: valueInOverrides,
      children: [
        /* @__PURE__ */ jsxs(RadioGroup.Label, { children: [
          /* @__PURE__ */ jsxs("h6", { className: "text-gray-900 align-center flex flex-row flex-nowrap items-center gap-2 lg:gap-4 h-7", children: [
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              "Feature: ",
              /* @__PURE__ */ jsx4("code", { children: feature.name })
            ] }),
            feature.noOverride === true ? /* @__PURE__ */ jsxs("div", { className: "border-orange-500 text-orange-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1", children: [
              /* @__PURE__ */ jsx4(
                "svg",
                {
                  "aria-hidden": "true",
                  className: "h-4 w-4 min-w-4",
                  fill: "currentColor",
                  viewBox: "0 0 20 20",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: /* @__PURE__ */ jsx4(
                    "path",
                    {
                      clipRule: "evenodd",
                      d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",
                      fillRule: "evenodd"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx4("div", { children: "No Overrides" })
            ] }) : null,
            actualChecked === true ? /* @__PURE__ */ jsxs("div", { className: "flex flex-nowrap text-xs text-green-500 flex-row gap-1 rounded-sm border items-center justify-center border-green-500 px-2 py-1", children: [
              /* @__PURE__ */ jsx4(
                "svg",
                {
                  "aria-hidden": "true",
                  className: "h-4 w-4 min-w-4",
                  fill: "currentColor",
                  viewBox: "0 0 20 20",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: /* @__PURE__ */ jsx4(
                    "path",
                    {
                      clipRule: "evenodd",
                      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                      fillRule: "evenodd"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx4("div", { children: actualChecked ? "Enabled" : "Disabled" })
            ] }) : null
          ] }),
          feature.description == null ? null : /* @__PURE__ */ jsx4("p", { className: "text-base text-gray-500 text-sm", children: feature.description })
        ] }),
        /* @__PURE__ */ jsx4("div", { className: "mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4", children: [
          {
            id: "false",
            title: `Disable ${feature.name}`,
            description: "Override the feature to be disabled"
          },
          {
            id: "unset",
            title: "Default",
            description: "Inherit enabled state from defaults",
            disabled: (feature.noOverride ?? false) || feature.force,
            defaultValue: valueInDefaults === "true" ? /* @__PURE__ */ jsx4("div", { className: "text-green-500 border-green-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1", children: /* @__PURE__ */ jsx4("span", { children: "Enabled" }) }) : /* @__PURE__ */ jsx4("div", { className: "text-red-500 border-red-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1", children: /* @__PURE__ */ jsx4("span", { children: "Disabled" }) })
          },
          {
            id: "true",
            title: `Enable ${feature.name}`,
            description: "Override the feature to be enabled"
          }
        ].map((option) => /* @__PURE__ */ jsx4(
          RadioGroup.Option,
          {
            className: ({ checked, active, disabled }) => classNames(
              checked ? "border-transparent" : "border-gray-300",
              !disabled && active ? "border-blue-500 ring-2 ring-blue-500" : "",
              disabled ? "border-transparent ring-gray-500 cursor-not-allowed" : "cursor-pointer",
              "relative bg-white border rounded-lg shadow-sm p-3 flex focus:outline-none"
            ),
            disabled: option.disabled,
            value: option.id,
            children: ({ checked, active, disabled }) => /* @__PURE__ */ jsxs(Fragment3, { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col grow", children: [
                /* @__PURE__ */ jsxs(
                  RadioGroup.Label,
                  {
                    as: "span",
                    className: "flex flex-nowrap flex-row gap-1 items-center space-between",
                    children: [
                      /* @__PURE__ */ jsx4("span", { className: "text-sm font-medium text-gray-900 grow shrink", children: option.title }),
                      option.defaultValue != null ? option.defaultValue : null,
                      /* @__PURE__ */ jsx4(
                        "svg",
                        {
                          "aria-hidden": "true",
                          className: classNames(
                            !checked ? "invisible" : "",
                            "h-5 w-5 text-blue-500 min-w-4"
                          ),
                          fill: "currentColor",
                          viewBox: "0 0 20 20",
                          xmlns: "http://www.w3.org/2000/svg",
                          children: /* @__PURE__ */ jsx4(
                            "path",
                            {
                              clipRule: "evenodd",
                              d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                              fillRule: "evenodd"
                            }
                          )
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx4(
                  RadioGroup.Description,
                  {
                    as: "span",
                    className: "mt-1 flex items-center text-sm text-gray-500",
                    children: option.description
                  }
                )
              ] }),
              /* @__PURE__ */ jsx4(
                "div",
                {
                  "aria-hidden": "true",
                  className: classNames(
                    !disabled && active ? "border" : "border-2",
                    checked ? disabled ? "border-gray-500" : "border-blue-500" : "border-transparent",
                    "absolute -inset-px rounded-lg pointer-events-none"
                  )
                }
              )
            ] })
          },
          option.id
        )) })
      ]
    }
  );
}
function ShadowContent({
  root,
  children
}) {
  return ReactDOM.createPortal(children, root);
}
function ToggleFeatures({
  defaultOpen = false,
  hidden = false
}) {
  const [root, setCoreRoot] = useState(null);
  const setRoot = (host) => {
    if (host == null || root != null) {
      return;
    }
    const shadowRoot = host?.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    const renderDiv = document.createElement("div");
    style.textContent = tailwind_default;
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(renderDiv);
    setCoreRoot(renderDiv);
  };
  if (hidden) {
    return null;
  }
  return /* @__PURE__ */ jsx4(
    "div",
    {
      ref: setRoot,
      style: {
        zIndex: 99999,
        position: "fixed",
        width: "0",
        height: "0",
        bottom: 0
      },
      children: root != null ? /* @__PURE__ */ jsx4(ShadowContent, { root, children: /* @__PURE__ */ jsx4(ToggleFeatureUnwrapped, { defaultOpen }) }) : null
    }
  );
}
function ToggleFeatureUnwrapped({
  defaultOpen = false,
  hidden = false
}) {
  const [open, setOpen] = useState(defaultOpen);
  const context = useContext2(FeatureContext);
  if (context == null) {
    return null;
  }
  if (hidden) {
    return null;
  }
  const { featuresDescription } = context;
  if (featuresDescription.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx4("div", { className: "absolute bottom-0 left-0 mx-4 my-4", children: /* @__PURE__ */ jsx4(
      "button",
      {
        className: "inline-flex items-center text-sm font-medium p-1 h-8 w-8 align-middle cursor-pointer rounded-full bg-blue-600 text-white  border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",
        onClick: () => setOpen(true),
        title: "Toggle features",
        type: "button",
        children: /* @__PURE__ */ jsx4(
          "svg",
          {
            className: "w-6 h-6 min-h-6 min-w-6",
            fill: "currentColor",
            viewBox: "0 0 20 20",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ jsx4(
              "path",
              {
                clipRule: "evenodd",
                d: "M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z",
                fillRule: "evenodd"
              }
            )
          }
        )
      }
    ) }),
    !open ? null : /* @__PURE__ */ jsx4("div", { className: "fixed z-10 inset-0 overflow-y-auto", children: /* @__PURE__ */ jsx4("div", { className: "flex items-end justify-flex-start mx-8 my-4 min-h-screen pt-4 px-4 pb-10 sm:block sm:p-0", children: /* @__PURE__ */ jsx4("div", { className: "relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 lg:max-w-[80%] max-w-full", children: /* @__PURE__ */ jsx4("div", { children: /* @__PURE__ */ jsxs("div", { className: "mt-1 sm:mt-3", children: [
      /* @__PURE__ */ jsx4("h3", { className: "flex flex-row gap-4 flex-nowrap items-center space-between", children: /* @__PURE__ */ jsx4("div", { className: "grow text-lg leading-6 font-medium text-gray-900", children: "Feature Flag Overrides" }) }),
      /* @__PURE__ */ jsx4("p", { className: "text-sm text-gray-500", children: "Features can be enabled or disabled unless they are forced upstream. You can also revert to default." }),
      /* @__PURE__ */ jsx4("div", { className: "mt-6", children: /* @__PURE__ */ jsxs("fieldset", { className: "flex flex-col gap-9", children: [
        /* @__PURE__ */ jsx4("legend", { className: "sr-only", children: "Feature Flags" }),
        featuresDescription.map((feature) => /* @__PURE__ */ jsx4(ToggleFeature, { feature }, feature.name))
      ] }) }),
      /* @__PURE__ */ jsx4("div", { className: "flex justify-center items-center mt-5 sm:mt-6", children: /* @__PURE__ */ jsx4(
        "button",
        {
          className: "inline-flex items-center text-sm font-medium pt-0 pb-0 pr-4 pl-4 h-8 leading-7 align-middle cursor-pointer rounded-sm bg-blue-600 text-white border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",
          onClick: () => setOpen(false),
          type: "button",
          children: "Done"
        }
      ) })
    ] }) }) }) }) })
  ] });
}
export {
  Disable,
  Enable,
  EnableContext,
  Features,
  ToggleFeatures,
  useAllDisabled,
  useAllEnabled,
  useDisabled,
  useEnabled
};
//# sourceMappingURL=index.js.map
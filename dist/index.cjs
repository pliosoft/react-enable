"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/utils.ts
var _react = require('react');

// src/EnableContext.tsx

var EnableContext = _react.createContext.call(void 0, (_s) => false);

// src/utils.ts
function useTestAndConvert(input) {
  const test = _react.useContext.call(void 0, EnableContext);
  const converted = _react.useMemo.call(void 0, 
    () => input == null ? [] : Array.isArray(input) ? input : [input],
    [input]
  );
  return [test, converted];
}

// src/useAllDisabled.tsx
function useAllDisabled(withoutAll) {
  const [test, queryAllWithout] = useTestAndConvert(withoutAll);
  return withoutAll.length > 0 && queryAllWithout.every((x) => !(_nullishCoalesce(test(x), () => ( false))));
}

// src/useDisabled.tsx
function useDisabled(without) {
  const [test, queryAnyWithout] = useTestAndConvert(without);
  return queryAnyWithout.some((x) => !(_nullishCoalesce(test(x), () => ( false))));
}

// src/Disable.tsx
var _jsxruntime = require('react/jsx-runtime');
var Disable = ({
  feature = [],
  allFeatures = [],
  children
}) => {
  const isAny = useDisabled(feature);
  const isAll = useAllDisabled(allFeatures);
  if (isAny || isAll) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _jsxruntime.Fragment, { children });
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

function Enable({
  feature = [],
  allFeatures = [],
  children
}) {
  const isAny = useEnabled(feature);
  const isAll = useAllEnabled(allFeatures);
  if (isAny || isAll) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _jsxruntime.Fragment, { children });
  }
  return null;
}

// src/Features.tsx








// src/FeatureContext.tsx

var FeatureContext = _react.createContext.call(void 0, null);

// src/FeatureState.tsx
function valueForState(featureState) {
  return [
    featureState.value === "enabled" || featureState.value === "asyncEnabled" ? true : featureState.value === "disabled" || featureState.value === "asyncDisabled" ? false : void 0,
    _nullishCoalesce(_optionalChain([featureState, 'access', _ => _.featureDesc, 'optionalAccess', _2 => _2.force]), () => ( false))
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
        const value = _nullishCoalesce(action.features[name], () => ( void 0));
        const currentFeature = features[name];
        if (_optionalChain([currentFeature, 'access', _3 => _3.featureDesc, 'optionalAccess', _4 => _4.onChangeDefault]) != null) {
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
      if (_optionalChain([feature, 'access', _5 => _5.featureDesc, 'optionalAccess', _6 => _6.onChangeDefault]) != null) {
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
      const newValue = _optionalChain([feature, 'access', _7 => _7.featureDesc, 'optionalAccess', _8 => _8.onChangeDefault]) != null ? "asyncEnabled" : "enabled";
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
      const newValue = _optionalChain([feature, 'access', _9 => _9.featureDesc, 'optionalAccess', _10 => _10.onChangeDefault]) != null ? "asyncEnabled" : "enabled";
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
      const newValue = _optionalChain([feature, 'access', _11 => _11.featureDesc, 'optionalAccess', _12 => _12.onChangeDefault]) != null ? "asyncDisabled" : "disabled";
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
      const newValue = _optionalChain([feature, 'access', _13 => _13.featureDesc, 'optionalAccess', _14 => _14.onChangeDefault]) != null ? "asyncUnspecified" : "unspecified";
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
  _react.useEffect.call(void 0, () => {
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

var KEY = "react-enable:feature-values";
function usePersist(storage, features, overrideState) {
  const overrides = _react.useMemo.call(void 0, () => {
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
  _react.useEffect.call(void 0, () => {
    try {
      if (storage != null && overrideState.value === "ready") {
        storage.setItem(KEY, strState);
      }
    } catch (e) {
    }
  }, [overrideState, storage, strState]);
}

// src/useTestCallback.tsx


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
        const enableFor = _optionalChain([featureState, 'access', _15 => _15.featureDesc, 'optionalAccess', _16 => _16.enableFor]);
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
  return _react.useCallback.call(void 0, 
    (f) => testFeature(f, [overridesState, defaultsState], rolloutStableId),
    [overridesState, defaultsState, rolloutStableId]
  );
}

// src/Features.tsx

var ROLLOUT_ID_KEY = "react-enable:rollout-stable-id";
function Features({
  children,
  features,
  disableConsole = false,
  storage = window.sessionStorage,
  rolloutStableId
}) {
  const featuresRef = _react.useRef.call(void 0, features);
  const stableId = _react.useMemo.call(void 0, () => {
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
  const [overridesState, overridesDispatch] = _react.useReducer.call(void 0, 
    featuresReducer,
    initialFeaturesState
  );
  const [defaultsState, defaultsDispatch] = _react.useReducer.call(void 0, 
    featuresReducer,
    initialFeaturesState
  );
  _react.useLayoutEffect.call(void 0, () => {
    defaultsDispatch({ type: "INIT", features });
    return () => {
      defaultsDispatch({ type: "DE_INIT" });
    };
  }, [features]);
  _react.useLayoutEffect.call(void 0, () => {
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
      features: (_nullishCoalesce(featuresRef.current, () => ( []))).filter((x) => x.noOverride !== true).map((x) => ({
        name: x.name,
        description: x.description,
        defaultValue: _nullishCoalesce(_optionalChain([f, 'optionalAccess', _17 => _17[x.name]]), () => ( void 0))
      }))
    });
    return () => {
      overridesDispatch({ type: "DE_INIT" });
    };
  }, [storage]);
  _react.useEffect.call(void 0, () => {
    if (defaultsState.value !== "ready") {
      return;
    }
    Object.entries(defaultsState.context.features).forEach(
      ([name, feature]) => {
        if (feature.value === "asyncEnabled" || feature.value === "asyncDisabled" || feature.value === "asyncUnspecified") {
          const targetValue = feature.value === "asyncEnabled" ? true : feature.value === "asyncDisabled" ? false : void 0;
          const onChangeDefault = _optionalChain([feature, 'access', _18 => _18.featureDesc, 'optionalAccess', _19 => _19.onChangeDefault]);
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
  const featureValue = _react.useMemo.call(void 0, 
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FeatureContext.Provider, { value: featureValue, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, EnableContext.Provider, { value: testCallback, children }) });
}

// src/ToggleFeatures.tsx





var _react3 = require('@headlessui/react');

var _reactdom = require('react-dom'); var _reactdom2 = _interopRequireDefault(_reactdom);

// src/tailwind.css
var tailwind_default = '/*! tailwindcss v4.1.15 | MIT License | https://tailwindcss.com */\n:root:not(#\\#), :host:not(#\\#) {\n  --font-sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, "Apple Color Emoji",\n      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",\n      "Courier New", monospace;\n  --color-red-500: rgb(251, 44, 54);\n  --color-orange-500: rgb(252, 113, 0);\n  --color-green-500: rgb(0, 198, 90);\n  --color-blue-500: rgb(50, 128, 255);\n  --color-blue-600: rgb(21, 93, 252);\n  --color-gray-300: rgb(209, 213, 220);\n  --color-gray-500: rgb(106, 114, 130);\n  --color-gray-900: rgb(16, 24, 40);\n  --color-white: #fff;\n  --spacing: 0.25rem;\n  --text-xs: 0.75rem;\n  --text-xs--line-height: calc(1 / 0.75);\n  --text-sm: 0.875rem;\n  --text-sm--line-height: calc(1.25 / 0.875);\n  --text-base: 1rem;\n  --text-base--line-height: calc(1.5 / 1);\n  --text-lg: 1.125rem;\n  --text-lg--line-height: calc(1.75 / 1.125);\n  --font-weight-medium: 500;\n  --font-weight-bold: 700;\n  --radius-sm: 0.25rem;\n  --radius-lg: 0.5rem;\n  --default-transition-duration: 150ms;\n  --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  --default-font-family: var(--font-sans);\n  --default-mono-font-family: var(--font-mono);\n}\n@supports (color: color(display-p3 0 0 0%)) {\n:root:not(#\\#), :host:not(#\\#) {\n    --color-orange-500: rgb(252, 113, 0);\n    --color-green-500: rgb(0, 198, 90);\n    --color-blue-500: rgb(50, 128, 255);\n  }\n\n@media (color-gamut: p3) {\n:root:not(#\\#), :host:not(#\\#) {\n      --color-orange-500: color(display-p3 0.94659 0.44979 0.07573);\n      --color-green-500: color(display-p3 0.30873 0.77475 0.37431);\n      --color-blue-500: color(display-p3 0.26642 0.49122 0.98862);\n    }\n}\n}\n:not(#\\#):not(#\\#)::-ms-backdrop {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  border: 0 solid;\n}\n:not(#\\#):not(#\\#)::-webkit-file-upload-button {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  border: 0 solid;\n}\n*:not(#\\#):not(#\\#),\n  :not(#\\#):not(#\\#)::after,\n  :not(#\\#):not(#\\#)::before,\n  :not(#\\#):not(#\\#)::backdrop,\n  :not(#\\#):not(#\\#)::file-selector-button {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  border: 0 solid;\n}\nhtml:not(#\\#):not(#\\#),\n  :host:not(#\\#):not(#\\#) {\n  line-height: 1.5;\n  -webkit-text-size-adjust: 100%;\n  -moz-tab-size: 4;\n    -o-tab-size: 4;\n       tab-size: 4;\n  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n  font-family: var(--default-font-family, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");\n  -webkit-font-feature-settings: normal;\n          font-feature-settings: normal;\n  -webkit-font-feature-settings: var(--default-font-feature-settings, normal);\n          font-feature-settings: var(--default-font-feature-settings, normal);\n  font-variation-settings: normal;\n  font-variation-settings: var(--default-font-variation-settings, normal);\n  -webkit-tap-highlight-color: transparent;\n}\nhr:not(#\\#):not(#\\#) {\n  height: 0;\n  color: inherit;\n  border-top-width: 1px;\n}\nabbr:where([title]):not(#\\#):not(#\\#) {\n  -webkit-text-decoration: underline dotted;\n  text-decoration: underline;\n  text-decoration: underline;\n  text-decoration: underline dotted;\n}\nh1:not(#\\#):not(#\\#),\n  h2:not(#\\#):not(#\\#),\n  h3:not(#\\#):not(#\\#),\n  h4:not(#\\#):not(#\\#),\n  h5:not(#\\#):not(#\\#),\n  h6:not(#\\#):not(#\\#) {\n  font-size: inherit;\n  font-weight: inherit;\n}\na:not(#\\#):not(#\\#) {\n  color: inherit;\n  -webkit-text-decoration: inherit;\n  text-decoration: inherit;\n}\nb:not(#\\#):not(#\\#),\n  strong:not(#\\#):not(#\\#) {\n  font-weight: bolder;\n}\ncode:not(#\\#):not(#\\#),\n  kbd:not(#\\#):not(#\\#),\n  samp:not(#\\#):not(#\\#),\n  pre:not(#\\#):not(#\\#) {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;\n  font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);\n  -webkit-font-feature-settings: normal;\n          font-feature-settings: normal;\n  -webkit-font-feature-settings: var(--default-mono-font-feature-settings, normal);\n          font-feature-settings: var(--default-mono-font-feature-settings, normal);\n  font-variation-settings: normal;\n  font-variation-settings: var(--default-mono-font-variation-settings, normal);\n  font-size: 1em;\n}\nsmall:not(#\\#):not(#\\#) {\n  font-size: 80%;\n}\nsub:not(#\\#):not(#\\#),\n  sup:not(#\\#):not(#\\#) {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\nsub:not(#\\#):not(#\\#) {\n  bottom: -0.25em;\n}\nsup:not(#\\#):not(#\\#) {\n  top: -0.5em;\n}\ntable:not(#\\#):not(#\\#) {\n  text-indent: 0;\n  border-color: inherit;\n  border-collapse: collapse;\n}\n:-moz-focusring:not(#\\#):not(#\\#) {\n  outline: auto;\n}\nprogress:not(#\\#):not(#\\#) {\n  vertical-align: baseline;\n}\nsummary:not(#\\#):not(#\\#) {\n  display: list-item;\n}\nol:not(#\\#):not(#\\#),\n  ul:not(#\\#):not(#\\#),\n  menu:not(#\\#):not(#\\#) {\n  list-style: none;\n}\nimg:not(#\\#):not(#\\#),\n  svg:not(#\\#):not(#\\#),\n  video:not(#\\#):not(#\\#),\n  canvas:not(#\\#):not(#\\#),\n  audio:not(#\\#):not(#\\#),\n  iframe:not(#\\#):not(#\\#),\n  embed:not(#\\#):not(#\\#),\n  object:not(#\\#):not(#\\#) {\n  display: block;\n  vertical-align: middle;\n}\nimg:not(#\\#):not(#\\#),\n  video:not(#\\#):not(#\\#) {\n  max-width: 100%;\n  height: auto;\n}\n:not(#\\#):not(#\\#)::-webkit-file-upload-button {\n  font: inherit;\n  -webkit-font-feature-settings: inherit;\n          font-feature-settings: inherit;\n  font-variation-settings: inherit;\n  letter-spacing: inherit;\n  color: inherit;\n  border-radius: 0;\n  background-color: transparent;\n  opacity: 1;\n}\nbutton:not(#\\#):not(#\\#),\n  input:not(#\\#):not(#\\#),\n  select:not(#\\#):not(#\\#),\n  optgroup:not(#\\#):not(#\\#),\n  textarea:not(#\\#):not(#\\#),\n  :not(#\\#):not(#\\#)::file-selector-button {\n  font: inherit;\n  -webkit-font-feature-settings: inherit;\n          font-feature-settings: inherit;\n  font-variation-settings: inherit;\n  letter-spacing: inherit;\n  color: inherit;\n  border-radius: 0;\n  background-color: transparent;\n  opacity: 1;\n}\n:where(select[multiple]):not(#\\#):not(#\\#) optgroup {\n  font-weight: bolder;\n}\n:where(select[size]):not(#\\#):not(#\\#) optgroup {\n  font-weight: bolder;\n}\n:where(select[multiple]):not(#\\#):not(#\\#) optgroup option {\n  padding-left: 20px;\n}\n:where(select[size]):not(#\\#):not(#\\#) optgroup option {\n  padding-left: 20px;\n}\n:not(#\\#):not(#\\#)::-webkit-file-upload-button {\n  margin-right: 4px;\n}\n:not(#\\#):not(#\\#)::file-selector-button {\n  margin-right: 4px;\n}\n:not(#\\#):not(#\\#)::-webkit-input-placeholder {\n  opacity: 1;\n}\n:not(#\\#):not(#\\#)::-moz-placeholder {\n  opacity: 1;\n}\n:not(#\\#):not(#\\#):-ms-input-placeholder {\n  opacity: 1;\n}\n:not(#\\#):not(#\\#)::-ms-input-placeholder {\n  opacity: 1;\n}\n:not(#\\#):not(#\\#)::placeholder {\n  opacity: 1;\n}\n@supports (not (-webkit-appearance: -apple-pay-button))  or\n    (contain-intrinsic-size: 1px) {\n  :not(#\\#):not(#\\#)::-webkit-input-placeholder {\n    color: currentcolor;\n  }\n  :not(#\\#):not(#\\#)::-moz-placeholder {\n    color: currentcolor;\n  }\n  :not(#\\#):not(#\\#):-ms-input-placeholder {\n    color: currentcolor;\n  }\n  :not(#\\#):not(#\\#)::-ms-input-placeholder {\n    color: currentcolor;\n  }\n  :not(#\\#):not(#\\#)::placeholder {\n    color: currentcolor;\n  }\n  @supports (color: color-mix(in lab, red, red)) {\n    :not(#\\#):not(#\\#)::-csstools-invalid-placeholder {\n      color: color-mix(in oklab, currentcolor 50%, transparent);\n    }\n  }\n}\ntextarea:not(#\\#):not(#\\#) {\n  resize: vertical;\n}\n:not(#\\#):not(#\\#)::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n:not(#\\#):not(#\\#)::-webkit-date-and-time-value {\n  min-height: 1lh;\n  text-align: inherit;\n}\n:not(#\\#):not(#\\#)::-webkit-datetime-edit {\n  display: -webkit-inline-box;\n  display: inline-flex;\n}\n:not(#\\#):not(#\\#)::-webkit-datetime-edit-fields-wrapper {\n  padding: 0;\n}\n:not(#\\#):not(#\\#)::-webkit-datetime-edit,\n  :not(#\\#):not(#\\#)::-webkit-datetime-edit-year-field,\n  :not(#\\#):not(#\\#)::-webkit-datetime-edit-month-field,\n  :not(#\\#):not(#\\#)::-webkit-datetime-edit-day-field,\n  :not(#\\#):not(#\\#)::-webkit-datetime-edit-hour-field,\n  :not(#\\#):not(#\\#)::-webkit-datetime-edit-minute-field,\n  :not(#\\#):not(#\\#)::-webkit-datetime-edit-second-field,\n  :not(#\\#):not(#\\#)::-webkit-datetime-edit-millisecond-field,\n  :not(#\\#):not(#\\#)::-webkit-datetime-edit-meridiem-field {\n  padding-top: 0;\n  padding-bottom: 0;\n}\n:not(#\\#):not(#\\#)::-webkit-calendar-picker-indicator {\n  line-height: 1;\n}\n:-moz-ui-invalid:not(#\\#):not(#\\#) {\n  box-shadow: none;\n}\n:not(#\\#):not(#\\#)::-webkit-file-upload-button {\n  -webkit-appearance: button;\n     -moz-appearance: button;\n          appearance: button;\n}\nbutton:not(#\\#):not(#\\#),\n  input:where([type="button"], [type="reset"], [type="submit"]):not(#\\#):not(#\\#),\n  :not(#\\#):not(#\\#)::file-selector-button {\n  -webkit-appearance: button;\n     -moz-appearance: button;\n          appearance: button;\n}\n:not(#\\#):not(#\\#)::-webkit-inner-spin-button,\n  :not(#\\#):not(#\\#)::-webkit-outer-spin-button {\n  height: auto;\n}\n[hidden]:where(:not([hidden="until-found"])):not(#\\#):not(#\\#):not(#\\#) {\n  display: none !important;\n}\n.pointer-events-none:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  pointer-events: none;\n}\n.invisible:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  visibility: hidden;\n}\n.visible:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  visibility: visible;\n}\n.sr-only:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n  border-width: 0;\n}\n.absolute:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  position: absolute;\n}\n.fixed:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  position: fixed;\n}\n.relative:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  position: relative;\n}\n.-inset-px:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  top: -1px;\n  right: -1px;\n  bottom: -1px;\n  left: -1px;\n}\n.inset-0:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  top: calc(var(--spacing) * 0);\n  right: calc(var(--spacing) * 0);\n  bottom: calc(var(--spacing) * 0);\n  left: calc(var(--spacing) * 0);\n}\n.bottom-0:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  bottom: calc(var(--spacing) * 0);\n}\n.left-0:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  left: calc(var(--spacing) * 0);\n}\n.z-10:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  z-index: 10;\n}\n.container:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  width: 100%;\n}\n@media (min-width: 40rem) {\n  .container:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    max-width: 40rem;\n  }\n}\n@media (min-width: 48rem) {\n  .container:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    max-width: 48rem;\n  }\n}\n@media (min-width: 64rem) {\n  .container:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    max-width: 64rem;\n  }\n}\n@media (min-width: 80rem) {\n  .container:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    max-width: 80rem;\n  }\n}\n@media (min-width: 96rem) {\n  .container:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    max-width: 96rem;\n  }\n}\n.mx-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  margin-left: calc(var(--spacing) * 4);\n  margin-right: calc(var(--spacing) * 4);\n}\n.mx-8:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  margin-left: calc(var(--spacing) * 8);\n  margin-right: calc(var(--spacing) * 8);\n}\n.my-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  margin-top: calc(var(--spacing) * 4);\n  margin-bottom: calc(var(--spacing) * 4);\n}\n.mt-1:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  margin-top: calc(var(--spacing) * 1);\n}\n.mt-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  margin-top: calc(var(--spacing) * 4);\n}\n.mt-5:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  margin-top: calc(var(--spacing) * 5);\n}\n.mt-6:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  margin-top: calc(var(--spacing) * 6);\n}\n.block:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  display: block;\n}\n.contents:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  display: contents;\n}\n.flex:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n.grid:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  display: grid;\n}\n.hidden:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  display: none;\n}\n.inline-block:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  display: inline-block;\n}\n.inline-flex:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n}\n.table:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  display: table;\n}\n.h-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  height: calc(var(--spacing) * 4);\n}\n.h-5:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  height: calc(var(--spacing) * 5);\n}\n.h-6:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  height: calc(var(--spacing) * 6);\n}\n.h-7:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  height: calc(var(--spacing) * 7);\n}\n.h-8:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  height: calc(var(--spacing) * 8);\n}\n.min-h-6:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  min-height: calc(var(--spacing) * 6);\n}\n.min-h-screen:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  min-height: 100vh;\n}\n.w-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  width: calc(var(--spacing) * 4);\n}\n.w-5:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  width: calc(var(--spacing) * 5);\n}\n.w-6:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  width: calc(var(--spacing) * 6);\n}\n.w-8:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  width: calc(var(--spacing) * 8);\n}\n.max-w-full:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  max-width: 100%;\n}\n.min-w-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  min-width: calc(var(--spacing) * 4);\n}\n.min-w-6:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  min-width: calc(var(--spacing) * 6);\n}\n.flex-shrink:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n}\n.shrink:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n}\n.flex-grow:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n}\n.grow:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n}\n.border-collapse:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-collapse: collapse;\n}\n.transform:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -webkit-transform:          ;\n          transform:          ;\n  -webkit-transform:          ;\n  -webkit-transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,);\n          transform:          ;\n          transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,);\n}\n.cursor-not-allowed:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  cursor: not-allowed;\n}\n.cursor-pointer:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  cursor: pointer;\n}\n.resize:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  resize: both;\n}\n.grid-cols-1:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  grid-template-columns: repeat(1, minmax(0, 1fr));\n}\n.flex-col:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n.flex-row:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n}\n.flex-nowrap:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -ms-flex-wrap: nowrap;\n      flex-wrap: nowrap;\n}\n.flex-wrap:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n}\n.items-center:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.items-end:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -webkit-box-align: end;\n      -ms-flex-align: end;\n          align-items: flex-end;\n}\n.justify-center:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.gap-1:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  gap: calc(var(--spacing) * 1);\n}\n.gap-2:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  gap: calc(var(--spacing) * 2);\n}\n.gap-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  gap: calc(var(--spacing) * 4);\n}\n.gap-9:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  gap: calc(var(--spacing) * 9);\n}\n.gap-y-6:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  row-gap: calc(var(--spacing) * 6);\n}\n.overflow-hidden:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  overflow: hidden;\n}\n.overflow-y-auto:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  overflow-y: auto;\n}\n.rounded-full:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-radius: calc(infinity * 1px);\n}\n.rounded-lg:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-radius: var(--radius-lg);\n}\n.rounded-sm:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-radius: var(--radius-sm);\n}\n.border:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-style: var(--tw-border-style);\n  border-width: 1px;\n}\n.border-2:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-style: var(--tw-border-style);\n  border-width: 2px;\n}\n.border-blue-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-color: var(--color-blue-500);\n}\n.border-gray-300:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-color: var(--color-gray-300);\n}\n.border-gray-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-color: var(--color-gray-500);\n}\n.border-green-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-color: var(--color-green-500);\n}\n.border-orange-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-color: var(--color-orange-500);\n}\n.border-red-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-color: var(--color-red-500);\n}\n.border-transparent:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  border-color: transparent;\n}\n.bg-blue-600:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  background-color: var(--color-blue-600);\n}\n.bg-white:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  background-color: var(--color-white);\n}\n.p-1:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding: calc(var(--spacing) * 1);\n}\n.p-3:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding: calc(var(--spacing) * 3);\n}\n.px-2:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding-left: calc(var(--spacing) * 2);\n  padding-right: calc(var(--spacing) * 2);\n}\n.px-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding-left: calc(var(--spacing) * 4);\n  padding-right: calc(var(--spacing) * 4);\n}\n.py-1:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding-top: calc(var(--spacing) * 1);\n  padding-bottom: calc(var(--spacing) * 1);\n}\n.pt-0:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding-top: calc(var(--spacing) * 0);\n}\n.pt-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding-top: calc(var(--spacing) * 4);\n}\n.pt-5:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding-top: calc(var(--spacing) * 5);\n}\n.pr-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding-right: calc(var(--spacing) * 4);\n}\n.pb-0:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding-bottom: calc(var(--spacing) * 0);\n}\n.pb-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding-bottom: calc(var(--spacing) * 4);\n}\n.pb-10:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding-bottom: calc(var(--spacing) * 10);\n}\n.pl-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  padding-left: calc(var(--spacing) * 4);\n}\n.text-left:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  text-align: left;\n}\n.align-bottom:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  vertical-align: bottom;\n}\n.align-middle:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  vertical-align: middle;\n}\n.text-base:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  font-size: var(--text-base);\n  line-height: var(--tw-leading, var(--text-base--line-height));\n}\n.text-lg:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  font-size: var(--text-lg);\n  line-height: var(--tw-leading, var(--text-lg--line-height));\n}\n.text-sm:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  font-size: var(--text-sm);\n  line-height: var(--tw-leading, var(--text-sm--line-height));\n}\n.text-xs:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  font-size: var(--text-xs);\n  line-height: var(--tw-leading, var(--text-xs--line-height));\n}\n.leading-6:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-leading: calc(var(--spacing) * 6);\n  line-height: calc(var(--spacing) * 6);\n}\n.leading-7:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-leading: calc(var(--spacing) * 7);\n  line-height: calc(var(--spacing) * 7);\n}\n.font-bold:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-font-weight: var(--font-weight-bold);\n  font-weight: var(--font-weight-bold);\n}\n.font-medium:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-font-weight: var(--font-weight-medium);\n  font-weight: var(--font-weight-medium);\n}\n.text-blue-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  color: var(--color-blue-500);\n}\n.text-gray-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  color: var(--color-gray-500);\n}\n.text-gray-900:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  color: var(--color-gray-900);\n}\n.text-green-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  color: var(--color-green-500);\n}\n.text-orange-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  color: var(--color-orange-500);\n}\n.text-red-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  color: var(--color-red-500);\n}\n.text-white:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  color: var(--color-white);\n}\n.underline:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  text-decoration-line: underline;\n}\n.shadow:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgba(0, 0, 0, 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgba(0, 0, 0, 0.1));\n  -webkit-box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);\n          box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);\n  -webkit-box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n          box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n}\n.shadow-sm:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgba(0, 0, 0, 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgba(0, 0, 0, 0.1));\n  -webkit-box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);\n          box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);\n  -webkit-box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n          box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n}\n.shadow-xl:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-shadow: 0 20px 25px -5px var(--tw-shadow-color, rgba(0, 0, 0, 0.1)), 0 8px 10px -6px var(--tw-shadow-color, rgba(0, 0, 0, 0.1));\n  -webkit-box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);\n          box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);\n  -webkit-box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n          box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n}\n.ring-2:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n  -webkit-box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n          box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n}\n.ring-blue-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-ring-color: var(--color-blue-500);\n}\n.ring-gray-500:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-ring-color: var(--color-gray-500);\n}\n.outline:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  outline-style: var(--tw-outline-style);\n  outline-width: 1px;\n}\n.invert:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-invert: invert(100%);\n  -webkit-filter:           invert(100%)      ;\n          filter:           invert(100%)      ;\n  -webkit-filter:           invert(100%)      ;\n  -webkit-filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);\n          filter:           invert(100%)      ;\n          filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);\n}\n.filter:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -webkit-filter:                  ;\n          filter:                  ;\n  -webkit-filter:                  ;\n  -webkit-filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);\n          filter:                  ;\n          filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);\n}\n.transition-all:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  -webkit-transition-property: all;\n  transition-property: all;\n  -webkit-transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n          transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n  -webkit-transition-duration: var(--tw-duration, var(--default-transition-duration));\n          transition-duration: var(--tw-duration, var(--default-transition-duration));\n}\n.focus\\:ring-2:focus:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n  -webkit-box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n          box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);\n}\n.focus\\:ring-blue-600:focus:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-ring-color: var(--color-blue-600);\n}\n.focus\\:ring-offset-2:focus:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-ring-offset-width: 2px;\n  --tw-ring-offset-shadow: var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n}\n.focus\\:outline-none:focus:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n  --tw-outline-style: none;\n  outline-style: none;\n}\n@media (min-width: 40rem) {\n  .sm\\:my-8:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    margin-top: calc(var(--spacing) * 8);\n    margin-bottom: calc(var(--spacing) * 8);\n  }\n}\n@media (min-width: 40rem) {\n  .sm\\:mt-3:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    margin-top: calc(var(--spacing) * 3);\n  }\n}\n@media (min-width: 40rem) {\n  .sm\\:mt-6:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    margin-top: calc(var(--spacing) * 6);\n  }\n}\n@media (min-width: 40rem) {\n  .sm\\:block:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    display: block;\n  }\n}\n@media (min-width: 40rem) {\n  .sm\\:grid-cols-3:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n@media (min-width: 40rem) {\n  .sm\\:gap-x-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    -webkit-column-gap: calc(var(--spacing) * 4);\n       -moz-column-gap: calc(var(--spacing) * 4);\n            column-gap: calc(var(--spacing) * 4);\n  }\n}\n@media (min-width: 40rem) {\n  .sm\\:p-0:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    padding: calc(var(--spacing) * 0);\n  }\n}\n@media (min-width: 40rem) {\n  .sm\\:p-6:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    padding: calc(var(--spacing) * 6);\n  }\n}\n@media (min-width: 40rem) {\n  .sm\\:align-middle:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    vertical-align: middle;\n  }\n}\n@media (min-width: 40rem) {\n  .sm\\:text-sm:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    font-size: var(--text-sm);\n    line-height: var(--tw-leading, var(--text-sm--line-height));\n  }\n}\n@media (min-width: 64rem) {\n  .lg\\:max-w-\\[80\\%\\]:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    max-width: 80%;\n  }\n}\n@media (min-width: 64rem) {\n  .lg\\:gap-4:not(#\\#):not(#\\#):not(#\\#):not(#\\#) {\n    gap: calc(var(--spacing) * 4);\n  }\n}\n@property --tw-rotate-x {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-rotate-y {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-rotate-z {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-skew-x {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-skew-y {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-border-style {\n  syntax: "*";\n  inherits: false;\n  initial-value: solid;\n}\n@property --tw-leading {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-font-weight {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-shadow {\n  syntax: "*";\n  inherits: false;\n  initial-value: 0 0 rgba(0,0,0,0);\n}\n@property --tw-shadow-color {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-shadow-alpha {\n  syntax: "<percentage>";\n  inherits: false;\n  initial-value: 100%;\n}\n@property --tw-inset-shadow {\n  syntax: "*";\n  inherits: false;\n  initial-value: 0 0 rgba(0,0,0,0);\n}\n@property --tw-inset-shadow-color {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-inset-shadow-alpha {\n  syntax: "<percentage>";\n  inherits: false;\n  initial-value: 100%;\n}\n@property --tw-ring-color {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-ring-shadow {\n  syntax: "*";\n  inherits: false;\n  initial-value: 0 0 rgba(0,0,0,0);\n}\n@property --tw-inset-ring-color {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-inset-ring-shadow {\n  syntax: "*";\n  inherits: false;\n  initial-value: 0 0 rgba(0,0,0,0);\n}\n@property --tw-ring-inset {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-ring-offset-width {\n  syntax: "<length>";\n  inherits: false;\n  initial-value: 0px;\n}\n@property --tw-ring-offset-color {\n  syntax: "*";\n  inherits: false;\n  initial-value: #fff;\n}\n@property --tw-ring-offset-shadow {\n  syntax: "*";\n  inherits: false;\n  initial-value: 0 0 rgba(0,0,0,0);\n}\n@property --tw-outline-style {\n  syntax: "*";\n  inherits: false;\n  initial-value: solid;\n}\n@property --tw-blur {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-brightness {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-contrast {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-grayscale {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-hue-rotate {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-invert {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-opacity {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-saturate {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-sepia {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-drop-shadow {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-drop-shadow-color {\n  syntax: "*";\n  inherits: false;\n}\n@property --tw-drop-shadow-alpha {\n  syntax: "<percentage>";\n  inherits: false;\n  initial-value: 100%;\n}\n@property --tw-drop-shadow-size {\n  syntax: "*";\n  inherits: false;\n}\n@supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {\n  ::-ms-backdrop {\n    --tw-rotate-x: initial;\n    --tw-rotate-y: initial;\n    --tw-rotate-z: initial;\n    --tw-skew-x: initial;\n    --tw-skew-y: initial;\n    --tw-border-style: solid;\n    --tw-leading: initial;\n    --tw-font-weight: initial;\n    --tw-shadow: 0 0 rgba(0,0,0,0);\n    --tw-shadow-color: initial;\n    --tw-shadow-alpha: 100%;\n    --tw-inset-shadow: 0 0 rgba(0,0,0,0);\n    --tw-inset-shadow-color: initial;\n    --tw-inset-shadow-alpha: 100%;\n    --tw-ring-color: initial;\n    --tw-ring-shadow: 0 0 rgba(0,0,0,0);\n    --tw-inset-ring-color: initial;\n    --tw-inset-ring-shadow: 0 0 rgba(0,0,0,0);\n    --tw-ring-inset: initial;\n    --tw-ring-offset-width: 0px;\n    --tw-ring-offset-color: #fff;\n    --tw-ring-offset-shadow: 0 0 rgba(0,0,0,0);\n    --tw-outline-style: solid;\n    --tw-blur: initial;\n    --tw-brightness: initial;\n    --tw-contrast: initial;\n    --tw-grayscale: initial;\n    --tw-hue-rotate: initial;\n    --tw-invert: initial;\n    --tw-opacity: initial;\n    --tw-saturate: initial;\n    --tw-sepia: initial;\n    --tw-drop-shadow: initial;\n    --tw-drop-shadow-color: initial;\n    --tw-drop-shadow-alpha: 100%;\n    --tw-drop-shadow-size: initial;\n  }\n  *, ::before, ::after, ::backdrop {\n    --tw-rotate-x: initial;\n    --tw-rotate-y: initial;\n    --tw-rotate-z: initial;\n    --tw-skew-x: initial;\n    --tw-skew-y: initial;\n    --tw-border-style: solid;\n    --tw-leading: initial;\n    --tw-font-weight: initial;\n    --tw-shadow: 0 0 rgba(0,0,0,0);\n    --tw-shadow-color: initial;\n    --tw-shadow-alpha: 100%;\n    --tw-inset-shadow: 0 0 rgba(0,0,0,0);\n    --tw-inset-shadow-color: initial;\n    --tw-inset-shadow-alpha: 100%;\n    --tw-ring-color: initial;\n    --tw-ring-shadow: 0 0 rgba(0,0,0,0);\n    --tw-inset-ring-color: initial;\n    --tw-inset-ring-shadow: 0 0 rgba(0,0,0,0);\n    --tw-ring-inset: initial;\n    --tw-ring-offset-width: 0px;\n    --tw-ring-offset-color: #fff;\n    --tw-ring-offset-shadow: 0 0 rgba(0,0,0,0);\n    --tw-outline-style: solid;\n    --tw-blur: initial;\n    --tw-brightness: initial;\n    --tw-contrast: initial;\n    --tw-grayscale: initial;\n    --tw-hue-rotate: initial;\n    --tw-invert: initial;\n    --tw-opacity: initial;\n    --tw-saturate: initial;\n    --tw-sepia: initial;\n    --tw-drop-shadow: initial;\n    --tw-drop-shadow-color: initial;\n    --tw-drop-shadow-alpha: 100%;\n    --tw-drop-shadow-size: initial;\n  }\n}\n';

// src/ToggleFeatures.tsx

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function ToggleFeature({
  feature
}) {
  const context = _react.useContext.call(void 0, FeatureContext);
  const handleChangeSelection = _react.useCallback.call(void 0, 
    (value) => {
      if (_optionalChain([context, 'optionalAccess', _20 => _20.overridesSend]) != null) {
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
  const valueInDefaults = (_nullishCoalesce(valueOfFeature(defaultsState, feature.name)[0], () => ( "unset"))).toString();
  const valueInOverrides = (_nullishCoalesce(valueOfFeature(overridesState, feature.name)[0], () => ( "unset"))).toString();
  const actualChecked = testFeature2(feature.name);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    _react3.RadioGroup,
    {
      disabled: feature.noOverride,
      onChange: handleChangeSelection,
      value: valueInOverrides,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react3.RadioGroupLabel, { children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "h6", { className: "text-gray-900 align-center flex flex-row flex-nowrap items-center gap-2 lg:gap-4 h-7", children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { className: "font-medium", children: [
              "Feature: ",
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "code", { children: feature.name })
            ] }),
            feature.noOverride === true ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "border-orange-500 text-orange-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "svg",
                {
                  "aria-hidden": "true",
                  className: "h-4 w-4 min-w-4",
                  fill: "currentColor",
                  viewBox: "0 0 20 20",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "path",
                    {
                      clipRule: "evenodd",
                      d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",
                      fillRule: "evenodd"
                    }
                  )
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: "No Overrides" })
            ] }) : null,
            actualChecked === true ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "flex flex-nowrap text-xs text-green-500 flex-row gap-1 rounded-sm border items-center justify-center border-green-500 px-2 py-1", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "svg",
                {
                  "aria-hidden": "true",
                  className: "h-4 w-4 min-w-4",
                  fill: "currentColor",
                  viewBox: "0 0 20 20",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "path",
                    {
                      clipRule: "evenodd",
                      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                      fillRule: "evenodd"
                    }
                  )
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: actualChecked ? "Enabled" : "Disabled" })
            ] }) : null
          ] }),
          feature.description == null ? null : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "text-base text-gray-500 text-sm", children: feature.description })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4", children: [
          {
            id: "false",
            title: `Disable ${feature.name}`,
            description: "Override the feature to be disabled"
          },
          {
            id: "unset",
            title: "Default",
            description: "Inherit enabled state from defaults",
            disabled: (_nullishCoalesce(feature.noOverride, () => ( false))) || feature.force,
            defaultValue: valueInDefaults === "true" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "text-green-500 border-green-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: "Enabled" }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "text-red-500 border-red-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: "Disabled" }) })
          },
          {
            id: "true",
            title: `Enable ${feature.name}`,
            description: "Override the feature to be enabled"
          }
        ].map((option) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _react3.Radio,
          {
            className: ({ checked, disabled }) => classNames(
              checked ? "border-transparent" : "border-gray-300",
              disabled ? "border-transparent ring-gray-500 cursor-not-allowed" : "cursor-pointer",
              "relative bg-white border rounded-lg shadow-sm p-3 flex focus:outline-none"
            ),
            disabled: option.disabled,
            value: option.id,
            children: ({ checked, disabled }) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "flex flex-col grow", children: [
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                  _react3.RadioGroupLabel,
                  {
                    as: "span",
                    className: "flex flex-nowrap flex-row gap-1 items-center space-between",
                    children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "text-sm font-medium text-gray-900 grow shrink", children: option.title }),
                      option.defaultValue != null ? option.defaultValue : null,
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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
                          children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  _react3.RadioGroupDescription,
                  {
                    as: "span",
                    className: "mt-1 flex items-center text-sm text-gray-500",
                    children: option.description
                  }
                )
              ] }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "div",
                {
                  "aria-hidden": "true",
                  className: classNames(
                    "border-2",
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
  return _reactdom2.default.createPortal(children, root);
}
function ToggleFeatures({
  defaultOpen = false,
  hidden = false
}) {
  const [root, setCoreRoot] = _react.useState.call(void 0, null);
  const setRoot = (host) => {
    if (host == null || root != null) {
      return;
    }
    const shadowRoot = _optionalChain([host, 'optionalAccess', _21 => _21.attachShadow, 'call', _22 => _22({ mode: "open" })]);
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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
      children: root != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ShadowContent, { root, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ToggleFeatureUnwrapped, { defaultOpen }) }) : null
    }
  );
}
function ToggleFeatureUnwrapped({
  defaultOpen = false,
  hidden = false
}) {
  const [open, setOpen] = _react.useState.call(void 0, defaultOpen);
  const context = _react.useContext.call(void 0, FeatureContext);
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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "relative", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "absolute bottom-0 left-0 mx-4 my-4", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "button",
      {
        className: "inline-flex items-center text-sm font-medium p-1 h-8 w-8 align-middle cursor-pointer rounded-full bg-blue-600 text-white  border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",
        onClick: () => setOpen(true),
        title: "Toggle features",
        type: "button",
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "svg",
          {
            className: "w-6 h-6 min-h-6 min-w-6",
            fill: "currentColor",
            viewBox: "0 0 20 20",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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
    !open ? null : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "fixed z-10 inset-0 overflow-y-auto", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "flex items-end justify-flex-start mx-8 my-4 min-h-screen pt-4 px-4 pb-10 sm:block sm:p-0", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 lg:max-w-[80%] max-w-full", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "mt-1 sm:mt-3", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h3", { className: "flex flex-row gap-4 flex-nowrap items-center space-between", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "grow text-lg leading-6 font-medium text-gray-900", children: "Feature Flag Overrides" }) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "text-sm text-gray-500", children: "Features can be enabled or disabled unless they are forced upstream. You can also revert to default." }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mt-6", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "fieldset", { className: "flex flex-col gap-9", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "legend", { className: "sr-only", children: "Feature Flags" }),
        featuresDescription.map((feature) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ToggleFeature, { feature }, feature.name))
      ] }) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "flex justify-center items-center mt-5 sm:mt-6", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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










exports.Disable = Disable; exports.Enable = Enable; exports.EnableContext = EnableContext; exports.Features = Features; exports.ToggleFeatures = ToggleFeatures; exports.useAllDisabled = useAllDisabled; exports.useAllEnabled = useAllEnabled; exports.useDisabled = useDisabled; exports.useEnabled = useEnabled;
//# sourceMappingURL=index.cjs.map
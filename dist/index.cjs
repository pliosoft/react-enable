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
      if (action.features.length === 0) {
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


// src/testFeature.tsx
function testFeature(feature, states) {
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
  return void 0;
}

// src/useTestCallback.tsx
function useTestCallback(defaultsState, overridesState) {
  return _react.useCallback.call(void 0, 
    (f) => testFeature(f, [defaultsState, overridesState]),
    [defaultsState, overridesState]
  );
}

// src/Features.tsx

function Features({
  children,
  features,
  disableConsole = false,
  storage = window.sessionStorage
}) {
  const featuresRef = _react.useRef.call(void 0, features);
  const [overridesState, overridesDispatch] = _react.useReducer.call(void 0, 
    featuresReducer,
    initialFeaturesState
  );
  const [defaultsState, defaultsDispatch] = _react.useReducer.call(void 0, 
    featuresReducer,
    initialFeaturesState
  );
  _react.useEffect.call(void 0, () => {
    defaultsDispatch({ type: "INIT", features });
    return () => {
      defaultsDispatch({ type: "DE_INIT" });
    };
  }, [features]);
  _react.useEffect.call(void 0, () => {
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
      features: featuresRef.current.filter((x) => x.noOverride !== true).map((x) => ({
        name: x.name,
        description: x.description,
        defaultValue: _nullishCoalesce(_optionalChain([f, 'optionalAccess', _15 => _15[x.name]]), () => ( void 0))
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
          const onChangeDefault = _optionalChain([feature, 'access', _16 => _16.featureDesc, 'optionalAccess', _17 => _17.onChangeDefault]);
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
  const testCallback = useTestCallback(overridesState, defaultsState);
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
var tailwind_default = '/*\n! tailwindcss v3.0.24 | MIT License | https://tailwindcss.com\n*/\n\n/*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  border-width: 0;\n  /* 2 */\n  border-style: solid;\n  /* 2 */\n  border-color: #e5e7eb;\n  /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: \'\';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user\'s configured `sans` font-family by default.\n*/\n\nhtml {\n  line-height: 1.5;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */\n  -moz-tab-size: 4;\n  /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4;\n  /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n  /* 4 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0;\n  /* 1 */\n  line-height: inherit;\n  /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  border-top-width: 1px;\n  /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user\'s configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0;\n  /* 1 */\n  border-color: inherit;\n  /* 2 */\n  border-collapse: collapse;\n  /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: inherit;\n  /* 1 */\n  color: inherit;\n  /* 1 */\n  margin: 0;\n  /* 2 */\n  padding: 0;\n  /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type=\'button\'],\n[type=\'reset\'],\n[type=\'submit\'] {\n  -webkit-appearance: button;\n  /* 1 */\n  background-color: transparent;\n  /* 2 */\n  background-image: none;\n  /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type=\'search\'] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user\'s configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1;\n  /* 1 */\n  color: #9ca3af;\n  /* 2 */\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  opacity: 1;\n  /* 1 */\n  color: #9ca3af;\n  /* 2 */\n}\n\ninput::-webkit-input-placeholder, textarea::-webkit-input-placeholder {\n  opacity: 1;\n  /* 1 */\n  color: #9ca3af;\n  /* 2 */\n}\n\ninput::-ms-input-placeholder, textarea::-ms-input-placeholder {\n  opacity: 1;\n  /* 1 */\n  color: #9ca3af;\n  /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1;\n  /* 1 */\n  color: #9ca3af;\n  /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don\'t get the pointer cursor.\n*/\n\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block;\n  /* 1 */\n  vertical-align: middle;\n  /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/*\nEnsure the default browser behavior of the `hidden` attribute.\n*/\n\n[hidden] {\n  display: none;\n}\n\n*, ::before, ::after {\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgba(59, 130, 246, 0.5);\n  --tw-ring-offset-shadow: 0 0 rgba(0,0,0,0);\n  --tw-ring-shadow: 0 0 rgba(0,0,0,0);\n  --tw-shadow: 0 0 rgba(0,0,0,0);\n  --tw-shadow-colored: 0 0 rgba(0,0,0,0);\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n';

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
      if (_optionalChain([context, 'optionalAccess', _18 => _18.overridesSend]) != null) {
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
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react3.RadioGroup.Label, { children: [
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
          _react3.RadioGroup.Option,
          {
            className: ({ checked, active, disabled }) => classNames(
              checked ? "border-transparent" : "border-gray-300",
              !disabled && active ? "border-blue-500 ring-2 ring-blue-500" : "",
              disabled ? "border-transparent ring-gray-500 cursor-not-allowed" : "cursor-pointer",
              "relative bg-white border rounded-lg shadow-sm p-3 flex focus:outline-none"
            ),
            disabled: option.disabled,
            value: option.id,
            children: ({ checked, active, disabled }) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "flex flex-col grow", children: [
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                  _react3.RadioGroup.Label,
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
                  _react3.RadioGroup.Description,
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
    const shadowRoot = _optionalChain([host, 'optionalAccess', _19 => _19.attachShadow, 'call', _20 => _20({ mode: "open" })]);
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
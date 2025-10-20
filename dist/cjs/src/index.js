var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  Disable: () => Disable,
  Enable: () => Enable,
  EnableContext: () => EnableContext,
  Features: () => Features,
  ToggleFeatures: () => ToggleFeatures,
  useAllDisabled: () => useAllDisabled,
  useAllEnabled: () => useAllEnabled,
  useDisabled: () => useDisabled,
  useEnabled: () => useEnabled
});
module.exports = __toCommonJS(src_exports);

// src/Disable.tsx
var React = __toESM(require("react"));

// src/utils.ts
var import_react2 = require("react");

// src/EnableContext.tsx
var import_react = require("react");
var EnableContext = (0, import_react.createContext)((_s) => false);

// src/utils.ts
function useTestAndConvert(input) {
  const test = (0, import_react2.useContext)(EnableContext);
  const converted = (0, import_react2.useMemo)(() => input == null ? [] : Array.isArray(input) ? input : [input], [input]);
  return [test, converted];
}

// src/useAllDisabled.tsx
function useAllDisabled(withoutAll) {
  const [test, queryAllWithout] = useTestAndConvert(withoutAll);
  return withoutAll.length > 0 && queryAllWithout.every((x) => {
    var _a;
    return !((_a = test(x)) != null ? _a : false);
  });
}

// src/useDisabled.tsx
function useDisabled(without) {
  const [test, queryAnyWithout] = useTestAndConvert(without);
  return queryAnyWithout.some((x) => {
    var _a;
    return !((_a = test(x)) != null ? _a : false);
  });
}

// src/Disable.tsx
var Disable = ({
  feature = [],
  allFeatures = [],
  children
}) => {
  const isAny = useDisabled(feature);
  const isAll = useAllDisabled(allFeatures);
  if (isAny || isAll) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
  }
  return null;
};

// src/Enable.tsx
var React2 = __toESM(require("react"));

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
    return /* @__PURE__ */ React2.createElement(React2.Fragment, null, children);
  }
  return null;
}

// src/Features.tsx
var import_react7 = __toESM(require("react"));

// src/FeatureContext.tsx
var import_react3 = require("react");
var FeatureContext = (0, import_react3.createContext)(null);

// src/FeatureState.tsx
function valueForState(featureState) {
  var _a, _b;
  return [
    featureState.value === "enabled" || featureState.value === "asyncEnabled" ? true : featureState.value === "disabled" || featureState.value === "asyncDisabled" ? false : void 0,
    (_b = (_a = featureState.featureDesc) == null ? void 0 : _a.force) != null ? _b : false
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
  var _a, _b, _c, _d, _e;
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
      const features = __spreadValues({}, state.context.features);
      Object.keys(features).forEach((name) => {
        var _a2, _b2;
        const value = (_a2 = action.features[name]) != null ? _a2 : void 0;
        const currentFeature = features[name];
        if (((_b2 = currentFeature.featureDesc) == null ? void 0 : _b2.onChangeDefault) != null) {
          if (value === true) {
            features[name] = __spreadProps(__spreadValues({}, currentFeature), { value: "asyncEnabled" });
          } else if (value === false) {
            features[name] = __spreadProps(__spreadValues({}, currentFeature), { value: "asyncDisabled" });
          } else {
            features[name] = __spreadProps(__spreadValues({}, currentFeature), { value: "asyncUnspecified" });
          }
        } else {
          if (value === true) {
            features[name] = __spreadProps(__spreadValues({}, currentFeature), { value: "enabled" });
          } else if (value === false) {
            features[name] = __spreadProps(__spreadValues({}, currentFeature), { value: "disabled" });
          } else {
            features[name] = __spreadProps(__spreadValues({}, currentFeature), { value: "unspecified" });
          }
        }
      });
      return __spreadProps(__spreadValues({}, state), {
        context: { features }
      });
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
      if (((_a = feature.featureDesc) == null ? void 0 : _a.onChangeDefault) != null) {
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
      return __spreadProps(__spreadValues({}, state), {
        context: {
          features: __spreadProps(__spreadValues({}, state.context.features), {
            [action.name]: __spreadProps(__spreadValues({}, feature), { value: newValue })
          })
        }
      });
    }
    case "TOGGLE": {
      if (state.value !== "ready") {
        return state;
      }
      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }
      const newValue = ((_b = feature.featureDesc) == null ? void 0 : _b.onChangeDefault) != null ? "asyncEnabled" : "enabled";
      return __spreadProps(__spreadValues({}, state), {
        context: {
          features: __spreadProps(__spreadValues({}, state.context.features), {
            [action.name]: __spreadProps(__spreadValues({}, feature), { value: newValue })
          })
        }
      });
    }
    case "ENABLE": {
      if (state.value !== "ready") {
        return state;
      }
      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }
      const newValue = ((_c = feature.featureDesc) == null ? void 0 : _c.onChangeDefault) != null ? "asyncEnabled" : "enabled";
      return __spreadProps(__spreadValues({}, state), {
        context: {
          features: __spreadProps(__spreadValues({}, state.context.features), {
            [action.name]: __spreadProps(__spreadValues({}, feature), { value: newValue })
          })
        }
      });
    }
    case "DISABLE": {
      if (state.value !== "ready") {
        return state;
      }
      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }
      const newValue = ((_d = feature.featureDesc) == null ? void 0 : _d.onChangeDefault) != null ? "asyncDisabled" : "disabled";
      return __spreadProps(__spreadValues({}, state), {
        context: {
          features: __spreadProps(__spreadValues({}, state.context.features), {
            [action.name]: __spreadProps(__spreadValues({}, feature), { value: newValue })
          })
        }
      });
    }
    case "UNSET": {
      if (state.value !== "ready") {
        return state;
      }
      const feature = state.context.features[action.name];
      if (feature == null) {
        return state;
      }
      const newValue = ((_e = feature.featureDesc) == null ? void 0 : _e.onChangeDefault) != null ? "asyncUnspecified" : "unspecified";
      return __spreadProps(__spreadValues({}, state), {
        context: {
          features: __spreadProps(__spreadValues({}, state.context.features), {
            [action.name]: __spreadProps(__spreadValues({}, feature), { value: newValue })
          })
        }
      });
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
      return __spreadProps(__spreadValues({}, state), {
        context: {
          features: __spreadProps(__spreadValues({}, state.context.features), {
            [action.name]: __spreadProps(__spreadValues({}, feature), { value: newValue })
          })
        }
      });
    }
    default:
      return state;
  }
}

// src/useConsoleOverride.tsx
var import_react4 = require("react");

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
  (0, import_react4.useEffect)(() => {
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
var import_react5 = require("react");
var KEY = "react-enable:feature-values";
function usePersist(storage, features, overrideState) {
  const overrides = (0, import_react5.useMemo)(() => {
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
  (0, import_react5.useEffect)(() => {
    try {
      if (storage != null && overrideState.value === "ready") {
        storage.setItem(KEY, strState);
      }
    } catch (e) {
    }
  }, [overrideState, storage, strState]);
}

// src/useTestCallback.tsx
var import_react6 = require("react");

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
  return (0, import_react6.useCallback)((f) => testFeature(f, [defaultsState, overridesState]), [defaultsState, overridesState]);
}

// src/Features.tsx
function Features({
  children,
  features,
  disableConsole = false,
  storage = window.sessionStorage
}) {
  const featuresRef = (0, import_react7.useRef)(features);
  const [overridesState, overridesDispatch] = (0, import_react7.useReducer)(featuresReducer, initialFeaturesState);
  const [defaultsState, defaultsDispatch] = (0, import_react7.useReducer)(featuresReducer, initialFeaturesState);
  (0, import_react7.useEffect)(() => {
    defaultsDispatch({ type: "INIT", features });
    return () => {
      defaultsDispatch({ type: "DE_INIT" });
    };
  }, [features]);
  (0, import_react7.useEffect)(() => {
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
      features: featuresRef.current.filter((x) => x.noOverride !== true).map((x) => {
        var _a;
        return {
          name: x.name,
          description: x.description,
          defaultValue: (_a = f == null ? void 0 : f[x.name]) != null ? _a : void 0
        };
      })
    });
    return () => {
      overridesDispatch({ type: "DE_INIT" });
    };
  }, [storage]);
  (0, import_react7.useEffect)(() => {
    if (defaultsState.value !== "ready") {
      return;
    }
    Object.entries(defaultsState.context.features).forEach(([name, feature]) => {
      var _a;
      if (feature.value === "asyncEnabled" || feature.value === "asyncDisabled" || feature.value === "asyncUnspecified") {
        const targetValue = feature.value === "asyncEnabled" ? true : feature.value === "asyncDisabled" ? false : void 0;
        const onChangeDefault = (_a = feature.featureDesc) == null ? void 0 : _a.onChangeDefault;
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
    });
  }, [defaultsState]);
  usePersist(storage, featuresRef.current, overridesState);
  const testCallback = useTestCallback(overridesState, defaultsState);
  useConsoleOverride(!disableConsole, featuresRef.current, testCallback, defaultsDispatch);
  const featureValue = (0, import_react7.useMemo)(() => ({
    overridesSend: overridesDispatch,
    defaultsSend: defaultsDispatch,
    featuresDescription: featuresRef.current,
    overridesState,
    defaultsState,
    test: testCallback
  }), [overridesState, defaultsState, testCallback]);
  return /* @__PURE__ */ import_react7.default.createElement(FeatureContext.Provider, {
    value: featureValue
  }, /* @__PURE__ */ import_react7.default.createElement(EnableContext.Provider, {
    value: testCallback
  }, children));
}

// src/ToggleFeatures.tsx
var import_react8 = require("@headlessui/react");
var import_react9 = __toESM(require("react"));
var import_react_dom = __toESM(require("react-dom"));

// src/tailwind.css
var tailwind_default = `/*
! tailwindcss v3.0.24 | MIT License | https://tailwindcss.com
*/

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
*/

html {
  line-height: 1.5;
  /* 1 */
  -webkit-text-size-adjust: 100%;
  /* 2 */
  -moz-tab-size: 4;
  /* 3 */
  -o-tab-size: 4;
     tab-size: 4;
  /* 3 */
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* 4 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  margin: 0;
  /* 1 */
  line-height: inherit;
  /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0;
  /* 1 */
  color: inherit;
  /* 2 */
  border-top-width: 1px;
  /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured \`mono\` font family by default.
2. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  /* 1 */
  font-size: 1em;
  /* 2 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0;
  /* 1 */
  border-color: inherit;
  /* 2 */
  border-collapse: collapse;
  /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  /* 1 */
  font-size: 100%;
  /* 1 */
  line-height: inherit;
  /* 1 */
  color: inherit;
  /* 1 */
  margin: 0;
  /* 2 */
  padding: 0;
  /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button;
  /* 1 */
  background-color: transparent;
  /* 2 */
  background-image: none;
  /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button;
  /* 1 */
  font: inherit;
  /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input:-ms-input-placeholder, textarea:-ms-input-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  /* 1 */
  vertical-align: middle;
  /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/*
Ensure the default browser behavior of the \`hidden\` attribute.
*/

[hidden] {
  display: none;
}

[type='text'],[type='email'],[type='url'],[type='password'],[type='number'],[type='date'],[type='datetime-local'],[type='month'],[type='search'],[type='tel'],[type='time'],[type='week'],[multiple],textarea,select {
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  background-color: #fff;
  border-color: #6b7280;
  border-width: 1px;
  border-radius: 0px;
  padding-top: 0.5rem;
  padding-right: 0.75rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  --tw-shadow: 0 0 #0000;
}

[type='text']:focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, textarea:focus, select:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: #2563eb;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  border-color: #2563eb;
}

input::-moz-placeholder, textarea::-moz-placeholder {
  color: #6b7280;
  opacity: 1;
}

input:-ms-input-placeholder, textarea:-ms-input-placeholder {
  color: #6b7280;
  opacity: 1;
}

input::placeholder,textarea::placeholder {
  color: #6b7280;
  opacity: 1;
}

::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}

::-webkit-date-and-time-value {
  min-height: 1.5em;
}

::-webkit-datetime-edit,::-webkit-datetime-edit-year-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-minute-field,::-webkit-datetime-edit-second-field,::-webkit-datetime-edit-millisecond-field,::-webkit-datetime-edit-meridiem-field {
  padding-top: 0;
  padding-bottom: 0;
}

select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
          color-adjust: exact;
}

[multiple] {
  background-image: initial;
  background-position: initial;
  background-repeat: unset;
  background-size: initial;
  padding-right: 0.75rem;
  -webkit-print-color-adjust: unset;
          color-adjust: unset;
}

[type='checkbox'],[type='radio'] {
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  padding: 0;
  -webkit-print-color-adjust: exact;
          color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  flex-shrink: 0;
  height: 1rem;
  width: 1rem;
  color: #2563eb;
  background-color: #fff;
  border-color: #6b7280;
  border-width: 1px;
  --tw-shadow: 0 0 #0000;
}

[type='checkbox'] {
  border-radius: 0px;
}

[type='radio'] {
  border-radius: 100%;
}

[type='checkbox']:focus,[type='radio']:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);
  --tw-ring-offset-width: 2px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: #2563eb;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}

[type='checkbox']:checked,[type='radio']:checked {
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

[type='checkbox']:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}

[type='radio']:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
}

[type='checkbox']:checked:hover,[type='checkbox']:checked:focus,[type='radio']:checked:hover,[type='radio']:checked:focus {
  border-color: transparent;
  background-color: currentColor;
}

[type='checkbox']:indeterminate {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

[type='checkbox']:indeterminate:hover,[type='checkbox']:indeterminate:focus {
  border-color: transparent;
  background-color: currentColor;
}

[type='file'] {
  background: unset;
  border-color: inherit;
  border-width: 0;
  border-radius: 0;
  padding: 0;
  font-size: unset;
  line-height: inherit;
}

[type='file']:focus {
  outline: 1px auto -webkit-focus-ring-color;
}

*, ::before, ::after {
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

.container {
  width: 100%;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.pointer-events-none {
  pointer-events: none;
}

.invisible {
  visibility: hidden;
}

.fixed {
  position: fixed;
}

.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

.-inset-px {
  top: -1px;
  right: -1px;
  bottom: -1px;
  left: -1px;
}

.inset-0 {
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.bottom-0 {
  bottom: 0px;
}

.left-0 {
  left: 0px;
}

.z-10 {
  z-index: 10;
}

.mx-4 {
  margin-left: 1rem;
  margin-right: 1rem;
}

.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.mx-8 {
  margin-left: 2rem;
  margin-right: 2rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.mt-5 {
  margin-top: 1.25rem;
}

.inline-block {
  display: inline-block;
}

.flex {
  display: flex;
}

.inline-flex {
  display: inline-flex;
}

.grid {
  display: grid;
}

.hidden {
  display: none;
}

.h-7 {
  height: 1.75rem;
}

.h-4 {
  height: 1rem;
}

.h-5 {
  height: 1.25rem;
}

.h-8 {
  height: 2rem;
}

.h-6 {
  height: 1.5rem;
}

.min-h-screen {
  min-height: 100vh;
}

.w-4 {
  width: 1rem;
}

.w-5 {
  width: 1.25rem;
}

.w-8 {
  width: 2rem;
}

.w-6 {
  width: 1.5rem;
}

.max-w-full {
  max-width: 100%;
}

.shrink {
  flex-shrink: 1;
}

.grow {
  flex-grow: 1;
}

.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.cursor-pointer {
  cursor: pointer;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.flex-row {
  flex-direction: row;
}

.flex-col {
  flex-direction: column;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

.items-end {
  align-items: flex-end;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-1 {
  gap: 0.25rem;
}

.gap-4 {
  gap: 1rem;
}

.gap-9 {
  gap: 2.25rem;
}

.gap-y-6 {
  row-gap: 1.5rem;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.rounded-sm {
  border-radius: 0.125rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-full {
  border-radius: 9999px;
}

.border {
  border-width: 1px;
}

.border-2 {
  border-width: 2px;
}

.border-orange-500 {
  --tw-border-opacity: 1;
  border-color: rgb(249 115 22 / var(--tw-border-opacity));
}

.border-green-500 {
  --tw-border-opacity: 1;
  border-color: rgb(34 197 94 / var(--tw-border-opacity));
}

.border-red-500 {
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity));
}

.border-transparent {
  border-color: transparent;
}

.border-gray-300 {
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity));
}

.border-blue-500 {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity));
}

.border-gray-500 {
  --tw-border-opacity: 1;
  border-color: rgb(107 114 128 / var(--tw-border-opacity));
}

.bg-blue-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
}

.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.p-3 {
  padding: 0.75rem;
}

.p-1 {
  padding: 0.25rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.pt-4 {
  padding-top: 1rem;
}

.pb-10 {
  padding-bottom: 2.5rem;
}

.pt-5 {
  padding-top: 1.25rem;
}

.pb-4 {
  padding-bottom: 1rem;
}

.pt-0 {
  padding-top: 0px;
}

.pb-0 {
  padding-bottom: 0px;
}

.pr-4 {
  padding-right: 1rem;
}

.pl-4 {
  padding-left: 1rem;
}

.text-left {
  text-align: left;
}

.align-middle {
  vertical-align: middle;
}

.align-bottom {
  vertical-align: bottom;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.font-medium {
  font-weight: 500;
}

.leading-6 {
  line-height: 1.5rem;
}

.leading-7 {
  line-height: 1.75rem;
}

.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity));
}

.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
}

.text-orange-500 {
  --tw-text-opacity: 1;
  color: rgb(249 115 22 / var(--tw-text-opacity));
}

.text-green-500 {
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity));
}

.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}

.text-blue-500 {
  --tw-text-opacity: 1;
  color: rgb(59 130 246 / var(--tw-text-opacity));
}

.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}

.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.ring-2 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-blue-500 {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
}

.ring-gray-500 {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity));
}

.invert {
  --tw-invert: invert(100%);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\\:ring-blue-600:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(37 99 235 / var(--tw-ring-opacity));
}

.focus\\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}

@media (min-width: 640px) {
  .sm\\:my-8 {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .sm\\:mt-3 {
    margin-top: 0.75rem;
  }

  .sm\\:mt-6 {
    margin-top: 1.5rem;
  }

  .sm\\:block {
    display: block;
  }

  .sm\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .sm\\:gap-x-4 {
    -moz-column-gap: 1rem;
         column-gap: 1rem;
  }

  .sm\\:p-0 {
    padding: 0px;
  }

  .sm\\:p-6 {
    padding: 1.5rem;
  }

  .sm\\:align-middle {
    vertical-align: middle;
  }

  .sm\\:text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .lg\\:max-w-\\[80\\%\\] {
    max-width: 80%;
  }

  .lg\\:gap-4 {
    gap: 1rem;
  }
}
`;

// src/ToggleFeatures.tsx
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function ToggleFeature({
  feature
}) {
  var _a, _b, _c;
  const context = (0, import_react9.useContext)(FeatureContext);
  const handleChangeSelection = (0, import_react9.useCallback)((value) => {
    if ((context == null ? void 0 : context.overridesSend) != null) {
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
  }, [feature.name, context]);
  if (context == null) {
    return null;
  }
  const { overridesState, test: testFeature2, defaultsState } = context;
  const valueInDefaults = ((_a = valueOfFeature(defaultsState, feature.name)[0]) != null ? _a : "unset").toString();
  const valueInOverrides = ((_b = valueOfFeature(overridesState, feature.name)[0]) != null ? _b : "unset").toString();
  const actualChecked = testFeature2(feature.name);
  return /* @__PURE__ */ import_react9.default.createElement(import_react8.RadioGroup, {
    disabled: feature.noOverride,
    onChange: handleChangeSelection,
    value: valueInOverrides
  }, /* @__PURE__ */ import_react9.default.createElement(import_react8.RadioGroup.Label, null, /* @__PURE__ */ import_react9.default.createElement("h6", {
    className: "text-gray-900 align-center flex flex-row flex-nowrap items-center gap-2 lg:gap-4 h-7"
  }, /* @__PURE__ */ import_react9.default.createElement("span", {
    className: "font-medium"
  }, "Feature: ", /* @__PURE__ */ import_react9.default.createElement("code", null, feature.name)), feature.noOverride === true ? /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "border-orange-500 text-orange-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"
  }, /* @__PURE__ */ import_react9.default.createElement("svg", {
    "aria-hidden": "true",
    className: "h-4 w-4 min-w-4",
    fill: "currentColor",
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ import_react9.default.createElement("path", {
    clipRule: "evenodd",
    d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",
    fillRule: "evenodd"
  })), /* @__PURE__ */ import_react9.default.createElement("div", null, "No Overrides")) : null, actualChecked === true ? /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "flex flex-nowrap text-xs text-green-500 flex-row gap-1 rounded-sm border items-center justify-center border-green-500 px-2 py-1"
  }, /* @__PURE__ */ import_react9.default.createElement("svg", {
    "aria-hidden": "true",
    className: "h-4 w-4 min-w-4",
    fill: "currentColor",
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ import_react9.default.createElement("path", {
    clipRule: "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
    fillRule: "evenodd"
  })), /* @__PURE__ */ import_react9.default.createElement("div", null, actualChecked ? "Enabled" : "Disabled")) : null), feature.description == null ? null : /* @__PURE__ */ import_react9.default.createElement("p", {
    className: "text-base text-gray-500 text-sm"
  }, feature.description)), /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
  }, [
    {
      id: "false",
      title: `Disable ${feature.name}`,
      description: "Override the feature to be disabled"
    },
    {
      id: "unset",
      title: "Default",
      description: "Inherit enabled state from defaults",
      disabled: ((_c = feature.noOverride) != null ? _c : false) || feature.force,
      defaultValue: valueInDefaults === "true" ? /* @__PURE__ */ import_react9.default.createElement("div", {
        className: "text-green-500 border-green-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"
      }, /* @__PURE__ */ import_react9.default.createElement("span", null, "Enabled")) : /* @__PURE__ */ import_react9.default.createElement("div", {
        className: "text-red-500 border-red-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"
      }, /* @__PURE__ */ import_react9.default.createElement("span", null, "Disabled"))
    },
    {
      id: "true",
      title: `Enable ${feature.name}`,
      description: "Override the feature to be enabled"
    }
  ].map((option) => /* @__PURE__ */ import_react9.default.createElement(import_react8.RadioGroup.Option, {
    className: ({ checked, active, disabled }) => classNames(checked ? "border-transparent" : "border-gray-300", !disabled && active ? "border-blue-500 ring-2 ring-blue-500" : "", disabled ? "border-transparent ring-gray-500 cursor-not-allowed" : "cursor-pointer", "relative bg-white border rounded-lg shadow-sm p-3 flex focus:outline-none"),
    disabled: option.disabled,
    key: option.id,
    value: option.id
  }, ({ checked, active, disabled }) => /* @__PURE__ */ import_react9.default.createElement(import_react9.default.Fragment, null, /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "flex flex-col grow"
  }, /* @__PURE__ */ import_react9.default.createElement(import_react8.RadioGroup.Label, {
    as: "span",
    className: "flex flex-nowrap flex-row gap-1 items-center space-between"
  }, /* @__PURE__ */ import_react9.default.createElement("span", {
    className: "text-sm font-medium text-gray-900 grow shrink"
  }, option.title), option.defaultValue != null ? option.defaultValue : null, /* @__PURE__ */ import_react9.default.createElement("svg", {
    "aria-hidden": "true",
    className: classNames(!checked ? "invisible" : "", "h-5 w-5 text-blue-500 min-w-4"),
    fill: "currentColor",
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ import_react9.default.createElement("path", {
    clipRule: "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
    fillRule: "evenodd"
  }))), /* @__PURE__ */ import_react9.default.createElement(import_react8.RadioGroup.Description, {
    as: "span",
    className: "mt-1 flex items-center text-sm text-gray-500"
  }, option.description)), /* @__PURE__ */ import_react9.default.createElement("div", {
    "aria-hidden": "true",
    className: classNames(!disabled && active ? "border" : "border-2", checked ? disabled ? "border-gray-500" : "border-blue-500" : "border-transparent", "absolute -inset-px rounded-lg pointer-events-none")
  }))))));
}
function ShadowContent({
  root,
  children
}) {
  return import_react_dom.default.createPortal(children, root);
}
function ToggleFeatures({
  defaultOpen = false,
  hidden = false
}) {
  const [root, setCoreRoot] = (0, import_react9.useState)(null);
  const setRoot = (host) => {
    if (host == null || root != null) {
      return;
    }
    const shadowRoot = host == null ? void 0 : host.attachShadow({ mode: "open" });
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
  return /* @__PURE__ */ import_react9.default.createElement("div", {
    ref: setRoot,
    style: {
      zIndex: 99999,
      position: "fixed",
      width: "0",
      height: "0",
      bottom: 0
    }
  }, root != null ? /* @__PURE__ */ import_react9.default.createElement(ShadowContent, {
    root
  }, /* @__PURE__ */ import_react9.default.createElement(ToggleFeatureUnwrapped, {
    defaultOpen
  })) : null);
}
function ToggleFeatureUnwrapped({
  defaultOpen = false,
  hidden = false
}) {
  const [open, setOpen] = (0, import_react9.useState)(defaultOpen);
  const context = (0, import_react9.useContext)(FeatureContext);
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
  return /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "relative"
  }, /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "absolute bottom-0 left-0 mx-4 my-4"
  }, /* @__PURE__ */ import_react9.default.createElement("button", {
    className: "inline-flex items-center text-sm font-medium p-1 h-8 w-8 align-middle cursor-pointer rounded-full bg-blue-600 text-white  border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",
    onClick: () => setOpen(true),
    title: "Toggle features",
    type: "button"
  }, /* @__PURE__ */ import_react9.default.createElement("svg", {
    className: "w-6 h-6 min-h-6 min-w-6",
    fill: "currentColor",
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ import_react9.default.createElement("path", {
    clipRule: "evenodd",
    d: "M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z",
    fillRule: "evenodd"
  })))), !open ? null : /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "fixed z-10 inset-0 overflow-y-auto"
  }, /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "flex items-end justify-flex-start mx-8 my-4 min-h-screen pt-4 px-4 pb-10 sm:block sm:p-0"
  }, /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 lg:max-w-[80%] max-w-full"
  }, /* @__PURE__ */ import_react9.default.createElement("div", null, /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "mt-1 sm:mt-3"
  }, /* @__PURE__ */ import_react9.default.createElement("h3", {
    className: "flex flex-row gap-4 flex-nowrap items-center space-between"
  }, /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "grow text-lg leading-6 font-medium text-gray-900"
  }, "Feature Flag Overrides")), /* @__PURE__ */ import_react9.default.createElement("p", {
    className: "text-sm text-gray-500"
  }, "Features can be enabled or disabled unless they are forced upstream. You can also revert to default."), /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "mt-6"
  }, /* @__PURE__ */ import_react9.default.createElement("fieldset", {
    className: "flex flex-col gap-9"
  }, /* @__PURE__ */ import_react9.default.createElement("legend", {
    className: "sr-only"
  }, "Feature Flags"), featuresDescription.map((feature) => /* @__PURE__ */ import_react9.default.createElement(ToggleFeature, {
    feature,
    key: feature.name
  })))), /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "flex justify-center items-center mt-5 sm:mt-6"
  }, /* @__PURE__ */ import_react9.default.createElement("button", {
    className: "inline-flex items-center text-sm font-medium pt-0 pb-0 pr-4 pl-4 h-8 leading-7 align-middle cursor-pointer rounded-sm bg-blue-600 text-white border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",
    onClick: () => setOpen(false),
    type: "button"
  }, "Done"))))))));
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2luZGV4LnRzeCIsICIuLi8uLi8uLi9zcmMvRGlzYWJsZS50c3giLCAiLi4vLi4vLi4vc3JjL3V0aWxzLnRzIiwgIi4uLy4uLy4uL3NyYy9FbmFibGVDb250ZXh0LnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlQWxsRGlzYWJsZWQudHN4IiwgIi4uLy4uLy4uL3NyYy91c2VEaXNhYmxlZC50c3giLCAiLi4vLi4vLi4vc3JjL0VuYWJsZS50c3giLCAiLi4vLi4vLi4vc3JjL3VzZUFsbEVuYWJsZWQudHN4IiwgIi4uLy4uLy4uL3NyYy91c2VFbmFibGVkLnRzeCIsICIuLi8uLi8uLi9zcmMvRmVhdHVyZXMudHN4IiwgIi4uLy4uLy4uL3NyYy9GZWF0dXJlQ29udGV4dC50c3giLCAiLi4vLi4vLi4vc3JjL0ZlYXR1cmVTdGF0ZS50c3giLCAiLi4vLi4vLi4vc3JjL0ZlYXR1cmVzU3RhdGUudHN4IiwgIi4uLy4uLy4uL3NyYy91c2VDb25zb2xlT3ZlcnJpZGUudHN4IiwgIi4uLy4uLy4uL3NyYy9HbG9iYWxFbmFibGUudHN4IiwgIi4uLy4uLy4uL3NyYy91c2VQZXJzaXN0LnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlVGVzdENhbGxiYWNrLnRzeCIsICIuLi8uLi8uLi9zcmMvdGVzdEZlYXR1cmUudHN4IiwgIi4uLy4uLy4uL3NyYy9Ub2dnbGVGZWF0dXJlcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCB7IERpc2FibGUgfSBmcm9tICcuL0Rpc2FibGUnO1xuZXhwb3J0IHsgRW5hYmxlIH0gZnJvbSAnLi9FbmFibGUnO1xuZXhwb3J0IHR5cGUgeyBFbmFibGVDb250ZXh0VHlwZSB9IGZyb20gJy4vRW5hYmxlQ29udGV4dCc7XG5leHBvcnQgeyBFbmFibGVDb250ZXh0IH0gZnJvbSAnLi9FbmFibGVDb250ZXh0JztcbmV4cG9ydCB0eXBlIHsgRmVhdHVyZUNvbnRleHRUeXBlIH0gZnJvbSAnLi9GZWF0dXJlQ29udGV4dCc7XG5leHBvcnQgdHlwZSB7XG4gIEZlYXR1cmVEZXNjcmlwdGlvbixcbiAgRmVhdHVyZURpc3BhdGNoLFxuICBGZWF0dXJlU3RhdGUsXG4gIEZlYXR1cmVWYWx1ZSxcbn0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuZXhwb3J0IHsgRmVhdHVyZXMgfSBmcm9tICcuL0ZlYXR1cmVzJztcbmV4cG9ydCB7IFRvZ2dsZUZlYXR1cmVzIH0gZnJvbSAnLi9Ub2dnbGVGZWF0dXJlcyc7XG5leHBvcnQgeyB1c2VBbGxEaXNhYmxlZCB9IGZyb20gJy4vdXNlQWxsRGlzYWJsZWQnO1xuZXhwb3J0IHsgdXNlQWxsRW5hYmxlZCB9IGZyb20gJy4vdXNlQWxsRW5hYmxlZCc7XG5leHBvcnQgeyB1c2VEaXNhYmxlZCB9IGZyb20gJy4vdXNlRGlzYWJsZWQnO1xuZXhwb3J0IHsgdXNlRW5hYmxlZCB9IGZyb20gJy4vdXNlRW5hYmxlZCc7XG4iLCAiLy8gYmlvbWUtaWdub3JlIGxpbnQvc3R5bGUvdXNlSW1wb3J0VHlwZTogSlNYIHJlcXVpcmVzIFJlYWN0IGF0IHJ1bnRpbWVcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHR5cGUgeyBFbmFibGVQcm9wcyB9IGZyb20gJy4vRW5hYmxlJztcbmltcG9ydCB7IHVzZUFsbERpc2FibGVkIH0gZnJvbSAnLi91c2VBbGxEaXNhYmxlZCc7XG5pbXBvcnQgeyB1c2VEaXNhYmxlZCB9IGZyb20gJy4vdXNlRGlzYWJsZWQnO1xuXG4vKipcbiAqIEZlYXR1cmUgd2lsbCBiZSBkaXNhYmxlZCBpZiBhbnkgaW4gdGhlIGxpc3QgYXJlIGVuYWJsZWRcbiAqL1xuZXhwb3J0IGNvbnN0IERpc2FibGU6IFJlYWN0LkZDPEVuYWJsZVByb3BzPiA9ICh7XG4gIGZlYXR1cmUgPSBbXSxcbiAgYWxsRmVhdHVyZXMgPSBbXSxcbiAgY2hpbGRyZW4sXG59KSA9PiB7XG4gIGNvbnN0IGlzQW55ID0gdXNlRGlzYWJsZWQoZmVhdHVyZSk7XG4gIGNvbnN0IGlzQWxsID0gdXNlQWxsRGlzYWJsZWQoYWxsRmVhdHVyZXMpO1xuXG4gIGlmIChpc0FueSB8fCBpc0FsbCkge1xuICAgIHJldHVybiA8PntjaGlsZHJlbn08Lz47XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG4iLCAiaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRW5hYmxlQ29udGV4dCwgdHlwZSBFbmFibGVDb250ZXh0VHlwZSB9IGZyb20gJy4vRW5hYmxlQ29udGV4dCc7XG5cbi8vIEhlbHBlcjogZ2V0IHJpZCBvZiBzb21lIGJvaWxlcnBsYXRlLlxuLy8ganVzdCBpbnB1dCBtYXNoaW5nIGFuZCBzYW5pdGF0aW9uLCByZW1vdmluZyBleHRyYSByZW5kZXJzLCBhbmQgZ2V0dGluZyB0ZXN0IGZ1bmN0aW9uXG5leHBvcnQgZnVuY3Rpb24gdXNlVGVzdEFuZENvbnZlcnQoXG4gIGlucHV0Pzogc3RyaW5nW10gfCBzdHJpbmcgfCBudWxsLFxuKTogW0VuYWJsZUNvbnRleHRUeXBlLCBzdHJpbmdbXV0ge1xuICBjb25zdCB0ZXN0ID0gdXNlQ29udGV4dChFbmFibGVDb250ZXh0KTtcblxuICAvLyBXZSBtZW1vaXplIGp1c3QgdG8gcHJldmVudCByZS1yZW5kZXJzIHNpbmNlIHRoaXMgY291bGQgYmUgYXQgdGhlIGxlYWYgb2YgYSB0cmVlXG4gIGNvbnN0IGNvbnZlcnRlZCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKGlucHV0ID09IG51bGwgPyBbXSA6IEFycmF5LmlzQXJyYXkoaW5wdXQpID8gaW5wdXQgOiBbaW5wdXRdKSxcbiAgICBbaW5wdXRdLFxuICApO1xuXG4gIHJldHVybiBbdGVzdCwgY29udmVydGVkXTtcbn1cbiIsICJpbXBvcnQgeyBjcmVhdGVDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVWYWx1ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcblxuZXhwb3J0IHR5cGUgRW5hYmxlQ29udGV4dFR5cGUgPSAoZmVhdHVyZTogc3RyaW5nKSA9PiBGZWF0dXJlVmFsdWU7XG5cbi8qKlxuICogQ29udGFpbmVkIGZ1bmN0aW9uIGNhbiBjaGVjayB3aGV0aGVyIGEgZ2l2ZW4gZmVhdHVyZSBpcyBlbmFibGVkLlxuICovXG5leHBvcnQgY29uc3QgRW5hYmxlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8RW5hYmxlQ29udGV4dFR5cGU+KChfcykgPT4gZmFsc2UpO1xuIiwgImltcG9ydCB7IHVzZVRlc3RBbmRDb252ZXJ0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogcmV0dXJucyB0cnVlIGlmZiBhbGwgc3BlY2lmaWVkIGZlYXR1cmVzIGFyZSBkaXNhYmxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlQWxsRGlzYWJsZWQod2l0aG91dEFsbDogc3RyaW5nW10gfCBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgW3Rlc3QsIHF1ZXJ5QWxsV2l0aG91dF0gPSB1c2VUZXN0QW5kQ29udmVydCh3aXRob3V0QWxsKTtcbiAgcmV0dXJuIChcbiAgICB3aXRob3V0QWxsLmxlbmd0aCA+IDAgJiYgcXVlcnlBbGxXaXRob3V0LmV2ZXJ5KCh4KSA9PiAhKHRlc3QoeCkgPz8gZmFsc2UpKVxuICApO1xufVxuIiwgImltcG9ydCB7IHVzZVRlc3RBbmRDb252ZXJ0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogcmV0dXJucyB0cnVlIGlmZiBhbnkgc3BlY2lmaWVkIGZlYXR1cmUgaXMgZGlzYWJsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZURpc2FibGVkKHdpdGhvdXQ6IHN0cmluZ1tdIHwgc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IFt0ZXN0LCBxdWVyeUFueVdpdGhvdXRdID0gdXNlVGVzdEFuZENvbnZlcnQod2l0aG91dCk7XG4gIHJldHVybiBxdWVyeUFueVdpdGhvdXQuc29tZSgoeCkgPT4gISh0ZXN0KHgpID8/IGZhbHNlKSk7XG59XG4iLCAiLy8gYmlvbWUtaWdub3JlIGxpbnQvc3R5bGUvdXNlSW1wb3J0VHlwZTogSlNYIHJlcXVpcmVzIFJlYWN0IGF0IHJ1bnRpbWVcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgdXNlQWxsRW5hYmxlZCB9IGZyb20gJy4vdXNlQWxsRW5hYmxlZCc7XG5pbXBvcnQgeyB1c2VFbmFibGVkIH0gZnJvbSAnLi91c2VFbmFibGVkJztcblxuZXhwb3J0IGludGVyZmFjZSBFbmFibGVQcm9wcyB7XG4gIHJlYWRvbmx5IGZlYXR1cmU/OiBzdHJpbmdbXSB8IHN0cmluZztcbiAgcmVhZG9ubHkgYWxsRmVhdHVyZXM/OiBzdHJpbmdbXTtcbiAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZTtcbn1cblxuLyoqXG4gKiBGZWF0dXJlIHdpbGwgYmUgZW5hYmxlZCBpZiBhbnkgZmVhdHVyZSBpbiB0aGUgbGlzdCBhcmUgZW5hYmxlZCxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEVuYWJsZSh7XG4gIGZlYXR1cmUgPSBbXSxcbiAgYWxsRmVhdHVyZXMgPSBbXSxcbiAgY2hpbGRyZW4sXG59OiBFbmFibGVQcm9wcyk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IGlzQW55ID0gdXNlRW5hYmxlZChmZWF0dXJlKTtcbiAgY29uc3QgaXNBbGwgPSB1c2VBbGxFbmFibGVkKGFsbEZlYXR1cmVzKTtcblxuICBpZiAoaXNBbnkgfHwgaXNBbGwpIHtcbiAgICByZXR1cm4gPD57Y2hpbGRyZW59PC8+O1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCAiaW1wb3J0IHsgdXNlVGVzdEFuZENvbnZlcnQgfSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiByZXR1cm5zIHRydWUgaWZmIGFsbCBzcGVjaWZpZWQgZmVhdHVyZXMgYXJlIGVuYWJsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFsbEVuYWJsZWQoYWxsRmVhdHVyZXM6IHN0cmluZ1tdIHwgc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IFt0ZXN0LCBxdWVyeUFsbFByZXNlbnRdID0gdXNlVGVzdEFuZENvbnZlcnQoYWxsRmVhdHVyZXMpO1xuICByZXR1cm4gcXVlcnlBbGxQcmVzZW50Lmxlbmd0aCA+IDAgJiYgcXVlcnlBbGxQcmVzZW50LmV2ZXJ5KHRlc3QpO1xufVxuIiwgImltcG9ydCB7IHVzZVRlc3RBbmRDb252ZXJ0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogcmV0dXJucyB0cnVlIGlmZiBhbnkgc3BlY2lmaWVkIGZlYXR1cmUgaXMgZW5hYmxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlRW5hYmxlZChmZWF0dXJlOiBzdHJpbmdbXSB8IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBbdGVzdCwgcXVlcnlBbnlQcmVzZW50XSA9IHVzZVRlc3RBbmRDb252ZXJ0KGZlYXR1cmUpO1xuICByZXR1cm4gcXVlcnlBbnlQcmVzZW50LnNvbWUodGVzdCk7XG59XG4iLCAiaW1wb3J0IFJlYWN0LCB7XG4gIHR5cGUgUmVhY3ROb2RlLFxuICB1c2VFZmZlY3QsXG4gIHVzZU1lbW8sXG4gIHVzZVJlZHVjZXIsXG4gIHVzZVJlZixcbn0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBFbmFibGVDb250ZXh0IH0gZnJvbSAnLi9FbmFibGVDb250ZXh0JztcbmltcG9ydCB7IEZlYXR1cmVDb250ZXh0IH0gZnJvbSAnLi9GZWF0dXJlQ29udGV4dCc7XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVEZXNjcmlwdGlvbiB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcbmltcG9ydCB7IGZlYXR1cmVzUmVkdWNlciwgaW5pdGlhbEZlYXR1cmVzU3RhdGUgfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuaW1wb3J0IHVzZUNvbnNvbGVPdmVycmlkZSBmcm9tICcuL3VzZUNvbnNvbGVPdmVycmlkZSc7XG5pbXBvcnQgdXNlUGVyc2lzdCwgeyBLRVkgfSBmcm9tICcuL3VzZVBlcnNpc3QnO1xuaW1wb3J0IHVzZVRlc3RDYWxsYmFjayBmcm9tICcuL3VzZVRlc3RDYWxsYmFjayc7XG5cbmludGVyZmFjZSBGZWF0dXJlUHJvcHMge1xuICByZWFkb25seSBmZWF0dXJlczogcmVhZG9ubHkgRmVhdHVyZURlc2NyaXB0aW9uW107XG4gIHJlYWRvbmx5IGNoaWxkcmVuPzogUmVhY3ROb2RlO1xuICByZWFkb25seSBkaXNhYmxlQ29uc29sZT86IGJvb2xlYW47XG4gIHJlYWRvbmx5IHN0b3JhZ2U/OiBTdG9yYWdlO1xufVxuXG4vKipcbiAqIEEgbW9yZSBiYXR0ZXJpZXMtZW5hYmxlZCBwYXJlbnQgY29tcG9uZW50IHRoYXQga2VlcHMgdHJhY2sgb2YgZmVhdHVyZSBzdGF0ZVxuICogaW50ZXJuYWxseSwgYW5kIGNyZWF0ZXMgd2luZG93LmZlYXR1cmUuZW5hYmxlKFwiZlwiKSBhbmQgd2luZG93LmZlYXR1cmUuZGlzYWJsZShcImZcIikuXG4gKiBLZWVwcyB0cmFjayBvZiBvdmVycmlkZXMgYW5kIGRlZmF1bHRzLCB3aXRoIGRlZmF1bHRzIHBvdGVudGlhbGx5IGNvbWluZyBmcm9tIHlvdXIgcHJvcHNcbiAqIGFuZCBvdmVycmlkZXMgYmVpbmcgcGVyc2lzdGVkIHRvIHlvdXIgY2hvaWNlIG9mIHN0b3JhZ2UgbGF5ZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBGZWF0dXJlcyh7XG4gIGNoaWxkcmVuLFxuICBmZWF0dXJlcyxcbiAgZGlzYWJsZUNvbnNvbGUgPSBmYWxzZSxcbiAgc3RvcmFnZSA9IHdpbmRvdy5zZXNzaW9uU3RvcmFnZSxcbn06IEZlYXR1cmVQcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgLy8gQ2FwdHVyZSBvbmx5IGZpcnN0IHZhbHVlOyB3ZSBkb24ndCBjYXJlIGFib3V0IGZ1dHVyZSB1cGRhdGVzXG4gIGNvbnN0IGZlYXR1cmVzUmVmID0gdXNlUmVmKGZlYXR1cmVzKTtcbiAgY29uc3QgW292ZXJyaWRlc1N0YXRlLCBvdmVycmlkZXNEaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKFxuICAgIGZlYXR1cmVzUmVkdWNlcixcbiAgICBpbml0aWFsRmVhdHVyZXNTdGF0ZSxcbiAgKTtcbiAgY29uc3QgW2RlZmF1bHRzU3RhdGUsIGRlZmF1bHRzRGlzcGF0Y2hdID0gdXNlUmVkdWNlcihcbiAgICBmZWF0dXJlc1JlZHVjZXIsXG4gICAgaW5pdGlhbEZlYXR1cmVzU3RhdGUsXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLy8gTG9hZCBkZWZhdWx0c1xuICAgIGRlZmF1bHRzRGlzcGF0Y2goeyB0eXBlOiAnSU5JVCcsIGZlYXR1cmVzIH0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkZWZhdWx0c0Rpc3BhdGNoKHsgdHlwZTogJ0RFX0lOSVQnIH0pO1xuICAgIH07XG4gIH0sIFtmZWF0dXJlc10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGY6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4gfCB1bmRlZmluZWQ+ID0ge307XG4gICAgaWYgKHN0b3JhZ2UgIT0gbnVsbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZmVhdHVyZXNKc29uID0gc3RvcmFnZS5nZXRJdGVtKEtFWSk7XG4gICAgICAgIGlmIChmZWF0dXJlc0pzb24gIT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IGZoID0gSlNPTi5wYXJzZShmZWF0dXJlc0pzb24pO1xuICAgICAgICAgIGYgPSBmaC5vdmVycmlkZXM7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gQ2FuJ3QgcGFyc2Ugb3IgZ2V0IG9yIG90aGVyd2lzZTsgaWdub3JlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yIGluIGxvY2FsU3RvcmFnZScsIGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG92ZXJyaWRlc0Rpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICdJTklUJyxcbiAgICAgIGZlYXR1cmVzOiBmZWF0dXJlc1JlZi5jdXJyZW50XG4gICAgICAgIC5maWx0ZXIoKHgpID0+IHgubm9PdmVycmlkZSAhPT0gdHJ1ZSlcbiAgICAgICAgLm1hcCgoeCkgPT4gKHtcbiAgICAgICAgICBuYW1lOiB4Lm5hbWUsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHguZGVzY3JpcHRpb24sXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiBmPy5beC5uYW1lXSA/PyB1bmRlZmluZWQsXG4gICAgICAgIH0pKSxcbiAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBvdmVycmlkZXNEaXNwYXRjaCh7IHR5cGU6ICdERV9JTklUJyB9KTtcbiAgICB9O1xuICB9LCBbc3RvcmFnZV0pO1xuXG4gIC8vIEhhbmRsZSBhc3luYyBvcGVyYXRpb25zIGZvciBmZWF0dXJlcyB3aXRoIG9uQ2hhbmdlRGVmYXVsdFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChkZWZhdWx0c1N0YXRlLnZhbHVlICE9PSAncmVhZHknKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGZlYXR1cmVzIGluIGFzeW5jIHN0YXRlcyBhbmQgaGFuZGxlIHRoZW1cbiAgICBPYmplY3QuZW50cmllcyhkZWZhdWx0c1N0YXRlLmNvbnRleHQuZmVhdHVyZXMpLmZvckVhY2goXG4gICAgICAoW25hbWUsIGZlYXR1cmVdKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBmZWF0dXJlLnZhbHVlID09PSAnYXN5bmNFbmFibGVkJyB8fFxuICAgICAgICAgIGZlYXR1cmUudmFsdWUgPT09ICdhc3luY0Rpc2FibGVkJyB8fFxuICAgICAgICAgIGZlYXR1cmUudmFsdWUgPT09ICdhc3luY1Vuc3BlY2lmaWVkJ1xuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdCB0YXJnZXRWYWx1ZSA9XG4gICAgICAgICAgICBmZWF0dXJlLnZhbHVlID09PSAnYXN5bmNFbmFibGVkJ1xuICAgICAgICAgICAgICA/IHRydWVcbiAgICAgICAgICAgICAgOiBmZWF0dXJlLnZhbHVlID09PSAnYXN5bmNEaXNhYmxlZCdcbiAgICAgICAgICAgICAgICA/IGZhbHNlXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBjb25zdCBvbkNoYW5nZURlZmF1bHQgPSBmZWF0dXJlLmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQ7XG4gICAgICAgICAgaWYgKG9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsICYmIGZlYXR1cmUuZmVhdHVyZURlc2MgIT0gbnVsbCkge1xuICAgICAgICAgICAgb25DaGFuZ2VEZWZhdWx0KGZlYXR1cmUuZmVhdHVyZURlc2MubmFtZSwgdGFyZ2V0VmFsdWUpXG4gICAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0c0Rpc3BhdGNoKHsgdHlwZTogJ0FTWU5DX0RPTkUnLCBuYW1lLCB2YWx1ZTogcmVzdWx0IH0pO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzRGlzcGF0Y2goe1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ0FTWU5DX0RPTkUnLFxuICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICApO1xuICB9LCBbZGVmYXVsdHNTdGF0ZV0pO1xuXG4gIHVzZVBlcnNpc3Qoc3RvcmFnZSwgZmVhdHVyZXNSZWYuY3VycmVudCwgb3ZlcnJpZGVzU3RhdGUpO1xuXG4gIGNvbnN0IHRlc3RDYWxsYmFjayA9IHVzZVRlc3RDYWxsYmFjayhvdmVycmlkZXNTdGF0ZSwgZGVmYXVsdHNTdGF0ZSk7XG4gIHVzZUNvbnNvbGVPdmVycmlkZShcbiAgICAhZGlzYWJsZUNvbnNvbGUsXG4gICAgZmVhdHVyZXNSZWYuY3VycmVudCxcbiAgICB0ZXN0Q2FsbGJhY2ssXG4gICAgZGVmYXVsdHNEaXNwYXRjaCxcbiAgKTtcblxuICBjb25zdCBmZWF0dXJlVmFsdWUgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBvdmVycmlkZXNTZW5kOiBvdmVycmlkZXNEaXNwYXRjaCxcbiAgICAgIGRlZmF1bHRzU2VuZDogZGVmYXVsdHNEaXNwYXRjaCxcbiAgICAgIGZlYXR1cmVzRGVzY3JpcHRpb246IGZlYXR1cmVzUmVmLmN1cnJlbnQsXG4gICAgICBvdmVycmlkZXNTdGF0ZSxcbiAgICAgIGRlZmF1bHRzU3RhdGUsXG4gICAgICB0ZXN0OiB0ZXN0Q2FsbGJhY2ssXG4gICAgfSksXG4gICAgW292ZXJyaWRlc1N0YXRlLCBkZWZhdWx0c1N0YXRlLCB0ZXN0Q2FsbGJhY2tdLFxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPEZlYXR1cmVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtmZWF0dXJlVmFsdWV9PlxuICAgICAgPEVuYWJsZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3Rlc3RDYWxsYmFja30+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvRW5hYmxlQ29udGV4dC5Qcm92aWRlcj5cbiAgICA8L0ZlYXR1cmVDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufVxuIiwgImltcG9ydCB7IGNyZWF0ZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVEZXNjcmlwdGlvbiwgRmVhdHVyZVZhbHVlIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlc0Rpc3BhdGNoLCBGZWF0dXJlc1N0YXRlIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcblxuZXhwb3J0IGNvbnN0IEZlYXR1cmVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxGZWF0dXJlQ29udGV4dFR5cGUgfCBudWxsPihudWxsKTtcblxuLy8vIEdpdmUgYWNjZXNzIHRvIHRoZSBvdmVycmlkZXMgbGF5ZXJcbmV4cG9ydCBpbnRlcmZhY2UgRmVhdHVyZUNvbnRleHRUeXBlIHtcbiAgLy8gTWFrZSBjaGFuZ2VzIHRvIHRoZSBvdmVycmlkZXNcbiAgb3ZlcnJpZGVzU2VuZDogRmVhdHVyZXNEaXNwYXRjaDtcblxuICAvLyBNYWtlIGNoYW5nZXMgdG8gZGVmYXVsdHNcbiAgZGVmYXVsdHNTZW5kOiBGZWF0dXJlc0Rpc3BhdGNoO1xuXG4gIGZlYXR1cmVzRGVzY3JpcHRpb246IHJlYWRvbmx5IEZlYXR1cmVEZXNjcmlwdGlvbltdO1xuXG4gIC8vIFN0YXRlIGlzIGluIGxheWVyczsgb3ZlcnJpZGVzIGFuZCBkZWZhdWx0c1xuICBvdmVycmlkZXNTdGF0ZTogRmVhdHVyZXNTdGF0ZTtcbiAgZGVmYXVsdHNTdGF0ZTogRmVhdHVyZXNTdGF0ZTtcblxuICAvLy8gVGVzdCB3aXRoIHByb3BlciBmYWxsYmFjayBhbmQgcmVzcGVjdGluZyB0aGUgdXNlcidzIGZvcmNlIHByZWZlcmVuY2VcbiAgdGVzdDogKGZsYWc6IHN0cmluZykgPT4gRmVhdHVyZVZhbHVlO1xufVxuIiwgImltcG9ydCB0eXBlIHsgRGlzcGF0Y2ggfSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogRmVhdHVyZSBpcyBlaXRoZXIgb24sIG9mZiwgb3IgJ3Vuc2V0JyxcbiAqIHdoaWNoIG1lYW5zIGl0IHdpbGwgZ28gdG8gdGhlIGRlZmF1bHQgdmFsdWUgb3IgdGhlIGxlc3Mgc3BlY2lmaWMgdmFsdWUuXG4gKi9cbmV4cG9ydCB0eXBlIEZlYXR1cmVWYWx1ZSA9IGZhbHNlIHwgdHJ1ZSB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgRmVhdHVyZVN0YXRlVmFsdWUgPVxuICB8ICdpbml0aWFsJ1xuICB8ICdlbmFibGVkJ1xuICB8ICdkaXNhYmxlZCdcbiAgfCAndW5zcGVjaWZpZWQnXG4gIHwgJ2FzeW5jRW5hYmxlZCdcbiAgfCAnYXN5bmNEaXNhYmxlZCdcbiAgfCAnYXN5bmNVbnNwZWNpZmllZCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmVhdHVyZVN0YXRlIHtcbiAgdmFsdWU6IEZlYXR1cmVTdGF0ZVZhbHVlO1xuICBmZWF0dXJlRGVzYz86IEZlYXR1cmVEZXNjcmlwdGlvbjtcbn1cblxuZXhwb3J0IHR5cGUgRmVhdHVyZURpc3BhdGNoID0gRGlzcGF0Y2g8RmVhdHVyZUFjdGlvbj47XG5cbi8vLyBHaXZlbiBhIGZlYXR1cmVzdGF0ZSwgZGV0ZXJtaW5lIHRoZSB2YWx1ZSAob24sIG9mZiwgb3IgdW5zZXQpXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVGb3JTdGF0ZShcbiAgZmVhdHVyZVN0YXRlOiBGZWF0dXJlU3RhdGUsXG4pOiBbRmVhdHVyZVZhbHVlLCBib29sZWFuXSB7XG4gIHJldHVybiBbXG4gICAgZmVhdHVyZVN0YXRlLnZhbHVlID09PSAnZW5hYmxlZCcgfHwgZmVhdHVyZVN0YXRlLnZhbHVlID09PSAnYXN5bmNFbmFibGVkJ1xuICAgICAgPyB0cnVlXG4gICAgICA6IGZlYXR1cmVTdGF0ZS52YWx1ZSA9PT0gJ2Rpc2FibGVkJyB8fFxuICAgICAgICAgIGZlYXR1cmVTdGF0ZS52YWx1ZSA9PT0gJ2FzeW5jRGlzYWJsZWQnXG4gICAgICAgID8gZmFsc2VcbiAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgZmVhdHVyZVN0YXRlLmZlYXR1cmVEZXNjPy5mb3JjZSA/PyBmYWxzZSxcbiAgXTtcbn1cblxuLyoqXG4gKiBEZWZpbml0aW9uIG9mIGEgZmVhdHVyZSB0aGF0IGNhbiBiZSBlbmFibGVkIG9yIGRpc2FibGVkLlxuICogSyBpcyB0aGUgdHlwZSBvZiB0aGUga2V5IHRoYXQgaXMgdXNlZCB0byBpZGVudGlmeSB0aGUgZmVhdHVyZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGZWF0dXJlRGVzY3JpcHRpb248SyBleHRlbmRzIHN0cmluZyA9IHN0cmluZz4ge1xuICByZWFkb25seSBuYW1lOiBLO1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvLy8gSWYgc2V0LCB3aWxsIGJlIHVzZWQgdG8gdXBkYXRlIHRoZSBmZWF0dXJlIGRlZmF1bHQgc3RhdGUgaW5zdGVhZCBvZiBzaW1wbHkgb3ZlcnJpZGluZy5cbiAgLy8vIEZvciBleGFtcGxlLCB5b3UgbWlnaHQgdXNlIHRoaXMgdG8gdXBkYXRlIGEgZmVhdHVyZSBmbGFnIG9uIGEgYmFja2VuZCBzZXJ2ZXIuXG4gIC8vLyB3aGVuIHNldCwgdGhlIGZlYXR1cmUgd2lsbCBiZSB1cGRhdGVkIG9uIHRoZSBiYWNrZW5kIHNlcnZlciwgYW5kIHRoZSByZXN1bHQgb2YgdGhlIGFzeW5jXG4gIC8vLyB3aWxsIGJlIHVzZWQgZm9yIHRoZSBmaW5hbCBzdGF0ZSBhZnRlciB0aGUgY2hhbmdlLiB3aGlsZSBjaGFuZ2luZywgdGhlIGZlYXR1cmUgd2lsbCBiZVxuICAvLy8gaW4gdGhlICdjaGFuZ2luZycgc3RhdGUuIEFsc28gbm90ZSB0aGF0IHRoZSBmZWF0dXJlIHdpbGwgYmUgY2hhbmdlZCBhdCB0aGUgXCJkZWZhdWx0XCIgbGF5ZXIuXG4gIHJlYWRvbmx5IG9uQ2hhbmdlRGVmYXVsdD86IChcbiAgICBuYW1lOiBLLFxuICAgIG5ld1ZhbHVlOiBGZWF0dXJlVmFsdWUsXG4gICkgPT4gUHJvbWlzZTxGZWF0dXJlVmFsdWU+O1xuXG4gIC8vLyBpZiBzZXQgdHJ1ZSwgd2lsbCBmb3JjZSB0aGUgZmllbGQgdG8gd2hhdCBpdCBpcyBzZXQgaGVyZSB0aHJvdWdoIGxheWVycyBvZiBzdGF0ZXMuXG4gIC8vLyB1c2VmdWwgdG8gaW52ZXJ0IHRoZSBsYXllcnMsIHNpbWlsYXIgdG8gIWltcG9ydGFudCBpbiBDU1MuXG4gIHJlYWRvbmx5IGZvcmNlPzogYm9vbGVhbjtcblxuICAvLy8gSWYgc2V0IHRvIHRydWUsIHRoZSBmZWF0dXJlIHdpbGwgbm90IGJlIG92ZXJyaWRhYmxlIGJ5IHRoZSB1c2VyLlxuICByZWFkb25seSBub092ZXJyaWRlPzogYm9vbGVhbjtcblxuICAvLy8gY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB3aGF0IHNob3VsZCBoYXBwZW4gaWYgdGhlIGZlYXR1cmUgaXMgbm90IHNldCB0byBhIHBhcnRpY3VsYXIgdmFsdWUuXG4gIHJlYWRvbmx5IGRlZmF1bHRWYWx1ZT86IEZlYXR1cmVWYWx1ZTtcbn1cblxuLyoqXG4gKiBBY3Rpb25zIHRoYXQgY2FuIGJlIHBlcmZvcm1lZCBvbiBhIGZlYXR1cmUuXG4gKi9cbmV4cG9ydCB0eXBlIEZlYXR1cmVBY3Rpb24gPVxuICB8IHsgdHlwZTogJ0RJU0FCTEUnIH1cbiAgfCB7IHR5cGU6ICdFTkFCTEUnIH1cbiAgfCB7IHR5cGU6ICdJTklUJzsgZmVhdHVyZTogRmVhdHVyZURlc2NyaXB0aW9uIH1cbiAgfCB7IHR5cGU6ICdTRVQnOyB2YWx1ZTogRmVhdHVyZVZhbHVlIH1cbiAgfCB7IHR5cGU6ICdUT0dHTEUnIH1cbiAgfCB7IHR5cGU6ICdVTlNFVCcgfVxuICB8IHsgdHlwZTogJ0FTWU5DX0RPTkUnOyB2YWx1ZTogRmVhdHVyZVZhbHVlIH07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsRmVhdHVyZVN0YXRlOiBGZWF0dXJlU3RhdGUgPSB7XG4gIHZhbHVlOiAnaW5pdGlhbCcsXG59O1xuXG4vKipcbiAqIFJlZHVjZXIgZm9yIG1hbmFnaW5nIGluZGl2aWR1YWwgZmVhdHVyZSBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmVhdHVyZVJlZHVjZXIoXG4gIHN0YXRlOiBGZWF0dXJlU3RhdGUsXG4gIGFjdGlvbjogRmVhdHVyZUFjdGlvbixcbik6IEZlYXR1cmVTdGF0ZSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlICdJTklUJzoge1xuICAgICAgY29uc3QgeyBmZWF0dXJlIH0gPSBhY3Rpb247XG4gICAgICBjb25zdCB2YWx1ZSA9XG4gICAgICAgIGZlYXR1cmUuZGVmYXVsdFZhbHVlID09PSB0cnVlXG4gICAgICAgICAgPyAnZW5hYmxlZCdcbiAgICAgICAgICA6IGZlYXR1cmUuZGVmYXVsdFZhbHVlID09PSBmYWxzZVxuICAgICAgICAgICAgPyAnZGlzYWJsZWQnXG4gICAgICAgICAgICA6ICd1bnNwZWNpZmllZCc7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUgYXMgRmVhdHVyZVN0YXRlVmFsdWUsXG4gICAgICAgIGZlYXR1cmVEZXNjOiBmZWF0dXJlLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjYXNlICdFTkFCTEUnOiB7XG4gICAgICBpZiAoc3RhdGUuZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB2YWx1ZTogJ2FzeW5jRW5hYmxlZCcgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB2YWx1ZTogJ2VuYWJsZWQnIH07XG4gICAgfVxuXG4gICAgY2FzZSAnRElTQUJMRSc6IHtcbiAgICAgIGlmIChzdGF0ZS5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnYXN5bmNEaXNhYmxlZCcgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB2YWx1ZTogJ2Rpc2FibGVkJyB9O1xuICAgIH1cblxuICAgIGNhc2UgJ1RPR0dMRSc6IHtcbiAgICAgIGlmIChzdGF0ZS5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnYXN5bmNFbmFibGVkJyB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnZW5hYmxlZCcgfTtcbiAgICB9XG5cbiAgICBjYXNlICdVTlNFVCc6IHtcbiAgICAgIGlmIChzdGF0ZS5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnYXN5bmNVbnNwZWNpZmllZCcgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB2YWx1ZTogJ3Vuc3BlY2lmaWVkJyB9O1xuICAgIH1cblxuICAgIGNhc2UgJ1NFVCc6IHtcbiAgICAgIGNvbnN0IHsgdmFsdWUgfSA9IGFjdGlvbjtcbiAgICAgIGlmIChzdGF0ZS5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnYXN5bmNFbmFibGVkJyB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsdWU6ICdhc3luY0Rpc2FibGVkJyB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB2YWx1ZTogJ2FzeW5jVW5zcGVjaWZpZWQnIH07XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnZW5hYmxlZCcgfTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnZGlzYWJsZWQnIH07XG4gICAgICB9XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsdWU6ICd1bnNwZWNpZmllZCcgfTtcbiAgICB9XG5cbiAgICBjYXNlICdBU1lOQ19ET05FJzoge1xuICAgICAgY29uc3QgeyB2YWx1ZSB9ID0gYWN0aW9uO1xuICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB2YWx1ZTogJ2VuYWJsZWQnIH07XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB2YWx1ZTogJ2Rpc2FibGVkJyB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAndW5zcGVjaWZpZWQnIH07XG4gICAgfVxuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIiwgImltcG9ydCB0eXBlIHsgRGlzcGF0Y2ggfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7XG4gIHR5cGUgRmVhdHVyZURlc2NyaXB0aW9uLFxuICB0eXBlIEZlYXR1cmVTdGF0ZSxcbiAgdHlwZSBGZWF0dXJlVmFsdWUsXG4gIHZhbHVlRm9yU3RhdGUsXG59IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcblxuZXhwb3J0IGludGVyZmFjZSBGZWF0dXJlc0NvbnRleHQge1xuICAvLyBmZWF0dXJlcyBhcmUgbGF5ZXJlZDpcbiAgLy8gIC0gZGVmYXVsdHM6IGlmIG5vdGhpbmcgZWxzZSBtYXRjaGVzLCBwcm92aWRlZCBhIHZhbHVlIGZvciBmZWF0dXJlXG4gIC8vICAtIGJyb3dzZXI6IGJyb3dzZXItbG9jYWwgdmFsdWVzIGZvciBmZWF0dXJlcyAoa2VwdCBpbiBsb2NhbCBzdG9yYWdlLCBldGMpXG4gIC8vICAtIHVzZXI6IHZhbHVlcyBmcm9tIHRoZSB1c2VyJ3MgcHJvZmlsZSwgaWYgYW55XG4gIC8vICAtIG9yZzogdmFsdWUgZnJvbSB0aGUgb3JnJ3MgcHJvZmlsZSwgaWYgYW55XG4gIGZlYXR1cmVzOiB7IFt4OiBzdHJpbmddOiBGZWF0dXJlU3RhdGUgfTtcbn1cblxuZXhwb3J0IHR5cGUgRmVhdHVyZXNBY3Rpb24gPVxuICB8IHsgdHlwZTogJ0RFX0lOSVQnIH1cbiAgfCB7IHR5cGU6ICdESVNBQkxFJzsgbmFtZTogc3RyaW5nIH1cbiAgfCB7IHR5cGU6ICdFTkFCTEUnOyBuYW1lOiBzdHJpbmcgfVxuICB8IHsgdHlwZTogJ0lOSVQnOyBmZWF0dXJlczogcmVhZG9ubHkgRmVhdHVyZURlc2NyaXB0aW9uW10gfVxuICB8IHsgdHlwZTogJ1NFVF9BTEwnOyBmZWF0dXJlczogeyBba2V5OiBzdHJpbmddOiBGZWF0dXJlVmFsdWUgfSB9XG4gIHwgeyB0eXBlOiAnU0VUJzsgbmFtZTogc3RyaW5nOyB2YWx1ZTogRmVhdHVyZVZhbHVlIH1cbiAgfCB7IHR5cGU6ICdUT0dHTEUnOyBuYW1lOiBzdHJpbmcgfVxuICB8IHsgdHlwZTogJ1VOU0VUJzsgbmFtZTogc3RyaW5nIH1cbiAgfCB7IHR5cGU6ICdBU1lOQ19ET05FJzsgbmFtZTogc3RyaW5nOyB2YWx1ZTogRmVhdHVyZVZhbHVlIH07XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmVhdHVyZXNTdGF0ZSB7XG4gIHZhbHVlOiAnaWRsZScgfCAncmVhZHknO1xuICBjb250ZXh0OiBGZWF0dXJlc0NvbnRleHQ7XG59XG5cbmV4cG9ydCB0eXBlIEZlYXR1cmVzRGlzcGF0Y2ggPSBEaXNwYXRjaDxGZWF0dXJlc0FjdGlvbj47XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZU9mRmVhdHVyZShcbiAgZmVhdHVyZXNTdGF0ZTogRmVhdHVyZXNTdGF0ZSxcbiAgZmVhdHVyZTogc3RyaW5nLFxuKTogW0ZlYXR1cmVWYWx1ZSwgYm9vbGVhbl0ge1xuICBpZiAoZmVhdHVyZXNTdGF0ZS5jb250ZXh0LmZlYXR1cmVzW2ZlYXR1cmVdID09IG51bGwpIHtcbiAgICByZXR1cm4gW3VuZGVmaW5lZCwgZmFsc2VdO1xuICB9XG4gIGNvbnN0IGZlYXR1cmVTdGF0ZSA9IGZlYXR1cmVzU3RhdGUuY29udGV4dC5mZWF0dXJlc1tmZWF0dXJlXTtcbiAgaWYgKGZlYXR1cmVTdGF0ZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlRm9yU3RhdGUoZmVhdHVyZVN0YXRlKTtcbiAgfVxuICByZXR1cm4gW3VuZGVmaW5lZCwgZmFsc2VdO1xufVxuXG5leHBvcnQgY29uc3QgaW5pdGlhbEZlYXR1cmVzU3RhdGU6IEZlYXR1cmVzU3RhdGUgPSB7XG4gIHZhbHVlOiAnaWRsZScsXG4gIGNvbnRleHQ6IHtcbiAgICBmZWF0dXJlczoge30sXG4gIH0sXG59O1xuXG4vKipcbiAqIFJlZHVjZXIgZm9yIG1hbmFnaW5nIGEgY29sbGVjdGlvbiBvZiBmZWF0dXJlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmVhdHVyZXNSZWR1Y2VyKFxuICBzdGF0ZTogRmVhdHVyZXNTdGF0ZSxcbiAgYWN0aW9uOiBGZWF0dXJlc0FjdGlvbixcbik6IEZlYXR1cmVzU3RhdGUge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSAnSU5JVCc6IHtcbiAgICAgIGlmIChhY3Rpb24uZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVhdHVyZXM6IHsgW3g6IHN0cmluZ106IEZlYXR1cmVTdGF0ZSB9ID0ge307XG4gICAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgYWN0aW9uLmZlYXR1cmVzKSB7XG4gICAgICAgIC8vIEluaXRpYWxpemUgZWFjaCBmZWF0dXJlXG4gICAgICAgIGNvbnN0IGZlYXR1cmVTdGF0ZSA9IHtcbiAgICAgICAgICB2YWx1ZTpcbiAgICAgICAgICAgIGZlYXR1cmUuZGVmYXVsdFZhbHVlID09PSB0cnVlXG4gICAgICAgICAgICAgID8gKCdlbmFibGVkJyBhcyBjb25zdClcbiAgICAgICAgICAgICAgOiBmZWF0dXJlLmRlZmF1bHRWYWx1ZSA9PT0gZmFsc2VcbiAgICAgICAgICAgICAgICA/ICgnZGlzYWJsZWQnIGFzIGNvbnN0KVxuICAgICAgICAgICAgICAgIDogKCd1bnNwZWNpZmllZCcgYXMgY29uc3QpLFxuICAgICAgICAgIGZlYXR1cmVEZXNjOiBmZWF0dXJlLFxuICAgICAgICB9O1xuICAgICAgICBmZWF0dXJlc1tmZWF0dXJlLm5hbWVdID0gZmVhdHVyZVN0YXRlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogJ3JlYWR5JyxcbiAgICAgICAgY29udGV4dDogeyBmZWF0dXJlcyB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjYXNlICdERV9JTklUJzoge1xuICAgICAgcmV0dXJuIGluaXRpYWxGZWF0dXJlc1N0YXRlO1xuICAgIH1cblxuICAgIGNhc2UgJ1NFVF9BTEwnOiB7XG4gICAgICBpZiAoc3RhdGUudmFsdWUgIT09ICdyZWFkeScpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlcyA9IHsgLi4uc3RhdGUuY29udGV4dC5mZWF0dXJlcyB9O1xuICAgICAgT2JqZWN0LmtleXMoZmVhdHVyZXMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhY3Rpb24uZmVhdHVyZXNbbmFtZV0gPz8gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBjdXJyZW50RmVhdHVyZSA9IGZlYXR1cmVzW25hbWVdO1xuXG4gICAgICAgIGlmIChjdXJyZW50RmVhdHVyZS5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGZlYXR1cmVzW25hbWVdID0geyAuLi5jdXJyZW50RmVhdHVyZSwgdmFsdWU6ICdhc3luY0VuYWJsZWQnIH07XG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGZlYXR1cmVzW25hbWVdID0geyAuLi5jdXJyZW50RmVhdHVyZSwgdmFsdWU6ICdhc3luY0Rpc2FibGVkJyB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmZWF0dXJlc1tuYW1lXSA9IHsgLi4uY3VycmVudEZlYXR1cmUsIHZhbHVlOiAnYXN5bmNVbnNwZWNpZmllZCcgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBmZWF0dXJlc1tuYW1lXSA9IHsgLi4uY3VycmVudEZlYXR1cmUsIHZhbHVlOiAnZW5hYmxlZCcgfTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZmVhdHVyZXNbbmFtZV0gPSB7IC4uLmN1cnJlbnRGZWF0dXJlLCB2YWx1ZTogJ2Rpc2FibGVkJyB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmZWF0dXJlc1tuYW1lXSA9IHsgLi4uY3VycmVudEZlYXR1cmUsIHZhbHVlOiAndW5zcGVjaWZpZWQnIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGNvbnRleHQ6IHsgZmVhdHVyZXMgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY2FzZSAnU0VUJzoge1xuICAgICAgaWYgKHN0YXRlLnZhbHVlICE9PSAncmVhZHknKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVhdHVyZSA9IHN0YXRlLmNvbnRleHQuZmVhdHVyZXNbYWN0aW9uLm5hbWVdO1xuICAgICAgaWYgKGZlYXR1cmUgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgdmFsdWUgfSA9IGFjdGlvbjtcbiAgICAgIGxldCBuZXdWYWx1ZTogRmVhdHVyZVN0YXRlWyd2YWx1ZSddO1xuXG4gICAgICBpZiAoZmVhdHVyZS5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSAnYXN5bmNFbmFibGVkJztcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9ICdhc3luY0Rpc2FibGVkJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9ICdhc3luY1Vuc3BlY2lmaWVkJztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSAnZW5hYmxlZCc7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSAnZGlzYWJsZWQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1ZhbHVlID0gJ3Vuc3BlY2lmaWVkJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgIGZlYXR1cmVzOiB7XG4gICAgICAgICAgICAuLi5zdGF0ZS5jb250ZXh0LmZlYXR1cmVzLFxuICAgICAgICAgICAgW2FjdGlvbi5uYW1lXTogeyAuLi5mZWF0dXJlLCB2YWx1ZTogbmV3VmFsdWUgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjYXNlICdUT0dHTEUnOiB7XG4gICAgICBpZiAoc3RhdGUudmFsdWUgIT09ICdyZWFkeScpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlID0gc3RhdGUuY29udGV4dC5mZWF0dXJlc1thY3Rpb24ubmFtZV07XG4gICAgICBpZiAoZmVhdHVyZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICBmZWF0dXJlLmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbFxuICAgICAgICAgID8gJ2FzeW5jRW5hYmxlZCdcbiAgICAgICAgICA6ICdlbmFibGVkJztcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICBmZWF0dXJlczoge1xuICAgICAgICAgICAgLi4uc3RhdGUuY29udGV4dC5mZWF0dXJlcyxcbiAgICAgICAgICAgIFthY3Rpb24ubmFtZV06IHsgLi4uZmVhdHVyZSwgdmFsdWU6IG5ld1ZhbHVlIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY2FzZSAnRU5BQkxFJzoge1xuICAgICAgaWYgKHN0YXRlLnZhbHVlICE9PSAncmVhZHknKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVhdHVyZSA9IHN0YXRlLmNvbnRleHQuZmVhdHVyZXNbYWN0aW9uLm5hbWVdO1xuICAgICAgaWYgKGZlYXR1cmUgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ld1ZhbHVlID1cbiAgICAgICAgZmVhdHVyZS5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGxcbiAgICAgICAgICA/ICdhc3luY0VuYWJsZWQnXG4gICAgICAgICAgOiAnZW5hYmxlZCc7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZXM6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlLmNvbnRleHQuZmVhdHVyZXMsXG4gICAgICAgICAgICBbYWN0aW9uLm5hbWVdOiB7IC4uLmZlYXR1cmUsIHZhbHVlOiBuZXdWYWx1ZSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNhc2UgJ0RJU0FCTEUnOiB7XG4gICAgICBpZiAoc3RhdGUudmFsdWUgIT09ICdyZWFkeScpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlID0gc3RhdGUuY29udGV4dC5mZWF0dXJlc1thY3Rpb24ubmFtZV07XG4gICAgICBpZiAoZmVhdHVyZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICBmZWF0dXJlLmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbFxuICAgICAgICAgID8gJ2FzeW5jRGlzYWJsZWQnXG4gICAgICAgICAgOiAnZGlzYWJsZWQnO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgIGZlYXR1cmVzOiB7XG4gICAgICAgICAgICAuLi5zdGF0ZS5jb250ZXh0LmZlYXR1cmVzLFxuICAgICAgICAgICAgW2FjdGlvbi5uYW1lXTogeyAuLi5mZWF0dXJlLCB2YWx1ZTogbmV3VmFsdWUgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjYXNlICdVTlNFVCc6IHtcbiAgICAgIGlmIChzdGF0ZS52YWx1ZSAhPT0gJ3JlYWR5Jykge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmUgPSBzdGF0ZS5jb250ZXh0LmZlYXR1cmVzW2FjdGlvbi5uYW1lXTtcbiAgICAgIGlmIChmZWF0dXJlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdWYWx1ZSA9XG4gICAgICAgIGZlYXR1cmUuZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsXG4gICAgICAgICAgPyAnYXN5bmNVbnNwZWNpZmllZCdcbiAgICAgICAgICA6ICd1bnNwZWNpZmllZCc7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZXM6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlLmNvbnRleHQuZmVhdHVyZXMsXG4gICAgICAgICAgICBbYWN0aW9uLm5hbWVdOiB7IC4uLmZlYXR1cmUsIHZhbHVlOiBuZXdWYWx1ZSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNhc2UgJ0FTWU5DX0RPTkUnOiB7XG4gICAgICBpZiAoc3RhdGUudmFsdWUgIT09ICdyZWFkeScpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlID0gc3RhdGUuY29udGV4dC5mZWF0dXJlc1thY3Rpb24ubmFtZV07XG4gICAgICBpZiAoZmVhdHVyZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyB2YWx1ZSB9ID0gYWN0aW9uO1xuICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICB2YWx1ZSA9PT0gdHJ1ZVxuICAgICAgICAgID8gJ2VuYWJsZWQnXG4gICAgICAgICAgOiB2YWx1ZSA9PT0gZmFsc2VcbiAgICAgICAgICAgID8gJ2Rpc2FibGVkJ1xuICAgICAgICAgICAgOiAndW5zcGVjaWZpZWQnO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgIGZlYXR1cmVzOiB7XG4gICAgICAgICAgICAuLi5zdGF0ZS5jb250ZXh0LmZlYXR1cmVzLFxuICAgICAgICAgICAgW2FjdGlvbi5uYW1lXTogeyAuLi5mZWF0dXJlLCB2YWx1ZTogbmV3VmFsdWUgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlRGVzY3JpcHRpb24sIEZlYXR1cmVWYWx1ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcbmltcG9ydCB0eXBlIHsgRmVhdHVyZXNEaXNwYXRjaCB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgeyBHbG9iYWxFbmFibGUgfSBmcm9tICcuL0dsb2JhbEVuYWJsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUNvbnNvbGVPdmVycmlkZShcbiAgY29uc29sZU92ZXJyaWRlOiBib29sZWFuLFxuICBmZWF0dXJlczogcmVhZG9ubHkgRmVhdHVyZURlc2NyaXB0aW9uW10sXG4gIHRlc3RGZWF0dXJlOiAoXzogc3RyaW5nKSA9PiBGZWF0dXJlVmFsdWUsXG4gIGRpc3BhdGNoOiBGZWF0dXJlc0Rpc3BhdGNoLFxuKTogdm9pZCB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFjb25zb2xlT3ZlcnJpZGUpIHtcbiAgICAgIC8vIENsZWFuIHVwIHdpbmRvdy5mZWF0dXJlIGltbWVkaWF0ZWx5IGlmIGNvbnNvbGVPdmVycmlkZSBpcyBkaXNhYmxlZFxuICAgICAgaWYgKHdpbmRvdy5mZWF0dXJlICE9IG51bGwpIHtcbiAgICAgICAgd2luZG93LmZlYXR1cmUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAod2luZG93LmZlYXR1cmUgIT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5mZWF0dXJlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICB3aW5kb3cuZmVhdHVyZSA9IG5ldyBHbG9iYWxFbmFibGUoZGlzcGF0Y2gsIHRlc3RGZWF0dXJlLCBmZWF0dXJlcyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmICh3aW5kb3cuZmVhdHVyZSAhPSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5mZWF0dXJlID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH07XG4gIH0sIFtmZWF0dXJlcywgZGlzcGF0Y2gsIGNvbnNvbGVPdmVycmlkZSwgdGVzdEZlYXR1cmVdKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEZlYXR1cmVEZXNjcmlwdGlvbiwgRmVhdHVyZVZhbHVlIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlc0Rpc3BhdGNoIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcblxuZXhwb3J0IGNsYXNzIEdsb2JhbEVuYWJsZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZmVhdHVyZURlc2M6IHJlYWRvbmx5IEZlYXR1cmVEZXNjcmlwdGlvbltdO1xuICBwcml2YXRlIHJlYWRvbmx5IGRpc3BhdGNoOiBGZWF0dXJlc0Rpc3BhdGNoO1xuICBwcml2YXRlIHJlYWRvbmx5IHRlc3RGZWF0dXJlOiAodmFsdWU6IHN0cmluZykgPT4gRmVhdHVyZVZhbHVlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGRpc3BhdGNoOiBGZWF0dXJlc0Rpc3BhdGNoLFxuICAgIHRlc3RGZWF0dXJlOiAoXzogc3RyaW5nKSA9PiBGZWF0dXJlVmFsdWUsXG4gICAgZmVhdHVyZURlc2M6IHJlYWRvbmx5IEZlYXR1cmVEZXNjcmlwdGlvbltdLFxuICApIHtcbiAgICB0aGlzLmZlYXR1cmVEZXNjID0gZmVhdHVyZURlc2M7XG4gICAgdGhpcy5kaXNwYXRjaCA9IGRpc3BhdGNoO1xuICAgIHRoaXMudGVzdEZlYXR1cmUgPSB0ZXN0RmVhdHVyZTtcbiAgfVxuXG4gIHB1YmxpYyB0b2dnbGUoZmVhdHVyZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaCh7IHR5cGU6ICdUT0dHTEUnLCBuYW1lOiBmZWF0dXJlIH0pO1xuICB9XG5cbiAgcHVibGljIGVuYWJsZShmZWF0dXJlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoKHsgdHlwZTogJ0VOQUJMRScsIG5hbWU6IGZlYXR1cmUgfSk7XG4gIH1cblxuICBwdWJsaWMgdW5zZXQoZmVhdHVyZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaCh7IHR5cGU6ICdVTlNFVCcsIG5hbWU6IGZlYXR1cmUgfSk7XG4gIH1cblxuICBwdWJsaWMgZGlzYWJsZShmZWF0dXJlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoKHsgdHlwZTogJ0RJU0FCTEUnLCBuYW1lOiBmZWF0dXJlIH0pO1xuICB9XG5cbiAgcHVibGljIHNldEFsbChmZWF0dXJlczogeyBba2V5OiBzdHJpbmddOiBGZWF0dXJlVmFsdWUgfSk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2goeyB0eXBlOiAnU0VUX0FMTCcsIGZlYXR1cmVzIH0pO1xuICB9XG5cbiAgcHVibGljIGxpc3RGZWF0dXJlcygpOiByZWFkb25seSBbc3RyaW5nLCBGZWF0dXJlVmFsdWVdW10ge1xuICAgIHJldHVybiB0aGlzLmZlYXR1cmVEZXNjLm1hcCgoZikgPT4gW2YubmFtZSwgdGhpcy50ZXN0RmVhdHVyZShmLm5hbWUpXSk7XG4gIH1cbn1cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgZmVhdHVyZT86IEdsb2JhbEVuYWJsZTtcbiAgfVxufVxuIiwgImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0eXBlIHsgRmVhdHVyZURlc2NyaXB0aW9uLCBGZWF0dXJlVmFsdWUgfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5pbXBvcnQgeyB0eXBlIEZlYXR1cmVzU3RhdGUsIHZhbHVlT2ZGZWF0dXJlIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcblxuZXhwb3J0IGNvbnN0IEtFWSA9ICdyZWFjdC1lbmFibGU6ZmVhdHVyZS12YWx1ZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VQZXJzaXN0KFxuICBzdG9yYWdlOiBTdG9yYWdlIHwgdW5kZWZpbmVkLFxuICBmZWF0dXJlczogcmVhZG9ubHkgRmVhdHVyZURlc2NyaXB0aW9uW10sXG4gIG92ZXJyaWRlU3RhdGU6IEZlYXR1cmVzU3RhdGUsXG4pOiB2b2lkIHtcbiAgY29uc3Qgb3ZlcnJpZGVzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgbmV3T3ZlcnJpZGVzOiB7IFtrZXk6IHN0cmluZ106IEZlYXR1cmVWYWx1ZSB9ID0ge307XG4gICAgaWYgKG92ZXJyaWRlU3RhdGUudmFsdWUgPT09ICdyZWFkeScpIHtcbiAgICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBmZWF0dXJlcykge1xuICAgICAgICBjb25zdCBbdmFsdWVdID0gdmFsdWVPZkZlYXR1cmUob3ZlcnJpZGVTdGF0ZSwgZmVhdHVyZS5uYW1lKTtcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICBuZXdPdmVycmlkZXNbZmVhdHVyZS5uYW1lXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdPdmVycmlkZXM7XG4gIH0sIFtmZWF0dXJlcywgb3ZlcnJpZGVTdGF0ZV0pO1xuXG4gIGNvbnN0IHN0clN0YXRlID1cbiAgICBPYmplY3Qua2V5cyhvdmVycmlkZXMpLmxlbmd0aCA9PT0gMCB8fCBzdG9yYWdlID09IG51bGxcbiAgICAgID8gJ3t9J1xuICAgICAgOiBKU09OLnN0cmluZ2lmeSh7IG92ZXJyaWRlcyB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoc3RvcmFnZSAhPSBudWxsICYmIG92ZXJyaWRlU3RhdGUudmFsdWUgPT09ICdyZWFkeScpIHtcbiAgICAgICAgc3RvcmFnZS5zZXRJdGVtKEtFWSwgc3RyU3RhdGUpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIENhbid0IHNldCBmb3Igc29tZSByZWFzb25cbiAgICB9XG4gIH0sIFtvdmVycmlkZVN0YXRlLCBzdG9yYWdlLCBzdHJTdGF0ZV0pO1xufVxuIiwgImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVzU3RhdGUgfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuaW1wb3J0IHRlc3RGZWF0dXJlIGZyb20gJy4vdGVzdEZlYXR1cmUnO1xuXG4vLy8gQSBjYWxsYmFjayB0aGF0IGNhbiBiZSBjYWxsZWQgdG8gdGVzdCBpZiBhIGZlYXR1cmUgaXMgZW5hYmxlZCBvciBkaXNhYmxlZFxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlVGVzdENhbGxiYWNrKFxuICBkZWZhdWx0c1N0YXRlOiBGZWF0dXJlc1N0YXRlLFxuICBvdmVycmlkZXNTdGF0ZTogRmVhdHVyZXNTdGF0ZSxcbik6IChmZWF0dXJlOiBzdHJpbmcpID0+IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICByZXR1cm4gdXNlQ2FsbGJhY2soXG4gICAgKGY6IHN0cmluZykgPT4gdGVzdEZlYXR1cmUoZiwgW2RlZmF1bHRzU3RhdGUsIG92ZXJyaWRlc1N0YXRlXSksXG4gICAgW2RlZmF1bHRzU3RhdGUsIG92ZXJyaWRlc1N0YXRlXSxcbiAgKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEZlYXR1cmVWYWx1ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcbmltcG9ydCB7IHR5cGUgRmVhdHVyZXNTdGF0ZSwgdmFsdWVPZkZlYXR1cmUgfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuXG4vKiogRGV0ZXJtaW5lIGlmIHRoZSBmZWF0dXJlIGlzIGVuYWJsZWQgaW4gb25lIG9mIHRoZSBzdGF0ZSBtYWNoaW5lcywgaW4gb3JkZXJcbiAqXG4gKiBAcGFyYW0gc3RhdGUgVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIG1hY2hpbmVcbiAqIEBwYXJhbSBmZWF0dXJlIFRoZSBmZWF0dXJlIHRvIGNoZWNrXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVzdEZlYXR1cmUoXG4gIGZlYXR1cmU6IHN0cmluZyxcbiAgc3RhdGVzOiBGZWF0dXJlc1N0YXRlW10sXG4pOiBGZWF0dXJlVmFsdWUge1xuICBjb25zdCB2YWx1ZXMgPSBzdGF0ZXMubWFwKChzdGF0ZSkgPT4gdmFsdWVPZkZlYXR1cmUoc3RhdGUsIGZlYXR1cmUpKTtcblxuICAvLyBsb29rIGZvciBiZXN0IGZvcmNlZCBvcHRpb24sIGluIG9yZGVyXG4gIGZvciAoY29uc3QgW2ZlYXR1cmVWYWx1ZSwgZmVhdHVyZUZvcmNlZF0gb2YgdmFsdWVzKSB7XG4gICAgaWYgKGZlYXR1cmVWYWx1ZSAhPSBudWxsICYmIGZlYXR1cmVGb3JjZWQpIHtcbiAgICAgIHJldHVybiBmZWF0dXJlVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLy8gbG9vayBmb3IgYmVzdCBub24tZm9yY2VkIG9wdGlvbiwgaW4gb3JkZXJcbiAgZm9yIChjb25zdCBbZmVhdHVyZVZhbHVlXSBvZiB2YWx1ZXMpIHtcbiAgICBpZiAoZmVhdHVyZVZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBmZWF0dXJlVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLy8gdW5zZXQgaWYgbm90aGluZyBoaXRcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiIsICJpbXBvcnQgeyBSYWRpb0dyb3VwIH0gZnJvbSAnQGhlYWRsZXNzdWkvcmVhY3QnO1xuaW1wb3J0IFJlYWN0LCB7XG4gIHR5cGUgUmVhY3ROb2RlLFxuICB1c2VDYWxsYmFjayxcbiAgdXNlQ29udGV4dCxcbiAgdXNlU3RhdGUsXG59IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuXG5pbXBvcnQgeyBGZWF0dXJlQ29udGV4dCB9IGZyb20gJy4vRmVhdHVyZUNvbnRleHQnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlRGVzY3JpcHRpb24gfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5pbXBvcnQgeyB2YWx1ZU9mRmVhdHVyZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG4vLyBAdHMtZXhwZWN0LWVycm9yIGJ1bmRsZXIgd2lsbCB0YWtlIGNhcmUgb2YgdGhpc1xuaW1wb3J0IHN0eWxlcyBmcm9tICcuL3RhaWx3aW5kLmNzcyc7XG5cbmZ1bmN0aW9uIGNsYXNzTmFtZXMoLi4uY2xhc3Nlczogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gY2xhc3Nlcy5maWx0ZXIoQm9vbGVhbikuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBUb2dnbGVGZWF0dXJlKHtcbiAgZmVhdHVyZSxcbn06IHtcbiAgZmVhdHVyZTogRmVhdHVyZURlc2NyaXB0aW9uO1xufSk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEZlYXR1cmVDb250ZXh0KTtcbiAgY29uc3QgaGFuZGxlQ2hhbmdlU2VsZWN0aW9uID0gdXNlQ2FsbGJhY2soXG4gICAgKHZhbHVlOiAnZmFsc2UnIHwgJ3RydWUnIHwgJ3Vuc2V0JykgPT4ge1xuICAgICAgaWYgKGNvbnRleHQ/Lm92ZXJyaWRlc1NlbmQgIT0gbnVsbCkge1xuICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgICAgY2FzZSAndHJ1ZSc6IHtcbiAgICAgICAgICAgIGNvbnRleHQub3ZlcnJpZGVzU2VuZCh7IHR5cGU6ICdFTkFCTEUnLCBuYW1lOiBmZWF0dXJlLm5hbWUgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FzZSAnZmFsc2UnOiB7XG4gICAgICAgICAgICBjb250ZXh0Lm92ZXJyaWRlc1NlbmQoeyB0eXBlOiAnRElTQUJMRScsIG5hbWU6IGZlYXR1cmUubmFtZSB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlICd1bnNldCc6IHtcbiAgICAgICAgICAgIGNvbnRleHQub3ZlcnJpZGVzU2VuZCh7IHR5cGU6ICdVTlNFVCcsIG5hbWU6IGZlYXR1cmUubmFtZSB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgW2ZlYXR1cmUubmFtZSwgY29udGV4dF0sXG4gICk7XG5cbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgeyBvdmVycmlkZXNTdGF0ZSwgdGVzdDogdGVzdEZlYXR1cmUsIGRlZmF1bHRzU3RhdGUgfSA9IGNvbnRleHQ7XG5cbiAgY29uc3QgdmFsdWVJbkRlZmF1bHRzID0gKFxuICAgIHZhbHVlT2ZGZWF0dXJlKGRlZmF1bHRzU3RhdGUsIGZlYXR1cmUubmFtZSlbMF0gPz8gJ3Vuc2V0J1xuICApLnRvU3RyaW5nKCkgYXMgJ2ZhbHNlJyB8ICd0cnVlJyB8ICd1bnNldCc7XG5cbiAgY29uc3QgdmFsdWVJbk92ZXJyaWRlcyA9IChcbiAgICB2YWx1ZU9mRmVhdHVyZShvdmVycmlkZXNTdGF0ZSwgZmVhdHVyZS5uYW1lKVswXSA/PyAndW5zZXQnXG4gICkudG9TdHJpbmcoKSBhcyAnZmFsc2UnIHwgJ3RydWUnIHwgJ3Vuc2V0JztcblxuICBjb25zdCBhY3R1YWxDaGVja2VkID0gdGVzdEZlYXR1cmUoZmVhdHVyZS5uYW1lKTtcblxuICByZXR1cm4gKFxuICAgIDxSYWRpb0dyb3VwXG4gICAgICBkaXNhYmxlZD17ZmVhdHVyZS5ub092ZXJyaWRlfVxuICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZVNlbGVjdGlvbn1cbiAgICAgIHZhbHVlPXt2YWx1ZUluT3ZlcnJpZGVzfVxuICAgID5cbiAgICAgIDxSYWRpb0dyb3VwLkxhYmVsPlxuICAgICAgICA8aDYgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTkwMCBhbGlnbi1jZW50ZXIgZmxleCBmbGV4LXJvdyBmbGV4LW5vd3JhcCBpdGVtcy1jZW50ZXIgZ2FwLTIgbGc6Z2FwLTQgaC03XCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tZWRpdW1cIj5cbiAgICAgICAgICAgIEZlYXR1cmU6IDxjb2RlPntmZWF0dXJlLm5hbWV9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICB7ZmVhdHVyZS5ub092ZXJyaWRlID09PSB0cnVlID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItb3JhbmdlLTUwMCB0ZXh0LW9yYW5nZS01MDAgZmxleCBmbGV4LW5vd3JhcCB0ZXh0LXhzIGZsZXgtcm93IGdhcC0xIHJvdW5kZWQtc20gYm9yZGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBweC0yIHB5LTFcIj5cbiAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC00IHctNCBtaW4tdy00XCJcbiAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgZD1cIk01IDlWN2E1IDUgMCAwMTEwIDB2MmEyIDIgMCAwMTIgMnY1YTIgMiAwIDAxLTIgMkg1YTIgMiAwIDAxLTItMnYtNWEyIDIgMCAwMTItMnptOC0ydjJIN1Y3YTMgMyAwIDAxNiAwelwiXG4gICAgICAgICAgICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICA8ZGl2Pk5vIE92ZXJyaWRlczwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAge2FjdHVhbENoZWNrZWQgPT09IHRydWUgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1ub3dyYXAgdGV4dC14cyB0ZXh0LWdyZWVuLTUwMCBmbGV4LXJvdyBnYXAtMSByb3VuZGVkLXNtIGJvcmRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYm9yZGVyLWdyZWVuLTUwMCBweC0yIHB5LTFcIj5cbiAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC00IHctNCBtaW4tdy00XCJcbiAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgZD1cIk0xMCAxOGE4IDggMCAxMDAtMTYgOCA4IDAgMDAwIDE2em0zLjcwNy05LjI5M2ExIDEgMCAwMC0xLjQxNC0xLjQxNEw5IDEwLjU4NiA3LjcwNyA5LjI5M2ExIDEgMCAwMC0xLjQxNCAxLjQxNGwyIDJhMSAxIDAgMDAxLjQxNCAwbDQtNHpcIlxuICAgICAgICAgICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgPGRpdj57YWN0dWFsQ2hlY2tlZCA/ICdFbmFibGVkJyA6ICdEaXNhYmxlZCd9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9oNj5cbiAgICAgICAge2ZlYXR1cmUuZGVzY3JpcHRpb24gPT0gbnVsbCA/IG51bGwgOiAoXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1iYXNlIHRleHQtZ3JheS01MDAgdGV4dC1zbVwiPlxuICAgICAgICAgICAge2ZlYXR1cmUuZGVzY3JpcHRpb259XG4gICAgICAgICAgPC9wPlxuICAgICAgICApfVxuICAgICAgPC9SYWRpb0dyb3VwLkxhYmVsPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGdyaWQgZ3JpZC1jb2xzLTEgZ2FwLXktNiBzbTpncmlkLWNvbHMtMyBzbTpnYXAteC00XCI+XG4gICAgICAgIHtbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdmYWxzZScsXG4gICAgICAgICAgICB0aXRsZTogYERpc2FibGUgJHtmZWF0dXJlLm5hbWV9YCxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnT3ZlcnJpZGUgdGhlIGZlYXR1cmUgdG8gYmUgZGlzYWJsZWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICd1bnNldCcsXG4gICAgICAgICAgICB0aXRsZTogJ0RlZmF1bHQnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJbmhlcml0IGVuYWJsZWQgc3RhdGUgZnJvbSBkZWZhdWx0cycsXG4gICAgICAgICAgICBkaXNhYmxlZDogKGZlYXR1cmUubm9PdmVycmlkZSA/PyBmYWxzZSkgfHwgZmVhdHVyZS5mb3JjZSxcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTpcbiAgICAgICAgICAgICAgdmFsdWVJbkRlZmF1bHRzID09PSAndHJ1ZScgPyAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWdyZWVuLTUwMCBib3JkZXItZ3JlZW4tNTAwIGZsZXggZmxleC1ub3dyYXAgdGV4dC14cyBmbGV4LXJvdyBnYXAtMSByb3VuZGVkLXNtIGJvcmRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcHgtMiBweS0xXCI+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj5FbmFibGVkPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1yZWQtNTAwIGJvcmRlci1yZWQtNTAwIGZsZXggZmxleC1ub3dyYXAgdGV4dC14cyBmbGV4LXJvdyBnYXAtMSByb3VuZGVkLXNtIGJvcmRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcHgtMiBweS0xXCI+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj5EaXNhYmxlZDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAndHJ1ZScsXG4gICAgICAgICAgICB0aXRsZTogYEVuYWJsZSAke2ZlYXR1cmUubmFtZX1gLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdPdmVycmlkZSB0aGUgZmVhdHVyZSB0byBiZSBlbmFibGVkJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLm1hcCgob3B0aW9uKSA9PiAoXG4gICAgICAgICAgPFJhZGlvR3JvdXAuT3B0aW9uXG4gICAgICAgICAgICBjbGFzc05hbWU9eyh7IGNoZWNrZWQsIGFjdGl2ZSwgZGlzYWJsZWQgfSkgPT5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgICBjaGVja2VkID8gJ2JvcmRlci10cmFuc3BhcmVudCcgOiAnYm9yZGVyLWdyYXktMzAwJyxcbiAgICAgICAgICAgICAgICAhZGlzYWJsZWQgJiYgYWN0aXZlXG4gICAgICAgICAgICAgICAgICA/ICdib3JkZXItYmx1ZS01MDAgcmluZy0yIHJpbmctYmx1ZS01MDAnXG4gICAgICAgICAgICAgICAgICA6ICcnLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkXG4gICAgICAgICAgICAgICAgICA/ICdib3JkZXItdHJhbnNwYXJlbnQgcmluZy1ncmF5LTUwMCBjdXJzb3Itbm90LWFsbG93ZWQnXG4gICAgICAgICAgICAgICAgICA6ICdjdXJzb3ItcG9pbnRlcicsXG4gICAgICAgICAgICAgICAgJ3JlbGF0aXZlIGJnLXdoaXRlIGJvcmRlciByb3VuZGVkLWxnIHNoYWRvdy1zbSBwLTMgZmxleCBmb2N1czpvdXRsaW5lLW5vbmUnLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXNhYmxlZD17b3B0aW9uLmRpc2FibGVkfVxuICAgICAgICAgICAga2V5PXtvcHRpb24uaWR9XG4gICAgICAgICAgICB2YWx1ZT17b3B0aW9uLmlkfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsoeyBjaGVja2VkLCBhY3RpdmUsIGRpc2FibGVkIH0pID0+IChcbiAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ3Jvd1wiPlxuICAgICAgICAgICAgICAgICAgPFJhZGlvR3JvdXAuTGFiZWxcbiAgICAgICAgICAgICAgICAgICAgYXM9XCJzcGFuXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBmbGV4LW5vd3JhcCBmbGV4LXJvdyBnYXAtMSBpdGVtcy1jZW50ZXIgc3BhY2UtYmV0d2VlblwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMCBncm93IHNocmlua1wiPlxuICAgICAgICAgICAgICAgICAgICAgIHtvcHRpb24udGl0bGV9XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAge29wdGlvbi5kZWZhdWx0VmFsdWUgIT0gbnVsbCA/IG9wdGlvbi5kZWZhdWx0VmFsdWUgOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXG4gICAgICAgICAgICAgICAgICAgICAgICAhY2hlY2tlZCA/ICdpbnZpc2libGUnIDogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaC01IHctNSB0ZXh0LWJsdWUtNTAwIG1pbi13LTQnLFxuICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgICAgICAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpcFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XCJNMTAgMThhOCA4IDAgMTAwLTE2IDggOCAwIDAwMCAxNnptMy43MDctOS4yOTNhMSAxIDAgMDAtMS40MTQtMS40MTRMOSAxMC41ODYgNy43MDcgOS4yOTNhMSAxIDAgMDAtMS40MTQgMS40MTRsMiAyYTEgMSAwIDAwMS40MTQgMGw0LTR6XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICA8L1JhZGlvR3JvdXAuTGFiZWw+XG4gICAgICAgICAgICAgICAgICA8UmFkaW9Hcm91cC5EZXNjcmlwdGlvblxuICAgICAgICAgICAgICAgICAgICBhcz1cInNwYW5cIlxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtdC0xIGZsZXggaXRlbXMtY2VudGVyIHRleHQtc20gdGV4dC1ncmF5LTUwMFwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtvcHRpb24uZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgICA8L1JhZGlvR3JvdXAuRGVzY3JpcHRpb24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgICAgICAgIWRpc2FibGVkICYmIGFjdGl2ZSA/ICdib3JkZXInIDogJ2JvcmRlci0yJyxcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZFxuICAgICAgICAgICAgICAgICAgICAgID8gZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1ncmF5LTUwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1ibHVlLTUwMCdcbiAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgICAnYWJzb2x1dGUgLWluc2V0LXB4IHJvdW5kZWQtbGcgcG9pbnRlci1ldmVudHMtbm9uZScsXG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1JhZGlvR3JvdXAuT3B0aW9uPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvUmFkaW9Hcm91cD5cbiAgKTtcbn1cblxuZnVuY3Rpb24gU2hhZG93Q29udGVudCh7XG4gIHJvb3QsXG4gIGNoaWxkcmVuLFxufToge1xuICBjaGlsZHJlbjogUmVhY3ROb2RlO1xuICByb290OiBFbGVtZW50O1xufSkge1xuICByZXR1cm4gUmVhY3RET00uY3JlYXRlUG9ydGFsKGNoaWxkcmVuLCByb290KTtcbn1cblxuLy8vIFBlcm1pdCB1c2VycyB0byBvdmVycmlkZSBmZWF0dXJlIGZsYWdzIHZpYSBhIEdVSS5cbi8vLyBSZW5kZXJzIGEgc21hbGwgZmxvYXRpbmcgYnV0dG9uIGluIGxvd2VyIGxlZnQgb3IgcmlnaHQsIHByZXNzaW5nIGl0IGJyaW5ncyB1cFxuLy8vIGEgbGlzdCBvZiBmZWF0dXJlcyB0byB0b2dnbGUgYW5kIHRoZWlyIGN1cnJlbnQgb3ZlcnJpZGUgc3RhdGUuIHlvdSBjYW4gb3ZlcnJpZGUgb24gb3Igb3ZlcnJpZGUgb2ZmLFxuLy8vIG9yIHVuc2V0IHRoZSBvdmVycmlkZSBhbmQgZ28gYmFjayB0byBkZWZhdWx0IHZhbHVlLlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5leHBvcnQgZnVuY3Rpb24gVG9nZ2xlRmVhdHVyZXMoe1xuICBkZWZhdWx0T3BlbiA9IGZhbHNlLFxuICBoaWRkZW4gPSBmYWxzZSxcbn06IHtcbiAgZGVmYXVsdE9wZW4/OiBib29sZWFuO1xuICBoaWRkZW4/OiBib29sZWFuO1xufSk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IFtyb290LCBzZXRDb3JlUm9vdF0gPSB1c2VTdGF0ZTxIVE1MRGl2RWxlbWVudCB8IG51bGw+KG51bGwpO1xuXG4gIGNvbnN0IHNldFJvb3QgPSAoaG9zdDogSFRNTERpdkVsZW1lbnQgfCBudWxsKSA9PiB7XG4gICAgaWYgKGhvc3QgPT0gbnVsbCB8fCByb290ICE9IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc2hhZG93Um9vdCA9IGhvc3Q/LmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcbiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgY29uc3QgcmVuZGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3R5bGUudGV4dENvbnRlbnQgPSBzdHlsZXM7XG4gICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChyZW5kZXJEaXYpO1xuICAgIHNldENvcmVSb290KHJlbmRlckRpdik7XG4gIH07XG5cbiAgaWYgKGhpZGRlbikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICByZWY9e3NldFJvb3R9XG4gICAgICBzdHlsZT17e1xuICAgICAgICB6SW5kZXg6IDk5OTk5LFxuICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgd2lkdGg6ICcwJyxcbiAgICAgICAgaGVpZ2h0OiAnMCcsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgIH19XG4gICAgPlxuICAgICAge3Jvb3QgIT0gbnVsbCA/IChcbiAgICAgICAgPFNoYWRvd0NvbnRlbnQgcm9vdD17cm9vdH0+XG4gICAgICAgICAgPFRvZ2dsZUZlYXR1cmVVbndyYXBwZWQgZGVmYXVsdE9wZW49e2RlZmF1bHRPcGVufSAvPlxuICAgICAgICA8L1NoYWRvd0NvbnRlbnQ+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuLy8vIExpa2UgVG9nZ2xlRmVhdHVyZXMsIGJ1dCBkb2VzIG5vdCBpbmplY3Qgc3R5bGVzIGludG8gYSBzaGFkb3cgRE9NIHJvb3Qgbm9kZS5cbi8vLyB1c2VmdWwgaWYgeW91J3JlIHVzaW5nIHRhaWx3aW5kLlxuZXhwb3J0IGZ1bmN0aW9uIFRvZ2dsZUZlYXR1cmVVbndyYXBwZWQoe1xuICBkZWZhdWx0T3BlbiA9IGZhbHNlLFxuICBoaWRkZW4gPSBmYWxzZSxcbn06IHtcbiAgZGVmYXVsdE9wZW4/OiBib29sZWFuO1xuICBoaWRkZW4/OiBib29sZWFuO1xufSk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGRlZmF1bHRPcGVuKTtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoRmVhdHVyZUNvbnRleHQpO1xuXG4gIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChoaWRkZW4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFdlIHdhbnQ6IFJlYWwgdmFsdWUgYWZ0ZXIgYWxsIG5lc3RpbmdzLCB2YWx1ZSBvZiB0aGUgb3ZlcnJpZGUuIHdlIHRvZ2dsZSBvdmVycmlkZVxuICBjb25zdCB7IGZlYXR1cmVzRGVzY3JpcHRpb24gfSA9IGNvbnRleHQ7XG5cbiAgaWYgKGZlYXR1cmVzRGVzY3JpcHRpb24ubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgYm90dG9tLTAgbGVmdC0wIG14LTQgbXktNFwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIHRleHQtc20gZm9udC1tZWRpdW0gcC0xIGgtOCB3LTggYWxpZ24tbWlkZGxlIGN1cnNvci1wb2ludGVyIHJvdW5kZWQtZnVsbCBiZy1ibHVlLTYwMCB0ZXh0LXdoaXRlICBib3JkZXIgYm9yZGVyLXRyYW5zcGFyZW50IGp1c3RpZnktY2VudGVyIHRleHQtYmFzZSBmb250LW1lZGl1bSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctb2Zmc2V0LTIgZm9jdXM6cmluZy1ibHVlLTYwMCBzbTp0ZXh0LXNtXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKHRydWUpfVxuICAgICAgICAgIHRpdGxlPVwiVG9nZ2xlIGZlYXR1cmVzXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInctNiBoLTYgbWluLWgtNiBtaW4tdy02XCJcbiAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICBkPVwiTTMgNmEzIDMgMCAwMTMtM2gxMGExIDEgMCAwMS44IDEuNkwxNC4yNSA4bDIuNTUgMy40QTEgMSAwIDAxMTYgMTNINmExIDEgMCAwMC0xIDF2M2ExIDEgMCAxMS0yIDBWNnpcIlxuICAgICAgICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIHshb3BlbiA/IG51bGwgOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgei0xMCBpbnNldC0wIG92ZXJmbG93LXktYXV0b1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1lbmQganVzdGlmeS1mbGV4LXN0YXJ0IG14LTggbXktNCBtaW4taC1zY3JlZW4gcHQtNCBweC00IHBiLTEwIHNtOmJsb2NrIHNtOnAtMFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBpbmxpbmUtYmxvY2sgYWxpZ24tYm90dG9tIGJnLXdoaXRlIHJvdW5kZWQtbGcgcHgtNCBwdC01IHBiLTQgdGV4dC1sZWZ0IG92ZXJmbG93LWhpZGRlbiBzaGFkb3cteGwgdHJhbnNmb3JtIHRyYW5zaXRpb24tYWxsIHNtOm15LTggc206YWxpZ24tbWlkZGxlIHNtOnAtNiBsZzptYXgtdy1bODAlXSBtYXgtdy1mdWxsXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xIHNtOm10LTNcIj5cbiAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmbGV4IGZsZXgtcm93IGdhcC00IGZsZXgtbm93cmFwIGl0ZW1zLWNlbnRlciBzcGFjZS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JvdyB0ZXh0LWxnIGxlYWRpbmctNiBmb250LW1lZGl1bSB0ZXh0LWdyYXktOTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgRmVhdHVyZSBGbGFnIE92ZXJyaWRlc1xuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgRmVhdHVyZXMgY2FuIGJlIGVuYWJsZWQgb3IgZGlzYWJsZWQgdW5sZXNzIHRoZXkgYXJlIGZvcmNlZFxuICAgICAgICAgICAgICAgICAgICB1cHN0cmVhbS4gWW91IGNhbiBhbHNvIHJldmVydCB0byBkZWZhdWx0LlxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC02XCI+XG4gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldCBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC05XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGxlZ2VuZCBjbGFzc05hbWU9XCJzci1vbmx5XCI+RmVhdHVyZSBGbGFnczwvbGVnZW5kPlxuICAgICAgICAgICAgICAgICAgICAgIHtmZWF0dXJlc0Rlc2NyaXB0aW9uLm1hcCgoZmVhdHVyZSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPFRvZ2dsZUZlYXR1cmUgZmVhdHVyZT17ZmVhdHVyZX0ga2V5PXtmZWF0dXJlLm5hbWV9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWNlbnRlciBpdGVtcy1jZW50ZXIgbXQtNSBzbTptdC02XCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgdGV4dC1zbSBmb250LW1lZGl1bSBwdC0wIHBiLTAgcHItNCBwbC00IGgtOCBsZWFkaW5nLTcgYWxpZ24tbWlkZGxlIGN1cnNvci1wb2ludGVyIHJvdW5kZWQtc20gYmctYmx1ZS02MDAgdGV4dC13aGl0ZSBib3JkZXIgYm9yZGVyLXRyYW5zcGFyZW50IGp1c3RpZnktY2VudGVyIHRleHQtYmFzZSBmb250LW1lZGl1bSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctb2Zmc2V0LTIgZm9jdXM6cmluZy1ibHVlLTYwMCBzbTp0ZXh0LXNtXCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKGZhbHNlKX1cbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIERvbmVcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ0NBLFlBQXVCOzs7QUNEdkIsb0JBQW9DOzs7QUNBcEMsbUJBQThCO0FBU3ZCLElBQU0sZ0JBQWdCLGdDQUFpQyxDQUFDLE9BQU8sS0FBSzs7O0FESHBFLDJCQUNMLE9BQytCO0FBQy9CLFFBQU0sT0FBTyw4QkFBVyxhQUFhO0FBR3JDLFFBQU0sWUFBWSwyQkFDaEIsTUFBTyxTQUFTLE9BQU8sQ0FBQyxJQUFJLE1BQU0sUUFBUSxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssR0FDakUsQ0FBQyxLQUFLLENBQ1I7QUFFQSxTQUFPLENBQUMsTUFBTSxTQUFTO0FBQ3pCOzs7QUViTyx3QkFBd0IsWUFBd0M7QUFDckUsUUFBTSxDQUFDLE1BQU0sbUJBQW1CLGtCQUFrQixVQUFVO0FBQzVELFNBQ0UsV0FBVyxTQUFT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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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

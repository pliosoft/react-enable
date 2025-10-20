var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/Disable.tsx
import * as React from "react";

// src/utils.ts
import { useContext, useMemo } from "react";

// src/EnableContext.tsx
import { createContext } from "react";
var EnableContext = createContext((_s) => false);

// src/utils.ts
function useTestAndConvert(input) {
  const test = useContext(EnableContext);
  const converted = useMemo(() => input == null ? [] : Array.isArray(input) ? input : [input], [input]);
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
import * as React2 from "react";

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
import React3, {
  useEffect as useEffect3,
  useMemo as useMemo3,
  useReducer,
  useRef
} from "react";

// src/FeatureContext.tsx
import { createContext as createContext2 } from "react";
var FeatureContext = createContext2(null);

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
  return useCallback((f) => testFeature(f, [defaultsState, overridesState]), [defaultsState, overridesState]);
}

// src/Features.tsx
function Features({
  children,
  features,
  disableConsole = false,
  storage = window.sessionStorage
}) {
  const featuresRef = useRef(features);
  const [overridesState, overridesDispatch] = useReducer(featuresReducer, initialFeaturesState);
  const [defaultsState, defaultsDispatch] = useReducer(featuresReducer, initialFeaturesState);
  useEffect3(() => {
    defaultsDispatch({ type: "INIT", features });
    return () => {
      defaultsDispatch({ type: "DE_INIT" });
    };
  }, [features]);
  useEffect3(() => {
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
  useEffect3(() => {
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
  const featureValue = useMemo3(() => ({
    overridesSend: overridesDispatch,
    defaultsSend: defaultsDispatch,
    featuresDescription: featuresRef.current,
    overridesState,
    defaultsState,
    test: testCallback
  }), [overridesState, defaultsState, testCallback]);
  return /* @__PURE__ */ React3.createElement(FeatureContext.Provider, {
    value: featureValue
  }, /* @__PURE__ */ React3.createElement(EnableContext.Provider, {
    value: testCallback
  }, children));
}

// src/ToggleFeatures.tsx
import { RadioGroup } from "@headlessui/react";
import React4, {
  useCallback as useCallback2,
  useContext as useContext2,
  useState
} from "react";
import ReactDOM from "react-dom";

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
  const context = useContext2(FeatureContext);
  const handleChangeSelection = useCallback2((value) => {
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
  return /* @__PURE__ */ React4.createElement(RadioGroup, {
    disabled: feature.noOverride,
    onChange: handleChangeSelection,
    value: valueInOverrides
  }, /* @__PURE__ */ React4.createElement(RadioGroup.Label, null, /* @__PURE__ */ React4.createElement("h6", {
    className: "text-gray-900 align-center flex flex-row flex-nowrap items-center gap-2 lg:gap-4 h-7"
  }, /* @__PURE__ */ React4.createElement("span", {
    className: "font-medium"
  }, "Feature: ", /* @__PURE__ */ React4.createElement("code", null, feature.name)), feature.noOverride === true ? /* @__PURE__ */ React4.createElement("div", {
    className: "border-orange-500 text-orange-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"
  }, /* @__PURE__ */ React4.createElement("svg", {
    "aria-hidden": "true",
    className: "h-4 w-4 min-w-4",
    fill: "currentColor",
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React4.createElement("path", {
    clipRule: "evenodd",
    d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",
    fillRule: "evenodd"
  })), /* @__PURE__ */ React4.createElement("div", null, "No Overrides")) : null, actualChecked === true ? /* @__PURE__ */ React4.createElement("div", {
    className: "flex flex-nowrap text-xs text-green-500 flex-row gap-1 rounded-sm border items-center justify-center border-green-500 px-2 py-1"
  }, /* @__PURE__ */ React4.createElement("svg", {
    "aria-hidden": "true",
    className: "h-4 w-4 min-w-4",
    fill: "currentColor",
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React4.createElement("path", {
    clipRule: "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
    fillRule: "evenodd"
  })), /* @__PURE__ */ React4.createElement("div", null, actualChecked ? "Enabled" : "Disabled")) : null), feature.description == null ? null : /* @__PURE__ */ React4.createElement("p", {
    className: "text-base text-gray-500 text-sm"
  }, feature.description)), /* @__PURE__ */ React4.createElement("div", {
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
      defaultValue: valueInDefaults === "true" ? /* @__PURE__ */ React4.createElement("div", {
        className: "text-green-500 border-green-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"
      }, /* @__PURE__ */ React4.createElement("span", null, "Enabled")) : /* @__PURE__ */ React4.createElement("div", {
        className: "text-red-500 border-red-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"
      }, /* @__PURE__ */ React4.createElement("span", null, "Disabled"))
    },
    {
      id: "true",
      title: `Enable ${feature.name}`,
      description: "Override the feature to be enabled"
    }
  ].map((option) => /* @__PURE__ */ React4.createElement(RadioGroup.Option, {
    className: ({ checked, active, disabled }) => classNames(checked ? "border-transparent" : "border-gray-300", !disabled && active ? "border-blue-500 ring-2 ring-blue-500" : "", disabled ? "border-transparent ring-gray-500 cursor-not-allowed" : "cursor-pointer", "relative bg-white border rounded-lg shadow-sm p-3 flex focus:outline-none"),
    disabled: option.disabled,
    key: option.id,
    value: option.id
  }, ({ checked, active, disabled }) => /* @__PURE__ */ React4.createElement(React4.Fragment, null, /* @__PURE__ */ React4.createElement("div", {
    className: "flex flex-col grow"
  }, /* @__PURE__ */ React4.createElement(RadioGroup.Label, {
    as: "span",
    className: "flex flex-nowrap flex-row gap-1 items-center space-between"
  }, /* @__PURE__ */ React4.createElement("span", {
    className: "text-sm font-medium text-gray-900 grow shrink"
  }, option.title), option.defaultValue != null ? option.defaultValue : null, /* @__PURE__ */ React4.createElement("svg", {
    "aria-hidden": "true",
    className: classNames(!checked ? "invisible" : "", "h-5 w-5 text-blue-500 min-w-4"),
    fill: "currentColor",
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React4.createElement("path", {
    clipRule: "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
    fillRule: "evenodd"
  }))), /* @__PURE__ */ React4.createElement(RadioGroup.Description, {
    as: "span",
    className: "mt-1 flex items-center text-sm text-gray-500"
  }, option.description)), /* @__PURE__ */ React4.createElement("div", {
    "aria-hidden": "true",
    className: classNames(!disabled && active ? "border" : "border-2", checked ? disabled ? "border-gray-500" : "border-blue-500" : "border-transparent", "absolute -inset-px rounded-lg pointer-events-none")
  }))))));
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
  return /* @__PURE__ */ React4.createElement("div", {
    ref: setRoot,
    style: {
      zIndex: 99999,
      position: "fixed",
      width: "0",
      height: "0",
      bottom: 0
    }
  }, root != null ? /* @__PURE__ */ React4.createElement(ShadowContent, {
    root
  }, /* @__PURE__ */ React4.createElement(ToggleFeatureUnwrapped, {
    defaultOpen
  })) : null);
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
  return /* @__PURE__ */ React4.createElement("div", {
    className: "relative"
  }, /* @__PURE__ */ React4.createElement("div", {
    className: "absolute bottom-0 left-0 mx-4 my-4"
  }, /* @__PURE__ */ React4.createElement("button", {
    className: "inline-flex items-center text-sm font-medium p-1 h-8 w-8 align-middle cursor-pointer rounded-full bg-blue-600 text-white  border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",
    onClick: () => setOpen(true),
    title: "Toggle features",
    type: "button"
  }, /* @__PURE__ */ React4.createElement("svg", {
    className: "w-6 h-6 min-h-6 min-w-6",
    fill: "currentColor",
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React4.createElement("path", {
    clipRule: "evenodd",
    d: "M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z",
    fillRule: "evenodd"
  })))), !open ? null : /* @__PURE__ */ React4.createElement("div", {
    className: "fixed z-10 inset-0 overflow-y-auto"
  }, /* @__PURE__ */ React4.createElement("div", {
    className: "flex items-end justify-flex-start mx-8 my-4 min-h-screen pt-4 px-4 pb-10 sm:block sm:p-0"
  }, /* @__PURE__ */ React4.createElement("div", {
    className: "relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 lg:max-w-[80%] max-w-full"
  }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("div", {
    className: "mt-1 sm:mt-3"
  }, /* @__PURE__ */ React4.createElement("h3", {
    className: "flex flex-row gap-4 flex-nowrap items-center space-between"
  }, /* @__PURE__ */ React4.createElement("div", {
    className: "grow text-lg leading-6 font-medium text-gray-900"
  }, "Feature Flag Overrides")), /* @__PURE__ */ React4.createElement("p", {
    className: "text-sm text-gray-500"
  }, "Features can be enabled or disabled unless they are forced upstream. You can also revert to default."), /* @__PURE__ */ React4.createElement("div", {
    className: "mt-6"
  }, /* @__PURE__ */ React4.createElement("fieldset", {
    className: "flex flex-col gap-9"
  }, /* @__PURE__ */ React4.createElement("legend", {
    className: "sr-only"
  }, "Feature Flags"), featuresDescription.map((feature) => /* @__PURE__ */ React4.createElement(ToggleFeature, {
    feature,
    key: feature.name
  })))), /* @__PURE__ */ React4.createElement("div", {
    className: "flex justify-center items-center mt-5 sm:mt-6"
  }, /* @__PURE__ */ React4.createElement("button", {
    className: "inline-flex items-center text-sm font-medium pt-0 pb-0 pr-4 pl-4 h-8 leading-7 align-middle cursor-pointer rounded-sm bg-blue-600 text-white border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",
    onClick: () => setOpen(false),
    type: "button"
  }, "Done"))))))));
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL0Rpc2FibGUudHN4IiwgIi4uLy4uLy4uL3NyYy91dGlscy50cyIsICIuLi8uLi8uLi9zcmMvRW5hYmxlQ29udGV4dC50c3giLCAiLi4vLi4vLi4vc3JjL3VzZUFsbERpc2FibGVkLnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlRGlzYWJsZWQudHN4IiwgIi4uLy4uLy4uL3NyYy9FbmFibGUudHN4IiwgIi4uLy4uLy4uL3NyYy91c2VBbGxFbmFibGVkLnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlRW5hYmxlZC50c3giLCAiLi4vLi4vLi4vc3JjL0ZlYXR1cmVzLnRzeCIsICIuLi8uLi8uLi9zcmMvRmVhdHVyZUNvbnRleHQudHN4IiwgIi4uLy4uLy4uL3NyYy9GZWF0dXJlU3RhdGUudHN4IiwgIi4uLy4uLy4uL3NyYy9GZWF0dXJlc1N0YXRlLnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlQ29uc29sZU92ZXJyaWRlLnRzeCIsICIuLi8uLi8uLi9zcmMvR2xvYmFsRW5hYmxlLnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlUGVyc2lzdC50c3giLCAiLi4vLi4vLi4vc3JjL3VzZVRlc3RDYWxsYmFjay50c3giLCAiLi4vLi4vLi4vc3JjL3Rlc3RGZWF0dXJlLnRzeCIsICIuLi8uLi8uLi9zcmMvVG9nZ2xlRmVhdHVyZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBiaW9tZS1pZ25vcmUgbGludC9zdHlsZS91c2VJbXBvcnRUeXBlOiBKU1ggcmVxdWlyZXMgUmVhY3QgYXQgcnVudGltZVxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdHlwZSB7IEVuYWJsZVByb3BzIH0gZnJvbSAnLi9FbmFibGUnO1xuaW1wb3J0IHsgdXNlQWxsRGlzYWJsZWQgfSBmcm9tICcuL3VzZUFsbERpc2FibGVkJztcbmltcG9ydCB7IHVzZURpc2FibGVkIH0gZnJvbSAnLi91c2VEaXNhYmxlZCc7XG5cbi8qKlxuICogRmVhdHVyZSB3aWxsIGJlIGRpc2FibGVkIGlmIGFueSBpbiB0aGUgbGlzdCBhcmUgZW5hYmxlZFxuICovXG5leHBvcnQgY29uc3QgRGlzYWJsZTogUmVhY3QuRkM8RW5hYmxlUHJvcHM+ID0gKHtcbiAgZmVhdHVyZSA9IFtdLFxuICBhbGxGZWF0dXJlcyA9IFtdLFxuICBjaGlsZHJlbixcbn0pID0+IHtcbiAgY29uc3QgaXNBbnkgPSB1c2VEaXNhYmxlZChmZWF0dXJlKTtcbiAgY29uc3QgaXNBbGwgPSB1c2VBbGxEaXNhYmxlZChhbGxGZWF0dXJlcyk7XG5cbiAgaWYgKGlzQW55IHx8IGlzQWxsKSB7XG4gICAgcmV0dXJuIDw+e2NoaWxkcmVufTwvPjtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcbiIsICJpbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBFbmFibGVDb250ZXh0LCB0eXBlIEVuYWJsZUNvbnRleHRUeXBlIH0gZnJvbSAnLi9FbmFibGVDb250ZXh0JztcblxuLy8gSGVscGVyOiBnZXQgcmlkIG9mIHNvbWUgYm9pbGVycGxhdGUuXG4vLyBqdXN0IGlucHV0IG1hc2hpbmcgYW5kIHNhbml0YXRpb24sIHJlbW92aW5nIGV4dHJhIHJlbmRlcnMsIGFuZCBnZXR0aW5nIHRlc3QgZnVuY3Rpb25cbmV4cG9ydCBmdW5jdGlvbiB1c2VUZXN0QW5kQ29udmVydChcbiAgaW5wdXQ/OiBzdHJpbmdbXSB8IHN0cmluZyB8IG51bGwsXG4pOiBbRW5hYmxlQ29udGV4dFR5cGUsIHN0cmluZ1tdXSB7XG4gIGNvbnN0IHRlc3QgPSB1c2VDb250ZXh0KEVuYWJsZUNvbnRleHQpO1xuXG4gIC8vIFdlIG1lbW9pemUganVzdCB0byBwcmV2ZW50IHJlLXJlbmRlcnMgc2luY2UgdGhpcyBjb3VsZCBiZSBhdCB0aGUgbGVhZiBvZiBhIHRyZWVcbiAgY29uc3QgY29udmVydGVkID0gdXNlTWVtbyhcbiAgICAoKSA9PiAoaW5wdXQgPT0gbnVsbCA/IFtdIDogQXJyYXkuaXNBcnJheShpbnB1dCkgPyBpbnB1dCA6IFtpbnB1dF0pLFxuICAgIFtpbnB1dF0sXG4gICk7XG5cbiAgcmV0dXJuIFt0ZXN0LCBjb252ZXJ0ZWRdO1xufVxuIiwgImltcG9ydCB7IGNyZWF0ZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB0eXBlIHsgRmVhdHVyZVZhbHVlIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuXG5leHBvcnQgdHlwZSBFbmFibGVDb250ZXh0VHlwZSA9IChmZWF0dXJlOiBzdHJpbmcpID0+IEZlYXR1cmVWYWx1ZTtcblxuLyoqXG4gKiBDb250YWluZWQgZnVuY3Rpb24gY2FuIGNoZWNrIHdoZXRoZXIgYSBnaXZlbiBmZWF0dXJlIGlzIGVuYWJsZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBFbmFibGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxFbmFibGVDb250ZXh0VHlwZT4oKF9zKSA9PiBmYWxzZSk7XG4iLCAiaW1wb3J0IHsgdXNlVGVzdEFuZENvbnZlcnQgfSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiByZXR1cm5zIHRydWUgaWZmIGFsbCBzcGVjaWZpZWQgZmVhdHVyZXMgYXJlIGRpc2FibGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VBbGxEaXNhYmxlZCh3aXRob3V0QWxsOiBzdHJpbmdbXSB8IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBbdGVzdCwgcXVlcnlBbGxXaXRob3V0XSA9IHVzZVRlc3RBbmRDb252ZXJ0KHdpdGhvdXRBbGwpO1xuICByZXR1cm4gKFxuICAgIHdpdGhvdXRBbGwubGVuZ3RoID4gMCAmJiBxdWVyeUFsbFdpdGhvdXQuZXZlcnkoKHgpID0+ICEodGVzdCh4KSA/PyBmYWxzZSkpXG4gICk7XG59XG4iLCAiaW1wb3J0IHsgdXNlVGVzdEFuZENvbnZlcnQgfSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiByZXR1cm5zIHRydWUgaWZmIGFueSBzcGVjaWZpZWQgZmVhdHVyZSBpcyBkaXNhYmxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlRGlzYWJsZWQod2l0aG91dDogc3RyaW5nW10gfCBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgW3Rlc3QsIHF1ZXJ5QW55V2l0aG91dF0gPSB1c2VUZXN0QW5kQ29udmVydCh3aXRob3V0KTtcbiAgcmV0dXJuIHF1ZXJ5QW55V2l0aG91dC5zb21lKCh4KSA9PiAhKHRlc3QoeCkgPz8gZmFsc2UpKTtcbn1cbiIsICIvLyBiaW9tZS1pZ25vcmUgbGludC9zdHlsZS91c2VJbXBvcnRUeXBlOiBKU1ggcmVxdWlyZXMgUmVhY3QgYXQgcnVudGltZVxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyB1c2VBbGxFbmFibGVkIH0gZnJvbSAnLi91c2VBbGxFbmFibGVkJztcbmltcG9ydCB7IHVzZUVuYWJsZWQgfSBmcm9tICcuL3VzZUVuYWJsZWQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVuYWJsZVByb3BzIHtcbiAgcmVhZG9ubHkgZmVhdHVyZT86IHN0cmluZ1tdIHwgc3RyaW5nO1xuICByZWFkb25seSBhbGxGZWF0dXJlcz86IHN0cmluZ1tdO1xuICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlO1xufVxuXG4vKipcbiAqIEZlYXR1cmUgd2lsbCBiZSBlbmFibGVkIGlmIGFueSBmZWF0dXJlIGluIHRoZSBsaXN0IGFyZSBlbmFibGVkLFxuICovXG5leHBvcnQgZnVuY3Rpb24gRW5hYmxlKHtcbiAgZmVhdHVyZSA9IFtdLFxuICBhbGxGZWF0dXJlcyA9IFtdLFxuICBjaGlsZHJlbixcbn06IEVuYWJsZVByb3BzKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgaXNBbnkgPSB1c2VFbmFibGVkKGZlYXR1cmUpO1xuICBjb25zdCBpc0FsbCA9IHVzZUFsbEVuYWJsZWQoYWxsRmVhdHVyZXMpO1xuXG4gIGlmIChpc0FueSB8fCBpc0FsbCkge1xuICAgIHJldHVybiA8PntjaGlsZHJlbn08Lz47XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsICJpbXBvcnQgeyB1c2VUZXN0QW5kQ29udmVydCB9IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIHJldHVybnMgdHJ1ZSBpZmYgYWxsIHNwZWNpZmllZCBmZWF0dXJlcyBhcmUgZW5hYmxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlQWxsRW5hYmxlZChhbGxGZWF0dXJlczogc3RyaW5nW10gfCBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgW3Rlc3QsIHF1ZXJ5QWxsUHJlc2VudF0gPSB1c2VUZXN0QW5kQ29udmVydChhbGxGZWF0dXJlcyk7XG4gIHJldHVybiBxdWVyeUFsbFByZXNlbnQubGVuZ3RoID4gMCAmJiBxdWVyeUFsbFByZXNlbnQuZXZlcnkodGVzdCk7XG59XG4iLCAiaW1wb3J0IHsgdXNlVGVzdEFuZENvbnZlcnQgfSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiByZXR1cm5zIHRydWUgaWZmIGFueSBzcGVjaWZpZWQgZmVhdHVyZSBpcyBlbmFibGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VFbmFibGVkKGZlYXR1cmU6IHN0cmluZ1tdIHwgc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IFt0ZXN0LCBxdWVyeUFueVByZXNlbnRdID0gdXNlVGVzdEFuZENvbnZlcnQoZmVhdHVyZSk7XG4gIHJldHVybiBxdWVyeUFueVByZXNlbnQuc29tZSh0ZXN0KTtcbn1cbiIsICJpbXBvcnQgUmVhY3QsIHtcbiAgdHlwZSBSZWFjdE5vZGUsXG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbiAgdXNlUmVkdWNlcixcbiAgdXNlUmVmLFxufSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IEVuYWJsZUNvbnRleHQgfSBmcm9tICcuL0VuYWJsZUNvbnRleHQnO1xuaW1wb3J0IHsgRmVhdHVyZUNvbnRleHQgfSBmcm9tICcuL0ZlYXR1cmVDb250ZXh0JztcbmltcG9ydCB0eXBlIHsgRmVhdHVyZURlc2NyaXB0aW9uIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuaW1wb3J0IHsgZmVhdHVyZXNSZWR1Y2VyLCBpbml0aWFsRmVhdHVyZXNTdGF0ZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgdXNlQ29uc29sZU92ZXJyaWRlIGZyb20gJy4vdXNlQ29uc29sZU92ZXJyaWRlJztcbmltcG9ydCB1c2VQZXJzaXN0LCB7IEtFWSB9IGZyb20gJy4vdXNlUGVyc2lzdCc7XG5pbXBvcnQgdXNlVGVzdENhbGxiYWNrIGZyb20gJy4vdXNlVGVzdENhbGxiYWNrJztcblxuaW50ZXJmYWNlIEZlYXR1cmVQcm9wcyB7XG4gIHJlYWRvbmx5IGZlYXR1cmVzOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXTtcbiAgcmVhZG9ubHkgY2hpbGRyZW4/OiBSZWFjdE5vZGU7XG4gIHJlYWRvbmx5IGRpc2FibGVDb25zb2xlPzogYm9vbGVhbjtcbiAgcmVhZG9ubHkgc3RvcmFnZT86IFN0b3JhZ2U7XG59XG5cbi8qKlxuICogQSBtb3JlIGJhdHRlcmllcy1lbmFibGVkIHBhcmVudCBjb21wb25lbnQgdGhhdCBrZWVwcyB0cmFjayBvZiBmZWF0dXJlIHN0YXRlXG4gKiBpbnRlcm5hbGx5LCBhbmQgY3JlYXRlcyB3aW5kb3cuZmVhdHVyZS5lbmFibGUoXCJmXCIpIGFuZCB3aW5kb3cuZmVhdHVyZS5kaXNhYmxlKFwiZlwiKS5cbiAqIEtlZXBzIHRyYWNrIG9mIG92ZXJyaWRlcyBhbmQgZGVmYXVsdHMsIHdpdGggZGVmYXVsdHMgcG90ZW50aWFsbHkgY29taW5nIGZyb20geW91ciBwcm9wc1xuICogYW5kIG92ZXJyaWRlcyBiZWluZyBwZXJzaXN0ZWQgdG8geW91ciBjaG9pY2Ugb2Ygc3RvcmFnZSBsYXllci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVzKHtcbiAgY2hpbGRyZW4sXG4gIGZlYXR1cmVzLFxuICBkaXNhYmxlQ29uc29sZSA9IGZhbHNlLFxuICBzdG9yYWdlID0gd2luZG93LnNlc3Npb25TdG9yYWdlLFxufTogRmVhdHVyZVByb3BzKTogSlNYLkVsZW1lbnQge1xuICAvLyBDYXB0dXJlIG9ubHkgZmlyc3QgdmFsdWU7IHdlIGRvbid0IGNhcmUgYWJvdXQgZnV0dXJlIHVwZGF0ZXNcbiAgY29uc3QgZmVhdHVyZXNSZWYgPSB1c2VSZWYoZmVhdHVyZXMpO1xuICBjb25zdCBbb3ZlcnJpZGVzU3RhdGUsIG92ZXJyaWRlc0Rpc3BhdGNoXSA9IHVzZVJlZHVjZXIoXG4gICAgZmVhdHVyZXNSZWR1Y2VyLFxuICAgIGluaXRpYWxGZWF0dXJlc1N0YXRlLFxuICApO1xuICBjb25zdCBbZGVmYXVsdHNTdGF0ZSwgZGVmYXVsdHNEaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKFxuICAgIGZlYXR1cmVzUmVkdWNlcixcbiAgICBpbml0aWFsRmVhdHVyZXNTdGF0ZSxcbiAgKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vLyBMb2FkIGRlZmF1bHRzXG4gICAgZGVmYXVsdHNEaXNwYXRjaCh7IHR5cGU6ICdJTklUJywgZmVhdHVyZXMgfSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGRlZmF1bHRzRGlzcGF0Y2goeyB0eXBlOiAnREVfSU5JVCcgfSk7XG4gICAgfTtcbiAgfSwgW2ZlYXR1cmVzXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgZjogUmVjb3JkPHN0cmluZywgYm9vbGVhbiB8IHVuZGVmaW5lZD4gPSB7fTtcbiAgICBpZiAoc3RvcmFnZSAhPSBudWxsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBmZWF0dXJlc0pzb24gPSBzdG9yYWdlLmdldEl0ZW0oS0VZKTtcbiAgICAgICAgaWYgKGZlYXR1cmVzSnNvbiAhPSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgZmggPSBKU09OLnBhcnNlKGZlYXR1cmVzSnNvbik7XG4gICAgICAgICAgZiA9IGZoLm92ZXJyaWRlcztcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBDYW4ndCBwYXJzZSBvciBnZXQgb3Igb3RoZXJ3aXNlOyBpZ25vcmVcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgaW4gbG9jYWxTdG9yYWdlJywgZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgb3ZlcnJpZGVzRGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ0lOSVQnLFxuICAgICAgZmVhdHVyZXM6IGZlYXR1cmVzUmVmLmN1cnJlbnRcbiAgICAgICAgLmZpbHRlcigoeCkgPT4geC5ub092ZXJyaWRlICE9PSB0cnVlKVxuICAgICAgICAubWFwKCh4KSA9PiAoe1xuICAgICAgICAgIG5hbWU6IHgubmFtZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogeC5kZXNjcmlwdGlvbixcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6IGY/Llt4Lm5hbWVdID8/IHVuZGVmaW5lZCxcbiAgICAgICAgfSkpLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIG92ZXJyaWRlc0Rpc3BhdGNoKHsgdHlwZTogJ0RFX0lOSVQnIH0pO1xuICAgIH07XG4gIH0sIFtzdG9yYWdlXSk7XG5cbiAgLy8gSGFuZGxlIGFzeW5jIG9wZXJhdGlvbnMgZm9yIGZlYXR1cmVzIHdpdGggb25DaGFuZ2VEZWZhdWx0XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGRlZmF1bHRzU3RhdGUudmFsdWUgIT09ICdyZWFkeScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgZmVhdHVyZXMgaW4gYXN5bmMgc3RhdGVzIGFuZCBoYW5kbGUgdGhlbVxuICAgIE9iamVjdC5lbnRyaWVzKGRlZmF1bHRzU3RhdGUuY29udGV4dC5mZWF0dXJlcykuZm9yRWFjaChcbiAgICAgIChbbmFtZSwgZmVhdHVyZV0pID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGZlYXR1cmUudmFsdWUgPT09ICdhc3luY0VuYWJsZWQnIHx8XG4gICAgICAgICAgZmVhdHVyZS52YWx1ZSA9PT0gJ2FzeW5jRGlzYWJsZWQnIHx8XG4gICAgICAgICAgZmVhdHVyZS52YWx1ZSA9PT0gJ2FzeW5jVW5zcGVjaWZpZWQnXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IHRhcmdldFZhbHVlID1cbiAgICAgICAgICAgIGZlYXR1cmUudmFsdWUgPT09ICdhc3luY0VuYWJsZWQnXG4gICAgICAgICAgICAgID8gdHJ1ZVxuICAgICAgICAgICAgICA6IGZlYXR1cmUudmFsdWUgPT09ICdhc3luY0Rpc2FibGVkJ1xuICAgICAgICAgICAgICAgID8gZmFsc2VcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGNvbnN0IG9uQ2hhbmdlRGVmYXVsdCA9IGZlYXR1cmUuZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdDtcbiAgICAgICAgICBpZiAob25DaGFuZ2VEZWZhdWx0ICE9IG51bGwgJiYgZmVhdHVyZS5mZWF0dXJlRGVzYyAhPSBudWxsKSB7XG4gICAgICAgICAgICBvbkNoYW5nZURlZmF1bHQoZmVhdHVyZS5mZWF0dXJlRGVzYy5uYW1lLCB0YXJnZXRWYWx1ZSlcbiAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzRGlzcGF0Y2goeyB0eXBlOiAnQVNZTkNfRE9ORScsIG5hbWUsIHZhbHVlOiByZXN1bHQgfSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdHNEaXNwYXRjaCh7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnQVNZTkNfRE9ORScsXG4gICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH0sIFtkZWZhdWx0c1N0YXRlXSk7XG5cbiAgdXNlUGVyc2lzdChzdG9yYWdlLCBmZWF0dXJlc1JlZi5jdXJyZW50LCBvdmVycmlkZXNTdGF0ZSk7XG5cbiAgY29uc3QgdGVzdENhbGxiYWNrID0gdXNlVGVzdENhbGxiYWNrKG92ZXJyaWRlc1N0YXRlLCBkZWZhdWx0c1N0YXRlKTtcbiAgdXNlQ29uc29sZU92ZXJyaWRlKFxuICAgICFkaXNhYmxlQ29uc29sZSxcbiAgICBmZWF0dXJlc1JlZi5jdXJyZW50LFxuICAgIHRlc3RDYWxsYmFjayxcbiAgICBkZWZhdWx0c0Rpc3BhdGNoLFxuICApO1xuXG4gIGNvbnN0IGZlYXR1cmVWYWx1ZSA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIG92ZXJyaWRlc1NlbmQ6IG92ZXJyaWRlc0Rpc3BhdGNoLFxuICAgICAgZGVmYXVsdHNTZW5kOiBkZWZhdWx0c0Rpc3BhdGNoLFxuICAgICAgZmVhdHVyZXNEZXNjcmlwdGlvbjogZmVhdHVyZXNSZWYuY3VycmVudCxcbiAgICAgIG92ZXJyaWRlc1N0YXRlLFxuICAgICAgZGVmYXVsdHNTdGF0ZSxcbiAgICAgIHRlc3Q6IHRlc3RDYWxsYmFjayxcbiAgICB9KSxcbiAgICBbb3ZlcnJpZGVzU3RhdGUsIGRlZmF1bHRzU3RhdGUsIHRlc3RDYWxsYmFja10sXG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8RmVhdHVyZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e2ZlYXR1cmVWYWx1ZX0+XG4gICAgICA8RW5hYmxlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dGVzdENhbGxiYWNrfT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9FbmFibGVDb250ZXh0LlByb3ZpZGVyPlxuICAgIDwvRmVhdHVyZUNvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59XG4iLCAiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0eXBlIHsgRmVhdHVyZURlc2NyaXB0aW9uLCBGZWF0dXJlVmFsdWUgfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVzRGlzcGF0Y2gsIEZlYXR1cmVzU3RhdGUgfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuXG5leHBvcnQgY29uc3QgRmVhdHVyZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0PEZlYXR1cmVDb250ZXh0VHlwZSB8IG51bGw+KG51bGwpO1xuXG4vLy8gR2l2ZSBhY2Nlc3MgdG8gdGhlIG92ZXJyaWRlcyBsYXllclxuZXhwb3J0IGludGVyZmFjZSBGZWF0dXJlQ29udGV4dFR5cGUge1xuICAvLyBNYWtlIGNoYW5nZXMgdG8gdGhlIG92ZXJyaWRlc1xuICBvdmVycmlkZXNTZW5kOiBGZWF0dXJlc0Rpc3BhdGNoO1xuXG4gIC8vIE1ha2UgY2hhbmdlcyB0byBkZWZhdWx0c1xuICBkZWZhdWx0c1NlbmQ6IEZlYXR1cmVzRGlzcGF0Y2g7XG5cbiAgZmVhdHVyZXNEZXNjcmlwdGlvbjogcmVhZG9ubHkgRmVhdHVyZURlc2NyaXB0aW9uW107XG5cbiAgLy8gU3RhdGUgaXMgaW4gbGF5ZXJzOyBvdmVycmlkZXMgYW5kIGRlZmF1bHRzXG4gIG92ZXJyaWRlc1N0YXRlOiBGZWF0dXJlc1N0YXRlO1xuICBkZWZhdWx0c1N0YXRlOiBGZWF0dXJlc1N0YXRlO1xuXG4gIC8vLyBUZXN0IHdpdGggcHJvcGVyIGZhbGxiYWNrIGFuZCByZXNwZWN0aW5nIHRoZSB1c2VyJ3MgZm9yY2UgcHJlZmVyZW5jZVxuICB0ZXN0OiAoZmxhZzogc3RyaW5nKSA9PiBGZWF0dXJlVmFsdWU7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBEaXNwYXRjaCB9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBGZWF0dXJlIGlzIGVpdGhlciBvbiwgb2ZmLCBvciAndW5zZXQnLFxuICogd2hpY2ggbWVhbnMgaXQgd2lsbCBnbyB0byB0aGUgZGVmYXVsdCB2YWx1ZSBvciB0aGUgbGVzcyBzcGVjaWZpYyB2YWx1ZS5cbiAqL1xuZXhwb3J0IHR5cGUgRmVhdHVyZVZhbHVlID0gZmFsc2UgfCB0cnVlIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBGZWF0dXJlU3RhdGVWYWx1ZSA9XG4gIHwgJ2luaXRpYWwnXG4gIHwgJ2VuYWJsZWQnXG4gIHwgJ2Rpc2FibGVkJ1xuICB8ICd1bnNwZWNpZmllZCdcbiAgfCAnYXN5bmNFbmFibGVkJ1xuICB8ICdhc3luY0Rpc2FibGVkJ1xuICB8ICdhc3luY1Vuc3BlY2lmaWVkJztcblxuZXhwb3J0IGludGVyZmFjZSBGZWF0dXJlU3RhdGUge1xuICB2YWx1ZTogRmVhdHVyZVN0YXRlVmFsdWU7XG4gIGZlYXR1cmVEZXNjPzogRmVhdHVyZURlc2NyaXB0aW9uO1xufVxuXG5leHBvcnQgdHlwZSBGZWF0dXJlRGlzcGF0Y2ggPSBEaXNwYXRjaDxGZWF0dXJlQWN0aW9uPjtcblxuLy8vIEdpdmVuIGEgZmVhdHVyZXN0YXRlLCBkZXRlcm1pbmUgdGhlIHZhbHVlIChvbiwgb2ZmLCBvciB1bnNldClcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUZvclN0YXRlKFxuICBmZWF0dXJlU3RhdGU6IEZlYXR1cmVTdGF0ZSxcbik6IFtGZWF0dXJlVmFsdWUsIGJvb2xlYW5dIHtcbiAgcmV0dXJuIFtcbiAgICBmZWF0dXJlU3RhdGUudmFsdWUgPT09ICdlbmFibGVkJyB8fCBmZWF0dXJlU3RhdGUudmFsdWUgPT09ICdhc3luY0VuYWJsZWQnXG4gICAgICA/IHRydWVcbiAgICAgIDogZmVhdHVyZVN0YXRlLnZhbHVlID09PSAnZGlzYWJsZWQnIHx8XG4gICAgICAgICAgZmVhdHVyZVN0YXRlLnZhbHVlID09PSAnYXN5bmNEaXNhYmxlZCdcbiAgICAgICAgPyBmYWxzZVxuICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICBmZWF0dXJlU3RhdGUuZmVhdHVyZURlc2M/LmZvcmNlID8/IGZhbHNlLFxuICBdO1xufVxuXG4vKipcbiAqIERlZmluaXRpb24gb2YgYSBmZWF0dXJlIHRoYXQgY2FuIGJlIGVuYWJsZWQgb3IgZGlzYWJsZWQuXG4gKiBLIGlzIHRoZSB0eXBlIG9mIHRoZSBrZXkgdGhhdCBpcyB1c2VkIHRvIGlkZW50aWZ5IHRoZSBmZWF0dXJlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZlYXR1cmVEZXNjcmlwdGlvbjxLIGV4dGVuZHMgc3RyaW5nID0gc3RyaW5nPiB7XG4gIHJlYWRvbmx5IG5hbWU6IEs7XG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8vLyBJZiBzZXQsIHdpbGwgYmUgdXNlZCB0byB1cGRhdGUgdGhlIGZlYXR1cmUgZGVmYXVsdCBzdGF0ZSBpbnN0ZWFkIG9mIHNpbXBseSBvdmVycmlkaW5nLlxuICAvLy8gRm9yIGV4YW1wbGUsIHlvdSBtaWdodCB1c2UgdGhpcyB0byB1cGRhdGUgYSBmZWF0dXJlIGZsYWcgb24gYSBiYWNrZW5kIHNlcnZlci5cbiAgLy8vIHdoZW4gc2V0LCB0aGUgZmVhdHVyZSB3aWxsIGJlIHVwZGF0ZWQgb24gdGhlIGJhY2tlbmQgc2VydmVyLCBhbmQgdGhlIHJlc3VsdCBvZiB0aGUgYXN5bmNcbiAgLy8vIHdpbGwgYmUgdXNlZCBmb3IgdGhlIGZpbmFsIHN0YXRlIGFmdGVyIHRoZSBjaGFuZ2UuIHdoaWxlIGNoYW5naW5nLCB0aGUgZmVhdHVyZSB3aWxsIGJlXG4gIC8vLyBpbiB0aGUgJ2NoYW5naW5nJyBzdGF0ZS4gQWxzbyBub3RlIHRoYXQgdGhlIGZlYXR1cmUgd2lsbCBiZSBjaGFuZ2VkIGF0IHRoZSBcImRlZmF1bHRcIiBsYXllci5cbiAgcmVhZG9ubHkgb25DaGFuZ2VEZWZhdWx0PzogKFxuICAgIG5hbWU6IEssXG4gICAgbmV3VmFsdWU6IEZlYXR1cmVWYWx1ZSxcbiAgKSA9PiBQcm9taXNlPEZlYXR1cmVWYWx1ZT47XG5cbiAgLy8vIGlmIHNldCB0cnVlLCB3aWxsIGZvcmNlIHRoZSBmaWVsZCB0byB3aGF0IGl0IGlzIHNldCBoZXJlIHRocm91Z2ggbGF5ZXJzIG9mIHN0YXRlcy5cbiAgLy8vIHVzZWZ1bCB0byBpbnZlcnQgdGhlIGxheWVycywgc2ltaWxhciB0byAhaW1wb3J0YW50IGluIENTUy5cbiAgcmVhZG9ubHkgZm9yY2U/OiBib29sZWFuO1xuXG4gIC8vLyBJZiBzZXQgdG8gdHJ1ZSwgdGhlIGZlYXR1cmUgd2lsbCBub3QgYmUgb3ZlcnJpZGFibGUgYnkgdGhlIHVzZXIuXG4gIHJlYWRvbmx5IG5vT3ZlcnJpZGU/OiBib29sZWFuO1xuXG4gIC8vLyBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHdoYXQgc2hvdWxkIGhhcHBlbiBpZiB0aGUgZmVhdHVyZSBpcyBub3Qgc2V0IHRvIGEgcGFydGljdWxhciB2YWx1ZS5cbiAgcmVhZG9ubHkgZGVmYXVsdFZhbHVlPzogRmVhdHVyZVZhbHVlO1xufVxuXG4vKipcbiAqIEFjdGlvbnMgdGhhdCBjYW4gYmUgcGVyZm9ybWVkIG9uIGEgZmVhdHVyZS5cbiAqL1xuZXhwb3J0IHR5cGUgRmVhdHVyZUFjdGlvbiA9XG4gIHwgeyB0eXBlOiAnRElTQUJMRScgfVxuICB8IHsgdHlwZTogJ0VOQUJMRScgfVxuICB8IHsgdHlwZTogJ0lOSVQnOyBmZWF0dXJlOiBGZWF0dXJlRGVzY3JpcHRpb24gfVxuICB8IHsgdHlwZTogJ1NFVCc7IHZhbHVlOiBGZWF0dXJlVmFsdWUgfVxuICB8IHsgdHlwZTogJ1RPR0dMRScgfVxuICB8IHsgdHlwZTogJ1VOU0VUJyB9XG4gIHwgeyB0eXBlOiAnQVNZTkNfRE9ORSc7IHZhbHVlOiBGZWF0dXJlVmFsdWUgfTtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxGZWF0dXJlU3RhdGU6IEZlYXR1cmVTdGF0ZSA9IHtcbiAgdmFsdWU6ICdpbml0aWFsJyxcbn07XG5cbi8qKlxuICogUmVkdWNlciBmb3IgbWFuYWdpbmcgaW5kaXZpZHVhbCBmZWF0dXJlIHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmZWF0dXJlUmVkdWNlcihcbiAgc3RhdGU6IEZlYXR1cmVTdGF0ZSxcbiAgYWN0aW9uOiBGZWF0dXJlQWN0aW9uLFxuKTogRmVhdHVyZVN0YXRlIHtcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgJ0lOSVQnOiB7XG4gICAgICBjb25zdCB7IGZlYXR1cmUgfSA9IGFjdGlvbjtcbiAgICAgIGNvbnN0IHZhbHVlID1cbiAgICAgICAgZmVhdHVyZS5kZWZhdWx0VmFsdWUgPT09IHRydWVcbiAgICAgICAgICA/ICdlbmFibGVkJ1xuICAgICAgICAgIDogZmVhdHVyZS5kZWZhdWx0VmFsdWUgPT09IGZhbHNlXG4gICAgICAgICAgICA/ICdkaXNhYmxlZCdcbiAgICAgICAgICAgIDogJ3Vuc3BlY2lmaWVkJztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSBhcyBGZWF0dXJlU3RhdGVWYWx1ZSxcbiAgICAgICAgZmVhdHVyZURlc2M6IGZlYXR1cmUsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNhc2UgJ0VOQUJMRSc6IHtcbiAgICAgIGlmIChzdGF0ZS5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnYXN5bmNFbmFibGVkJyB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnZW5hYmxlZCcgfTtcbiAgICB9XG5cbiAgICBjYXNlICdESVNBQkxFJzoge1xuICAgICAgaWYgKHN0YXRlLmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsdWU6ICdhc3luY0Rpc2FibGVkJyB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnZGlzYWJsZWQnIH07XG4gICAgfVxuXG4gICAgY2FzZSAnVE9HR0xFJzoge1xuICAgICAgaWYgKHN0YXRlLmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsdWU6ICdhc3luY0VuYWJsZWQnIH07XG4gICAgICB9XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsdWU6ICdlbmFibGVkJyB9O1xuICAgIH1cblxuICAgIGNhc2UgJ1VOU0VUJzoge1xuICAgICAgaWYgKHN0YXRlLmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsdWU6ICdhc3luY1Vuc3BlY2lmaWVkJyB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAndW5zcGVjaWZpZWQnIH07XG4gICAgfVxuXG4gICAgY2FzZSAnU0VUJzoge1xuICAgICAgY29uc3QgeyB2YWx1ZSB9ID0gYWN0aW9uO1xuICAgICAgaWYgKHN0YXRlLmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCkge1xuICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsdWU6ICdhc3luY0VuYWJsZWQnIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB2YWx1ZTogJ2FzeW5jRGlzYWJsZWQnIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnYXN5bmNVbnNwZWNpZmllZCcgfTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsdWU6ICdlbmFibGVkJyB9O1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsdWU6ICdkaXNhYmxlZCcgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB2YWx1ZTogJ3Vuc3BlY2lmaWVkJyB9O1xuICAgIH1cblxuICAgIGNhc2UgJ0FTWU5DX0RPTkUnOiB7XG4gICAgICBjb25zdCB7IHZhbHVlIH0gPSBhY3Rpb247XG4gICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnZW5hYmxlZCcgfTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHZhbHVlOiAnZGlzYWJsZWQnIH07XG4gICAgICB9XG4gICAgICByZXR1cm4geyAuLi5zdGF0ZSwgdmFsdWU6ICd1bnNwZWNpZmllZCcgfTtcbiAgICB9XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBEaXNwYXRjaCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHtcbiAgdHlwZSBGZWF0dXJlRGVzY3JpcHRpb24sXG4gIHR5cGUgRmVhdHVyZVN0YXRlLFxuICB0eXBlIEZlYXR1cmVWYWx1ZSxcbiAgdmFsdWVGb3JTdGF0ZSxcbn0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZlYXR1cmVzQ29udGV4dCB7XG4gIC8vIGZlYXR1cmVzIGFyZSBsYXllcmVkOlxuICAvLyAgLSBkZWZhdWx0czogaWYgbm90aGluZyBlbHNlIG1hdGNoZXMsIHByb3ZpZGVkIGEgdmFsdWUgZm9yIGZlYXR1cmVcbiAgLy8gIC0gYnJvd3NlcjogYnJvd3Nlci1sb2NhbCB2YWx1ZXMgZm9yIGZlYXR1cmVzIChrZXB0IGluIGxvY2FsIHN0b3JhZ2UsIGV0YylcbiAgLy8gIC0gdXNlcjogdmFsdWVzIGZyb20gdGhlIHVzZXIncyBwcm9maWxlLCBpZiBhbnlcbiAgLy8gIC0gb3JnOiB2YWx1ZSBmcm9tIHRoZSBvcmcncyBwcm9maWxlLCBpZiBhbnlcbiAgZmVhdHVyZXM6IHsgW3g6IHN0cmluZ106IEZlYXR1cmVTdGF0ZSB9O1xufVxuXG5leHBvcnQgdHlwZSBGZWF0dXJlc0FjdGlvbiA9XG4gIHwgeyB0eXBlOiAnREVfSU5JVCcgfVxuICB8IHsgdHlwZTogJ0RJU0FCTEUnOyBuYW1lOiBzdHJpbmcgfVxuICB8IHsgdHlwZTogJ0VOQUJMRSc7IG5hbWU6IHN0cmluZyB9XG4gIHwgeyB0eXBlOiAnSU5JVCc7IGZlYXR1cmVzOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXSB9XG4gIHwgeyB0eXBlOiAnU0VUX0FMTCc7IGZlYXR1cmVzOiB7IFtrZXk6IHN0cmluZ106IEZlYXR1cmVWYWx1ZSB9IH1cbiAgfCB7IHR5cGU6ICdTRVQnOyBuYW1lOiBzdHJpbmc7IHZhbHVlOiBGZWF0dXJlVmFsdWUgfVxuICB8IHsgdHlwZTogJ1RPR0dMRSc7IG5hbWU6IHN0cmluZyB9XG4gIHwgeyB0eXBlOiAnVU5TRVQnOyBuYW1lOiBzdHJpbmcgfVxuICB8IHsgdHlwZTogJ0FTWU5DX0RPTkUnOyBuYW1lOiBzdHJpbmc7IHZhbHVlOiBGZWF0dXJlVmFsdWUgfTtcblxuZXhwb3J0IGludGVyZmFjZSBGZWF0dXJlc1N0YXRlIHtcbiAgdmFsdWU6ICdpZGxlJyB8ICdyZWFkeSc7XG4gIGNvbnRleHQ6IEZlYXR1cmVzQ29udGV4dDtcbn1cblxuZXhwb3J0IHR5cGUgRmVhdHVyZXNEaXNwYXRjaCA9IERpc3BhdGNoPEZlYXR1cmVzQWN0aW9uPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlT2ZGZWF0dXJlKFxuICBmZWF0dXJlc1N0YXRlOiBGZWF0dXJlc1N0YXRlLFxuICBmZWF0dXJlOiBzdHJpbmcsXG4pOiBbRmVhdHVyZVZhbHVlLCBib29sZWFuXSB7XG4gIGlmIChmZWF0dXJlc1N0YXRlLmNvbnRleHQuZmVhdHVyZXNbZmVhdHVyZV0gPT0gbnVsbCkge1xuICAgIHJldHVybiBbdW5kZWZpbmVkLCBmYWxzZV07XG4gIH1cbiAgY29uc3QgZmVhdHVyZVN0YXRlID0gZmVhdHVyZXNTdGF0ZS5jb250ZXh0LmZlYXR1cmVzW2ZlYXR1cmVdO1xuICBpZiAoZmVhdHVyZVN0YXRlICE9IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWVGb3JTdGF0ZShmZWF0dXJlU3RhdGUpO1xuICB9XG4gIHJldHVybiBbdW5kZWZpbmVkLCBmYWxzZV07XG59XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsRmVhdHVyZXNTdGF0ZTogRmVhdHVyZXNTdGF0ZSA9IHtcbiAgdmFsdWU6ICdpZGxlJyxcbiAgY29udGV4dDoge1xuICAgIGZlYXR1cmVzOiB7fSxcbiAgfSxcbn07XG5cbi8qKlxuICogUmVkdWNlciBmb3IgbWFuYWdpbmcgYSBjb2xsZWN0aW9uIG9mIGZlYXR1cmVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmZWF0dXJlc1JlZHVjZXIoXG4gIHN0YXRlOiBGZWF0dXJlc1N0YXRlLFxuICBhY3Rpb246IEZlYXR1cmVzQWN0aW9uLFxuKTogRmVhdHVyZXNTdGF0ZSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlICdJTklUJzoge1xuICAgICAgaWYgKGFjdGlvbi5mZWF0dXJlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlczogeyBbeDogc3RyaW5nXTogRmVhdHVyZVN0YXRlIH0gPSB7fTtcbiAgICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBhY3Rpb24uZmVhdHVyZXMpIHtcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBlYWNoIGZlYXR1cmVcbiAgICAgICAgY29uc3QgZmVhdHVyZVN0YXRlID0ge1xuICAgICAgICAgIHZhbHVlOlxuICAgICAgICAgICAgZmVhdHVyZS5kZWZhdWx0VmFsdWUgPT09IHRydWVcbiAgICAgICAgICAgICAgPyAoJ2VuYWJsZWQnIGFzIGNvbnN0KVxuICAgICAgICAgICAgICA6IGZlYXR1cmUuZGVmYXVsdFZhbHVlID09PSBmYWxzZVxuICAgICAgICAgICAgICAgID8gKCdkaXNhYmxlZCcgYXMgY29uc3QpXG4gICAgICAgICAgICAgICAgOiAoJ3Vuc3BlY2lmaWVkJyBhcyBjb25zdCksXG4gICAgICAgICAgZmVhdHVyZURlc2M6IGZlYXR1cmUsXG4gICAgICAgIH07XG4gICAgICAgIGZlYXR1cmVzW2ZlYXR1cmUubmFtZV0gPSBmZWF0dXJlU3RhdGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiAncmVhZHknLFxuICAgICAgICBjb250ZXh0OiB7IGZlYXR1cmVzIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNhc2UgJ0RFX0lOSVQnOiB7XG4gICAgICByZXR1cm4gaW5pdGlhbEZlYXR1cmVzU3RhdGU7XG4gICAgfVxuXG4gICAgY2FzZSAnU0VUX0FMTCc6IHtcbiAgICAgIGlmIChzdGF0ZS52YWx1ZSAhPT0gJ3JlYWR5Jykge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmVzID0geyAuLi5zdGF0ZS5jb250ZXh0LmZlYXR1cmVzIH07XG4gICAgICBPYmplY3Qua2V5cyhmZWF0dXJlcykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGFjdGlvbi5mZWF0dXJlc1tuYW1lXSA/PyB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRGZWF0dXJlID0gZmVhdHVyZXNbbmFtZV07XG5cbiAgICAgICAgaWYgKGN1cnJlbnRGZWF0dXJlLmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCkge1xuICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZmVhdHVyZXNbbmFtZV0gPSB7IC4uLmN1cnJlbnRGZWF0dXJlLCB2YWx1ZTogJ2FzeW5jRW5hYmxlZCcgfTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZmVhdHVyZXNbbmFtZV0gPSB7IC4uLmN1cnJlbnRGZWF0dXJlLCB2YWx1ZTogJ2FzeW5jRGlzYWJsZWQnIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZlYXR1cmVzW25hbWVdID0geyAuLi5jdXJyZW50RmVhdHVyZSwgdmFsdWU6ICdhc3luY1Vuc3BlY2lmaWVkJyB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGZlYXR1cmVzW25hbWVdID0geyAuLi5jdXJyZW50RmVhdHVyZSwgdmFsdWU6ICdlbmFibGVkJyB9O1xuICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBmZWF0dXJlc1tuYW1lXSA9IHsgLi4uY3VycmVudEZlYXR1cmUsIHZhbHVlOiAnZGlzYWJsZWQnIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZlYXR1cmVzW25hbWVdID0geyAuLi5jdXJyZW50RmVhdHVyZSwgdmFsdWU6ICd1bnNwZWNpZmllZCcgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgY29udGV4dDogeyBmZWF0dXJlcyB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjYXNlICdTRVQnOiB7XG4gICAgICBpZiAoc3RhdGUudmFsdWUgIT09ICdyZWFkeScpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlID0gc3RhdGUuY29udGV4dC5mZWF0dXJlc1thY3Rpb24ubmFtZV07XG4gICAgICBpZiAoZmVhdHVyZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyB2YWx1ZSB9ID0gYWN0aW9uO1xuICAgICAgbGV0IG5ld1ZhbHVlOiBGZWF0dXJlU3RhdGVbJ3ZhbHVlJ107XG5cbiAgICAgIGlmIChmZWF0dXJlLmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCkge1xuICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9ICdhc3luY0VuYWJsZWQnO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gJ2FzeW5jRGlzYWJsZWQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1ZhbHVlID0gJ2FzeW5jVW5zcGVjaWZpZWQnO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9ICdlbmFibGVkJztcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9ICdkaXNhYmxlZCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSAndW5zcGVjaWZpZWQnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZXM6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlLmNvbnRleHQuZmVhdHVyZXMsXG4gICAgICAgICAgICBbYWN0aW9uLm5hbWVdOiB7IC4uLmZlYXR1cmUsIHZhbHVlOiBuZXdWYWx1ZSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNhc2UgJ1RPR0dMRSc6IHtcbiAgICAgIGlmIChzdGF0ZS52YWx1ZSAhPT0gJ3JlYWR5Jykge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmUgPSBzdGF0ZS5jb250ZXh0LmZlYXR1cmVzW2FjdGlvbi5uYW1lXTtcbiAgICAgIGlmIChmZWF0dXJlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdWYWx1ZSA9XG4gICAgICAgIGZlYXR1cmUuZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsXG4gICAgICAgICAgPyAnYXN5bmNFbmFibGVkJ1xuICAgICAgICAgIDogJ2VuYWJsZWQnO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgIGZlYXR1cmVzOiB7XG4gICAgICAgICAgICAuLi5zdGF0ZS5jb250ZXh0LmZlYXR1cmVzLFxuICAgICAgICAgICAgW2FjdGlvbi5uYW1lXTogeyAuLi5mZWF0dXJlLCB2YWx1ZTogbmV3VmFsdWUgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjYXNlICdFTkFCTEUnOiB7XG4gICAgICBpZiAoc3RhdGUudmFsdWUgIT09ICdyZWFkeScpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlID0gc3RhdGUuY29udGV4dC5mZWF0dXJlc1thY3Rpb24ubmFtZV07XG4gICAgICBpZiAoZmVhdHVyZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV3VmFsdWUgPVxuICAgICAgICBmZWF0dXJlLmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbFxuICAgICAgICAgID8gJ2FzeW5jRW5hYmxlZCdcbiAgICAgICAgICA6ICdlbmFibGVkJztcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICBmZWF0dXJlczoge1xuICAgICAgICAgICAgLi4uc3RhdGUuY29udGV4dC5mZWF0dXJlcyxcbiAgICAgICAgICAgIFthY3Rpb24ubmFtZV06IHsgLi4uZmVhdHVyZSwgdmFsdWU6IG5ld1ZhbHVlIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY2FzZSAnRElTQUJMRSc6IHtcbiAgICAgIGlmIChzdGF0ZS52YWx1ZSAhPT0gJ3JlYWR5Jykge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmUgPSBzdGF0ZS5jb250ZXh0LmZlYXR1cmVzW2FjdGlvbi5uYW1lXTtcbiAgICAgIGlmIChmZWF0dXJlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdWYWx1ZSA9XG4gICAgICAgIGZlYXR1cmUuZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsXG4gICAgICAgICAgPyAnYXN5bmNEaXNhYmxlZCdcbiAgICAgICAgICA6ICdkaXNhYmxlZCc7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZXM6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlLmNvbnRleHQuZmVhdHVyZXMsXG4gICAgICAgICAgICBbYWN0aW9uLm5hbWVdOiB7IC4uLmZlYXR1cmUsIHZhbHVlOiBuZXdWYWx1ZSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNhc2UgJ1VOU0VUJzoge1xuICAgICAgaWYgKHN0YXRlLnZhbHVlICE9PSAncmVhZHknKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVhdHVyZSA9IHN0YXRlLmNvbnRleHQuZmVhdHVyZXNbYWN0aW9uLm5hbWVdO1xuICAgICAgaWYgKGZlYXR1cmUgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5ld1ZhbHVlID1cbiAgICAgICAgZmVhdHVyZS5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGxcbiAgICAgICAgICA/ICdhc3luY1Vuc3BlY2lmaWVkJ1xuICAgICAgICAgIDogJ3Vuc3BlY2lmaWVkJztcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICBmZWF0dXJlczoge1xuICAgICAgICAgICAgLi4uc3RhdGUuY29udGV4dC5mZWF0dXJlcyxcbiAgICAgICAgICAgIFthY3Rpb24ubmFtZV06IHsgLi4uZmVhdHVyZSwgdmFsdWU6IG5ld1ZhbHVlIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY2FzZSAnQVNZTkNfRE9ORSc6IHtcbiAgICAgIGlmIChzdGF0ZS52YWx1ZSAhPT0gJ3JlYWR5Jykge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmUgPSBzdGF0ZS5jb250ZXh0LmZlYXR1cmVzW2FjdGlvbi5uYW1lXTtcbiAgICAgIGlmIChmZWF0dXJlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IHZhbHVlIH0gPSBhY3Rpb247XG4gICAgICBjb25zdCBuZXdWYWx1ZSA9XG4gICAgICAgIHZhbHVlID09PSB0cnVlXG4gICAgICAgICAgPyAnZW5hYmxlZCdcbiAgICAgICAgICA6IHZhbHVlID09PSBmYWxzZVxuICAgICAgICAgICAgPyAnZGlzYWJsZWQnXG4gICAgICAgICAgICA6ICd1bnNwZWNpZmllZCc7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZXM6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlLmNvbnRleHQuZmVhdHVyZXMsXG4gICAgICAgICAgICBbYWN0aW9uLm5hbWVdOiB7IC4uLmZlYXR1cmUsIHZhbHVlOiBuZXdWYWx1ZSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVEZXNjcmlwdGlvbiwgRmVhdHVyZVZhbHVlIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlc0Rpc3BhdGNoIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcbmltcG9ydCB7IEdsb2JhbEVuYWJsZSB9IGZyb20gJy4vR2xvYmFsRW5hYmxlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQ29uc29sZU92ZXJyaWRlKFxuICBjb25zb2xlT3ZlcnJpZGU6IGJvb2xlYW4sXG4gIGZlYXR1cmVzOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXSxcbiAgdGVzdEZlYXR1cmU6IChfOiBzdHJpbmcpID0+IEZlYXR1cmVWYWx1ZSxcbiAgZGlzcGF0Y2g6IEZlYXR1cmVzRGlzcGF0Y2gsXG4pOiB2b2lkIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWNvbnNvbGVPdmVycmlkZSkge1xuICAgICAgLy8gQ2xlYW4gdXAgd2luZG93LmZlYXR1cmUgaW1tZWRpYXRlbHkgaWYgY29uc29sZU92ZXJyaWRlIGlzIGRpc2FibGVkXG4gICAgICBpZiAod2luZG93LmZlYXR1cmUgIT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuZmVhdHVyZSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmICh3aW5kb3cuZmVhdHVyZSAhPSBudWxsKSB7XG4gICAgICAgICAgd2luZG93LmZlYXR1cmUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHdpbmRvdy5mZWF0dXJlID0gbmV3IEdsb2JhbEVuYWJsZShkaXNwYXRjaCwgdGVzdEZlYXR1cmUsIGZlYXR1cmVzKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHdpbmRvdy5mZWF0dXJlICE9IG51bGwpIHtcbiAgICAgICAgd2luZG93LmZlYXR1cmUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW2ZlYXR1cmVzLCBkaXNwYXRjaCwgY29uc29sZU92ZXJyaWRlLCB0ZXN0RmVhdHVyZV0pO1xufVxuIiwgImltcG9ydCB0eXBlIHsgRmVhdHVyZURlc2NyaXB0aW9uLCBGZWF0dXJlVmFsdWUgfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVzRGlzcGF0Y2ggfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuXG5leHBvcnQgY2xhc3MgR2xvYmFsRW5hYmxlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBmZWF0dXJlRGVzYzogcmVhZG9ubHkgRmVhdHVyZURlc2NyaXB0aW9uW107XG4gIHByaXZhdGUgcmVhZG9ubHkgZGlzcGF0Y2g6IEZlYXR1cmVzRGlzcGF0Y2g7XG4gIHByaXZhdGUgcmVhZG9ubHkgdGVzdEZlYXR1cmU6ICh2YWx1ZTogc3RyaW5nKSA9PiBGZWF0dXJlVmFsdWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZGlzcGF0Y2g6IEZlYXR1cmVzRGlzcGF0Y2gsXG4gICAgdGVzdEZlYXR1cmU6IChfOiBzdHJpbmcpID0+IEZlYXR1cmVWYWx1ZSxcbiAgICBmZWF0dXJlRGVzYzogcmVhZG9ubHkgRmVhdHVyZURlc2NyaXB0aW9uW10sXG4gICkge1xuICAgIHRoaXMuZmVhdHVyZURlc2MgPSBmZWF0dXJlRGVzYztcbiAgICB0aGlzLmRpc3BhdGNoID0gZGlzcGF0Y2g7XG4gICAgdGhpcy50ZXN0RmVhdHVyZSA9IHRlc3RGZWF0dXJlO1xuICB9XG5cbiAgcHVibGljIHRvZ2dsZShmZWF0dXJlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoKHsgdHlwZTogJ1RPR0dMRScsIG5hbWU6IGZlYXR1cmUgfSk7XG4gIH1cblxuICBwdWJsaWMgZW5hYmxlKGZlYXR1cmU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2goeyB0eXBlOiAnRU5BQkxFJywgbmFtZTogZmVhdHVyZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyB1bnNldChmZWF0dXJlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoKHsgdHlwZTogJ1VOU0VUJywgbmFtZTogZmVhdHVyZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBkaXNhYmxlKGZlYXR1cmU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2goeyB0eXBlOiAnRElTQUJMRScsIG5hbWU6IGZlYXR1cmUgfSk7XG4gIH1cblxuICBwdWJsaWMgc2V0QWxsKGZlYXR1cmVzOiB7IFtrZXk6IHN0cmluZ106IEZlYXR1cmVWYWx1ZSB9KTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaCh7IHR5cGU6ICdTRVRfQUxMJywgZmVhdHVyZXMgfSk7XG4gIH1cblxuICBwdWJsaWMgbGlzdEZlYXR1cmVzKCk6IHJlYWRvbmx5IFtzdHJpbmcsIEZlYXR1cmVWYWx1ZV1bXSB7XG4gICAgcmV0dXJuIHRoaXMuZmVhdHVyZURlc2MubWFwKChmKSA9PiBbZi5uYW1lLCB0aGlzLnRlc3RGZWF0dXJlKGYubmFtZSldKTtcbiAgfVxufVxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBmZWF0dXJlPzogR2xvYmFsRW5hYmxlO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlRGVzY3JpcHRpb24sIEZlYXR1cmVWYWx1ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcbmltcG9ydCB7IHR5cGUgRmVhdHVyZXNTdGF0ZSwgdmFsdWVPZkZlYXR1cmUgfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuXG5leHBvcnQgY29uc3QgS0VZID0gJ3JlYWN0LWVuYWJsZTpmZWF0dXJlLXZhbHVlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZVBlcnNpc3QoXG4gIHN0b3JhZ2U6IFN0b3JhZ2UgfCB1bmRlZmluZWQsXG4gIGZlYXR1cmVzOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXSxcbiAgb3ZlcnJpZGVTdGF0ZTogRmVhdHVyZXNTdGF0ZSxcbik6IHZvaWQge1xuICBjb25zdCBvdmVycmlkZXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBuZXdPdmVycmlkZXM6IHsgW2tleTogc3RyaW5nXTogRmVhdHVyZVZhbHVlIH0gPSB7fTtcbiAgICBpZiAob3ZlcnJpZGVTdGF0ZS52YWx1ZSA9PT0gJ3JlYWR5Jykge1xuICAgICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIGZlYXR1cmVzKSB7XG4gICAgICAgIGNvbnN0IFt2YWx1ZV0gPSB2YWx1ZU9mRmVhdHVyZShvdmVycmlkZVN0YXRlLCBmZWF0dXJlLm5hbWUpO1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgIG5ld092ZXJyaWRlc1tmZWF0dXJlLm5hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld092ZXJyaWRlcztcbiAgfSwgW2ZlYXR1cmVzLCBvdmVycmlkZVN0YXRlXSk7XG5cbiAgY29uc3Qgc3RyU3RhdGUgPVxuICAgIE9iamVjdC5rZXlzKG92ZXJyaWRlcykubGVuZ3RoID09PSAwIHx8IHN0b3JhZ2UgPT0gbnVsbFxuICAgICAgPyAne30nXG4gICAgICA6IEpTT04uc3RyaW5naWZ5KHsgb3ZlcnJpZGVzIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChzdG9yYWdlICE9IG51bGwgJiYgb3ZlcnJpZGVTdGF0ZS52YWx1ZSA9PT0gJ3JlYWR5Jykge1xuICAgICAgICBzdG9yYWdlLnNldEl0ZW0oS0VZLCBzdHJTdGF0ZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gQ2FuJ3Qgc2V0IGZvciBzb21lIHJlYXNvblxuICAgIH1cbiAgfSwgW292ZXJyaWRlU3RhdGUsIHN0b3JhZ2UsIHN0clN0YXRlXSk7XG59XG4iLCAiaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB0eXBlIHsgRmVhdHVyZXNTdGF0ZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgdGVzdEZlYXR1cmUgZnJvbSAnLi90ZXN0RmVhdHVyZSc7XG5cbi8vLyBBIGNhbGxiYWNrIHRoYXQgY2FuIGJlIGNhbGxlZCB0byB0ZXN0IGlmIGEgZmVhdHVyZSBpcyBlbmFibGVkIG9yIGRpc2FibGVkXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VUZXN0Q2FsbGJhY2soXG4gIGRlZmF1bHRzU3RhdGU6IEZlYXR1cmVzU3RhdGUsXG4gIG92ZXJyaWRlc1N0YXRlOiBGZWF0dXJlc1N0YXRlLFxuKTogKGZlYXR1cmU6IHN0cmluZykgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiB1c2VDYWxsYmFjayhcbiAgICAoZjogc3RyaW5nKSA9PiB0ZXN0RmVhdHVyZShmLCBbZGVmYXVsdHNTdGF0ZSwgb3ZlcnJpZGVzU3RhdGVdKSxcbiAgICBbZGVmYXVsdHNTdGF0ZSwgb3ZlcnJpZGVzU3RhdGVdLFxuICApO1xufVxuIiwgImltcG9ydCB0eXBlIHsgRmVhdHVyZVZhbHVlIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuaW1wb3J0IHsgdHlwZSBGZWF0dXJlc1N0YXRlLCB2YWx1ZU9mRmVhdHVyZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5cbi8qKiBEZXRlcm1pbmUgaWYgdGhlIGZlYXR1cmUgaXMgZW5hYmxlZCBpbiBvbmUgb2YgdGhlIHN0YXRlIG1hY2hpbmVzLCBpbiBvcmRlclxuICpcbiAqIEBwYXJhbSBzdGF0ZSBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgbWFjaGluZVxuICogQHBhcmFtIGZlYXR1cmUgVGhlIGZlYXR1cmUgdG8gY2hlY2tcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0ZXN0RmVhdHVyZShcbiAgZmVhdHVyZTogc3RyaW5nLFxuICBzdGF0ZXM6IEZlYXR1cmVzU3RhdGVbXSxcbik6IEZlYXR1cmVWYWx1ZSB7XG4gIGNvbnN0IHZhbHVlcyA9IHN0YXRlcy5tYXAoKHN0YXRlKSA9PiB2YWx1ZU9mRmVhdHVyZShzdGF0ZSwgZmVhdHVyZSkpO1xuXG4gIC8vIGxvb2sgZm9yIGJlc3QgZm9yY2VkIG9wdGlvbiwgaW4gb3JkZXJcbiAgZm9yIChjb25zdCBbZmVhdHVyZVZhbHVlLCBmZWF0dXJlRm9yY2VkXSBvZiB2YWx1ZXMpIHtcbiAgICBpZiAoZmVhdHVyZVZhbHVlICE9IG51bGwgJiYgZmVhdHVyZUZvcmNlZCkge1xuICAgICAgcmV0dXJuIGZlYXR1cmVWYWx1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBsb29rIGZvciBiZXN0IG5vbi1mb3JjZWQgb3B0aW9uLCBpbiBvcmRlclxuICBmb3IgKGNvbnN0IFtmZWF0dXJlVmFsdWVdIG9mIHZhbHVlcykge1xuICAgIGlmIChmZWF0dXJlVmFsdWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZlYXR1cmVWYWx1ZTtcbiAgICB9XG4gIH1cblxuICAvLyB1bnNldCBpZiBub3RoaW5nIGhpdFxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIiwgImltcG9ydCB7IFJhZGlvR3JvdXAgfSBmcm9tICdAaGVhZGxlc3N1aS9yZWFjdCc7XG5pbXBvcnQgUmVhY3QsIHtcbiAgdHlwZSBSZWFjdE5vZGUsXG4gIHVzZUNhbGxiYWNrLFxuICB1c2VDb250ZXh0LFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5cbmltcG9ydCB7IEZlYXR1cmVDb250ZXh0IH0gZnJvbSAnLi9GZWF0dXJlQ29udGV4dCc7XG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVEZXNjcmlwdGlvbiB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcbmltcG9ydCB7IHZhbHVlT2ZGZWF0dXJlIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcbi8vIEB0cy1leHBlY3QtZXJyb3IgYnVuZGxlciB3aWxsIHRha2UgY2FyZSBvZiB0aGlzXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vdGFpbHdpbmQuY3NzJztcblxuZnVuY3Rpb24gY2xhc3NOYW1lcyguLi5jbGFzc2VzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIHJldHVybiBjbGFzc2VzLmZpbHRlcihCb29sZWFuKS5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIFRvZ2dsZUZlYXR1cmUoe1xuICBmZWF0dXJlLFxufToge1xuICBmZWF0dXJlOiBGZWF0dXJlRGVzY3JpcHRpb247XG59KTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoRmVhdHVyZUNvbnRleHQpO1xuICBjb25zdCBoYW5kbGVDaGFuZ2VTZWxlY3Rpb24gPSB1c2VDYWxsYmFjayhcbiAgICAodmFsdWU6ICdmYWxzZScgfCAndHJ1ZScgfCAndW5zZXQnKSA9PiB7XG4gICAgICBpZiAoY29udGV4dD8ub3ZlcnJpZGVzU2VuZCAhPSBudWxsKSB7XG4gICAgICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgICAgICBjYXNlICd0cnVlJzoge1xuICAgICAgICAgICAgY29udGV4dC5vdmVycmlkZXNTZW5kKHsgdHlwZTogJ0VOQUJMRScsIG5hbWU6IGZlYXR1cmUubmFtZSB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlICdmYWxzZSc6IHtcbiAgICAgICAgICAgIGNvbnRleHQub3ZlcnJpZGVzU2VuZCh7IHR5cGU6ICdESVNBQkxFJywgbmFtZTogZmVhdHVyZS5uYW1lIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhc2UgJ3Vuc2V0Jzoge1xuICAgICAgICAgICAgY29udGV4dC5vdmVycmlkZXNTZW5kKHsgdHlwZTogJ1VOU0VUJywgbmFtZTogZmVhdHVyZS5uYW1lIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBbZmVhdHVyZS5uYW1lLCBjb250ZXh0XSxcbiAgKTtcblxuICBpZiAoY29udGV4dCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB7IG92ZXJyaWRlc1N0YXRlLCB0ZXN0OiB0ZXN0RmVhdHVyZSwgZGVmYXVsdHNTdGF0ZSB9ID0gY29udGV4dDtcblxuICBjb25zdCB2YWx1ZUluRGVmYXVsdHMgPSAoXG4gICAgdmFsdWVPZkZlYXR1cmUoZGVmYXVsdHNTdGF0ZSwgZmVhdHVyZS5uYW1lKVswXSA/PyAndW5zZXQnXG4gICkudG9TdHJpbmcoKSBhcyAnZmFsc2UnIHwgJ3RydWUnIHwgJ3Vuc2V0JztcblxuICBjb25zdCB2YWx1ZUluT3ZlcnJpZGVzID0gKFxuICAgIHZhbHVlT2ZGZWF0dXJlKG92ZXJyaWRlc1N0YXRlLCBmZWF0dXJlLm5hbWUpWzBdID8/ICd1bnNldCdcbiAgKS50b1N0cmluZygpIGFzICdmYWxzZScgfCAndHJ1ZScgfCAndW5zZXQnO1xuXG4gIGNvbnN0IGFjdHVhbENoZWNrZWQgPSB0ZXN0RmVhdHVyZShmZWF0dXJlLm5hbWUpO1xuXG4gIHJldHVybiAoXG4gICAgPFJhZGlvR3JvdXBcbiAgICAgIGRpc2FibGVkPXtmZWF0dXJlLm5vT3ZlcnJpZGV9XG4gICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlU2VsZWN0aW9ufVxuICAgICAgdmFsdWU9e3ZhbHVlSW5PdmVycmlkZXN9XG4gICAgPlxuICAgICAgPFJhZGlvR3JvdXAuTGFiZWw+XG4gICAgICAgIDxoNiBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktOTAwIGFsaWduLWNlbnRlciBmbGV4IGZsZXgtcm93IGZsZXgtbm93cmFwIGl0ZW1zLWNlbnRlciBnYXAtMiBsZzpnYXAtNCBoLTdcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1lZGl1bVwiPlxuICAgICAgICAgICAgRmVhdHVyZTogPGNvZGU+e2ZlYXR1cmUubmFtZX08L2NvZGU+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIHtmZWF0dXJlLm5vT3ZlcnJpZGUgPT09IHRydWUgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci1vcmFuZ2UtNTAwIHRleHQtb3JhbmdlLTUwMCBmbGV4IGZsZXgtbm93cmFwIHRleHQteHMgZmxleC1yb3cgZ2FwLTEgcm91bmRlZC1zbSBib3JkZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB4LTIgcHktMVwiPlxuICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJoLTQgdy00IG1pbi13LTRcIlxuICAgICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjAgMjBcIlxuICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgICAgIGNsaXBSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgICBkPVwiTTUgOVY3YTUgNSAwIDAxMTAgMHYyYTIgMiAwIDAxMiAydjVhMiAyIDAgMDEtMiAySDVhMiAyIDAgMDEtMi0ydi01YTIgMiAwIDAxMi0yem04LTJ2Mkg3VjdhMyAzIDAgMDE2IDB6XCJcbiAgICAgICAgICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgIDxkaXY+Tm8gT3ZlcnJpZGVzPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7YWN0dWFsQ2hlY2tlZCA9PT0gdHJ1ZSA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LW5vd3JhcCB0ZXh0LXhzIHRleHQtZ3JlZW4tNTAwIGZsZXgtcm93IGdhcC0xIHJvdW5kZWQtc20gYm9yZGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBib3JkZXItZ3JlZW4tNTAwIHB4LTIgcHktMVwiPlxuICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJoLTQgdy00IG1pbi13LTRcIlxuICAgICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjAgMjBcIlxuICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgICAgIGNsaXBSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgICBkPVwiTTEwIDE4YTggOCAwIDEwMC0xNiA4IDggMCAwMDAgMTZ6bTMuNzA3LTkuMjkzYTEgMSAwIDAwLTEuNDE0LTEuNDE0TDkgMTAuNTg2IDcuNzA3IDkuMjkzYTEgMSAwIDAwLTEuNDE0IDEuNDE0bDIgMmExIDEgMCAwMDEuNDE0IDBsNC00elwiXG4gICAgICAgICAgICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICA8ZGl2PnthY3R1YWxDaGVja2VkID8gJ0VuYWJsZWQnIDogJ0Rpc2FibGVkJ308L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L2g2PlxuICAgICAgICB7ZmVhdHVyZS5kZXNjcmlwdGlvbiA9PSBudWxsID8gbnVsbCA6IChcbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWJhc2UgdGV4dC1ncmF5LTUwMCB0ZXh0LXNtXCI+XG4gICAgICAgICAgICB7ZmVhdHVyZS5kZXNjcmlwdGlvbn1cbiAgICAgICAgICA8L3A+XG4gICAgICAgICl9XG4gICAgICA8L1JhZGlvR3JvdXAuTGFiZWw+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgZ3JpZCBncmlkLWNvbHMtMSBnYXAteS02IHNtOmdyaWQtY29scy0zIHNtOmdhcC14LTRcIj5cbiAgICAgICAge1tcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ2ZhbHNlJyxcbiAgICAgICAgICAgIHRpdGxlOiBgRGlzYWJsZSAke2ZlYXR1cmUubmFtZX1gLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdPdmVycmlkZSB0aGUgZmVhdHVyZSB0byBiZSBkaXNhYmxlZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3Vuc2V0JyxcbiAgICAgICAgICAgIHRpdGxlOiAnRGVmYXVsdCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0luaGVyaXQgZW5hYmxlZCBzdGF0ZSBmcm9tIGRlZmF1bHRzJyxcbiAgICAgICAgICAgIGRpc2FibGVkOiAoZmVhdHVyZS5ub092ZXJyaWRlID8/IGZhbHNlKSB8fCBmZWF0dXJlLmZvcmNlLFxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOlxuICAgICAgICAgICAgICB2YWx1ZUluRGVmYXVsdHMgPT09ICd0cnVlJyA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtZ3JlZW4tNTAwIGJvcmRlci1ncmVlbi01MDAgZmxleCBmbGV4LW5vd3JhcCB0ZXh0LXhzIGZsZXgtcm93IGdhcC0xIHJvdW5kZWQtc20gYm9yZGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBweC0yIHB5LTFcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPkVuYWJsZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDAgYm9yZGVyLXJlZC01MDAgZmxleCBmbGV4LW5vd3JhcCB0ZXh0LXhzIGZsZXgtcm93IGdhcC0xIHJvdW5kZWQtc20gYm9yZGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBweC0yIHB5LTFcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPkRpc2FibGVkPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICd0cnVlJyxcbiAgICAgICAgICAgIHRpdGxlOiBgRW5hYmxlICR7ZmVhdHVyZS5uYW1lfWAsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ092ZXJyaWRlIHRoZSBmZWF0dXJlIHRvIGJlIGVuYWJsZWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0ubWFwKChvcHRpb24pID0+IChcbiAgICAgICAgICA8UmFkaW9Hcm91cC5PcHRpb25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17KHsgY2hlY2tlZCwgYWN0aXZlLCBkaXNhYmxlZCB9KSA9PlxuICAgICAgICAgICAgICBjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgIGNoZWNrZWQgPyAnYm9yZGVyLXRyYW5zcGFyZW50JyA6ICdib3JkZXItZ3JheS0zMDAnLFxuICAgICAgICAgICAgICAgICFkaXNhYmxlZCAmJiBhY3RpdmVcbiAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1ibHVlLTUwMCByaW5nLTIgcmluZy1ibHVlLTUwMCdcbiAgICAgICAgICAgICAgICAgIDogJycsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci10cmFuc3BhcmVudCByaW5nLWdyYXktNTAwIGN1cnNvci1ub3QtYWxsb3dlZCdcbiAgICAgICAgICAgICAgICAgIDogJ2N1cnNvci1wb2ludGVyJyxcbiAgICAgICAgICAgICAgICAncmVsYXRpdmUgYmctd2hpdGUgYm9yZGVyIHJvdW5kZWQtbGcgc2hhZG93LXNtIHAtMyBmbGV4IGZvY3VzOm91dGxpbmUtbm9uZScsXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtvcHRpb24uZGlzYWJsZWR9XG4gICAgICAgICAgICBrZXk9e29wdGlvbi5pZH1cbiAgICAgICAgICAgIHZhbHVlPXtvcHRpb24uaWR9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgeyh7IGNoZWNrZWQsIGFjdGl2ZSwgZGlzYWJsZWQgfSkgPT4gKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBncm93XCI+XG4gICAgICAgICAgICAgICAgICA8UmFkaW9Hcm91cC5MYWJlbFxuICAgICAgICAgICAgICAgICAgICBhcz1cInNwYW5cIlxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGZsZXgtbm93cmFwIGZsZXgtcm93IGdhcC0xIGl0ZW1zLWNlbnRlciBzcGFjZS1iZXR3ZWVuXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktOTAwIGdyb3cgc2hyaW5rXCI+XG4gICAgICAgICAgICAgICAgICAgICAge29wdGlvbi50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICB7b3B0aW9uLmRlZmF1bHRWYWx1ZSAhPSBudWxsID8gb3B0aW9uLmRlZmF1bHRWYWx1ZSA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICFjaGVja2VkID8gJ2ludmlzaWJsZScgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdoLTUgdy01IHRleHQtYmx1ZS01MDAgbWluLXctNCcsXG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cIk0xMCAxOGE4IDggMCAxMDAtMTYgOCA4IDAgMDAwIDE2em0zLjcwNy05LjI5M2ExIDEgMCAwMC0xLjQxNC0xLjQxNEw5IDEwLjU4NiA3LjcwNyA5LjI5M2ExIDEgMCAwMC0xLjQxNCAxLjQxNGwyIDJhMSAxIDAgMDAxLjQxNCAwbDQtNHpcIlxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgIDwvUmFkaW9Hcm91cC5MYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxSYWRpb0dyb3VwLkRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgICAgIGFzPVwic3BhblwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm10LTEgZmxleCBpdGVtcy1jZW50ZXIgdGV4dC1zbSB0ZXh0LWdyYXktNTAwXCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge29wdGlvbi5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICAgIDwvUmFkaW9Hcm91cC5EZXNjcmlwdGlvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgICAgICAhZGlzYWJsZWQgJiYgYWN0aXZlID8gJ2JvcmRlcicgOiAnYm9yZGVyLTInLFxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkXG4gICAgICAgICAgICAgICAgICAgICAgPyBkaXNhYmxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLWdyYXktNTAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLWJsdWUtNTAwJ1xuICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci10cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgICdhYnNvbHV0ZSAtaW5zZXQtcHggcm91bmRlZC1sZyBwb2ludGVyLWV2ZW50cy1ub25lJyxcbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvUmFkaW9Hcm91cC5PcHRpb24+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgPC9SYWRpb0dyb3VwPlxuICApO1xufVxuXG5mdW5jdGlvbiBTaGFkb3dDb250ZW50KHtcbiAgcm9vdCxcbiAgY2hpbGRyZW4sXG59OiB7XG4gIGNoaWxkcmVuOiBSZWFjdE5vZGU7XG4gIHJvb3Q6IEVsZW1lbnQ7XG59KSB7XG4gIHJldHVybiBSZWFjdERPTS5jcmVhdGVQb3J0YWwoY2hpbGRyZW4sIHJvb3QpO1xufVxuXG4vLy8gUGVybWl0IHVzZXJzIHRvIG92ZXJyaWRlIGZlYXR1cmUgZmxhZ3MgdmlhIGEgR1VJLlxuLy8vIFJlbmRlcnMgYSBzbWFsbCBmbG9hdGluZyBidXR0b24gaW4gbG93ZXIgbGVmdCBvciByaWdodCwgcHJlc3NpbmcgaXQgYnJpbmdzIHVwXG4vLy8gYSBsaXN0IG9mIGZlYXR1cmVzIHRvIHRvZ2dsZSBhbmQgdGhlaXIgY3VycmVudCBvdmVycmlkZSBzdGF0ZS4geW91IGNhbiBvdmVycmlkZSBvbiBvciBvdmVycmlkZSBvZmYsXG4vLy8gb3IgdW5zZXQgdGhlIG92ZXJyaWRlIGFuZCBnbyBiYWNrIHRvIGRlZmF1bHQgdmFsdWUuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbmV4cG9ydCBmdW5jdGlvbiBUb2dnbGVGZWF0dXJlcyh7XG4gIGRlZmF1bHRPcGVuID0gZmFsc2UsXG4gIGhpZGRlbiA9IGZhbHNlLFxufToge1xuICBkZWZhdWx0T3Blbj86IGJvb2xlYW47XG4gIGhpZGRlbj86IGJvb2xlYW47XG59KTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgW3Jvb3QsIHNldENvcmVSb290XSA9IHVzZVN0YXRlPEhUTUxEaXZFbGVtZW50IHwgbnVsbD4obnVsbCk7XG5cbiAgY29uc3Qgc2V0Um9vdCA9IChob3N0OiBIVE1MRGl2RWxlbWVudCB8IG51bGwpID0+IHtcbiAgICBpZiAoaG9zdCA9PSBudWxsIHx8IHJvb3QgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzaGFkb3dSb290ID0gaG9zdD8uYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBjb25zdCByZW5kZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdHlsZS50ZXh0Q29udGVudCA9IHN0eWxlcztcbiAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICBzaGFkb3dSb290LmFwcGVuZENoaWxkKHJlbmRlckRpdik7XG4gICAgc2V0Q29yZVJvb3QocmVuZGVyRGl2KTtcbiAgfTtcblxuICBpZiAoaGlkZGVuKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHJlZj17c2V0Um9vdH1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHpJbmRleDogOTk5OTksXG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICB3aWR0aDogJzAnLFxuICAgICAgICBoZWlnaHQ6ICcwJyxcbiAgICAgICAgYm90dG9tOiAwLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7cm9vdCAhPSBudWxsID8gKFxuICAgICAgICA8U2hhZG93Q29udGVudCByb290PXtyb290fT5cbiAgICAgICAgICA8VG9nZ2xlRmVhdHVyZVVud3JhcHBlZCBkZWZhdWx0T3Blbj17ZGVmYXVsdE9wZW59IC8+XG4gICAgICAgIDwvU2hhZG93Q29udGVudD5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG4vLy8gTGlrZSBUb2dnbGVGZWF0dXJlcywgYnV0IGRvZXMgbm90IGluamVjdCBzdHlsZXMgaW50byBhIHNoYWRvdyBET00gcm9vdCBub2RlLlxuLy8vIHVzZWZ1bCBpZiB5b3UncmUgdXNpbmcgdGFpbHdpbmQuXG5leHBvcnQgZnVuY3Rpb24gVG9nZ2xlRmVhdHVyZVVud3JhcHBlZCh7XG4gIGRlZmF1bHRPcGVuID0gZmFsc2UsXG4gIGhpZGRlbiA9IGZhbHNlLFxufToge1xuICBkZWZhdWx0T3Blbj86IGJvb2xlYW47XG4gIGhpZGRlbj86IGJvb2xlYW47XG59KTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZGVmYXVsdE9wZW4pO1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChGZWF0dXJlQ29udGV4dCk7XG5cbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKGhpZGRlbikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gV2Ugd2FudDogUmVhbCB2YWx1ZSBhZnRlciBhbGwgbmVzdGluZ3MsIHZhbHVlIG9mIHRoZSBvdmVycmlkZS4gd2UgdG9nZ2xlIG92ZXJyaWRlXG4gIGNvbnN0IHsgZmVhdHVyZXNEZXNjcmlwdGlvbiB9ID0gY29udGV4dDtcblxuICBpZiAoZmVhdHVyZXNEZXNjcmlwdGlvbi5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tMCBsZWZ0LTAgbXgtNCBteS00XCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgdGV4dC1zbSBmb250LW1lZGl1bSBwLTEgaC04IHctOCBhbGlnbi1taWRkbGUgY3Vyc29yLXBvaW50ZXIgcm91bmRlZC1mdWxsIGJnLWJsdWUtNjAwIHRleHQtd2hpdGUgIGJvcmRlciBib3JkZXItdHJhbnNwYXJlbnQganVzdGlmeS1jZW50ZXIgdGV4dC1iYXNlIGZvbnQtbWVkaXVtIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1vZmZzZXQtMiBmb2N1czpyaW5nLWJsdWUtNjAwIHNtOnRleHQtc21cIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE9wZW4odHJ1ZSl9XG4gICAgICAgICAgdGl0bGU9XCJUb2dnbGUgZmVhdHVyZXNcIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICA+XG4gICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy02IGgtNiBtaW4taC02IG1pbi13LTZcIlxuICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgIGNsaXBSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgIGQ9XCJNMyA2YTMgMyAwIDAxMy0zaDEwYTEgMSAwIDAxLjggMS42TDE0LjI1IDhsMi41NSAzLjRBMSAxIDAgMDExNiAxM0g2YTEgMSAwIDAwLTEgMXYzYTEgMSAwIDExLTIgMFY2elwiXG4gICAgICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgeyFvcGVuID8gbnVsbCA6IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCB6LTEwIGluc2V0LTAgb3ZlcmZsb3cteS1hdXRvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWVuZCBqdXN0aWZ5LWZsZXgtc3RhcnQgbXgtOCBteS00IG1pbi1oLXNjcmVlbiBwdC00IHB4LTQgcGItMTAgc206YmxvY2sgc206cC0wXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGlubGluZS1ibG9jayBhbGlnbi1ib3R0b20gYmctd2hpdGUgcm91bmRlZC1sZyBweC00IHB0LTUgcGItNCB0ZXh0LWxlZnQgb3ZlcmZsb3ctaGlkZGVuIHNoYWRvdy14bCB0cmFuc2Zvcm0gdHJhbnNpdGlvbi1hbGwgc206bXktOCBzbTphbGlnbi1taWRkbGUgc206cC02IGxnOm1heC13LVs4MCVdIG1heC13LWZ1bGxcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTEgc206bXQtM1wiPlxuICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImZsZXggZmxleC1yb3cgZ2FwLTQgZmxleC1ub3dyYXAgaXRlbXMtY2VudGVyIHNwYWNlLWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncm93IHRleHQtbGcgbGVhZGluZy02IGZvbnQtbWVkaXVtIHRleHQtZ3JheS05MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICBGZWF0dXJlIEZsYWcgT3ZlcnJpZGVzXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTUwMFwiPlxuICAgICAgICAgICAgICAgICAgICBGZWF0dXJlcyBjYW4gYmUgZW5hYmxlZCBvciBkaXNhYmxlZCB1bmxlc3MgdGhleSBhcmUgZm9yY2VkXG4gICAgICAgICAgICAgICAgICAgIHVwc3RyZWFtLiBZb3UgY2FuIGFsc28gcmV2ZXJ0IHRvIGRlZmF1bHQuXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTZcIj5cbiAgICAgICAgICAgICAgICAgICAgPGZpZWxkc2V0IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTlcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGVnZW5kIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5GZWF0dXJlIEZsYWdzPC9sZWdlbmQ+XG4gICAgICAgICAgICAgICAgICAgICAge2ZlYXR1cmVzRGVzY3JpcHRpb24ubWFwKChmZWF0dXJlKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8VG9nZ2xlRmVhdHVyZSBmZWF0dXJlPXtmZWF0dXJlfSBrZXk9e2ZlYXR1cmUubmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktY2VudGVyIGl0ZW1zLWNlbnRlciBtdC01IHNtOm10LTZcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciB0ZXh0LXNtIGZvbnQtbWVkaXVtIHB0LTAgcGItMCBwci00IHBsLTQgaC04IGxlYWRpbmctNyBhbGlnbi1taWRkbGUgY3Vyc29yLXBvaW50ZXIgcm91bmRlZC1zbSBiZy1ibHVlLTYwMCB0ZXh0LXdoaXRlIGJvcmRlciBib3JkZXItdHJhbnNwYXJlbnQganVzdGlmeS1jZW50ZXIgdGV4dC1iYXNlIGZvbnQtbWVkaXVtIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1vZmZzZXQtMiBmb2N1czpyaW5nLWJsdWUtNjAwIHNtOnRleHQtc21cIlxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oZmFsc2UpfVxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgRG9uZVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7O0FDREE7OztBQ0FBO0FBU08sSUFBTSxnQkFBZ0IsY0FBaUMsQ0FBQyxPQUFPLEtBQUs7OztBREhwRSwyQkFDTCxPQUMrQjtBQUMvQixRQUFNLE9BQU8sV0FBVyxhQUFhO0FBR3JDLFFBQU0sWUFBWSxRQUNoQixNQUFPLFNBQVMsT0FBTyxDQUFDLElBQUksTUFBTSxRQUFRLEtBQUssSUFBSSxRQUFRLENBQUMsS0FBSyxHQUNqRSxDQUFDLEtBQUssQ0FD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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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

var le=Object.create;var F=Object.defineProperty;var de=Object.getOwnPropertyDescriptor;var ue=Object.getOwnPropertyNames,H=Object.getOwnPropertySymbols,ce=Object.getPrototypeOf,K=Object.prototype.hasOwnProperty,pe=Object.prototype.propertyIsEnumerable;var q=(t,e,r)=>e in t?F(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Y=(t,e)=>{for(var r in e||(e={}))K.call(e,r)&&q(t,r,e[r]);if(H)for(var r of H(e))pe.call(e,r)&&q(t,r,e[r]);return t};var fe=(t,e)=>{for(var r in e)F(t,r,{get:e[r],enumerable:!0})},W=(t,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of ue(e))!K.call(t,n)&&n!==r&&F(t,n,{get:()=>e[n],enumerable:!(a=de(e,n))||a.enumerable});return t};var k=(t,e,r)=>(r=t!=null?le(ce(t)):{},W(e||!t||!t.__esModule?F(r,"default",{value:t,enumerable:!0}):r,t)),me=t=>W(F({},"__esModule",{value:!0}),t);var C=(t,e,r)=>new Promise((a,n)=>{var i=s=>{try{u(r.next(s))}catch(c){n(c)}},d=s=>{try{u(r.throw(s))}catch(c){n(c)}},u=s=>s.done?a(s.value):Promise.resolve(s.value).then(i,d);u((r=r.apply(t,e)).next())});var xe={};fe(xe,{Disable:()=>ae,Enable:()=>oe,EnableContext:()=>x,Features:()=>re,FeaturesMachine:()=>D,ToggleFeatures:()=>se,useAllDisabled:()=>L,useAllEnabled:()=>A,useDisabled:()=>O,useEnabled:()=>I});module.exports=me(xe);var m=require("xstate");var w=require("xstate");function $(t){var e,r;return[t.matches("enabled")?!0:t.matches("disabled")?!1:void 0,(r=(e=t.context.featureDesc)==null?void 0:e.force)!=null?r:!1]}var Q=(0,w.createMachine)({id:"feature",initial:"initial",context:{},predictableActionArguments:!0,on:{ENABLE:[{target:"asyncEnabled",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"enabled"}],TOGGLE:[{target:"asyncEnabled",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"enabled"}],DISABLE:[{target:"asyncDisabled",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"disabled"}],UNSET:[{target:"asyncUnspecied",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"unspecified"}],SET:[{target:"asyncEnabled",cond:(t,e)=>{var r;return e.value===!0&&((r=t.featureDesc)==null?void 0:r.onChangeDefault)!=null}},{target:"asyncDisabled",cond:(t,e)=>{var r;return e.value===!1&&((r=t.featureDesc)==null?void 0:r.onChangeDefault)!=null}},{target:"asyncUnspecied",cond:(t,e)=>{var r;return((r=t.featureDesc)==null?void 0:r.onChangeDefault)!=null}},{target:"enabled",cond:(t,e)=>e.value===!0},{target:"disabled",cond:(t,e)=>e.value===!1},{target:"unspecified"}]},states:{initial:{on:{INIT:[{actions:(0,w.assign)({featureDesc:(t,e)=>e.feature}),target:"enabled",cond:(t,e)=>e.feature.defaultValue===!0},{actions:(0,w.assign)({featureDesc:(t,e)=>e.feature}),target:"unspecified",cond:(t,e)=>e.feature.defaultValue===void 0},{actions:(0,w.assign)({featureDesc:(t,e)=>e.feature}),target:"disabled",cond:(t,e)=>e.feature.defaultValue===!1}]}},unspecified:{},disabled:{},enabled:{},asyncDisabled:{invoke:{id:"set-off-upstream",src:t=>C(void 0,null,function*(){var r;let e=(r=t.featureDesc)==null?void 0:r.onChangeDefault;if(e!=null&&t.featureDesc!=null)return e(t.featureDesc.name,!1)}),onDone:[{target:"enabled",cond:(t,e)=>e.data===!0},{target:"disabled",cond:(t,e)=>e.data===!1},{target:"unspecified"}],onError:"unspecified"}},asyncUnspecied:{invoke:{id:"set-unset-upstream",src:t=>C(void 0,null,function*(){var r;let e=(r=t.featureDesc)==null?void 0:r.onChangeDefault;if(e!=null&&t.featureDesc!=null)return e(t.featureDesc.name,void 0)}),onDone:[{target:"enabled",cond:(t,e)=>e.data===!0},{target:"disabled",cond:(t,e)=>e.data===!1},{target:"unspecified"}],onError:"unspecified"}},asyncEnabled:{invoke:{id:"set-on-upstream",src:t=>C(void 0,null,function*(){var r;let e=(r=t.featureDesc)==null?void 0:r.onChangeDefault;if(e!=null&&t.featureDesc!=null)return e(t.featureDesc.name,!0)}),onDone:[{target:"enabled",cond:(t,e)=>e.data===!0},{target:"disabled",cond:(t,e)=>e.data===!1},{target:"unspecified"}],onError:"unspecified"}}}});function h(t,e){if(t.context.features[e]==null)return[void 0,!1];let r=t.context.features[e].getSnapshot();return r!=null?$(r):[void 0,!1]}var D=(0,m.createMachine)({id:"features",initial:"idle",predictableActionArguments:!0,context:{features:{}},states:{idle:{on:{INIT:{target:"ready",cond:(t,e)=>e.features.length>0,actions:(0,m.assign)({features:(t,e)=>{let r={};for(let a of e.features)r[a.name]=(0,m.spawn)(Q,{name:a.name,sync:!0}),r[a.name].send({type:"INIT",feature:a});return r}})}}},ready:{on:{DE_INIT:{target:"idle",actions:(0,m.assign)({features:(t,e)=>({})})},SET_ALL:{actions:(0,m.assign)({features:(t,e)=>{let r=Y({},t.features);return Object.keys(r).forEach(a=>{var n;r[a].send({type:"SET",value:(n=e.features[a])!=null?n:void 0})}),r}})},SET:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"SET",value:e.value})}},TOGGLE:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"TOGGLE"})}},ENABLE:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"ENABLE"})}},DISABLE:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"DISABLE"})}},UNSET:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"UNSET"})}}}}}});var p=k(require("react")),J=require("@xstate/react");var Z=require("react"),x=(0,Z.createContext)(t=>!1);var R=require("react"),E=(0,R.createContext)(null);var ee=require("react");var N=class{constructor(e,r,a){this.featureDesc=a,this.dispatch=e,this.testFeature=r}toggle(e){this.dispatch({type:"TOGGLE",name:e})}enable(e){this.dispatch({type:"ENABLE",name:e})}unset(e){this.dispatch({type:"UNSET",name:e})}disable(e){this.dispatch({type:"DISABLE",name:e})}setAll(e){this.dispatch({type:"SET_ALL",features:e})}listFeatures(){return this.featureDesc.map(e=>[e.name,this.testFeature(e.name)])}};function j(t,e,r,a){(0,ee.useEffect)(()=>t?(window.feature=new N(a,r,e),()=>{window.feature!=null&&delete window.feature}):()=>{},[e,a,t,r])}var z=require("react");var B="react-enable:feature-values";function P(t,e,r){let a=(0,z.useMemo)(()=>{let i={};if(r.matches("ready"))for(let d of e){let[u]=h(r,d.name);u!=null&&(i[d.name]=u)}return i},[e,r]),n=Object.keys(a).length===0||t==null?"{}":JSON.stringify({overrides:a});(0,z.useEffect)(()=>{try{t!=null&&r.matches("ready")&&t.setItem(B,n)}catch(i){}},[r,t,n])}var te=require("react");function U(t,e){let r=e.map(a=>h(a,t));for(let[a,n]of r)if(a!=null&&n)return a;for(let[a]of r)if(a!=null)return a}function G(t,e){return(0,te.useCallback)(r=>U(r,[t,e]),[t,e])}function re({children:t,features:e,disableConsole:r=!1,storage:a=window.sessionStorage}){let n=(0,p.useRef)(e),[i,d]=(0,J.useMachine)(D),[u,s]=(0,J.useMachine)(D);(0,p.useEffect)(()=>(s({type:"INIT",features:e}),()=>{s({type:"DE_INIT"})}),[s,e]),(0,p.useEffect)(()=>{let b={};if(a!=null)try{let l=a.getItem(B);l!=null&&(b=JSON.parse(l).overrides)}catch(l){console.error("error in localStorage",l)}return d({type:"INIT",features:n.current.filter(l=>l.noOverride!==!0).map(l=>{var f;return{name:l.name,description:l.description,defaultValue:(f=b==null?void 0:b[l.name])!=null?f:void 0}})}),()=>{d({type:"DE_INIT"})}},[n,d,a]),P(a,n.current,i);let c=G(i,u);j(!r,n.current,c,s);let S=(0,p.useMemo)(()=>({overridesSend:d,defaultsSend:s,featuresDescription:n.current,overridesState:i,defaultsState:u,test:c}),[d,s,i,u,c]);return p.default.createElement(E.Provider,{value:S},p.default.createElement(x.Provider,{value:c},t))}var V=k(require("react"));var T=require("react");function g(t){let e=(0,T.useContext)(x),r=(0,T.useMemo)(()=>t==null?[]:Array.isArray(t)?t:[t],[t]);return[e,r]}function A(t){let[e,r]=g(t);return r.length>0&&r.every(e)}function I(t){let[e,r]=g(t);return r.some(e)}function oe({feature:t=[],allFeatures:e=[],children:r}){let a=I(t),n=A(e);return a||n?V.createElement(V.Fragment,null,r):null}var M=k(require("react"));function L(t){let[e,r]=g(t);return t.length>0&&r.every(a=>{var n;return!((n=e(a))!=null&&n)})}function O(t){let[e,r]=g(t);return r.some(a=>{var n;return!((n=e(a))!=null&&n)})}var ae=({feature:t=[],allFeatures:e=[],children:r})=>{let a=O(t),n=L(e);return a||n?M.createElement(M.Fragment,null,r):null};var o=k(require("react")),ie=k(require("react-dom")),v=require("@headlessui/react");var ne=`/*
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

.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.bg-blue-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
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

.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity));
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
`;function X(...t){return t.filter(Boolean).join(" ")}function be({feature:t}){var c,S,b;let e=(0,o.useContext)(E),r=(0,o.useCallback)(l=>{if((e==null?void 0:e.overridesSend)!=null)switch(l){case"true":{e.overridesSend({type:"ENABLE",name:t.name});break}case"false":{e.overridesSend({type:"DISABLE",name:t.name});break}case"unset":{e.overridesSend({type:"UNSET",name:t.name});break}}},[t.name,e]);if(e==null)return null;let{overridesState:a,test:n,defaultsState:i}=e,d=((c=h(i,t.name)[0])!=null?c:"unset").toString(),u=((S=h(a,t.name)[0])!=null?S:"unset").toString(),s=n(t.name);return o.default.createElement(v.RadioGroup,{disabled:t.noOverride,onChange:r,value:u},o.default.createElement(v.RadioGroup.Label,null,o.default.createElement("h6",{className:"text-gray-900 align-center flex flex-row flex-nowrap items-center gap-2 lg:gap-4 h-7"},o.default.createElement("span",{className:"font-medium"},"Feature: ",o.default.createElement("code",null,t.name)),t.noOverride===!0?o.default.createElement("div",{className:"border-orange-500 text-orange-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"},o.default.createElement("svg",{"aria-hidden":"true",className:"h-4 w-4 min-w-4",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.default.createElement("path",{clipRule:"evenodd",d:"M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",fillRule:"evenodd"})),o.default.createElement("div",null,"No Overrides")):null,s===!0?o.default.createElement("div",{className:"flex flex-nowrap text-xs text-green-500 flex-row gap-1 rounded-sm border items-center justify-center border-green-500 px-2 py-1"},o.default.createElement("svg",{"aria-hidden":"true",className:"h-4 w-4 min-w-4",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.default.createElement("path",{clipRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",fillRule:"evenodd"})),o.default.createElement("div",null,s?"Enabled":"Disabled")):null),t.description==null?null:o.default.createElement("p",{className:"text-base text-gray-500 text-sm"},t.description)),o.default.createElement("div",{className:"mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"},[{id:"false",title:`Disable ${t.name}`,description:"Override the feature to be disabled"},{id:"unset",title:"Default",description:"Inherit enabled state from defaults",disabled:((b=t.noOverride)!=null?b:!1)||t.force,defaultValue:d==="true"?o.default.createElement("div",{className:"text-green-500 border-green-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"},o.default.createElement("span",null,"Enabled")):o.default.createElement("div",{className:"text-red-500 border-red-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"},o.default.createElement("span",null,"Disabled"))},{id:"true",title:`Enable ${t.name}`,description:"Override the feature to be enabled"}].map(l=>o.default.createElement(v.RadioGroup.Option,{className:({checked:f,active:_,disabled:y})=>X(f?"border-transparent":"border-gray-300",!y&&_?"border-blue-500 ring-2 ring-blue-500":"",y?"border-transparent ring-gray-500 cursor-not-allowed":"cursor-pointer","relative bg-white border rounded-lg shadow-sm p-3 flex focus:outline-none"),disabled:l.disabled,key:l.id,value:l.id},({checked:f,active:_,disabled:y})=>o.default.createElement(o.default.Fragment,null,o.default.createElement("div",{className:"flex flex-col grow"},o.default.createElement(v.RadioGroup.Label,{as:"span",className:"flex flex-nowrap flex-row gap-1 items-center space-between"},o.default.createElement("span",{className:"text-sm font-medium text-gray-900 grow shrink"},l.title),l.defaultValue!=null?l.defaultValue:null,o.default.createElement("svg",{"aria-hidden":"true",className:X(f?"":"invisible","h-5 w-5 text-blue-500 min-w-4"),fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.default.createElement("path",{clipRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",fillRule:"evenodd"}))),o.default.createElement(v.RadioGroup.Description,{as:"span",className:"mt-1 flex items-center text-sm text-gray-500"},l.description)),o.default.createElement("div",{"aria-hidden":"true",className:X(!y&&_?"border":"border-2",f?y?"border-gray-500":"border-blue-500":"border-transparent","absolute -inset-px rounded-lg pointer-events-none")}))))))}function he({root:t,children:e}){return ie.default.createPortal(e,t)}function se({defaultOpen:t=!1,hidden:e=!1}){let[r,a]=(0,o.useState)(null),n=i=>{if(i==null||r!=null)return;let d=i==null?void 0:i.attachShadow({mode:"open"}),u=document.createElement("style"),s=document.createElement("div");u.textContent=ne,d.appendChild(u),d.appendChild(s),a(s)};return e?null:o.default.createElement("div",{ref:n,style:{zIndex:99999,position:"fixed",width:"0",height:"0",bottom:0}},r!=null?o.default.createElement(he,{root:r},o.default.createElement(we,{defaultOpen:t})):null)}function we({defaultOpen:t=!1,hidden:e=!1}){let[r,a]=(0,o.useState)(t),n=(0,o.useContext)(E);if(n==null||e)return null;let{featuresDescription:i}=n;return i.length===0?null:o.default.createElement("div",{className:"relative"},o.default.createElement("div",{className:"absolute bottom-0 left-0 mx-4 my-4"},o.default.createElement("button",{className:"inline-flex items-center text-sm font-medium p-1 h-8 w-8 align-middle cursor-pointer rounded-full bg-blue-600 text-white  border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",onClick:()=>a(!0),title:"Toggle features",type:"button"},o.default.createElement("svg",{className:"w-6 h-6 min-h-6 min-w-6",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.default.createElement("path",{clipRule:"evenodd",d:"M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z",fillRule:"evenodd"})))),r?o.default.createElement("div",{className:"fixed z-10 inset-0 overflow-y-auto"},o.default.createElement("div",{className:"flex items-end justify-flex-start mx-8 my-4 min-h-screen pt-4 px-4 pb-10 sm:block sm:p-0"},o.default.createElement("div",{className:"relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 lg:max-w-[80%] max-w-full"},o.default.createElement("div",null,o.default.createElement("div",{className:"mt-1 sm:mt-3"},o.default.createElement("h3",{className:"flex flex-row gap-4 flex-nowrap items-center space-between"},o.default.createElement("div",{className:"grow text-lg leading-6 font-medium text-gray-900"},"Feature Flag Overrides")),o.default.createElement("p",{className:"text-sm text-gray-500"},"Features can be enabled or disabled unless they are forced upstream. You can also revert to default."),o.default.createElement("div",{className:"mt-6"},o.default.createElement("fieldset",{className:"flex flex-col gap-9"},o.default.createElement("legend",{className:"sr-only"},"Feature Flags"),i.map(d=>o.default.createElement(be,{feature:d,key:d.name})))),o.default.createElement("div",{className:"flex justify-center items-center mt-5 sm:mt-6"},o.default.createElement("button",{className:"inline-flex items-center text-sm font-medium pt-0 pb-0 pr-4 pl-4 h-8 leading-7 align-middle cursor-pointer rounded-sm bg-blue-600 text-white border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",onClick:()=>a(!1),type:"button"},"Done"))))))):null)}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2luZGV4LnRzeCIsICIuLi8uLi8uLi9zcmMvRmVhdHVyZXNTdGF0ZS50c3giLCAiLi4vLi4vLi4vc3JjL0ZlYXR1cmVTdGF0ZS50c3giLCAiLi4vLi4vLi4vc3JjL0ZlYXR1cmVzLnRzeCIsICIuLi8uLi8uLi9zcmMvRW5hYmxlQ29udGV4dC50c3giLCAiLi4vLi4vLi4vc3JjL0ZlYXR1cmVDb250ZXh0LnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlQ29uc29sZU92ZXJyaWRlLnRzeCIsICIuLi8uLi8uLi9zcmMvR2xvYmFsRW5hYmxlLnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlUGVyc2lzdC50c3giLCAiLi4vLi4vLi4vc3JjL3VzZVRlc3RDYWxsYmFjay50c3giLCAiLi4vLi4vLi4vc3JjL3Rlc3RGZWF0dXJlLnRzeCIsICIuLi8uLi8uLi9zcmMvRW5hYmxlLnRzeCIsICIuLi8uLi8uLi9zcmMvdXRpbHMudHMiLCAiLi4vLi4vLi4vc3JjL3VzZUFsbEVuYWJsZWQudHN4IiwgIi4uLy4uLy4uL3NyYy91c2VFbmFibGVkLnRzeCIsICIuLi8uLi8uLi9zcmMvRGlzYWJsZS50c3giLCAiLi4vLi4vLi4vc3JjL3VzZUFsbERpc2FibGVkLnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlRGlzYWJsZWQudHN4IiwgIi4uLy4uLy4uL3NyYy9Ub2dnbGVGZWF0dXJlcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCB7IEZlYXR1cmVzTWFjaGluZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5leHBvcnQgeyBGZWF0dXJlcyB9IGZyb20gJy4vRmVhdHVyZXMnO1xuZXhwb3J0IHsgRW5hYmxlIH0gZnJvbSAnLi9FbmFibGUnO1xuZXhwb3J0IHsgRGlzYWJsZSB9IGZyb20gJy4vRGlzYWJsZSc7XG5leHBvcnQgeyB1c2VEaXNhYmxlZCB9IGZyb20gJy4vdXNlRGlzYWJsZWQnO1xuZXhwb3J0IHsgdXNlRW5hYmxlZCB9IGZyb20gJy4vdXNlRW5hYmxlZCc7XG5leHBvcnQgeyB1c2VBbGxEaXNhYmxlZCB9IGZyb20gJy4vdXNlQWxsRGlzYWJsZWQnO1xuZXhwb3J0IHsgdXNlQWxsRW5hYmxlZCB9IGZyb20gJy4vdXNlQWxsRW5hYmxlZCc7XG5leHBvcnQgdHlwZSB7IEVuYWJsZUNvbnRleHRUeXBlIH0gZnJvbSAnLi9FbmFibGVDb250ZXh0JztcbmV4cG9ydCB0eXBlIHsgRmVhdHVyZUNvbnRleHRUeXBlIH0gZnJvbSAnLi9GZWF0dXJlQ29udGV4dCc7XG5leHBvcnQgdHlwZSB7IEZlYXR1cmVWYWx1ZSwgRmVhdHVyZVN0YXRlLCBGZWF0dXJlRGVzY3JpcHRpb24sIEZlYXR1cmVEaXNwYXRjaCB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcbmV4cG9ydCB7IEVuYWJsZUNvbnRleHQgfSBmcm9tICcuL0VuYWJsZUNvbnRleHQnO1xuZXhwb3J0IHsgVG9nZ2xlRmVhdHVyZXMgfSBmcm9tICcuL1RvZ2dsZUZlYXR1cmVzJztcbiIsICJpbXBvcnQgeyBBY3RvclJlZkZyb20sIEludGVycHJldGVyRnJvbSwgU3RhdGVGcm9tLCBhc3NpZ24sIGNyZWF0ZU1hY2hpbmUsIHNwYXduIH0gZnJvbSAneHN0YXRlJztcblxuaW1wb3J0IHsgRmVhdHVyZU1hY2hpbmUsIEZlYXR1cmVEZXNjcmlwdGlvbiwgRmVhdHVyZVZhbHVlLCB2YWx1ZUZvclN0YXRlIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZlYXR1cmVzQ29udGV4dCB7XG4gIC8vIGZlYXR1cmVzIGFyZSBsYXllcmVkOlxuICAvLyAgLSBkZWZhdWx0czogaWYgbm90aGluZyBlbHNlIG1hdGNoZXMsIHByb3ZpZGVkIGEgdmFsdWUgZm9yIGZlYXR1cmVcbiAgLy8gIC0gYnJvd3NlcjogYnJvd3Nlci1sb2NhbCB2YWx1ZXMgZm9yIGZlYXR1cmVzIChrZXB0IGluIGxvY2FsIHN0b3JhZ2UsIGV0YylcbiAgLy8gIC0gdXNlcjogdmFsdWVzIGZyb20gdGhlIHVzZXIncyBwcm9maWxlLCBpZiBhbnlcbiAgLy8gIC0gb3JnOiB2YWx1ZSBmcm9tIHRoZSBvcmcncyBwcm9maWxlLCBpZiBhbnlcbiAgZmVhdHVyZXM6IHsgW3g6IHN0cmluZ106IEFjdG9yUmVmRnJvbTx0eXBlb2YgRmVhdHVyZU1hY2hpbmU+IH07XG59XG5cbmV4cG9ydCB0eXBlIEZlYXR1cmVzQWN0aW9uID1cbiAgfCB7IHR5cGU6ICdERV9JTklUJyB9XG4gIHwgeyB0eXBlOiAnRElTQUJMRSc7IG5hbWU6IHN0cmluZyB9XG4gIHwgeyB0eXBlOiAnRU5BQkxFJzsgbmFtZTogc3RyaW5nIH1cbiAgfCB7IHR5cGU6ICdJTklUJzsgZmVhdHVyZXM6IHJlYWRvbmx5IEZlYXR1cmVEZXNjcmlwdGlvbltdIH1cbiAgfCB7IHR5cGU6ICdTRVRfQUxMJzsgZmVhdHVyZXM6IHsgW2tleTogc3RyaW5nXTogRmVhdHVyZVZhbHVlIH0gfVxuICB8IHsgdHlwZTogJ1NFVCc7IG5hbWU6IHN0cmluZzsgdmFsdWU6IEZlYXR1cmVWYWx1ZSB9XG4gIHwgeyB0eXBlOiAnVE9HR0xFJzsgbmFtZTogc3RyaW5nIH1cbiAgfCB7IHR5cGU6ICdVTlNFVCc7IG5hbWU6IHN0cmluZyB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIEZlYXR1cmVzVHlwZVN0YXRlIHtcbiAgdmFsdWU6ICdyZWFkeSc7XG4gIGNvbnRleHQ6IEZlYXR1cmVzQ29udGV4dDtcbn1cblxuZXhwb3J0IHR5cGUgRmVhdHVyZXNTdGF0ZSA9IFN0YXRlRnJvbTx0eXBlb2YgRmVhdHVyZXNNYWNoaW5lPjtcbmV4cG9ydCB0eXBlIEZlYXR1cmVzRGlzcGF0Y2ggPSBJbnRlcnByZXRlckZyb208dHlwZW9mIEZlYXR1cmVzTWFjaGluZT5bJ3NlbmQnXTtcblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlT2ZGZWF0dXJlKGZlYXR1cmVzU3RhdGU6IEZlYXR1cmVzU3RhdGUsIGZlYXR1cmU6IHN0cmluZyk6IFtGZWF0dXJlVmFsdWUsIGJvb2xlYW5dIHtcbiAgaWYgKGZlYXR1cmVzU3RhdGUuY29udGV4dC5mZWF0dXJlc1tmZWF0dXJlXSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFt1bmRlZmluZWQsIGZhbHNlXTtcbiAgfVxuICBjb25zdCBmZWF0dXJlU3RhdGUgPSBmZWF0dXJlc1N0YXRlLmNvbnRleHQuZmVhdHVyZXNbZmVhdHVyZV0uZ2V0U25hcHNob3QoKTtcbiAgaWYgKGZlYXR1cmVTdGF0ZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlRm9yU3RhdGUoZmVhdHVyZVN0YXRlKTtcbiAgfVxuICByZXR1cm4gW3VuZGVmaW5lZCwgZmFsc2VdO1xufVxuXG4vLy8gc3RhdGUgbWFjaGluZSB0aGF0IG1hbmFnZXMgYSBzZXQgb2YgZmVhdHVyZXMgd2l0aCB1c2VyLCBvcmcsIGFuZCBsb2NhbCBvdmVycmlkZXNcbmV4cG9ydCBjb25zdCBGZWF0dXJlc01hY2hpbmUgPSBjcmVhdGVNYWNoaW5lPEZlYXR1cmVzQ29udGV4dCwgRmVhdHVyZXNBY3Rpb24sIEZlYXR1cmVzVHlwZVN0YXRlPih7XG4gIGlkOiAnZmVhdHVyZXMnLFxuICBpbml0aWFsOiAnaWRsZScsXG4gIHByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzOiB0cnVlLFxuICBjb250ZXh0OiB7XG4gICAgZmVhdHVyZXM6IHt9LFxuICB9LFxuICBzdGF0ZXM6IHtcbiAgICBpZGxlOiB7XG4gICAgICBvbjoge1xuICAgICAgICBJTklUOiB7XG4gICAgICAgICAgdGFyZ2V0OiAncmVhZHknLFxuICAgICAgICAgIGNvbmQ6IChfLCBlKSA9PiBlLmZlYXR1cmVzLmxlbmd0aCA+IDAsXG4gICAgICAgICAgYWN0aW9uczogYXNzaWduKHtcbiAgICAgICAgICAgIGZlYXR1cmVzOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZmVhdHVyZXM6IHR5cGVvZiBjb250ZXh0LmZlYXR1cmVzID0ge307XG5cbiAgICAgICAgICAgICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIGV2ZW50LmZlYXR1cmVzKSB7XG4gICAgICAgICAgICAgICAgZmVhdHVyZXNbZmVhdHVyZS5uYW1lXSA9IHNwYXduKEZlYXR1cmVNYWNoaW5lLCB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBmZWF0dXJlLm5hbWUsXG4gICAgICAgICAgICAgICAgICBzeW5jOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZlYXR1cmVzW2ZlYXR1cmUubmFtZV0uc2VuZCh7IHR5cGU6ICdJTklUJywgZmVhdHVyZSB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZmVhdHVyZXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdGhlIGZlYXR1cmVzIGFyZSBsb2FkZWQgYW5kIHJlYWR5IHRvIGJlIHVzZWRcbiAgICByZWFkeToge1xuICAgICAgb246IHtcbiAgICAgICAgREVfSU5JVDogeyB0YXJnZXQ6ICdpZGxlJywgYWN0aW9uczogYXNzaWduKHsgZmVhdHVyZXM6IChfLCBfXykgPT4gKHt9KSB9KSB9LFxuICAgICAgICBTRVRfQUxMOiB7XG4gICAgICAgICAgYWN0aW9uczogYXNzaWduKHtcbiAgICAgICAgICAgIGZlYXR1cmVzOiAoY3R4LCBlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGZlYXR1cmVzID0geyAuLi5jdHguZmVhdHVyZXMgfTtcbiAgICAgICAgICAgICAgLy8gQWxsIGNvbmZpZ3VyZWQgZmVhdHVyZXMgYXJlIHNldCB0byBvbi9vZmYgb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICAgIE9iamVjdC5rZXlzKGZlYXR1cmVzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgZmVhdHVyZXNbbmFtZV0uc2VuZCh7IHR5cGU6ICdTRVQnLCB2YWx1ZTogZS5mZWF0dXJlc1tuYW1lXSA/PyB1bmRlZmluZWQgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gZmVhdHVyZXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFNldCBhIGZlYXR1cmUgdG8gYSB2YWx1ZVxuICAgICAgICBTRVQ6IHtcbiAgICAgICAgICBhY3Rpb25zOiAoY3R4LCBlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlID0gY3R4LmZlYXR1cmVzW2UubmFtZV07XG4gICAgICAgICAgICBpZiAoZmVhdHVyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIGZlYXR1cmUuc2VuZCh7IHR5cGU6ICdTRVQnLCB2YWx1ZTogZS52YWx1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHRvZ2dsZSBhIGZlYXR1cmVcbiAgICAgICAgVE9HR0xFOiB7XG4gICAgICAgICAgYWN0aW9uczogKGN0eCwgZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmVhdHVyZSA9IGN0eC5mZWF0dXJlc1tlLm5hbWVdO1xuICAgICAgICAgICAgaWYgKGZlYXR1cmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBmZWF0dXJlLnNlbmQoeyB0eXBlOiAnVE9HR0xFJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHdoZW4gYSBmZWF0dXJlIGlzIGVuYWJsZWQsIHNlbmQgdGhlIGVuYWJsZSBtZXNzYWdlIHRvIHRoZSBhY3RvclxuICAgICAgICBFTkFCTEU6IHtcbiAgICAgICAgICBhY3Rpb25zOiAoY3R4LCBlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlID0gY3R4LmZlYXR1cmVzW2UubmFtZV07XG4gICAgICAgICAgICBpZiAoZmVhdHVyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIGZlYXR1cmUuc2VuZCh7IHR5cGU6ICdFTkFCTEUnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gd2hlbiBhIGZlYXR1cmUgaXMgZGlzYWJsZWQsIHNlbmQgdGhlIGRpc2FibGUgbWVzc2FnZSB0byB0aGUgYWN0b3JcbiAgICAgICAgRElTQUJMRToge1xuICAgICAgICAgIGFjdGlvbnM6IChjdHgsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZlYXR1cmUgPSBjdHguZmVhdHVyZXNbZS5uYW1lXTtcbiAgICAgICAgICAgIGlmIChmZWF0dXJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgZmVhdHVyZS5zZW5kKHsgdHlwZTogJ0RJU0FCTEUnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gd2hlbiBhIGZlYXR1cmUgaXMgdW5zZXQsIHNlbmQgdGhlIHVuc2V0IG1lc3NhZ2UgdG8gdGhlIGFjdG9yXG4gICAgICAgIFVOU0VUOiB7XG4gICAgICAgICAgYWN0aW9uczogKGN0eCwgZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmVhdHVyZSA9IGN0eC5mZWF0dXJlc1tlLm5hbWVdO1xuICAgICAgICAgICAgaWYgKGZlYXR1cmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBmZWF0dXJlLnNlbmQoeyB0eXBlOiAnVU5TRVQnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiIsICJpbXBvcnQgeyBhc3NpZ24sIGNyZWF0ZU1hY2hpbmUsIERvbmVJbnZva2VFdmVudCwgSW50ZXJwcmV0ZXJGcm9tLCBTdGF0ZUZyb20gfSBmcm9tICd4c3RhdGUnO1xuXG4vKipcbiAqIEZlYXR1cmUgaXMgZWl0aGVyIG9uLCBvZmYsIG9yICd1bnNldCcsXG4gKiB3aGljaCBtZWFucyBpdCB3aWxsIGdvIHRvIHRoZSBkZWZhdWx0IHZhbHVlIG9yIHRoZSBsZXNzIHNwZWNpZmljIHZhbHVlLlxuICovXG5leHBvcnQgdHlwZSBGZWF0dXJlVmFsdWUgPSBmYWxzZSB8IHRydWUgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIEZlYXR1cmVTdGF0ZSA9IFN0YXRlRnJvbTx0eXBlb2YgRmVhdHVyZU1hY2hpbmU+O1xuZXhwb3J0IHR5cGUgRmVhdHVyZURpc3BhdGNoID0gSW50ZXJwcmV0ZXJGcm9tPHR5cGVvZiBGZWF0dXJlTWFjaGluZT5bJ3NlbmQnXTtcblxuLy8vIEdpdmVuIGEgZmVhdHVyZXN0YXRlLCBkZXRlcm1pbmUgdGhlIHZhbHVlIChvbiwgb2ZmLCBvciB1bnNldClcbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZUZvclN0YXRlKGZlYXR1cmVTdGF0ZTogRmVhdHVyZVN0YXRlKTogW0ZlYXR1cmVWYWx1ZSwgYm9vbGVhbl0ge1xuICByZXR1cm4gW1xuICAgIGZlYXR1cmVTdGF0ZS5tYXRjaGVzKCdlbmFibGVkJykgPyB0cnVlIDogZmVhdHVyZVN0YXRlLm1hdGNoZXMoJ2Rpc2FibGVkJykgPyBmYWxzZSA6IHVuZGVmaW5lZCxcbiAgICBmZWF0dXJlU3RhdGUuY29udGV4dC5mZWF0dXJlRGVzYz8uZm9yY2UgPz8gZmFsc2UsXG4gIF07XG59XG5cbi8qKlxuICogRGVmaW5pdGlvbiBvZiBhIGZlYXR1cmUgdGhhdCBjYW4gYmUgZW5hYmxlZCBvciBkaXNhYmxlZC5cbiAqIEsgaXMgdGhlIHR5cGUgb2YgdGhlIGtleSB0aGF0IGlzIHVzZWQgdG8gaWRlbnRpZnkgdGhlIGZlYXR1cmUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmVhdHVyZURlc2NyaXB0aW9uPEsgZXh0ZW5kcyBzdHJpbmcgPSBzdHJpbmc+IHtcbiAgcmVhZG9ubHkgbmFtZTogSztcbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLy8vIElmIHNldCwgd2lsbCBiZSB1c2VkIHRvIHVwZGF0ZSB0aGUgZmVhdHVyZSBkZWZhdWx0IHN0YXRlIGluc3RlYWQgb2Ygc2ltcGx5IG92ZXJyaWRpbmcuXG4gIC8vLyBGb3IgZXhhbXBsZSwgeW91IG1pZ2h0IHVzZSB0aGlzIHRvIHVwZGF0ZSBhIGZlYXR1cmUgZmxhZyBvbiBhIGJhY2tlbmQgc2VydmVyLlxuICAvLy8gd2hlbiBzZXQsIHRoZSBmZWF0dXJlIHdpbGwgYmUgdXBkYXRlZCBvbiB0aGUgYmFja2VuZCBzZXJ2ZXIsIGFuZCB0aGUgcmVzdWx0IG9mIHRoZSBhc3luY1xuICAvLy8gd2lsbCBiZSB1c2VkIGZvciB0aGUgZmluYWwgc3RhdGUgYWZ0ZXIgdGhlIGNoYW5nZS4gd2hpbGUgY2hhbmdpbmcsIHRoZSBmZWF0dXJlIHdpbGwgYmVcbiAgLy8vIGluIHRoZSAnY2hhbmdpbmcnIHN0YXRlLiBBbHNvIG5vdGUgdGhhdCB0aGUgZmVhdHVyZSB3aWxsIGJlIGNoYW5nZWQgYXQgdGhlIFwiZGVmYXVsdFwiIGxheWVyLlxuICByZWFkb25seSBvbkNoYW5nZURlZmF1bHQ/OiAobmFtZTogSywgbmV3VmFsdWU6IEZlYXR1cmVWYWx1ZSkgPT4gUHJvbWlzZTxGZWF0dXJlVmFsdWU+O1xuXG4gIC8vLyBpZiBzZXQgdHJ1ZSwgd2lsbCBmb3JjZSB0aGUgZmllbGQgdG8gd2hhdCBpdCBpcyBzZXQgaGVyZSB0aHJvdWdoIGxheWVycyBvZiBzdGF0ZXMuXG4gIC8vLyB1c2VmdWwgdG8gaW52ZXJ0IHRoZSBsYXllcnMsIHNpbWlsYXIgdG8gIWltcG9ydGFudCBpbiBDU1MuXG4gIHJlYWRvbmx5IGZvcmNlPzogYm9vbGVhbjtcblxuICAvLy8gSWYgc2V0IHRvIHRydWUsIHRoZSBmZWF0dXJlIHdpbGwgbm90IGJlIG92ZXJyaWRhYmxlIGJ5IHRoZSB1c2VyLlxuICByZWFkb25seSBub092ZXJyaWRlPzogYm9vbGVhbjtcblxuICAvLy8gY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB3aGF0IHNob3VsZCBoYXBwZW4gaWYgdGhlIGZlYXR1cmUgaXMgbm90IHNldCB0byBhIHBhcnRpY3VsYXIgdmFsdWUuXG4gIHJlYWRvbmx5IGRlZmF1bHRWYWx1ZT86IEZlYXR1cmVWYWx1ZTtcbn1cblxuaW50ZXJmYWNlIEZlYXR1cmVDb250ZXh0IHtcbiAgZmVhdHVyZURlc2M/OiBGZWF0dXJlRGVzY3JpcHRpb247XG59XG5cbnR5cGUgRmVhdHVyZVR5cGVTdGF0ZSA9XG4gIHwge1xuICAgICAgdmFsdWU6ICdhc3luY0RlbmFibGVkJztcbiAgICAgIGNvbnRleHQ6IEZlYXR1cmVDb250ZXh0O1xuICAgIH1cbiAgfCB7XG4gICAgICB2YWx1ZTogJ2FzeW5jRGlzYWJsZWQnO1xuICAgICAgY29udGV4dDogRmVhdHVyZUNvbnRleHQ7XG4gICAgfVxuICB8IHtcbiAgICAgIHZhbHVlOiAnYXN5bmNVbnNwZWNpZWQnO1xuICAgICAgY29udGV4dDogRmVhdHVyZUNvbnRleHQ7XG4gICAgfVxuICB8IHtcbiAgICAgIHZhbHVlOiAnZGlzYWJsZWQnO1xuICAgICAgY29udGV4dDogRmVhdHVyZUNvbnRleHQ7XG4gICAgfVxuICB8IHtcbiAgICAgIHZhbHVlOiAnZW5hYmxlZCc7XG4gICAgICBjb250ZXh0OiBGZWF0dXJlQ29udGV4dDtcbiAgICB9XG4gIHwge1xuICAgICAgdmFsdWU6ICdpbml0aWFsJztcbiAgICAgIGNvbnRleHQ6IG5ldmVyO1xuICAgIH1cbiAgfCB7XG4gICAgICB2YWx1ZTogJ3Vuc3BlY2llZCc7XG4gICAgICBjb250ZXh0OiBGZWF0dXJlQ29udGV4dDtcbiAgICB9O1xuXG4vKipcbiAqIEFjdGlvbnMgdGhhdCBjYW4gYmUgcGVyZm9ybWVkIG9uIGEgZmVhdHVyZS5cbiAqL1xuZXhwb3J0IHR5cGUgRmVhdHVyZUFjdGlvbiA9XG4gIHwgeyB0eXBlOiAnRElTQUJMRScgfVxuICB8IHsgdHlwZTogJ0VOQUJMRScgfVxuICB8IHsgdHlwZTogJ0lOSVQnOyBmZWF0dXJlOiBGZWF0dXJlRGVzY3JpcHRpb24gfVxuICB8IHsgdHlwZTogJ1NFVCc7IHZhbHVlOiBGZWF0dXJlVmFsdWUgfVxuICB8IHsgdHlwZTogJ1RPR0dMRScgfVxuICB8IHsgdHlwZTogJ1VOU0VUJyB9O1xuXG4vKipcbiAqIEZ1bGx5IGRlc2NyaWJlIHRoZSBzdGF0ZXMgYSBmZWF0dXJlIGNhbiBiZSBpblxuICovXG5leHBvcnQgY29uc3QgRmVhdHVyZU1hY2hpbmUgPSBjcmVhdGVNYWNoaW5lPEZlYXR1cmVDb250ZXh0LCBGZWF0dXJlQWN0aW9uLCBGZWF0dXJlVHlwZVN0YXRlPih7XG4gIGlkOiAnZmVhdHVyZScsXG4gIGluaXRpYWw6ICdpbml0aWFsJyxcbiAgY29udGV4dDoge30sXG4gIHByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzOiB0cnVlLFxuICBvbjoge1xuICAgIEVOQUJMRTogW1xuICAgICAgeyB0YXJnZXQ6ICdhc3luY0VuYWJsZWQnLCBjb25kOiAoY3R4KSA9PiBjdHguZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsIH0sXG4gICAgICB7IHRhcmdldDogJ2VuYWJsZWQnIH0sXG4gICAgXSxcblxuICAgIFRPR0dMRTogW1xuICAgICAgeyB0YXJnZXQ6ICdhc3luY0VuYWJsZWQnLCBjb25kOiAoY3R4KSA9PiBjdHguZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsIH0sXG4gICAgICB7IHRhcmdldDogJ2VuYWJsZWQnIH0sXG4gICAgXSxcblxuICAgIERJU0FCTEU6IFtcbiAgICAgIHsgdGFyZ2V0OiAnYXN5bmNEaXNhYmxlZCcsIGNvbmQ6IChjdHgpID0+IGN0eC5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwgfSxcbiAgICAgIHsgdGFyZ2V0OiAnZGlzYWJsZWQnIH0sXG4gICAgXSxcblxuICAgIFVOU0VUOiBbXG4gICAgICB7IHRhcmdldDogJ2FzeW5jVW5zcGVjaWVkJywgY29uZDogKGN0eCkgPT4gY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCB9LFxuICAgICAgeyB0YXJnZXQ6ICd1bnNwZWNpZmllZCcgfSxcbiAgICBdLFxuXG4gICAgU0VUOiBbXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogJ2FzeW5jRW5hYmxlZCcsXG4gICAgICAgIGNvbmQ6IChjdHgsIGUpID0+IGUudmFsdWUgPT09IHRydWUgJiYgY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogJ2FzeW5jRGlzYWJsZWQnLFxuICAgICAgICBjb25kOiAoY3R4LCBlKSA9PiBlLnZhbHVlID09PSBmYWxzZSAmJiBjdHguZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGFyZ2V0OiAnYXN5bmNVbnNwZWNpZWQnLFxuICAgICAgICBjb25kOiAoY3R4LCBfZSkgPT4gY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogJ2VuYWJsZWQnLFxuICAgICAgICBjb25kOiAoX2N0eCwgZSkgPT4gZS52YWx1ZSA9PT0gdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogJ2Rpc2FibGVkJyxcbiAgICAgICAgY29uZDogKF9jdHgsIGUpID0+IGUudmFsdWUgPT09IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHsgdGFyZ2V0OiAndW5zcGVjaWZpZWQnIH0sXG4gICAgXSxcbiAgfSxcblxuICBzdGF0ZXM6IHtcbiAgICBpbml0aWFsOiB7XG4gICAgICBvbjoge1xuICAgICAgICBJTklUOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYWN0aW9uczogYXNzaWduKHsgZmVhdHVyZURlc2M6IChfLCBlKSA9PiBlLmZlYXR1cmUgfSksXG4gICAgICAgICAgICB0YXJnZXQ6ICdlbmFibGVkJyxcbiAgICAgICAgICAgIGNvbmQ6IChfLCBlKSA9PiBlLmZlYXR1cmUuZGVmYXVsdFZhbHVlID09PSB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYWN0aW9uczogYXNzaWduKHsgZmVhdHVyZURlc2M6IChfLCBlKSA9PiBlLmZlYXR1cmUgfSksXG4gICAgICAgICAgICB0YXJnZXQ6ICd1bnNwZWNpZmllZCcsXG4gICAgICAgICAgICBjb25kOiAoXywgZSkgPT4gZS5mZWF0dXJlLmRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYWN0aW9uczogYXNzaWduKHsgZmVhdHVyZURlc2M6IChfLCBlKSA9PiBlLmZlYXR1cmUgfSksXG4gICAgICAgICAgICB0YXJnZXQ6ICdkaXNhYmxlZCcsXG4gICAgICAgICAgICBjb25kOiAoXywgZSkgPT4gZS5mZWF0dXJlLmRlZmF1bHRWYWx1ZSA9PT0gZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIHVuc3BlY2lmaWVkOiB7fSxcbiAgICBkaXNhYmxlZDoge30sXG4gICAgZW5hYmxlZDoge30sXG5cbiAgICBhc3luY0Rpc2FibGVkOiB7XG4gICAgICBpbnZva2U6IHtcbiAgICAgICAgaWQ6ICdzZXQtb2ZmLXVwc3RyZWFtJyxcbiAgICAgICAgc3JjOiBhc3luYyAoY3R4KSA9PiB7XG4gICAgICAgICAgY29uc3Qgb25jaGFuZ2UgPSBjdHguZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdDtcbiAgICAgICAgICBpZiAob25jaGFuZ2UgIT0gbnVsbCAmJiBjdHguZmVhdHVyZURlc2MgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG9uY2hhbmdlKGN0eC5mZWF0dXJlRGVzYy5uYW1lLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRG9uZTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRhcmdldDogJ2VuYWJsZWQnLFxuICAgICAgICAgICAgY29uZDogKF9jdHgsIGU6IERvbmVJbnZva2VFdmVudDxGZWF0dXJlVmFsdWU+KSA9PiBlLmRhdGEgPT09IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdkaXNhYmxlZCcsXG4gICAgICAgICAgICBjb25kOiAoX2N0eCwgZTogRG9uZUludm9rZUV2ZW50PEZlYXR1cmVWYWx1ZT4pID0+IGUuZGF0YSA9PT0gZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHRhcmdldDogJ3Vuc3BlY2lmaWVkJyB9LFxuICAgICAgICBdLFxuICAgICAgICBvbkVycm9yOiAndW5zcGVjaWZpZWQnLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgYXN5bmNVbnNwZWNpZWQ6IHtcbiAgICAgIGludm9rZToge1xuICAgICAgICBpZDogJ3NldC11bnNldC11cHN0cmVhbScsXG4gICAgICAgIHNyYzogYXN5bmMgKGN0eCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9uY2hhbmdlID0gY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQ7XG4gICAgICAgICAgaWYgKG9uY2hhbmdlICE9IG51bGwgJiYgY3R4LmZlYXR1cmVEZXNjICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBvbmNoYW5nZShjdHguZmVhdHVyZURlc2MubmFtZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSxcbiAgICAgICAgb25Eb25lOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGFyZ2V0OiAnZW5hYmxlZCcsXG4gICAgICAgICAgICBjb25kOiAoX2N0eCwgZTogRG9uZUludm9rZUV2ZW50PEZlYXR1cmVWYWx1ZT4pID0+IGUuZGF0YSA9PT0gdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRhcmdldDogJ2Rpc2FibGVkJyxcbiAgICAgICAgICAgIGNvbmQ6IChfY3R4LCBlOiBEb25lSW52b2tlRXZlbnQ8RmVhdHVyZVZhbHVlPikgPT4gZS5kYXRhID09PSBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgdGFyZ2V0OiAndW5zcGVjaWZpZWQnIH0sXG4gICAgICAgIF0sXG4gICAgICAgIG9uRXJyb3I6ICd1bnNwZWNpZmllZCcsXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBhc3luY0VuYWJsZWQ6IHtcbiAgICAgIGludm9rZToge1xuICAgICAgICBpZDogJ3NldC1vbi11cHN0cmVhbScsXG4gICAgICAgIHNyYzogYXN5bmMgKGN0eCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9uY2hhbmdlID0gY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQ7XG4gICAgICAgICAgaWYgKG9uY2hhbmdlICE9IG51bGwgJiYgY3R4LmZlYXR1cmVEZXNjICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBvbmNoYW5nZShjdHguZmVhdHVyZURlc2MubmFtZSwgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRG9uZTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRhcmdldDogJ2VuYWJsZWQnLFxuICAgICAgICAgICAgY29uZDogKF9jdHgsIGU6IERvbmVJbnZva2VFdmVudDxGZWF0dXJlVmFsdWU+KSA9PiBlLmRhdGEgPT09IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdkaXNhYmxlZCcsXG4gICAgICAgICAgICBjb25kOiAoX2N0eCwgZTogRG9uZUludm9rZUV2ZW50PEZlYXR1cmVWYWx1ZT4pID0+IGUuZGF0YSA9PT0gZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHRhcmdldDogJ3Vuc3BlY2lmaWVkJyB9LFxuICAgICAgICBdLFxuICAgICAgICBvbkVycm9yOiAndW5zcGVjaWZpZWQnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iLCAiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIFJlYWN0Tm9kZSwgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IHVzZU1hY2hpbmUgfSBmcm9tICdAeHN0YXRlL3JlYWN0JztcblxuaW1wb3J0IHsgRW5hYmxlQ29udGV4dCB9IGZyb20gJy4vRW5hYmxlQ29udGV4dCc7XG5pbXBvcnQgeyBGZWF0dXJlQ29udGV4dCB9IGZyb20gJy4vRmVhdHVyZUNvbnRleHQnO1xuaW1wb3J0IHsgRmVhdHVyZXNNYWNoaW5lIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcbmltcG9ydCB7IEZlYXR1cmVEZXNjcmlwdGlvbiB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcbmltcG9ydCB1c2VDb25zb2xlT3ZlcnJpZGUgZnJvbSAnLi91c2VDb25zb2xlT3ZlcnJpZGUnO1xuaW1wb3J0IHVzZVBlcnNpc3QsIHsgS0VZIH0gZnJvbSAnLi91c2VQZXJzaXN0JztcbmltcG9ydCB1c2VUZXN0Q2FsbGJhY2sgZnJvbSAnLi91c2VUZXN0Q2FsbGJhY2snO1xuXG5pbnRlcmZhY2UgRmVhdHVyZVByb3BzIHtcbiAgcmVhZG9ubHkgZmVhdHVyZXM6IHJlYWRvbmx5IEZlYXR1cmVEZXNjcmlwdGlvbltdO1xuICByZWFkb25seSBjaGlsZHJlbj86IFJlYWN0Tm9kZTtcbiAgcmVhZG9ubHkgZGlzYWJsZUNvbnNvbGU/OiBib29sZWFuO1xuICByZWFkb25seSBzdG9yYWdlPzogU3RvcmFnZTtcbn1cblxuLyoqXG4gKiBBIG1vcmUgYmF0dGVyaWVzLWVuYWJsZWQgcGFyZW50IGNvbXBvbmVudCB0aGF0IGtlZXBzIHRyYWNrIG9mIGZlYXR1cmUgc3RhdGVcbiAqIGludGVybmFsbHksIGFuZCBjcmVhdGVzIHdpbmRvdy5mZWF0dXJlLmVuYWJsZShcImZcIikgYW5kIHdpbmRvdy5mZWF0dXJlLmRpc2FibGUoXCJmXCIpLlxuICogS2VlcHMgdHJhY2sgb2Ygb3ZlcnJpZGVzIGFuZCBkZWZhdWx0cywgd2l0aCBkZWZhdWx0cyBwb3RlbnRpYWxseSBjb21pbmcgZnJvbSB5b3VyIHByb3BzXG4gKiBhbmQgb3ZlcnJpZGVzIGJlaW5nIHBlcnNpc3RlZCB0byB5b3VyIGNob2ljZSBvZiBzdG9yYWdlIGxheWVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gRmVhdHVyZXMoe1xuICBjaGlsZHJlbixcbiAgZmVhdHVyZXMsXG4gIGRpc2FibGVDb25zb2xlID0gZmFsc2UsXG4gIHN0b3JhZ2UgPSB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UsXG59OiBGZWF0dXJlUHJvcHMpOiBKU1guRWxlbWVudCB7XG4gIC8vIENhcHR1cmUgb25seSBmaXJzdCB2YWx1ZTsgd2UgZG9uJ3QgY2FyZSBhYm91dCBmdXR1cmUgdXBkYXRlc1xuICBjb25zdCBmZWF0dXJlc1JlZiA9IHVzZVJlZihmZWF0dXJlcyk7XG4gIGNvbnN0IFtvdmVycmlkZXNTdGF0ZSwgb3ZlcnJpZGVzU2VuZF0gPSB1c2VNYWNoaW5lKEZlYXR1cmVzTWFjaGluZSk7XG4gIGNvbnN0IFtkZWZhdWx0c1N0YXRlLCBkZWZhdWx0c1NlbmRdID0gdXNlTWFjaGluZShGZWF0dXJlc01hY2hpbmUpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8vIExvYWQgZGVmYXVsdHNcbiAgICBkZWZhdWx0c1NlbmQoeyB0eXBlOiAnSU5JVCcsIGZlYXR1cmVzIH0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkZWZhdWx0c1NlbmQoeyB0eXBlOiAnREVfSU5JVCcgfSk7XG4gICAgfTtcbiAgfSwgW2RlZmF1bHRzU2VuZCwgZmVhdHVyZXNdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCBmOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuIHwgdW5kZWZpbmVkPiA9IHt9O1xuICAgIGlmIChzdG9yYWdlICE9IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZlYXR1cmVzSnNvbiA9IHN0b3JhZ2UuZ2V0SXRlbShLRVkpO1xuICAgICAgICBpZiAoZmVhdHVyZXNKc29uICE9IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBmaCA9IEpTT04ucGFyc2UoZmVhdHVyZXNKc29uKTtcbiAgICAgICAgICBmID0gZmgub3ZlcnJpZGVzO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIENhbid0IHBhcnNlIG9yIGdldCBvciBvdGhlcndpc2U7IGlnbm9yZVxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciBpbiBsb2NhbFN0b3JhZ2UnLCBlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvdmVycmlkZXNTZW5kKHtcbiAgICAgIHR5cGU6ICdJTklUJyxcbiAgICAgIGZlYXR1cmVzOiBmZWF0dXJlc1JlZi5jdXJyZW50XG4gICAgICAgIC5maWx0ZXIoKHgpID0+IHgubm9PdmVycmlkZSAhPT0gdHJ1ZSlcbiAgICAgICAgLm1hcCgoeCkgPT4gKHsgbmFtZTogeC5uYW1lLCBkZXNjcmlwdGlvbjogeC5kZXNjcmlwdGlvbiwgZGVmYXVsdFZhbHVlOiBmPy5beC5uYW1lXSA/PyB1bmRlZmluZWQgfSkpLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIG92ZXJyaWRlc1NlbmQoeyB0eXBlOiAnREVfSU5JVCcgfSk7XG4gICAgfTtcbiAgfSwgW2ZlYXR1cmVzUmVmLCBvdmVycmlkZXNTZW5kLCBzdG9yYWdlXSk7XG5cbiAgdXNlUGVyc2lzdChzdG9yYWdlLCBmZWF0dXJlc1JlZi5jdXJyZW50LCBvdmVycmlkZXNTdGF0ZSk7XG5cbiAgY29uc3QgdGVzdENhbGxiYWNrID0gdXNlVGVzdENhbGxiYWNrKG92ZXJyaWRlc1N0YXRlLCBkZWZhdWx0c1N0YXRlKTtcbiAgdXNlQ29uc29sZU92ZXJyaWRlKCFkaXNhYmxlQ29uc29sZSwgZmVhdHVyZXNSZWYuY3VycmVudCwgdGVzdENhbGxiYWNrLCBkZWZhdWx0c1NlbmQpO1xuXG4gIGNvbnN0IGZlYXR1cmVWYWx1ZSA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIG92ZXJyaWRlc1NlbmQsXG4gICAgICBkZWZhdWx0c1NlbmQsXG4gICAgICBmZWF0dXJlc0Rlc2NyaXB0aW9uOiBmZWF0dXJlc1JlZi5jdXJyZW50LFxuICAgICAgb3ZlcnJpZGVzU3RhdGUsXG4gICAgICBkZWZhdWx0c1N0YXRlLFxuICAgICAgdGVzdDogdGVzdENhbGxiYWNrLFxuICAgIH0pLFxuICAgIFtvdmVycmlkZXNTZW5kLCBkZWZhdWx0c1NlbmQsIG92ZXJyaWRlc1N0YXRlLCBkZWZhdWx0c1N0YXRlLCB0ZXN0Q2FsbGJhY2tdXG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8RmVhdHVyZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e2ZlYXR1cmVWYWx1ZX0+XG4gICAgICA8RW5hYmxlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dGVzdENhbGxiYWNrfT57Y2hpbGRyZW59PC9FbmFibGVDb250ZXh0LlByb3ZpZGVyPlxuICAgIDwvRmVhdHVyZUNvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59XG4iLCAiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRmVhdHVyZVZhbHVlIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuXG5leHBvcnQgdHlwZSBFbmFibGVDb250ZXh0VHlwZSA9IChmZWF0dXJlOiBzdHJpbmcpID0+IEZlYXR1cmVWYWx1ZTtcblxuLyoqXG4gKiBDb250YWluZWQgZnVuY3Rpb24gY2FuIGNoZWNrIHdoZXRoZXIgYSBnaXZlbiBmZWF0dXJlIGlzIGVuYWJsZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBFbmFibGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxFbmFibGVDb250ZXh0VHlwZT4oKF9zKSA9PiBmYWxzZSk7XG4iLCAiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRmVhdHVyZXNEaXNwYXRjaCwgRmVhdHVyZXNTdGF0ZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgeyBGZWF0dXJlRGVzY3JpcHRpb24sIEZlYXR1cmVWYWx1ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcblxuZXhwb3J0IGNvbnN0IEZlYXR1cmVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxGZWF0dXJlQ29udGV4dFR5cGUgfCBudWxsPihudWxsKTtcblxuLy8vIEdpdmUgYWNjZXNzIHRvIHRoZSBvdmVycmlkZXMgbGF5ZXJcbmV4cG9ydCBpbnRlcmZhY2UgRmVhdHVyZUNvbnRleHRUeXBlIHtcbiAgLy8gTWFrZSBjaGFuZ2VzIHRvIHRoZSBvdmVycmlkZXNcbiAgb3ZlcnJpZGVzU2VuZDogRmVhdHVyZXNEaXNwYXRjaDtcblxuICAvLyBNYWtlIGNoYW5nZXMgdG8gZGVmYXVsdHNcbiAgZGVmYXVsdHNTZW5kOiBGZWF0dXJlc0Rpc3BhdGNoO1xuXG4gIGZlYXR1cmVzRGVzY3JpcHRpb246IHJlYWRvbmx5IEZlYXR1cmVEZXNjcmlwdGlvbltdO1xuXG4gIC8vIFN0YXRlIGlzIGluIGxheWVyczsgb3ZlcnJpZGVzIGFuZCBkZWZhdWx0c1xuICBvdmVycmlkZXNTdGF0ZTogRmVhdHVyZXNTdGF0ZTtcbiAgZGVmYXVsdHNTdGF0ZTogRmVhdHVyZXNTdGF0ZTtcblxuICAvLy8gVGVzdCB3aXRoIHByb3BlciBmYWxsYmFjayBhbmQgcmVzcGVjdGluZyB0aGUgdXNlcidzIGZvcmNlIHByZWZlcmVuY2VcbiAgdGVzdDogKGZsYWc6IHN0cmluZykgPT4gRmVhdHVyZVZhbHVlO1xufVxuIiwgImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRmVhdHVyZXNEaXNwYXRjaCB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgeyBGZWF0dXJlRGVzY3JpcHRpb24sIEZlYXR1cmVWYWx1ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcbmltcG9ydCB7IEdsb2JhbEVuYWJsZSB9IGZyb20gJy4vR2xvYmFsRW5hYmxlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQ29uc29sZU92ZXJyaWRlKFxuICBjb25zb2xlT3ZlcnJpZGU6IGJvb2xlYW4sXG4gIGZlYXR1cmVzOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXSxcbiAgdGVzdEZlYXR1cmU6IChfOiBzdHJpbmcpID0+IEZlYXR1cmVWYWx1ZSxcbiAgZGlzcGF0Y2g6IEZlYXR1cmVzRGlzcGF0Y2hcbik6IHZvaWQge1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghY29uc29sZU92ZXJyaWRlKSB7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAvKiBlbXB0eSAqL1xuICAgICAgfTtcbiAgICB9XG4gICAgd2luZG93LmZlYXR1cmUgPSBuZXcgR2xvYmFsRW5hYmxlKGRpc3BhdGNoLCB0ZXN0RmVhdHVyZSwgZmVhdHVyZXMpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAod2luZG93LmZlYXR1cmUgIT0gbnVsbCkge1xuICAgICAgICBkZWxldGUgd2luZG93LmZlYXR1cmU7XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW2ZlYXR1cmVzLCBkaXNwYXRjaCwgY29uc29sZU92ZXJyaWRlLCB0ZXN0RmVhdHVyZV0pO1xufVxuIiwgImltcG9ydCB7IEZlYXR1cmVzRGlzcGF0Y2ggfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuaW1wb3J0IHsgRmVhdHVyZURlc2NyaXB0aW9uLCBGZWF0dXJlVmFsdWUgfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5cbmV4cG9ydCBjbGFzcyBHbG9iYWxFbmFibGUge1xuICBwcml2YXRlIHJlYWRvbmx5IGZlYXR1cmVEZXNjOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXTtcbiAgcHJpdmF0ZSByZWFkb25seSBkaXNwYXRjaDogRmVhdHVyZXNEaXNwYXRjaDtcbiAgcHJpdmF0ZSByZWFkb25seSB0ZXN0RmVhdHVyZTogKHZhbHVlOiBzdHJpbmcpID0+IEZlYXR1cmVWYWx1ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBkaXNwYXRjaDogRmVhdHVyZXNEaXNwYXRjaCxcbiAgICB0ZXN0RmVhdHVyZTogKF86IHN0cmluZykgPT4gRmVhdHVyZVZhbHVlLFxuICAgIGZlYXR1cmVEZXNjOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXVxuICApIHtcbiAgICB0aGlzLmZlYXR1cmVEZXNjID0gZmVhdHVyZURlc2M7XG4gICAgdGhpcy5kaXNwYXRjaCA9IGRpc3BhdGNoO1xuICAgIHRoaXMudGVzdEZlYXR1cmUgPSB0ZXN0RmVhdHVyZTtcbiAgfVxuXG4gIHB1YmxpYyB0b2dnbGUoZmVhdHVyZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaCh7IHR5cGU6ICdUT0dHTEUnLCBuYW1lOiBmZWF0dXJlIH0pO1xuICB9XG5cbiAgcHVibGljIGVuYWJsZShmZWF0dXJlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoKHsgdHlwZTogJ0VOQUJMRScsIG5hbWU6IGZlYXR1cmUgfSk7XG4gIH1cblxuICBwdWJsaWMgdW5zZXQoZmVhdHVyZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaCh7IHR5cGU6ICdVTlNFVCcsIG5hbWU6IGZlYXR1cmUgfSk7XG4gIH1cblxuICBwdWJsaWMgZGlzYWJsZShmZWF0dXJlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoKHsgdHlwZTogJ0RJU0FCTEUnLCBuYW1lOiBmZWF0dXJlIH0pO1xuICB9XG5cbiAgcHVibGljIHNldEFsbChmZWF0dXJlczogeyBba2V5OiBzdHJpbmddOiBGZWF0dXJlVmFsdWUgfSk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2goeyB0eXBlOiAnU0VUX0FMTCcsIGZlYXR1cmVzIH0pO1xuICB9XG5cbiAgcHVibGljIGxpc3RGZWF0dXJlcygpOiByZWFkb25seSBbc3RyaW5nLCBGZWF0dXJlVmFsdWVdW10ge1xuICAgIHJldHVybiB0aGlzLmZlYXR1cmVEZXNjLm1hcCgoZikgPT4gW2YubmFtZSwgdGhpcy50ZXN0RmVhdHVyZShmLm5hbWUpXSk7XG4gIH1cbn1cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgZmVhdHVyZT86IEdsb2JhbEVuYWJsZTtcbiAgfVxufVxuIiwgImltcG9ydCB7IHVzZU1lbW8sIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRmVhdHVyZXNTdGF0ZSwgdmFsdWVPZkZlYXR1cmUgfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuaW1wb3J0IHsgRmVhdHVyZURlc2NyaXB0aW9uLCBGZWF0dXJlVmFsdWUgfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5cbmV4cG9ydCBjb25zdCBLRVkgPSAncmVhY3QtZW5hYmxlOmZlYXR1cmUtdmFsdWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlUGVyc2lzdChcbiAgc3RvcmFnZTogU3RvcmFnZSB8IHVuZGVmaW5lZCxcbiAgZmVhdHVyZXM6IHJlYWRvbmx5IEZlYXR1cmVEZXNjcmlwdGlvbltdLFxuICBvdmVycmlkZVN0YXRlOiBGZWF0dXJlc1N0YXRlXG4pOiB2b2lkIHtcbiAgY29uc3Qgb3ZlcnJpZGVzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgbmV3T3ZlcnJpZGVzOiB7IFtrZXk6IHN0cmluZ106IEZlYXR1cmVWYWx1ZSB9ID0ge307XG4gICAgaWYgKG92ZXJyaWRlU3RhdGUubWF0Y2hlcygncmVhZHknKSkge1xuICAgICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIGZlYXR1cmVzKSB7XG4gICAgICAgIGNvbnN0IFt2YWx1ZV0gPSB2YWx1ZU9mRmVhdHVyZShvdmVycmlkZVN0YXRlLCBmZWF0dXJlLm5hbWUpO1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgIG5ld092ZXJyaWRlc1tmZWF0dXJlLm5hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld092ZXJyaWRlcztcbiAgfSwgW2ZlYXR1cmVzLCBvdmVycmlkZVN0YXRlXSk7XG5cbiAgY29uc3Qgc3RyU3RhdGUgPSBPYmplY3Qua2V5cyhvdmVycmlkZXMpLmxlbmd0aCA9PT0gMCB8fCBzdG9yYWdlID09IG51bGwgPyAne30nIDogSlNPTi5zdHJpbmdpZnkoeyBvdmVycmlkZXMgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKHN0b3JhZ2UgIT0gbnVsbCAmJiBvdmVycmlkZVN0YXRlLm1hdGNoZXMoJ3JlYWR5JykpIHtcbiAgICAgICAgc3RvcmFnZS5zZXRJdGVtKEtFWSwgc3RyU3RhdGUpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIENhbid0IHNldCBmb3Igc29tZSByZWFzb25cbiAgICB9XG4gIH0sIFtvdmVycmlkZVN0YXRlLCBzdG9yYWdlLCBzdHJTdGF0ZV0pO1xufVxuIiwgImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBGZWF0dXJlc1N0YXRlIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcbmltcG9ydCB0ZXN0RmVhdHVyZSBmcm9tICcuL3Rlc3RGZWF0dXJlJztcblxuLy8vIEEgY2FsbGJhY2sgdGhhdCBjYW4gYmUgY2FsbGVkIHRvIHRlc3QgaWYgYSBmZWF0dXJlIGlzIGVuYWJsZWQgb3IgZGlzYWJsZWRcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZVRlc3RDYWxsYmFjayhcbiAgZGVmYXVsdHNTdGF0ZTogRmVhdHVyZXNTdGF0ZSxcbiAgb3ZlcnJpZGVzU3RhdGU6IEZlYXR1cmVzU3RhdGVcbik6IChmZWF0dXJlOiBzdHJpbmcpID0+IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICByZXR1cm4gdXNlQ2FsbGJhY2soKGY6IHN0cmluZykgPT4gdGVzdEZlYXR1cmUoZiwgW2RlZmF1bHRzU3RhdGUsIG92ZXJyaWRlc1N0YXRlXSksIFtkZWZhdWx0c1N0YXRlLCBvdmVycmlkZXNTdGF0ZV0pO1xufVxuIiwgImltcG9ydCB7IEZlYXR1cmVzU3RhdGUsIHZhbHVlT2ZGZWF0dXJlIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcbmltcG9ydCB7IEZlYXR1cmVWYWx1ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcblxuLyoqIERldGVybWluZSBpZiB0aGUgZmVhdHVyZSBpcyBlbmFibGVkIGluIG9uZSBvZiB0aGUgc3RhdGUgbWFjaGluZXMsIGluIG9yZGVyXG4gKlxuICogQHBhcmFtIHN0YXRlIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBtYWNoaW5lXG4gKiBAcGFyYW0gZmVhdHVyZSBUaGUgZmVhdHVyZSB0byBjaGVja1xuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlc3RGZWF0dXJlKGZlYXR1cmU6IHN0cmluZywgc3RhdGVzOiBGZWF0dXJlc1N0YXRlW10pOiBGZWF0dXJlVmFsdWUge1xuICBjb25zdCB2YWx1ZXMgPSBzdGF0ZXMubWFwKChzdGF0ZSkgPT4gdmFsdWVPZkZlYXR1cmUoc3RhdGUsIGZlYXR1cmUpKTtcblxuICAvLyBsb29rIGZvciBiZXN0IGZvcmNlZCBvcHRpb24sIGluIG9yZGVyXG4gIGZvciAoY29uc3QgW2ZlYXR1cmVWYWx1ZSwgZmVhdHVyZUZvcmNlZF0gb2YgdmFsdWVzKSB7XG4gICAgaWYgKGZlYXR1cmVWYWx1ZSAhPSBudWxsICYmIGZlYXR1cmVGb3JjZWQpIHtcbiAgICAgIHJldHVybiBmZWF0dXJlVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLy8gbG9vayBmb3IgYmVzdCBub24tZm9yY2VkIG9wdGlvbiwgaW4gb3JkZXJcbiAgZm9yIChjb25zdCBbZmVhdHVyZVZhbHVlXSBvZiB2YWx1ZXMpIHtcbiAgICBpZiAoZmVhdHVyZVZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBmZWF0dXJlVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLy8gdW5zZXQgaWYgbm90aGluZyBoaXRcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiIsICJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IHVzZUFsbEVuYWJsZWQgfSBmcm9tICcuL3VzZUFsbEVuYWJsZWQnO1xuaW1wb3J0IHsgdXNlRW5hYmxlZCB9IGZyb20gJy4vdXNlRW5hYmxlZCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW5hYmxlUHJvcHMge1xuICByZWFkb25seSBmZWF0dXJlPzogc3RyaW5nW10gfCBzdHJpbmc7XG4gIHJlYWRvbmx5IGFsbEZlYXR1cmVzPzogc3RyaW5nW107XG4gIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGU7XG59XG5cbi8qKlxuICogRmVhdHVyZSB3aWxsIGJlIGVuYWJsZWQgaWYgYW55IGZlYXR1cmUgaW4gdGhlIGxpc3QgYXJlIGVuYWJsZWQsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBFbmFibGUoeyBmZWF0dXJlID0gW10sIGFsbEZlYXR1cmVzID0gW10sIGNoaWxkcmVuIH06IEVuYWJsZVByb3BzKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgaXNBbnkgPSB1c2VFbmFibGVkKGZlYXR1cmUpO1xuICBjb25zdCBpc0FsbCA9IHVzZUFsbEVuYWJsZWQoYWxsRmVhdHVyZXMpO1xuXG4gIGlmIChpc0FueSB8fCBpc0FsbCkge1xuICAgIHJldHVybiA8PntjaGlsZHJlbn08Lz47XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsICJpbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBFbmFibGVDb250ZXh0VHlwZSwgRW5hYmxlQ29udGV4dCB9IGZyb20gJy4vRW5hYmxlQ29udGV4dCc7XG5cbi8vIEhlbHBlcjogZ2V0IHJpZCBvZiBzb21lIGJvaWxlcnBsYXRlLlxuLy8ganVzdCBpbnB1dCBtYXNoaW5nIGFuZCBzYW5pdGF0aW9uLCByZW1vdmluZyBleHRyYSByZW5kZXJzLCBhbmQgZ2V0dGluZyB0ZXN0IGZ1bmN0aW9uXG5leHBvcnQgZnVuY3Rpb24gdXNlVGVzdEFuZENvbnZlcnQoaW5wdXQ/OiBzdHJpbmdbXSB8IHN0cmluZyB8IG51bGwpOiBbRW5hYmxlQ29udGV4dFR5cGUsIHN0cmluZ1tdXSB7XG4gIGNvbnN0IHRlc3QgPSB1c2VDb250ZXh0KEVuYWJsZUNvbnRleHQpO1xuXG4gIC8vIFdlIG1lbW9pemUganVzdCB0byBwcmV2ZW50IHJlLXJlbmRlcnMgc2luY2UgdGhpcyBjb3VsZCBiZSBhdCB0aGUgbGVhZiBvZiBhIHRyZWVcbiAgY29uc3QgY29udmVydGVkID0gdXNlTWVtbygoKSA9PiAoaW5wdXQgPT0gbnVsbCA/IFtdIDogQXJyYXkuaXNBcnJheShpbnB1dCkgPyBpbnB1dCA6IFtpbnB1dF0pLCBbaW5wdXRdKTtcblxuICByZXR1cm4gW3Rlc3QsIGNvbnZlcnRlZF07XG59XG4iLCAiaW1wb3J0IHsgdXNlVGVzdEFuZENvbnZlcnQgfSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiByZXR1cm5zIHRydWUgaWZmIGFsbCBzcGVjaWZpZWQgZmVhdHVyZXMgYXJlIGVuYWJsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFsbEVuYWJsZWQoYWxsRmVhdHVyZXM6IHN0cmluZ1tdIHwgc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IFt0ZXN0LCBxdWVyeUFsbFByZXNlbnRdID0gdXNlVGVzdEFuZENvbnZlcnQoYWxsRmVhdHVyZXMpO1xuICByZXR1cm4gcXVlcnlBbGxQcmVzZW50Lmxlbmd0aCA+IDAgJiYgcXVlcnlBbGxQcmVzZW50LmV2ZXJ5KHRlc3QpO1xufVxuIiwgImltcG9ydCB7IHVzZVRlc3RBbmRDb252ZXJ0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogcmV0dXJucyB0cnVlIGlmZiBhbnkgc3BlY2lmaWVkIGZlYXR1cmUgaXMgZW5hYmxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlRW5hYmxlZChmZWF0dXJlOiBzdHJpbmdbXSB8IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBbdGVzdCwgcXVlcnlBbnlQcmVzZW50XSA9IHVzZVRlc3RBbmRDb252ZXJ0KGZlYXR1cmUpO1xuICByZXR1cm4gcXVlcnlBbnlQcmVzZW50LnNvbWUodGVzdCk7XG59XG4iLCAiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCB7IEVuYWJsZVByb3BzIH0gZnJvbSBcIi4vRW5hYmxlXCI7XG5pbXBvcnQgeyB1c2VBbGxEaXNhYmxlZCB9IGZyb20gXCIuL3VzZUFsbERpc2FibGVkXCI7XG5pbXBvcnQgeyB1c2VEaXNhYmxlZCB9IGZyb20gXCIuL3VzZURpc2FibGVkXCI7XG5cbi8qKlxuICogRmVhdHVyZSB3aWxsIGJlIGRpc2FibGVkIGlmIGFueSBpbiB0aGUgbGlzdCBhcmUgZW5hYmxlZFxuICovXG5leHBvcnQgY29uc3QgRGlzYWJsZTogUmVhY3QuRkM8RW5hYmxlUHJvcHM+ID0gKHtcbiAgZmVhdHVyZSA9IFtdLFxuICBhbGxGZWF0dXJlcyA9IFtdLFxuICBjaGlsZHJlblxufSkgPT4ge1xuICBjb25zdCBpc0FueSA9IHVzZURpc2FibGVkKGZlYXR1cmUpO1xuICBjb25zdCBpc0FsbCA9IHVzZUFsbERpc2FibGVkKGFsbEZlYXR1cmVzKTtcblxuICBpZiAoaXNBbnkgfHwgaXNBbGwpIHtcbiAgICByZXR1cm4gPD57Y2hpbGRyZW59PC8+O1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuIiwgImltcG9ydCB7IHVzZVRlc3RBbmRDb252ZXJ0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogcmV0dXJucyB0cnVlIGlmZiBhbGwgc3BlY2lmaWVkIGZlYXR1cmVzIGFyZSBkaXNhYmxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlQWxsRGlzYWJsZWQod2l0aG91dEFsbDogc3RyaW5nW10gfCBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgW3Rlc3QsIHF1ZXJ5QWxsV2l0aG91dF0gPSB1c2VUZXN0QW5kQ29udmVydCh3aXRob3V0QWxsKTtcbiAgcmV0dXJuIHdpdGhvdXRBbGwubGVuZ3RoID4gMCAmJiBxdWVyeUFsbFdpdGhvdXQuZXZlcnkoKHgpID0+ICEodGVzdCh4KSA/PyBmYWxzZSkpO1xufVxuIiwgImltcG9ydCB7IHVzZVRlc3RBbmRDb252ZXJ0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogcmV0dXJucyB0cnVlIGlmZiBhbnkgc3BlY2lmaWVkIGZlYXR1cmUgaXMgZGlzYWJsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZURpc2FibGVkKHdpdGhvdXQ6IHN0cmluZ1tdIHwgc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IFt0ZXN0LCBxdWVyeUFueVdpdGhvdXRdID0gdXNlVGVzdEFuZENvbnZlcnQod2l0aG91dCk7XG4gIHJldHVybiBxdWVyeUFueVdpdGhvdXQuc29tZSgoeCkgPT4gISh0ZXN0KHgpID8/IGZhbHNlKSk7XG59XG4iLCAiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VDYWxsYmFjaywgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5cbmltcG9ydCB7IFJhZGlvR3JvdXAgfSBmcm9tICdAaGVhZGxlc3N1aS9yZWFjdCc7XG5cbmltcG9ydCB7IEZlYXR1cmVDb250ZXh0IH0gZnJvbSAnLi9GZWF0dXJlQ29udGV4dCc7XG5pbXBvcnQgeyB2YWx1ZU9mRmVhdHVyZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgeyBGZWF0dXJlRGVzY3JpcHRpb24gfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG4vLyBAdHMtZXhwZWN0LWVycm9yIGJ1bmRsZXIgd2lsbCB0YWtlIGNhcmUgb2YgdGhpc1xuaW1wb3J0IHN0eWxlcyBmcm9tICcuL3RhaWx3aW5kLmNzcyc7XG5cbmZ1bmN0aW9uIGNsYXNzTmFtZXMoLi4uY2xhc3Nlczogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gY2xhc3Nlcy5maWx0ZXIoQm9vbGVhbikuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBUb2dnbGVGZWF0dXJlKHsgZmVhdHVyZSB9OiB7IGZlYXR1cmU6IEZlYXR1cmVEZXNjcmlwdGlvbiB9KTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoRmVhdHVyZUNvbnRleHQpO1xuICBjb25zdCBoYW5kbGVDaGFuZ2VTZWxlY3Rpb24gPSB1c2VDYWxsYmFjayhcbiAgICAodmFsdWU6ICdmYWxzZScgfCAndHJ1ZScgfCAndW5zZXQnKSA9PiB7XG4gICAgICBpZiAoY29udGV4dD8ub3ZlcnJpZGVzU2VuZCAhPSBudWxsKSB7XG4gICAgICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgICAgICBjYXNlICd0cnVlJzoge1xuICAgICAgICAgICAgY29udGV4dC5vdmVycmlkZXNTZW5kKHsgdHlwZTogJ0VOQUJMRScsIG5hbWU6IGZlYXR1cmUubmFtZSB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlICdmYWxzZSc6IHtcbiAgICAgICAgICAgIGNvbnRleHQub3ZlcnJpZGVzU2VuZCh7IHR5cGU6ICdESVNBQkxFJywgbmFtZTogZmVhdHVyZS5uYW1lIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhc2UgJ3Vuc2V0Jzoge1xuICAgICAgICAgICAgY29udGV4dC5vdmVycmlkZXNTZW5kKHsgdHlwZTogJ1VOU0VUJywgbmFtZTogZmVhdHVyZS5uYW1lIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBbZmVhdHVyZS5uYW1lLCBjb250ZXh0XVxuICApO1xuXG4gIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHsgb3ZlcnJpZGVzU3RhdGUsIHRlc3Q6IHRlc3RGZWF0dXJlLCBkZWZhdWx0c1N0YXRlIH0gPSBjb250ZXh0O1xuXG4gIGNvbnN0IHZhbHVlSW5EZWZhdWx0cyA9ICh2YWx1ZU9mRmVhdHVyZShkZWZhdWx0c1N0YXRlLCBmZWF0dXJlLm5hbWUpWzBdID8/ICd1bnNldCcpLnRvU3RyaW5nKCkgYXNcbiAgICB8ICdmYWxzZSdcbiAgICB8ICd0cnVlJ1xuICAgIHwgJ3Vuc2V0JztcblxuICBjb25zdCB2YWx1ZUluT3ZlcnJpZGVzID0gKHZhbHVlT2ZGZWF0dXJlKG92ZXJyaWRlc1N0YXRlLCBmZWF0dXJlLm5hbWUpWzBdID8/ICd1bnNldCcpLnRvU3RyaW5nKCkgYXNcbiAgICB8ICdmYWxzZSdcbiAgICB8ICd0cnVlJ1xuICAgIHwgJ3Vuc2V0JztcblxuICBjb25zdCBhY3R1YWxDaGVja2VkID0gdGVzdEZlYXR1cmUoZmVhdHVyZS5uYW1lKTtcblxuICByZXR1cm4gKFxuICAgIDxSYWRpb0dyb3VwIGRpc2FibGVkPXtmZWF0dXJlLm5vT3ZlcnJpZGV9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2VTZWxlY3Rpb259IHZhbHVlPXt2YWx1ZUluT3ZlcnJpZGVzfT5cbiAgICAgIDxSYWRpb0dyb3VwLkxhYmVsPlxuICAgICAgICA8aDYgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTkwMCBhbGlnbi1jZW50ZXIgZmxleCBmbGV4LXJvdyBmbGV4LW5vd3JhcCBpdGVtcy1jZW50ZXIgZ2FwLTIgbGc6Z2FwLTQgaC03XCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tZWRpdW1cIj5cbiAgICAgICAgICAgIEZlYXR1cmU6IDxjb2RlPntmZWF0dXJlLm5hbWV9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICB7ZmVhdHVyZS5ub092ZXJyaWRlID09PSB0cnVlID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItb3JhbmdlLTUwMCB0ZXh0LW9yYW5nZS01MDAgZmxleCBmbGV4LW5vd3JhcCB0ZXh0LXhzIGZsZXgtcm93IGdhcC0xIHJvdW5kZWQtc20gYm9yZGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBweC0yIHB5LTFcIj5cbiAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC00IHctNCBtaW4tdy00XCJcbiAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgZD1cIk01IDlWN2E1IDUgMCAwMTEwIDB2MmEyIDIgMCAwMTIgMnY1YTIgMiAwIDAxLTIgMkg1YTIgMiAwIDAxLTItMnYtNWEyIDIgMCAwMTItMnptOC0ydjJIN1Y3YTMgMyAwIDAxNiAwelwiXG4gICAgICAgICAgICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICA8ZGl2Pk5vIE92ZXJyaWRlczwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAge2FjdHVhbENoZWNrZWQgPT09IHRydWUgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1ub3dyYXAgdGV4dC14cyB0ZXh0LWdyZWVuLTUwMCBmbGV4LXJvdyBnYXAtMSByb3VuZGVkLXNtIGJvcmRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYm9yZGVyLWdyZWVuLTUwMCBweC0yIHB5LTFcIj5cbiAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC00IHctNCBtaW4tdy00XCJcbiAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgZD1cIk0xMCAxOGE4IDggMCAxMDAtMTYgOCA4IDAgMDAwIDE2em0zLjcwNy05LjI5M2ExIDEgMCAwMC0xLjQxNC0xLjQxNEw5IDEwLjU4NiA3LjcwNyA5LjI5M2ExIDEgMCAwMC0xLjQxNCAxLjQxNGwyIDJhMSAxIDAgMDAxLjQxNCAwbDQtNHpcIlxuICAgICAgICAgICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgPGRpdj57YWN0dWFsQ2hlY2tlZCA/ICdFbmFibGVkJyA6ICdEaXNhYmxlZCd9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9oNj5cbiAgICAgICAge2ZlYXR1cmUuZGVzY3JpcHRpb24gPT0gbnVsbCA/IG51bGwgOiA8cCBjbGFzc05hbWU9XCJ0ZXh0LWJhc2UgdGV4dC1ncmF5LTUwMCB0ZXh0LXNtXCI+e2ZlYXR1cmUuZGVzY3JpcHRpb259PC9wPn1cbiAgICAgIDwvUmFkaW9Hcm91cC5MYWJlbD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBncmlkIGdyaWQtY29scy0xIGdhcC15LTYgc206Z3JpZC1jb2xzLTMgc206Z2FwLXgtNFwiPlxuICAgICAgICB7W1xuICAgICAgICAgIHsgaWQ6ICdmYWxzZScsIHRpdGxlOiBgRGlzYWJsZSAke2ZlYXR1cmUubmFtZX1gLCBkZXNjcmlwdGlvbjogJ092ZXJyaWRlIHRoZSBmZWF0dXJlIHRvIGJlIGRpc2FibGVkJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAndW5zZXQnLFxuICAgICAgICAgICAgdGl0bGU6ICdEZWZhdWx0JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSW5oZXJpdCBlbmFibGVkIHN0YXRlIGZyb20gZGVmYXVsdHMnLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IChmZWF0dXJlLm5vT3ZlcnJpZGUgPz8gZmFsc2UpIHx8IGZlYXR1cmUuZm9yY2UsXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6XG4gICAgICAgICAgICAgIHZhbHVlSW5EZWZhdWx0cyA9PT0gJ3RydWUnID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1ncmVlbi01MDAgYm9yZGVyLWdyZWVuLTUwMCBmbGV4IGZsZXgtbm93cmFwIHRleHQteHMgZmxleC1yb3cgZ2FwLTEgcm91bmRlZC1zbSBib3JkZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB4LTIgcHktMVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+RW5hYmxlZDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtcmVkLTUwMCBib3JkZXItcmVkLTUwMCBmbGV4IGZsZXgtbm93cmFwIHRleHQteHMgZmxleC1yb3cgZ2FwLTEgcm91bmRlZC1zbSBib3JkZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB4LTIgcHktMVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+RGlzYWJsZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IGlkOiAndHJ1ZScsIHRpdGxlOiBgRW5hYmxlICR7ZmVhdHVyZS5uYW1lfWAsIGRlc2NyaXB0aW9uOiAnT3ZlcnJpZGUgdGhlIGZlYXR1cmUgdG8gYmUgZW5hYmxlZCcgfSxcbiAgICAgICAgXS5tYXAoKG9wdGlvbikgPT4gKFxuICAgICAgICAgIDxSYWRpb0dyb3VwLk9wdGlvblxuICAgICAgICAgICAgY2xhc3NOYW1lPXsoeyBjaGVja2VkLCBhY3RpdmUsIGRpc2FibGVkIH0pID0+XG4gICAgICAgICAgICAgIGNsYXNzTmFtZXMoXG4gICAgICAgICAgICAgICAgY2hlY2tlZCA/ICdib3JkZXItdHJhbnNwYXJlbnQnIDogJ2JvcmRlci1ncmF5LTMwMCcsXG4gICAgICAgICAgICAgICAgIWRpc2FibGVkICYmIGFjdGl2ZSA/ICdib3JkZXItYmx1ZS01MDAgcmluZy0yIHJpbmctYmx1ZS01MDAnIDogJycsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQgPyAnYm9yZGVyLXRyYW5zcGFyZW50IHJpbmctZ3JheS01MDAgY3Vyc29yLW5vdC1hbGxvd2VkJyA6ICdjdXJzb3ItcG9pbnRlcicsXG4gICAgICAgICAgICAgICAgJ3JlbGF0aXZlIGJnLXdoaXRlIGJvcmRlciByb3VuZGVkLWxnIHNoYWRvdy1zbSBwLTMgZmxleCBmb2N1czpvdXRsaW5lLW5vbmUnXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtvcHRpb24uZGlzYWJsZWR9XG4gICAgICAgICAgICBrZXk9e29wdGlvbi5pZH1cbiAgICAgICAgICAgIHZhbHVlPXtvcHRpb24uaWR9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgeyh7IGNoZWNrZWQsIGFjdGl2ZSwgZGlzYWJsZWQgfSkgPT4gKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBncm93XCI+XG4gICAgICAgICAgICAgICAgICA8UmFkaW9Hcm91cC5MYWJlbCBhcz1cInNwYW5cIiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtbm93cmFwIGZsZXgtcm93IGdhcC0xIGl0ZW1zLWNlbnRlciBzcGFjZS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMCBncm93IHNocmlua1wiPntvcHRpb24udGl0bGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICB7b3B0aW9uLmRlZmF1bHRWYWx1ZSAhPSBudWxsID8gb3B0aW9uLmRlZmF1bHRWYWx1ZSA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyghY2hlY2tlZCA/ICdpbnZpc2libGUnIDogJycsICdoLTUgdy01IHRleHQtYmx1ZS01MDAgbWluLXctNCcpfVxuICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjAgMjBcIlxuICAgICAgICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVwiTTEwIDE4YTggOCAwIDEwMC0xNiA4IDggMCAwMDAgMTZ6bTMuNzA3LTkuMjkzYTEgMSAwIDAwLTEuNDE0LTEuNDE0TDkgMTAuNTg2IDcuNzA3IDkuMjkzYTEgMSAwIDAwLTEuNDE0IDEuNDE0bDIgMmExIDEgMCAwMDEuNDE0IDBsNC00elwiXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgPC9SYWRpb0dyb3VwLkxhYmVsPlxuICAgICAgICAgICAgICAgICAgPFJhZGlvR3JvdXAuRGVzY3JpcHRpb24gYXM9XCJzcGFuXCIgY2xhc3NOYW1lPVwibXQtMSBmbGV4IGl0ZW1zLWNlbnRlciB0ZXh0LXNtIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICAgICAgICAgICAge29wdGlvbi5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICAgIDwvUmFkaW9Hcm91cC5EZXNjcmlwdGlvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgICAgICAhZGlzYWJsZWQgJiYgYWN0aXZlID8gJ2JvcmRlcicgOiAnYm9yZGVyLTInLFxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkID8gKGRpc2FibGVkID8gJ2JvcmRlci1ncmF5LTUwMCcgOiAnYm9yZGVyLWJsdWUtNTAwJykgOiAnYm9yZGVyLXRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgICAgJ2Fic29sdXRlIC1pbnNldC1weCByb3VuZGVkLWxnIHBvaW50ZXItZXZlbnRzLW5vbmUnXG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1JhZGlvR3JvdXAuT3B0aW9uPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvUmFkaW9Hcm91cD5cbiAgKTtcbn1cblxuZnVuY3Rpb24gU2hhZG93Q29udGVudCh7IHJvb3QsIGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0Tm9kZTsgcm9vdDogRWxlbWVudCB9KSB7XG4gIHJldHVybiBSZWFjdERPTS5jcmVhdGVQb3J0YWwoY2hpbGRyZW4sIHJvb3QpO1xufVxuXG4vLy8gUGVybWl0IHVzZXJzIHRvIG92ZXJyaWRlIGZlYXR1cmUgZmxhZ3MgdmlhIGEgR1VJLlxuLy8vIFJlbmRlcnMgYSBzbWFsbCBmbG9hdGluZyBidXR0b24gaW4gbG93ZXIgbGVmdCBvciByaWdodCwgcHJlc3NpbmcgaXQgYnJpbmdzIHVwXG4vLy8gYSBsaXN0IG9mIGZlYXR1cmVzIHRvIHRvZ2dsZSBhbmQgdGhlaXIgY3VycmVudCBvdmVycmlkZSBzdGF0ZS4geW91IGNhbiBvdmVycmlkZSBvbiBvciBvdmVycmlkZSBvZmYsXG4vLy8gb3IgdW5zZXQgdGhlIG92ZXJyaWRlIGFuZCBnbyBiYWNrIHRvIGRlZmF1bHQgdmFsdWUuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbmV4cG9ydCBmdW5jdGlvbiBUb2dnbGVGZWF0dXJlcyh7IGRlZmF1bHRPcGVuID0gZmFsc2UsIGhpZGRlbiA9IGZhbHNlIH06IHsgZGVmYXVsdE9wZW4/OiBib29sZWFuOyBoaWRkZW4/OiBib29sZWFuIH0pOiBKU1guRWxlbWVudCB8IG51bGwge1xuICBjb25zdCBbcm9vdCwgc2V0Q29yZVJvb3RdID0gdXNlU3RhdGU8SFRNTERpdkVsZW1lbnQgfCBudWxsPihudWxsKTtcblxuICBjb25zdCBzZXRSb290ID0gKGhvc3Q6IEhUTUxEaXZFbGVtZW50IHwgbnVsbCkgPT4ge1xuICAgIGlmIChob3N0ID09IG51bGwgfHwgcm9vdCAhPSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNoYWRvd1Jvb3QgPSBob3N0Py5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIGNvbnN0IHJlbmRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0eWxlLnRleHRDb250ZW50ID0gc3R5bGVzO1xuICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQocmVuZGVyRGl2KTtcbiAgICBzZXRDb3JlUm9vdChyZW5kZXJEaXYpO1xuICB9O1xuXG4gIGlmIChoaWRkZW4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiByZWY9e3NldFJvb3R9IHN0eWxlPXt7IHpJbmRleDogOTk5OTksIHBvc2l0aW9uOiAnZml4ZWQnLCB3aWR0aDogJzAnLCBoZWlnaHQ6ICcwJywgYm90dG9tOiAwIH19PlxuICAgICAge3Jvb3QgIT0gbnVsbCA/IChcbiAgICAgICAgPFNoYWRvd0NvbnRlbnQgcm9vdD17cm9vdH0+XG4gICAgICAgICAgPFRvZ2dsZUZlYXR1cmVVbndyYXBwZWQgZGVmYXVsdE9wZW49e2RlZmF1bHRPcGVufSAvPlxuICAgICAgICA8L1NoYWRvd0NvbnRlbnQ+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuLy8vIExpa2UgVG9nZ2xlRmVhdHVyZXMsIGJ1dCBkb2VzIG5vdCBpbmplY3Qgc3R5bGVzIGludG8gYSBzaGFkb3cgRE9NIHJvb3Qgbm9kZS5cbi8vLyB1c2VmdWwgaWYgeW91J3JlIHVzaW5nIHRhaWx3aW5kLlxuZXhwb3J0IGZ1bmN0aW9uIFRvZ2dsZUZlYXR1cmVVbndyYXBwZWQoeyBkZWZhdWx0T3BlbiA9IGZhbHNlLCBoaWRkZW4gPSBmYWxzZSB9OiB7IGRlZmF1bHRPcGVuPzogYm9vbGVhbjsgaGlkZGVuPzogYm9vbGVhbiB9KTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZGVmYXVsdE9wZW4pO1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChGZWF0dXJlQ29udGV4dCk7XG5cbiAgaWYgKGNvbnRleHQgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKGhpZGRlbikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gV2Ugd2FudDogUmVhbCB2YWx1ZSBhZnRlciBhbGwgbmVzdGluZ3MsIHZhbHVlIG9mIHRoZSBvdmVycmlkZS4gd2UgdG9nZ2xlIG92ZXJyaWRlXG4gIGNvbnN0IHsgZmVhdHVyZXNEZXNjcmlwdGlvbiB9ID0gY29udGV4dDtcblxuICBpZiAoZmVhdHVyZXNEZXNjcmlwdGlvbi5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tMCBsZWZ0LTAgbXgtNCBteS00XCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgdGV4dC1zbSBmb250LW1lZGl1bSBwLTEgaC04IHctOCBhbGlnbi1taWRkbGUgY3Vyc29yLXBvaW50ZXIgcm91bmRlZC1mdWxsIGJnLWJsdWUtNjAwIHRleHQtd2hpdGUgIGJvcmRlciBib3JkZXItdHJhbnNwYXJlbnQganVzdGlmeS1jZW50ZXIgdGV4dC1iYXNlIGZvbnQtbWVkaXVtIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1vZmZzZXQtMiBmb2N1czpyaW5nLWJsdWUtNjAwIHNtOnRleHQtc21cIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE9wZW4odHJ1ZSl9XG4gICAgICAgICAgdGl0bGU9XCJUb2dnbGUgZmVhdHVyZXNcIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICA+XG4gICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy02IGgtNiBtaW4taC02IG1pbi13LTZcIlxuICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgIGNsaXBSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgIGQ9XCJNMyA2YTMgMyAwIDAxMy0zaDEwYTEgMSAwIDAxLjggMS42TDE0LjI1IDhsMi41NSAzLjRBMSAxIDAgMDExNiAxM0g2YTEgMSAwIDAwLTEgMXYzYTEgMSAwIDExLTIgMFY2elwiXG4gICAgICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgeyFvcGVuID8gbnVsbCA6IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCB6LTEwIGluc2V0LTAgb3ZlcmZsb3cteS1hdXRvXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWVuZCBqdXN0aWZ5LWZsZXgtc3RhcnQgbXgtOCBteS00IG1pbi1oLXNjcmVlbiBwdC00IHB4LTQgcGItMTAgc206YmxvY2sgc206cC0wXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGlubGluZS1ibG9jayBhbGlnbi1ib3R0b20gYmctd2hpdGUgcm91bmRlZC1sZyBweC00IHB0LTUgcGItNCB0ZXh0LWxlZnQgb3ZlcmZsb3ctaGlkZGVuIHNoYWRvdy14bCB0cmFuc2Zvcm0gdHJhbnNpdGlvbi1hbGwgc206bXktOCBzbTphbGlnbi1taWRkbGUgc206cC02IGxnOm1heC13LVs4MCVdIG1heC13LWZ1bGxcIj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTEgc206bXQtM1wiPlxuICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImZsZXggZmxleC1yb3cgZ2FwLTQgZmxleC1ub3dyYXAgaXRlbXMtY2VudGVyIHNwYWNlLWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncm93IHRleHQtbGcgbGVhZGluZy02IGZvbnQtbWVkaXVtIHRleHQtZ3JheS05MDBcIj5GZWF0dXJlIEZsYWcgT3ZlcnJpZGVzPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAgICAgICAgICAgIEZlYXR1cmVzIGNhbiBiZSBlbmFibGVkIG9yIGRpc2FibGVkIHVubGVzcyB0aGV5IGFyZSBmb3JjZWQgdXBzdHJlYW0uIFlvdSBjYW4gYWxzbyByZXZlcnQgdG8gZGVmYXVsdC5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNlwiPlxuICAgICAgICAgICAgICAgICAgICA8ZmllbGRzZXQgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtOVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxsZWdlbmQgY2xhc3NOYW1lPVwic3Itb25seVwiPkZlYXR1cmUgRmxhZ3M8L2xlZ2VuZD5cbiAgICAgICAgICAgICAgICAgICAgICB7ZmVhdHVyZXNEZXNjcmlwdGlvbi5tYXAoKGZlYXR1cmUpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxUb2dnbGVGZWF0dXJlIGZlYXR1cmU9e2ZlYXR1cmV9IGtleT17ZmVhdHVyZS5uYW1lfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1jZW50ZXIgaXRlbXMtY2VudGVyIG10LTUgc206bXQtNlwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIHRleHQtc20gZm9udC1tZWRpdW0gcHQtMCBwYi0wIHByLTQgcGwtNCBoLTggbGVhZGluZy03IGFsaWduLW1pZGRsZSBjdXJzb3ItcG9pbnRlciByb3VuZGVkLXNtIGJnLWJsdWUtNjAwIHRleHQtd2hpdGUgYm9yZGVyIGJvcmRlci10cmFuc3BhcmVudCBqdXN0aWZ5LWNlbnRlciB0ZXh0LWJhc2UgZm9udC1tZWRpdW0gZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOnJpbmctMiBmb2N1czpyaW5nLW9mZnNldC0yIGZvY3VzOnJpbmctYmx1ZS02MDAgc206dGV4dC1zbVwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0T3BlbihmYWxzZSl9XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICBEb25lXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICJxaENBQUEsa09DQUEsTUFBdUYsa0JDQXZGLE1BQW1GLGtCQVk1RSxXQUF1QixFQUFxRCxDQVpuRixRQWFFLE1BQU8sQ0FDTCxFQUFhLFFBQVEsU0FBUyxFQUFJLEdBQU8sRUFBYSxRQUFRLFVBQVUsRUFBSSxHQUFRLE9BQ3BGLFFBQWEsUUFBUSxjQUFyQixjQUFrQyxRQUFsQyxPQUEyQyxFQUM3QyxDQUNGLENBNEVPLEdBQU0sR0FBaUIsb0JBQStELENBQzNGLEdBQUksVUFDSixRQUFTLFVBQ1QsUUFBUyxDQUFDLEVBQ1YsMkJBQTRCLEdBQzVCLEdBQUksQ0FDRixPQUFRLENBQ04sQ0FBRSxPQUFRLGVBQWdCLEtBQU0sQUFBQyxHQUFLLENBcEc1QyxNQW9HK0MsWUFBSSxjQUFKLGNBQWlCLGtCQUFtQixLQUFLLEVBQ2xGLENBQUUsT0FBUSxTQUFVLENBQ3RCLEVBRUEsT0FBUSxDQUNOLENBQUUsT0FBUSxlQUFnQixLQUFNLEFBQUMsR0FBSyxDQXpHNUMsTUF5RytDLFlBQUksY0FBSixjQUFpQixrQkFBbUIsS0FBSyxFQUNsRixDQUFFLE9BQVEsU0FBVSxDQUN0QixFQUVBLFFBQVMsQ0FDUCxDQUFFLE9BQVEsZ0JBQWlCLEtBQU0sQUFBQyxHQUFLLENBOUc3QyxNQThHZ0QsWUFBSSxjQUFKLGNBQWlCLGtCQUFtQixLQUFLLEVBQ25GLENBQUUsT0FBUSxVQUFXLENBQ3ZCLEVBRUEsTUFBTyxDQUNMLENBQUUsT0FBUSxpQkFBa0IsS0FBTSxBQUFDLEdBQUssQ0FuSDlDLE1BbUhpRCxZQUFJLGNBQUosY0FBaUIsa0JBQW1CLEtBQUssRUFDcEYsQ0FBRSxPQUFRLGFBQWMsQ0FDMUIsRUFFQSxJQUFLLENBQ0gsQ0FDRSxPQUFRLGVBQ1IsS0FBTSxDQUFDLEVBQUssSUFBRyxDQTFIdkIsTUEwSDBCLFNBQUUsUUFBVSxJQUFRLE1BQUksY0FBSixjQUFpQixrQkFBbUIsS0FDNUUsRUFDQSxDQUNFLE9BQVEsZ0JBQ1IsS0FBTSxDQUFDLEVBQUssSUFBRyxDQTlIdkIsTUE4SDBCLFNBQUUsUUFBVSxJQUFTLE1BQUksY0FBSixjQUFpQixrQkFBbUIsS0FDN0UsRUFDQSxDQUNFLE9BQVEsaUJBQ1IsS0FBTSxDQUFDLEVBQUssSUFBSSxDQWxJeEIsTUFrSTJCLFlBQUksY0FBSixjQUFpQixrQkFBbUIsS0FDekQsRUFDQSxDQUNFLE9BQVEsVUFDUixLQUFNLENBQUMsRUFBTSxJQUFNLEVBQUUsUUFBVSxFQUNqQyxFQUNBLENBQ0UsT0FBUSxXQUNSLEtBQU0sQ0FBQyxFQUFNLElBQU0sRUFBRSxRQUFVLEVBQ2pDLEVBQ0EsQ0FBRSxPQUFRLGFBQWMsQ0FDMUIsQ0FDRixFQUVBLE9BQVEsQ0FDTixRQUFTLENBQ1AsR0FBSSxDQUNGLEtBQU0sQ0FDSixDQUNFLFFBQVMsYUFBTyxDQUFFLFlBQWEsQ0FBQyxFQUFHLElBQU0sRUFBRSxPQUFRLENBQUMsRUFDcEQsT0FBUSxVQUNSLEtBQU0sQ0FBQyxFQUFHLElBQU0sRUFBRSxRQUFRLGVBQWlCLEVBQzdDLEVBQ0EsQ0FDRSxRQUFTLGFBQU8sQ0FBRSxZQUFhLENBQUMsRUFBRyxJQUFNLEVBQUUsT0FBUSxDQUFDLEVBQ3BELE9BQVEsY0FDUixLQUFNLENBQUMsRUFBRyxJQUFNLEVBQUUsUUFBUSxlQUFpQixNQUM3QyxFQUNBLENBQ0UsUUFBUyxhQUFPLENBQUUsWUFBYSxDQUFDLEVBQUcsSUFBTSxFQUFFLE9BQVEsQ0FBQyxFQUNwRCxPQUFRLFdBQ1IsS0FBTSxDQUFDLEVBQUcsSUFBTSxFQUFFLFFBQVEsZUFBaUIsRUFDN0MsQ0FDRixDQUNGLENBQ0YsRUFFQSxZQUFhLENBQUMsRUFDZCxTQUFVLENBQUMsRUFDWCxRQUFTLENBQUMsRUFFVixjQUFlLENBQ2IsT0FBUSxDQUNOLEdBQUksbUJBQ0osSUFBSyxBQUFPLEdBQVEsMEJBOUs1QixNQStLVSxHQUFNLEdBQVcsS0FBSSxjQUFKLGNBQWlCLGdCQUNsQyxHQUFJLEdBQVksTUFBUSxFQUFJLGFBQWUsS0FDekMsTUFBTyxHQUFTLEVBQUksWUFBWSxLQUFNLEVBQUssQ0FHL0MsR0FDQSxPQUFRLENBQ04sQ0FDRSxPQUFRLFVBQ1IsS0FBTSxDQUFDLEVBQU0sSUFBcUMsRUFBRSxPQUFTLEVBQy9ELEVBQ0EsQ0FDRSxPQUFRLFdBQ1IsS0FBTSxDQUFDLEVBQU0sSUFBcUMsRUFBRSxPQUFTLEVBQy9ELEVBQ0EsQ0FBRSxPQUFRLGFBQWMsQ0FDMUIsRUFDQSxRQUFTLGFBQ1gsQ0FDRixFQUVBLGVBQWdCLENBQ2QsT0FBUSxDQUNOLEdBQUkscUJBQ0osSUFBSyxBQUFPLEdBQVEsMEJBdk01QixNQXdNVSxHQUFNLEdBQVcsS0FBSSxjQUFKLGNBQWlCLGdCQUNsQyxHQUFJLEdBQVksTUFBUSxFQUFJLGFBQWUsS0FDekMsTUFBTyxHQUFTLEVBQUksWUFBWSxLQUFNLE1BQVMsQ0FHbkQsR0FDQSxPQUFRLENBQ04sQ0FDRSxPQUFRLFVBQ1IsS0FBTSxDQUFDLEVBQU0sSUFBcUMsRUFBRSxPQUFTLEVBQy9ELEVBQ0EsQ0FDRSxPQUFRLFdBQ1IsS0FBTSxDQUFDLEVBQU0sSUFBcUMsRUFBRSxPQUFTLEVBQy9ELEVBQ0EsQ0FBRSxPQUFRLGFBQWMsQ0FDMUIsRUFDQSxRQUFTLGFBQ1gsQ0FDRixFQUVBLGFBQWMsQ0FDWixPQUFRLENBQ04sR0FBSSxrQkFDSixJQUFLLEFBQU8sR0FBUSwwQkFoTzVCLE1BaU9VLEdBQU0sR0FBVyxLQUFJLGNBQUosY0FBaUIsZ0JBQ2xDLEdBQUksR0FBWSxNQUFRLEVBQUksYUFBZSxLQUN6QyxNQUFPLEdBQVMsRUFBSSxZQUFZLEtBQU0sRUFBSSxDQUc5QyxHQUNBLE9BQVEsQ0FDTixDQUNFLE9BQVEsVUFDUixLQUFNLENBQUMsRUFBTSxJQUFxQyxFQUFFLE9BQVMsRUFDL0QsRUFDQSxDQUNFLE9BQVEsV0FDUixLQUFNLENBQUMsRUFBTSxJQUFxQyxFQUFFLE9BQVMsRUFDL0QsRUFDQSxDQUFFLE9BQVEsYUFBYyxDQUMxQixFQUNBLFFBQVMsYUFDWCxDQUNGLENBQ0YsQ0FDRixDQUFDLEVEdk5NLFdBQXdCLEVBQThCLEVBQTBDLENBQ3JHLEdBQUksRUFBYyxRQUFRLFNBQVMsSUFBWSxLQUM3QyxNQUFPLENBQUMsT0FBVyxFQUFLLEVBRTFCLEdBQU0sR0FBZSxFQUFjLFFBQVEsU0FBUyxHQUFTLFlBQVksRUFDekUsTUFBSSxJQUFnQixLQUNYLEVBQWMsQ0FBWSxFQUU1QixDQUFDLE9BQVcsRUFBSyxDQUMxQixDQUdPLEdBQU0sR0FBa0Isb0JBQWtFLENBQy9GLEdBQUksV0FDSixRQUFTLE9BQ1QsMkJBQTRCLEdBQzVCLFFBQVMsQ0FDUCxTQUFVLENBQUMsQ0FDYixFQUNBLE9BQVEsQ0FDTixLQUFNLENBQ0osR0FBSSxDQUNGLEtBQU0sQ0FDSixPQUFRLFFBQ1IsS0FBTSxDQUFDLEVBQUcsSUFBTSxFQUFFLFNBQVMsT0FBUyxFQUNwQyxRQUFTLGFBQU8sQ0FDZCxTQUFVLENBQUMsRUFBUyxJQUFVLENBQzVCLEdBQU0sR0FBb0MsQ0FBQyxFQUUzQyxPQUFXLEtBQVcsR0FBTSxTQUMxQixFQUFTLEVBQVEsTUFBUSxZQUFNLEVBQWdCLENBQzdDLEtBQU0sRUFBUSxLQUNkLEtBQU0sRUFDUixDQUFDLEVBQ0QsRUFBUyxFQUFRLE1BQU0sS0FBSyxDQUFFLEtBQU0sT0FBUSxTQUFRLENBQUMsRUFFdkQsTUFBTyxFQUNULENBQ0YsQ0FBQyxDQUNILENBQ0YsQ0FDRixFQUdBLE1BQU8sQ0FDTCxHQUFJLENBQ0YsUUFBUyxDQUFFLE9BQVEsT0FBUSxRQUFTLGFBQU8sQ0FBRSxTQUFVLENBQUMsRUFBRyxJQUFRLEVBQUMsRUFBRyxDQUFDLENBQUUsRUFDMUUsUUFBUyxDQUNQLFFBQVMsYUFBTyxDQUNkLFNBQVUsQ0FBQyxFQUFLLElBQU0sQ0FDcEIsR0FBTSxHQUFXLEtBQUssRUFBSSxVQUUxQixjQUFPLEtBQUssQ0FBUSxFQUFFLFFBQVEsQUFBQyxHQUFTLENBbkZ0RCxNQW9GZ0IsRUFBUyxHQUFNLEtBQUssQ0FBRSxLQUFNLE1BQU8sTUFBTyxLQUFFLFNBQVMsS0FBWCxPQUFvQixNQUFVLENBQUMsQ0FDM0UsQ0FBQyxFQUNNLENBQ1QsQ0FDRixDQUFDLENBQ0gsRUFHQSxJQUFLLENBQ0gsUUFBUyxDQUFDLEVBQUssSUFBTSxDQUNuQixHQUFNLEdBQVUsRUFBSSxTQUFTLEVBQUUsTUFDL0IsQUFBSSxHQUFXLE1BQ2IsRUFBUSxLQUFLLENBQUUsS0FBTSxNQUFPLE1BQU8sRUFBRSxLQUFNLENBQUMsQ0FFaEQsQ0FDRixFQUdBLE9BQVEsQ0FDTixRQUFTLENBQUMsRUFBSyxJQUFNLENBQ25CLEdBQU0sR0FBVSxFQUFJLFNBQVMsRUFBRSxNQUMvQixBQUFJLEdBQVcsTUFDYixFQUFRLEtBQUssQ0FBRSxLQUFNLFFBQVMsQ0FBQyxDQUVuQyxDQUNGLEVBR0EsT0FBUSxDQUNOLFFBQVMsQ0FBQyxFQUFLLElBQU0sQ0FDbkIsR0FBTSxHQUFVLEVBQUksU0FBUyxFQUFFLE1BQy9CLEFBQUksR0FBVyxNQUNiLEVBQVEsS0FBSyxDQUFFLEtBQU0sUUFBUyxDQUFDLENBRW5DLENBQ0YsRUFHQSxRQUFTLENBQ1AsUUFBUyxDQUFDLEVBQUssSUFBTSxDQUNuQixHQUFNLEdBQVUsRUFBSSxTQUFTLEVBQUUsTUFDL0IsQUFBSSxHQUFXLE1BQ2IsRUFBUSxLQUFLLENBQUUsS0FBTSxTQUFVLENBQUMsQ0FFcEMsQ0FDRixFQUdBLE1BQU8sQ0FDTCxRQUFTLENBQUMsRUFBSyxJQUFNLENBQ25CLEdBQU0sR0FBVSxFQUFJLFNBQVMsRUFBRSxNQUMvQixBQUFJLEdBQVcsTUFDYixFQUFRLEtBQUssQ0FBRSxLQUFNLE9BQVEsQ0FBQyxDQUVsQyxDQUNGLENBQ0YsQ0FDRixDQUNGLENBQ0YsQ0FBQyxFRS9JRCxNQUE2RCxvQkFFN0QsRUFBMkIseUJDRjNCLE1BQThCLGlCQVNqQixFQUFnQixvQkFBaUMsQUFBQyxHQUFPLEVBQUssRUNUM0UsTUFBOEIsaUJBS2pCLEVBQWlCLG9CQUF5QyxJQUFJLEVDTDNFLE9BQTBCLGlCQ0duQixXQUFtQixDQUt4QixZQUNFLEVBQ0EsRUFDQSxFQUNBLENBQ0EsS0FBSyxZQUFjLEVBQ25CLEtBQUssU0FBVyxFQUNoQixLQUFLLFlBQWMsQ0FDckIsQ0FFTyxPQUFPLEVBQXVCLENBQ25DLEtBQUssU0FBUyxDQUFFLEtBQU0sU0FBVSxLQUFNLENBQVEsQ0FBQyxDQUNqRCxDQUVPLE9BQU8sRUFBdUIsQ0FDbkMsS0FBSyxTQUFTLENBQUUsS0FBTSxTQUFVLEtBQU0sQ0FBUSxDQUFDLENBQ2pELENBRU8sTUFBTSxFQUF1QixDQUNsQyxLQUFLLFNBQVMsQ0FBRSxLQUFNLFFBQVMsS0FBTSxDQUFRLENBQUMsQ0FDaEQsQ0FFTyxRQUFRLEVBQXVCLENBQ3BDLEtBQUssU0FBUyxDQUFFLEtBQU0sVUFBVyxLQUFNLENBQVEsQ0FBQyxDQUNsRCxDQUVPLE9BQU8sRUFBaUQsQ0FDN0QsS0FBSyxTQUFTLENBQUUsS0FBTSxVQUFXLFVBQVMsQ0FBQyxDQUM3QyxDQUVPLGNBQWtELENBQ3ZELE1BQU8sTUFBSyxZQUFZLElBQUksQUFBQyxHQUFNLENBQUMsRUFBRSxLQUFNLEtBQUssWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQ3ZFLENBQ0YsRURuQ2UsV0FDYixFQUNBLEVBQ0EsRUFDQSxFQUNNLENBQ04saUJBQVUsSUFDSCxFQUtMLFFBQU8sUUFBVSxHQUFJLEdBQWEsRUFBVSxFQUFhLENBQVEsRUFDMUQsSUFBTSxDQUNYLEFBQUksT0FBTyxTQUFXLE1BQ3BCLE1BQU8sUUFBTyxPQUVsQixHQVRTLElBQU0sQ0FFYixFQVFELENBQUMsRUFBVSxFQUFVLEVBQWlCLENBQVcsQ0FBQyxDQUN2RCxDRXpCQSxNQUFtQyxpQkFLNUIsR0FBTSxHQUFNLDhCQUVKLFdBQ2IsRUFDQSxFQUNBLEVBQ00sQ0FDTixHQUFNLEdBQVksY0FBUSxJQUFNLENBQzlCLEdBQU0sR0FBZ0QsQ0FBQyxFQUN2RCxHQUFJLEVBQWMsUUFBUSxPQUFPLEVBQy9CLE9BQVcsS0FBVyxHQUFVLENBQzlCLEdBQU0sQ0FBQyxHQUFTLEVBQWUsRUFBZSxFQUFRLElBQUksRUFDMUQsQUFBSSxHQUFTLE1BQ1gsR0FBYSxFQUFRLE1BQVEsRUFFakMsQ0FFRixNQUFPLEVBQ1QsRUFBRyxDQUFDLEVBQVUsQ0FBYSxDQUFDLEVBRXRCLEVBQVcsT0FBTyxLQUFLLENBQVMsRUFBRSxTQUFXLEdBQUssR0FBVyxLQUFPLEtBQU8sS0FBSyxVQUFVLENBQUUsV0FBVSxDQUFDLEVBRTdHLGdCQUFVLElBQU0sQ0FDZCxHQUFJLENBQ0YsQUFBSSxHQUFXLE1BQVEsRUFBYyxRQUFRLE9BQU8sR0FDbEQsRUFBUSxRQUFRLEVBQUssQ0FBUSxDQUVqQyxPQUFTLEVBQVAsQ0FFRixDQUNGLEVBQUcsQ0FBQyxFQUFlLEVBQVMsQ0FBUSxDQUFDLENBQ3ZDLENDcENBLE9BQTRCLGlCQ1NiLFdBQXFCLEVBQWlCLEVBQXVDLENBQzFGLEdBQU0sR0FBUyxFQUFPLElBQUksQUFBQyxHQUFVLEVBQWUsRUFBTyxDQUFPLENBQUMsRUFHbkUsT0FBVyxDQUFDLEVBQWMsSUFBa0IsR0FDMUMsR0FBSSxHQUFnQixNQUFRLEVBQzFCLE1BQU8sR0FLWCxPQUFXLENBQUMsSUFBaUIsR0FDM0IsR0FBSSxHQUFnQixLQUNsQixNQUFPLEVBTWIsQ0R0QmUsV0FDYixFQUNBLEVBQzBDLENBQzFDLE1BQU8sbUJBQVksQUFBQyxHQUFjLEVBQVksRUFBRyxDQUFDLEVBQWUsQ0FBYyxDQUFDLEVBQUcsQ0FBQyxFQUFlLENBQWMsQ0FBQyxDQUNwSCxDTmNPLFlBQWtCLENBQ3ZCLFdBQ0EsV0FDQSxpQkFBaUIsR0FDakIsVUFBVSxPQUFPLGdCQUNXLENBRTVCLEdBQU0sR0FBYyxhQUFPLENBQVEsRUFDN0IsQ0FBQyxFQUFnQixHQUFpQixpQkFBVyxDQUFlLEVBQzVELENBQUMsRUFBZSxHQUFnQixpQkFBVyxDQUFlLEVBRWhFLGdCQUFVLElBRVIsR0FBYSxDQUFFLEtBQU0sT0FBUSxVQUFTLENBQUMsRUFDaEMsSUFBTSxDQUNYLEVBQWEsQ0FBRSxLQUFNLFNBQVUsQ0FBQyxDQUNsQyxHQUNDLENBQUMsRUFBYyxDQUFRLENBQUMsRUFFM0IsZ0JBQVUsSUFBTSxDQUNkLEdBQUksR0FBeUMsQ0FBQyxFQUM5QyxHQUFJLEdBQVcsS0FDYixHQUFJLENBQ0YsR0FBTSxHQUFlLEVBQVEsUUFBUSxDQUFHLEVBQ3hDLEFBQUksR0FBZ0IsTUFFbEIsR0FBSSxBQURPLEtBQUssTUFBTSxDQUFZLEVBQzNCLFVBRVgsT0FBUyxFQUFQLENBRUEsUUFBUSxNQUFNLHdCQUF5QixDQUFDLENBQzFDLENBR0YsU0FBYyxDQUNaLEtBQU0sT0FDTixTQUFVLEVBQVksUUFDbkIsT0FBTyxBQUFDLEdBQU0sRUFBRSxhQUFlLEVBQUksRUFDbkMsSUFBSSxBQUFDLEdBQUcsQ0EvRGpCLE1BK0RxQixPQUFFLEtBQU0sRUFBRSxLQUFNLFlBQWEsRUFBRSxZQUFhLGFBQWMsb0JBQUksRUFBRSxRQUFOLE9BQWUsTUFBVSxFQUFFLENBQ3RHLENBQUMsRUFFTSxJQUFNLENBQ1gsRUFBYyxDQUFFLEtBQU0sU0FBVSxDQUFDLENBQ25DLENBQ0YsRUFBRyxDQUFDLEVBQWEsRUFBZSxDQUFPLENBQUMsRUFFeEMsRUFBVyxFQUFTLEVBQVksUUFBUyxDQUFjLEVBRXZELEdBQU0sR0FBZSxFQUFnQixFQUFnQixDQUFhLEVBQ2xFLEVBQW1CLENBQUMsRUFBZ0IsRUFBWSxRQUFTLEVBQWMsQ0FBWSxFQUVuRixHQUFNLEdBQWUsY0FDbkIsSUFBTyxFQUNMLGdCQUNBLGVBQ0Esb0JBQXFCLEVBQVksUUFDakMsaUJBQ0EsZ0JBQ0EsS0FBTSxDQUNSLEdBQ0EsQ0FBQyxFQUFlLEVBQWMsRUFBZ0IsRUFBZSxDQUFZLENBQzNFLEVBRUEsTUFDRSx5QkFBQyxFQUFlLFNBQWYsQ0FBd0IsTUFBTyxHQUM5Qix3QkFBQyxFQUFjLFNBQWQsQ0FBdUIsTUFBTyxHQUFlLENBQVMsQ0FDekQsQ0FFSixDUTdGQSxNQUF1QixvQkNBdkIsTUFBb0MsaUJBTTdCLFdBQTJCLEVBQWlFLENBQ2pHLEdBQU0sR0FBTyxpQkFBVyxDQUFhLEVBRy9CLEVBQVksY0FBUSxJQUFPLEdBQVMsS0FBTyxDQUFDLEVBQUksTUFBTSxRQUFRLENBQUssRUFBSSxFQUFRLENBQUMsQ0FBSyxFQUFJLENBQUMsQ0FBSyxDQUFDLEVBRXRHLE1BQU8sQ0FBQyxFQUFNLENBQVMsQ0FDekIsQ0NSTyxXQUF1QixFQUF5QyxDQUNyRSxHQUFNLENBQUMsRUFBTSxHQUFtQixFQUFrQixDQUFXLEVBQzdELE1BQU8sR0FBZ0IsT0FBUyxHQUFLLEVBQWdCLE1BQU0sQ0FBSSxDQUNqRSxDQ0hPLFdBQW9CLEVBQXFDLENBQzlELEdBQU0sQ0FBQyxFQUFNLEdBQW1CLEVBQWtCLENBQU8sRUFDekQsTUFBTyxHQUFnQixLQUFLLENBQUksQ0FDbEMsQ0hNTyxZQUFnQixDQUFFLFVBQVUsQ0FBQyxFQUFHLGNBQWMsQ0FBQyxFQUFHLFlBQTZDLENBQ3BHLEdBQU0sR0FBUSxFQUFXLENBQU8sRUFDMUIsRUFBUSxFQUFjLENBQVcsRUFFdkMsTUFBSSxJQUFTLEVBQ0osZ0NBQUcsQ0FBUyxFQUdkLElBQ1QsQ0l2QkEsTUFBdUIsb0JDS2hCLFdBQXdCLEVBQXdDLENBQ3JFLEdBQU0sQ0FBQyxFQUFNLEdBQW1CLEVBQWtCLENBQVUsRUFDNUQsTUFBTyxHQUFXLE9BQVMsR0FBSyxFQUFnQixNQUFNLEFBQUMsR0FBRyxDQVA1RCxNQU8rRCxPQUFFLE1BQUssQ0FBQyxJQUFOLFNBQWlCLENBQ2xGLENDSE8sV0FBcUIsRUFBcUMsQ0FDL0QsR0FBTSxDQUFDLEVBQU0sR0FBbUIsRUFBa0IsQ0FBTyxFQUN6RCxNQUFPLEdBQWdCLEtBQUssQUFBQyxHQUFHLENBUGxDLE1BT3FDLE9BQUUsTUFBSyxDQUFDLElBQU4sU0FBaUIsQ0FDeEQsQ0ZDTyxHQUFNLElBQWlDLENBQUMsQ0FDN0MsVUFBVSxDQUFDLEVBQ1gsY0FBYyxDQUFDLEVBQ2YsY0FDSSxDQUNKLEdBQU0sR0FBUSxFQUFZLENBQU8sRUFDM0IsRUFBUSxFQUFlLENBQVcsRUFFeEMsTUFBSSxJQUFTLEVBQ0osZ0NBQUcsQ0FBUyxFQUdkLElBQ1QsRUd0QkEsTUFBb0Usb0JBQ3BFLEdBQXFCLHdCQUVyQixFQUEyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBUTNCLGNBQXVCLEVBQTJCLENBQ2hELE1BQU8sR0FBUSxPQUFPLE9BQU8sRUFBRSxLQUFLLEdBQUcsQ0FDekMsQ0FFQSxZQUF1QixDQUFFLFdBQWdFLENBZnpGLFVBZ0JFLEdBQU0sR0FBVSxpQkFBVyxDQUFjLEVBQ25DLEVBQXdCLGtCQUM1QixBQUFDLEdBQXNDLENBQ3JDLEdBQUksa0JBQVMsZ0JBQWlCLEtBQzVCLE9BQVEsT0FDRCxPQUFRLENBQ1gsRUFBUSxjQUFjLENBQUUsS0FBTSxTQUFVLEtBQU0sRUFBUSxJQUFLLENBQUMsRUFDNUQsS0FDRixLQUNLLFFBQVMsQ0FDWixFQUFRLGNBQWMsQ0FBRSxLQUFNLFVBQVcsS0FBTSxFQUFRLElBQUssQ0FBQyxFQUM3RCxLQUNGLEtBQ0ssUUFBUyxDQUNaLEVBQVEsY0FBYyxDQUFFLEtBQU0sUUFBUyxLQUFNLEVBQVEsSUFBSyxDQUFDLEVBQzNELEtBQ0YsRUFHTixFQUNBLENBQUMsRUFBUSxLQUFNLENBQU8sQ0FDeEIsRUFFQSxHQUFJLEdBQVcsS0FDYixNQUFPLE1BR1QsR0FBTSxDQUFFLGlCQUFnQixLQUFNLEVBQWEsaUJBQWtCLEVBRXZELEVBQW1CLE1BQWUsRUFBZSxFQUFRLElBQUksRUFBRSxLQUE1QyxPQUFrRCxTQUFTLFNBQVMsRUFLdkYsRUFBb0IsTUFBZSxFQUFnQixFQUFRLElBQUksRUFBRSxLQUE3QyxPQUFtRCxTQUFTLFNBQVMsRUFLekYsRUFBZ0IsRUFBWSxFQUFRLElBQUksRUFFOUMsTUFDRSx5QkFBQyxjQUFXLFNBQVUsRUFBUSxXQUFZLFNBQVUsRUFBdUIsTUFBTyxHQUNoRix3QkFBQyxhQUFXLE1BQVgsS0FDQyx3QkFBQyxNQUFHLFVBQVUsd0ZBQ1osd0JBQUMsUUFBSyxVQUFVLGVBQWMsWUFDbkIsd0JBQUMsWUFBTSxFQUFRLElBQUssQ0FDL0IsRUFDQyxFQUFRLGFBQWUsR0FDdEIsd0JBQUMsT0FBSSxVQUFVLHFJQUNiLHdCQUFDLE9BQ0MsY0FBWSxPQUNaLFVBQVUsa0JBQ1YsS0FBSyxlQUNMLFFBQVEsWUFDUixNQUFNLDhCQUVOLHdCQUFDLFFBQ0MsU0FBUyxVQUNULEVBQUUseUdBQ0YsU0FBUyxVQUNYLENBQ0YsRUFDQSx3QkFBQyxXQUFJLGNBQVksQ0FDbkIsRUFDRSxLQUNILElBQWtCLEdBQ2pCLHdCQUFDLE9BQUksVUFBVSxtSUFDYix3QkFBQyxPQUNDLGNBQVksT0FDWixVQUFVLGtCQUNWLEtBQUssZUFDTCxRQUFRLFlBQ1IsTUFBTSw4QkFFTix3QkFBQyxRQUNDLFNBQVMsVUFDVCxFQUFFLHdJQUNGLFNBQVMsVUFDWCxDQUNGLEVBQ0Esd0JBQUMsV0FBSyxFQUFnQixVQUFZLFVBQVcsQ0FDL0MsRUFDRSxJQUNOLEVBQ0MsRUFBUSxhQUFlLEtBQU8sS0FBTyx3QkFBQyxLQUFFLFVBQVUsbUNBQW1DLEVBQVEsV0FBWSxDQUM1RyxFQUNBLHdCQUFDLE9BQUksVUFBVSwyREFDWixDQUNDLENBQUUsR0FBSSxRQUFTLE1BQU8sV0FBVyxFQUFRLE9BQVEsWUFBYSxxQ0FBc0MsRUFDcEcsQ0FDRSxHQUFJLFFBQ0osTUFBTyxVQUNQLFlBQWEsc0NBQ2IsU0FBVyxNQUFRLGFBQVIsT0FBc0IsS0FBVSxFQUFRLE1BQ25ELGFBQ0UsSUFBb0IsT0FDbEIsd0JBQUMsT0FBSSxVQUFVLG1JQUNiLHdCQUFDLFlBQUssU0FBTyxDQUNmLEVBRUEsd0JBQUMsT0FBSSxVQUFVLCtIQUNiLHdCQUFDLFlBQUssVUFBUSxDQUNoQixDQUVOLEVBQ0EsQ0FBRSxHQUFJLE9BQVEsTUFBTyxVQUFVLEVBQVEsT0FBUSxZQUFhLG9DQUFxQyxDQUNuRyxFQUFFLElBQUksQUFBQyxHQUNMLHdCQUFDLGFBQVcsT0FBWCxDQUNDLFVBQVcsQ0FBQyxDQUFFLFVBQVMsU0FBUSxjQUM3QixFQUNFLEVBQVUscUJBQXVCLGtCQUNqQyxDQUFDLEdBQVksRUFBUyx1Q0FBeUMsR0FDL0QsRUFBVyxzREFBd0QsaUJBQ25FLDJFQUNGLEVBRUYsU0FBVSxFQUFPLFNBQ2pCLElBQUssRUFBTyxHQUNaLE1BQU8sRUFBTyxJQUViLENBQUMsQ0FBRSxVQUFTLFNBQVEsY0FDbkIsZ0RBQ0Usd0JBQUMsT0FBSSxVQUFVLHNCQUNiLHdCQUFDLGFBQVcsTUFBWCxDQUFpQixHQUFHLE9BQU8sVUFBVSw4REFDcEMsd0JBQUMsUUFBSyxVQUFVLGlEQUFpRCxFQUFPLEtBQU0sRUFDN0UsRUFBTyxjQUFnQixLQUFPLEVBQU8sYUFBZSxLQUNyRCx3QkFBQyxPQUNDLGNBQVksT0FDWixVQUFXLEVBQVcsQUFBQyxFQUF3QixHQUFkLFlBQWtCLCtCQUErQixFQUNsRixLQUFLLGVBQ0wsUUFBUSxZQUNSLE1BQU0sOEJBRU4sd0JBQUMsUUFDQyxTQUFTLFVBQ1QsRUFBRSx3SUFDRixTQUFTLFVBQ1gsQ0FDRixDQUNGLEVBQ0Esd0JBQUMsYUFBVyxZQUFYLENBQXVCLEdBQUcsT0FBTyxVQUFVLGdEQUN6QyxFQUFPLFdBQ1YsQ0FDRixFQUNBLHdCQUFDLE9BQ0MsY0FBWSxPQUNaLFVBQVcsRUFDVCxDQUFDLEdBQVksRUFBUyxTQUFXLFdBQ2pDLEVBQVcsRUFBVyxrQkFBb0Isa0JBQXFCLHFCQUMvRCxtREFDRixFQUNGLENBQ0YsQ0FFSixDQUNELENBQ0gsQ0FDRixDQUVKLENBRUEsWUFBdUIsQ0FBRSxPQUFNLFlBQW9ELENBQ2pGLE1BQU8sWUFBUyxhQUFhLEVBQVUsQ0FBSSxDQUM3QyxDQU9PLFlBQXdCLENBQUUsY0FBYyxHQUFPLFNBQVMsSUFBMEUsQ0FDdkksR0FBTSxDQUFDLEVBQU0sR0FBZSxlQUFnQyxJQUFJLEVBRTFELEVBQVUsQUFBQyxHQUFnQyxDQUMvQyxHQUFJLEdBQVEsTUFBUSxHQUFRLEtBQzFCLE9BRUYsR0FBTSxHQUFhLGlCQUFNLGFBQWEsQ0FBRSxLQUFNLE1BQU8sR0FDL0MsRUFBUSxTQUFTLGNBQWMsT0FBTyxFQUN0QyxFQUFZLFNBQVMsY0FBYyxLQUFLLEVBQzlDLEVBQU0sWUFBYyxHQUNwQixFQUFXLFlBQVksQ0FBSyxFQUM1QixFQUFXLFlBQVksQ0FBUyxFQUNoQyxFQUFZLENBQVMsQ0FDdkIsRUFFQSxNQUFJLEdBQ0ssS0FJUCx3QkFBQyxPQUFJLElBQUssRUFBUyxNQUFPLENBQUUsT0FBUSxNQUFPLFNBQVUsUUFBUyxNQUFPLElBQUssT0FBUSxJQUFLLE9BQVEsQ0FBRSxHQUM5RixHQUFRLEtBQ1Asd0JBQUMsSUFBYyxLQUFNLEdBQ25CLHdCQUFDLElBQXVCLFlBQWEsRUFBYSxDQUNwRCxFQUNFLElBQ04sQ0FFSixDQUlPLFlBQWdDLENBQUUsY0FBYyxHQUFPLFNBQVMsSUFBMEUsQ0FDL0ksR0FBTSxDQUFDLEVBQU0sR0FBVyxlQUFTLENBQVcsRUFDdEMsRUFBVSxpQkFBVyxDQUFjLEVBTXpDLEdBSkksR0FBVyxNQUlYLEVBQ0YsTUFBTyxNQUlULEdBQU0sQ0FBRSx1QkFBd0IsRUFFaEMsTUFBSSxHQUFvQixTQUFXLEVBQzFCLEtBSVAsd0JBQUMsT0FBSSxVQUFVLFlBQ2Isd0JBQUMsT0FBSSxVQUFVLHNDQUNiLHdCQUFDLFVBQ0MsVUFBVSw4UUFDVixRQUFTLElBQU0sRUFBUSxFQUFJLEVBQzNCLE1BQU0sa0JBQ04sS0FBSyxVQUVMLHdCQUFDLE9BQ0MsVUFBVSwwQkFDVixLQUFLLGVBQ0wsUUFBUSxZQUNSLE1BQU0sOEJBRU4sd0JBQUMsUUFDQyxTQUFTLFVBQ1QsRUFBRSxxR0FDRixTQUFTLFVBQ1gsQ0FDRixDQUNGLENBQ0YsRUFDQyxBQUFDLEVBQ0Esd0JBQUMsT0FBSSxVQUFVLHNDQUNiLHdCQUFDLE9BQUksVUFBVSw0RkFDYix3QkFBQyxPQUFJLFVBQVUsK0xBQ2Isd0JBQUMsV0FDQyx3QkFBQyxPQUFJLFVBQVUsZ0JBQ2Isd0JBQUMsTUFBRyxVQUFVLDhEQUNaLHdCQUFDLE9BQUksVUFBVSxvREFBbUQsd0JBQXNCLENBQzFGLEVBQ0Esd0JBQUMsS0FBRSxVQUFVLHlCQUF3QixzR0FFckMsRUFDQSx3QkFBQyxPQUFJLFVBQVUsUUFDYix3QkFBQyxZQUFTLFVBQVUsdUJBQ2xCLHdCQUFDLFVBQU8sVUFBVSxXQUFVLGVBQWEsRUFDeEMsRUFBb0IsSUFBSSxBQUFDLEdBQ3hCLHdCQUFDLElBQWMsUUFBUyxFQUFTLElBQUssRUFBUSxLQUFNLENBQ3JELENBQ0gsQ0FDRixFQUNBLHdCQUFDLE9BQUksVUFBVSxpREFDYix3QkFBQyxVQUNDLFVBQVUsaVNBQ1YsUUFBUyxJQUFNLEVBQVEsRUFBSyxFQUM1QixLQUFLLFVBQ04sTUFFRCxDQUNGLENBQ0YsQ0FDRixDQUNGLENBQ0YsQ0FDRixFQWpDTyxJQW1DWCxDQUVKIiwKICAibmFtZXMiOiBbXQp9Cg==

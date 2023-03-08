var le=Object.create;var F=Object.defineProperty;var de=Object.getOwnPropertyDescriptor;var ue=Object.getOwnPropertyNames,H=Object.getOwnPropertySymbols,ce=Object.getPrototypeOf,K=Object.prototype.hasOwnProperty,pe=Object.prototype.propertyIsEnumerable;var q=(t,e,r)=>e in t?F(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Y=(t,e)=>{for(var r in e||(e={}))K.call(e,r)&&q(t,r,e[r]);if(H)for(var r of H(e))pe.call(e,r)&&q(t,r,e[r]);return t};var me=(t,e)=>{for(var r in e)F(t,r,{get:e[r],enumerable:!0})},W=(t,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of ue(e))!K.call(t,n)&&n!==r&&F(t,n,{get:()=>e[n],enumerable:!(a=de(e,n))||a.enumerable});return t};var k=(t,e,r)=>(r=t!=null?le(ce(t)):{},W(e||!t||!t.__esModule?F(r,"default",{value:t,enumerable:!0}):r,t)),fe=t=>W(F({},"__esModule",{value:!0}),t);var C=(t,e,r)=>new Promise((a,n)=>{var s=l=>{try{u(r.next(l))}catch(c){n(c)}},d=l=>{try{u(r.throw(l))}catch(c){n(c)}},u=l=>l.done?a(l.value):Promise.resolve(l.value).then(s,d);u((r=r.apply(t,e)).next())});var xe={};me(xe,{Disable:()=>ae,Enable:()=>oe,EnableContext:()=>x,Features:()=>re,FeaturesMachine:()=>D,ToggleFeatures:()=>se,useAllDisabled:()=>L,useAllEnabled:()=>A,useDisabled:()=>O,useEnabled:()=>I});module.exports=fe(xe);var f=require("xstate");var w=require("xstate");function $(t){var e,r;return[t.matches("enabled")?!0:t.matches("disabled")?!1:void 0,(r=(e=t.context.featureDesc)==null?void 0:e.force)!=null?r:!1]}var Q=(0,w.createMachine)({id:"feature",initial:"initial",context:{},predictableActionArguments:!0,on:{ENABLE:[{target:"asyncEnabled",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"enabled"}],TOGGLE:[{target:"asyncEnabled",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"enabled"}],DISABLE:[{target:"asyncDisabled",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"disabled"}],UNSET:[{target:"asyncUnspecied",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"unspecified"}],SET:[{target:"asyncEnabled",cond:(t,e)=>{var r;return e.value===!0&&((r=t.featureDesc)==null?void 0:r.onChangeDefault)!=null}},{target:"asyncDisabled",cond:(t,e)=>{var r;return e.value===!1&&((r=t.featureDesc)==null?void 0:r.onChangeDefault)!=null}},{target:"asyncUnspecied",cond:(t,e)=>{var r;return((r=t.featureDesc)==null?void 0:r.onChangeDefault)!=null}},{target:"enabled",cond:(t,e)=>e.value===!0},{target:"disabled",cond:(t,e)=>e.value===!1},{target:"unspecified"}]},states:{initial:{on:{INIT:[{actions:(0,w.assign)({featureDesc:(t,e)=>e.feature}),target:"enabled",cond:(t,e)=>e.feature.defaultValue===!0},{actions:(0,w.assign)({featureDesc:(t,e)=>e.feature}),target:"unspecified",cond:(t,e)=>e.feature.defaultValue===void 0},{actions:(0,w.assign)({featureDesc:(t,e)=>e.feature}),target:"disabled",cond:(t,e)=>e.feature.defaultValue===!1}]}},unspecified:{},disabled:{},enabled:{},asyncDisabled:{invoke:{id:"set-off-upstream",src:t=>C(void 0,null,function*(){var r;let e=(r=t.featureDesc)==null?void 0:r.onChangeDefault;if(e!=null&&t.featureDesc!=null)return e(t.featureDesc.name,!1)}),onDone:[{target:"enabled",cond:(t,e)=>e.data===!0},{target:"disabled",cond:(t,e)=>e.data===!1},{target:"unspecified"}],onError:"unspecified"}},asyncUnspecied:{invoke:{id:"set-unset-upstream",src:t=>C(void 0,null,function*(){var r;let e=(r=t.featureDesc)==null?void 0:r.onChangeDefault;if(e!=null&&t.featureDesc!=null)return e(t.featureDesc.name,void 0)}),onDone:[{target:"enabled",cond:(t,e)=>e.data===!0},{target:"disabled",cond:(t,e)=>e.data===!1},{target:"unspecified"}],onError:"unspecified"}},asyncEnabled:{invoke:{id:"set-on-upstream",src:t=>C(void 0,null,function*(){var r;let e=(r=t.featureDesc)==null?void 0:r.onChangeDefault;if(e!=null&&t.featureDesc!=null)return e(t.featureDesc.name,!0)}),onDone:[{target:"enabled",cond:(t,e)=>e.data===!0},{target:"disabled",cond:(t,e)=>e.data===!1},{target:"unspecified"}],onError:"unspecified"}}}});function h(t,e){if(t.context.features[e]==null)return[void 0,!1];let r=t.context.features[e].getSnapshot();return r!=null?$(r):[void 0,!1]}var D=(0,f.createMachine)({id:"features",initial:"idle",predictableActionArguments:!0,context:{features:{}},states:{idle:{on:{INIT:{target:"ready",cond:(t,e)=>e.features.length>0,actions:(0,f.assign)({features:(t,e)=>{let r={};for(let a of e.features)r[a.name]=(0,f.spawn)(Q,{name:a.name,sync:!0}),r[a.name].send({type:"INIT",feature:a});return r}})}}},ready:{on:{DE_INIT:{target:"idle",actions:(0,f.assign)({features:(t,e)=>({})})},SET_ALL:{actions:(0,f.assign)({features:(t,e)=>{let r=Y({},t.features);return Object.keys(r).forEach(a=>{var n;r[a].send({type:"SET",value:(n=e.features[a])!=null?n:void 0})}),r}})},SET:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"SET",value:e.value})}},TOGGLE:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"TOGGLE"})}},ENABLE:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"ENABLE"})}},DISABLE:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"DISABLE"})}},UNSET:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"UNSET"})}}}}}});var p=k(require("react")),J=require("@xstate/react");var Z=require("react"),x=(0,Z.createContext)(t=>!1);var R=require("react"),E=(0,R.createContext)(null);var ee=require("react");var N=class{constructor(e,r,a){this.featureDesc=a,this.dispatch=e,this.testFeature=r}toggle(e){this.dispatch({type:"TOGGLE",name:e})}enable(e){this.dispatch({type:"ENABLE",name:e})}unset(e){this.dispatch({type:"UNSET",name:e})}disable(e){this.dispatch({type:"DISABLE",name:e})}setAll(e){this.dispatch({type:"SET_ALL",features:e})}listFeatures(){return this.featureDesc.map(e=>[e.name,this.testFeature(e.name)])}};function j(t,e,r,a){(0,ee.useEffect)(()=>t?(window.feature=new N(a,r,e),()=>{window.feature!=null&&delete window.feature}):()=>{},[e,a,t,r])}var z=require("react");var B="react-enable:feature-values";function P(t,e,r){let a=(0,z.useMemo)(()=>{let s={};if(r.matches("ready"))for(let d of e){let[u]=h(r,d.name);u!=null&&(s[d.name]=u)}return s},[e,r]),n=Object.keys(a).length===0||t==null?"{}":JSON.stringify({overrides:a});(0,z.useEffect)(()=>{try{t!=null&&r.matches("ready")&&t.setItem(B,n)}catch(s){}},[r,t,n])}var te=require("react");function U(t,e){let r=e.map(a=>h(a,t));for(let[a,n]of r)if(a!=null&&n)return a;for(let[a]of r)if(a!=null)return a}function G(t,e){return(0,te.useCallback)(r=>U(r,[t,e]),[t,e])}function re({children:t,features:e,disableConsole:r=!1,storage:a=window.sessionStorage}){let n=(0,p.useRef)(e),[s,d]=(0,J.useMachine)(D),[u,l]=(0,J.useMachine)(D);(0,p.useEffect)(()=>(l({type:"INIT",features:e}),()=>{l({type:"DE_INIT"})}),[l,e]),(0,p.useEffect)(()=>{let b={};if(a!=null)try{let i=a.getItem(B);i!=null&&(b=JSON.parse(i).overrides)}catch(i){console.error("error in localStorage",i)}return d({type:"INIT",features:n.current.filter(i=>i.noOverride!==!0).map(i=>{var m;return{name:i.name,description:i.description,defaultValue:(m=b==null?void 0:b[i.name])!=null?m:void 0}})}),()=>{d({type:"DE_INIT"})}},[n,d,a]),P(a,n.current,s);let c=G(s,u);j(!r,n.current,c,l);let S=(0,p.useMemo)(()=>({overridesSend:d,defaultsSend:l,featuresDescription:n.current,overridesState:s,defaultsState:u,test:c}),[d,l,s,u,c]);return p.default.createElement(E.Provider,{value:S},p.default.createElement(x.Provider,{value:c},t))}var V=k(require("react"));var T=require("react");function g(t){let e=(0,T.useContext)(x),r=(0,T.useMemo)(()=>t==null?[]:Array.isArray(t)?t:[t],[t]);return[e,r]}function A(t){let[e,r]=g(t);return r.length>0&&r.every(e)}function I(t){let[e,r]=g(t);return r.some(e)}function oe({feature:t=[],allFeatures:e=[],children:r}){let a=I(t),n=A(e);return a||n?V.createElement(V.Fragment,null,r):null}var M=k(require("react"));function L(t){let[e,r]=g(t);return t.length>0&&r.every(a=>{var n;return!((n=e(a))!=null&&n)})}function O(t){let[e,r]=g(t);return r.some(a=>{var n;return!((n=e(a))!=null&&n)})}var ae=({feature:t=[],allFeatures:e=[],children:r})=>{let a=O(t),n=L(e);return a||n?M.createElement(M.Fragment,null,r):null};var o=k(require("react")),ie=k(require("react-dom")),v=require("@headlessui/react");var ne=`/*
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
`;function X(...t){return t.filter(Boolean).join(" ")}function be({feature:t}){var c,S,b;let e=(0,o.useContext)(E),r=(0,o.useCallback)(i=>{if((e==null?void 0:e.overridesSend)!=null)switch(i){case"true":{e.overridesSend({type:"ENABLE",name:t.name});break}case"false":{e.overridesSend({type:"DISABLE",name:t.name});break}case"unset":{e.overridesSend({type:"UNSET",name:t.name});break}}},[t.name,e]);if(e==null)return null;let{overridesState:a,test:n,defaultsState:s}=e,d=((c=h(s,t.name)[0])!=null?c:"unset").toString(),u=((S=h(a,t.name)[0])!=null?S:"unset").toString(),l=n(t.name);return o.default.createElement(v.RadioGroup,{disabled:t.noOverride,onChange:r,value:u},o.default.createElement(v.RadioGroup.Label,null,o.default.createElement("h6",{className:"text-gray-900 align-center flex flex-row flex-nowrap items-center gap-2 lg:gap-4 h-7"},o.default.createElement("span",{className:"font-medium"},"Feature: ",o.default.createElement("code",null,t.name)),t.noOverride===!0?o.default.createElement("div",{className:"border-orange-500 text-orange-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"},o.default.createElement("svg",{"aria-hidden":"true",className:"h-4 w-4 min-w-4",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.default.createElement("path",{clipRule:"evenodd",d:"M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",fillRule:"evenodd"})),o.default.createElement("div",null,"No Overrides")):null,l===!0?o.default.createElement("div",{className:"flex flex-nowrap text-xs text-green-500 flex-row gap-1 rounded-sm border items-center justify-center border-green-500 px-2 py-1"},o.default.createElement("svg",{"aria-hidden":"true",className:"h-4 w-4 min-w-4",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.default.createElement("path",{clipRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",fillRule:"evenodd"})),o.default.createElement("div",null,l?"Enabled":"Disabled")):null),t.description==null?null:o.default.createElement("p",{className:"text-base text-gray-500 text-sm"},t.description)),o.default.createElement("div",{className:"mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"},[{id:"false",title:`Disable ${t.name}`,description:"Override the feature to be disabled"},{id:"unset",title:"Default",description:"Inherit enabled state from defaults",disabled:((b=t.noOverride)!=null?b:!1)||t.force,defaultValue:d==="true"?o.default.createElement("div",{className:"text-green-500 border-green-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"},o.default.createElement("span",null,"Enabled")):o.default.createElement("div",{className:"text-red-500 border-red-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"},o.default.createElement("span",null,"Disabled"))},{id:"true",title:`Enable ${t.name}`,description:"Override the feature to be enabled"}].map(i=>o.default.createElement(v.RadioGroup.Option,{className:({checked:m,active:_,disabled:y})=>X(m?"border-transparent":"border-gray-300",!y&&_?"border-blue-500 ring-2 ring-blue-500":"",y?"border-transparent ring-gray-500 cursor-not-allowed":"cursor-pointer","relative bg-white border rounded-lg shadow-sm p-3 flex focus:outline-none"),disabled:i.disabled,key:i.id,value:i.id},({checked:m,active:_,disabled:y})=>o.default.createElement(o.default.Fragment,null,o.default.createElement("div",{className:"flex flex-col grow"},o.default.createElement(v.RadioGroup.Label,{as:"span",className:"flex flex-nowrap flex-row gap-1 items-center space-between"},o.default.createElement("span",{className:"text-sm font-medium text-gray-900 grow shrink"},i.title),i.defaultValue!=null?i.defaultValue:null,o.default.createElement("svg",{"aria-hidden":"true",className:X(m?"":"invisible","h-5 w-5 text-blue-500 min-w-4"),fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.default.createElement("path",{clipRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",fillRule:"evenodd"}))),o.default.createElement(v.RadioGroup.Description,{as:"span",className:"mt-1 flex items-center text-sm text-gray-500"},i.description)),o.default.createElement("div",{"aria-hidden":"true",className:X(!y&&_?"border":"border-2",m?y?"border-gray-500":"border-blue-500":"border-transparent","absolute -inset-px rounded-lg pointer-events-none")}))))))}function he({root:t,children:e}){return ie.default.createPortal(e,t)}function se({defaultOpen:t=!1}){let[e,r]=(0,o.useState)(null);return o.default.createElement("div",{ref:n=>{if(n==null||e!=null)return;let s=n==null?void 0:n.attachShadow({mode:"open"}),d=document.createElement("style"),u=document.createElement("div");d.textContent=ne,s.appendChild(d),s.appendChild(u),r(u)},style:{zIndex:99999,position:"fixed",width:"0",height:"0",bottom:0}},e!=null?o.default.createElement(he,{root:e},o.default.createElement(we,{defaultOpen:t})):null)}function we({defaultOpen:t=!1}){let[e,r]=(0,o.useState)(t),a=(0,o.useContext)(E);if(a==null)return null;let{featuresDescription:n}=a;return n.length===0?null:o.default.createElement("div",{className:"relative"},o.default.createElement("div",{className:"absolute bottom-0 left-0 mx-4 my-4"},o.default.createElement("button",{className:"inline-flex items-center text-sm font-medium p-1 h-8 w-8 align-middle cursor-pointer rounded-full bg-blue-600 text-white  border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",onClick:()=>r(!0),title:"Toggle features",type:"button"},o.default.createElement("svg",{className:"w-6 h-6 min-h-6 min-w-6",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.default.createElement("path",{clipRule:"evenodd",d:"M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z",fillRule:"evenodd"})))),e?o.default.createElement("div",{className:"fixed z-10 inset-0 overflow-y-auto"},o.default.createElement("div",{className:"flex items-end justify-flex-start mx-8 my-4 min-h-screen pt-4 px-4 pb-10 sm:block sm:p-0"},o.default.createElement("div",{className:"relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 lg:max-w-[80%] max-w-full"},o.default.createElement("div",null,o.default.createElement("div",{className:"mt-1 sm:mt-3"},o.default.createElement("h3",{className:"flex flex-row gap-4 flex-nowrap items-center space-between"},o.default.createElement("div",{className:"grow text-lg leading-6 font-medium text-gray-900"},"Feature Flag Overrides")),o.default.createElement("p",{className:"text-sm text-gray-500"},"Features can be enabled or disabled unless they are forced upstream. You can also revert to default."),o.default.createElement("div",{className:"mt-6"},o.default.createElement("fieldset",{className:"flex flex-col gap-9"},o.default.createElement("legend",{className:"sr-only"},"Feature Flags"),n.map(s=>o.default.createElement(be,{feature:s,key:s.name})))),o.default.createElement("div",{className:"flex justify-center items-center mt-5 sm:mt-6"},o.default.createElement("button",{className:"inline-flex items-center text-sm font-medium pt-0 pb-0 pr-4 pl-4 h-8 leading-7 align-middle cursor-pointer rounded-sm bg-blue-600 text-white border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",onClick:()=>r(!1),type:"button"},"Done"))))))):null)}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2luZGV4LnRzeCIsICIuLi8uLi8uLi9zcmMvRmVhdHVyZXNTdGF0ZS50c3giLCAiLi4vLi4vLi4vc3JjL0ZlYXR1cmVTdGF0ZS50c3giLCAiLi4vLi4vLi4vc3JjL0ZlYXR1cmVzLnRzeCIsICIuLi8uLi8uLi9zcmMvRW5hYmxlQ29udGV4dC50c3giLCAiLi4vLi4vLi4vc3JjL0ZlYXR1cmVDb250ZXh0LnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlQ29uc29sZU92ZXJyaWRlLnRzeCIsICIuLi8uLi8uLi9zcmMvR2xvYmFsRW5hYmxlLnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlUGVyc2lzdC50c3giLCAiLi4vLi4vLi4vc3JjL3VzZVRlc3RDYWxsYmFjay50c3giLCAiLi4vLi4vLi4vc3JjL3Rlc3RGZWF0dXJlLnRzeCIsICIuLi8uLi8uLi9zcmMvRW5hYmxlLnRzeCIsICIuLi8uLi8uLi9zcmMvdXRpbHMudHMiLCAiLi4vLi4vLi4vc3JjL3VzZUFsbEVuYWJsZWQudHN4IiwgIi4uLy4uLy4uL3NyYy91c2VFbmFibGVkLnRzeCIsICIuLi8uLi8uLi9zcmMvRGlzYWJsZS50c3giLCAiLi4vLi4vLi4vc3JjL3VzZUFsbERpc2FibGVkLnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlRGlzYWJsZWQudHN4IiwgIi4uLy4uLy4uL3NyYy9Ub2dnbGVGZWF0dXJlcy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCB7IEZlYXR1cmVzTWFjaGluZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5leHBvcnQgeyBGZWF0dXJlcyB9IGZyb20gJy4vRmVhdHVyZXMnO1xuZXhwb3J0IHsgRW5hYmxlIH0gZnJvbSAnLi9FbmFibGUnO1xuZXhwb3J0IHsgRGlzYWJsZSB9IGZyb20gJy4vRGlzYWJsZSc7XG5leHBvcnQgeyB1c2VEaXNhYmxlZCB9IGZyb20gJy4vdXNlRGlzYWJsZWQnO1xuZXhwb3J0IHsgdXNlRW5hYmxlZCB9IGZyb20gJy4vdXNlRW5hYmxlZCc7XG5leHBvcnQgeyB1c2VBbGxEaXNhYmxlZCB9IGZyb20gJy4vdXNlQWxsRGlzYWJsZWQnO1xuZXhwb3J0IHsgdXNlQWxsRW5hYmxlZCB9IGZyb20gJy4vdXNlQWxsRW5hYmxlZCc7XG5leHBvcnQgdHlwZSB7IEVuYWJsZUNvbnRleHRUeXBlIH0gZnJvbSAnLi9FbmFibGVDb250ZXh0JztcbmV4cG9ydCB0eXBlIHsgRmVhdHVyZUNvbnRleHRUeXBlIH0gZnJvbSAnLi9GZWF0dXJlQ29udGV4dCc7XG5leHBvcnQgdHlwZSB7IEZlYXR1cmVWYWx1ZSwgRmVhdHVyZVN0YXRlLCBGZWF0dXJlRGlzcGF0Y2ggfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5leHBvcnQgeyBFbmFibGVDb250ZXh0IH0gZnJvbSAnLi9FbmFibGVDb250ZXh0JztcbmV4cG9ydCB7IFRvZ2dsZUZlYXR1cmVzIH0gZnJvbSAnLi9Ub2dnbGVGZWF0dXJlcyc7XG4iLCAiaW1wb3J0IHsgQWN0b3JSZWZGcm9tLCBJbnRlcnByZXRlckZyb20sIFN0YXRlRnJvbSwgYXNzaWduLCBjcmVhdGVNYWNoaW5lLCBzcGF3biB9IGZyb20gJ3hzdGF0ZSc7XG5cbmltcG9ydCB7IEZlYXR1cmVNYWNoaW5lLCBGZWF0dXJlRGVzY3JpcHRpb24sIEZlYXR1cmVWYWx1ZSwgdmFsdWVGb3JTdGF0ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcblxuZXhwb3J0IGludGVyZmFjZSBGZWF0dXJlc0NvbnRleHQge1xuICAvLyBmZWF0dXJlcyBhcmUgbGF5ZXJlZDpcbiAgLy8gIC0gZGVmYXVsdHM6IGlmIG5vdGhpbmcgZWxzZSBtYXRjaGVzLCBwcm92aWRlZCBhIHZhbHVlIGZvciBmZWF0dXJlXG4gIC8vICAtIGJyb3dzZXI6IGJyb3dzZXItbG9jYWwgdmFsdWVzIGZvciBmZWF0dXJlcyAoa2VwdCBpbiBsb2NhbCBzdG9yYWdlLCBldGMpXG4gIC8vICAtIHVzZXI6IHZhbHVlcyBmcm9tIHRoZSB1c2VyJ3MgcHJvZmlsZSwgaWYgYW55XG4gIC8vICAtIG9yZzogdmFsdWUgZnJvbSB0aGUgb3JnJ3MgcHJvZmlsZSwgaWYgYW55XG4gIGZlYXR1cmVzOiB7IFt4OiBzdHJpbmddOiBBY3RvclJlZkZyb208dHlwZW9mIEZlYXR1cmVNYWNoaW5lPiB9O1xufVxuXG5leHBvcnQgdHlwZSBGZWF0dXJlc0FjdGlvbiA9XG4gIHwgeyB0eXBlOiAnREVfSU5JVCcgfVxuICB8IHsgdHlwZTogJ0RJU0FCTEUnOyBuYW1lOiBzdHJpbmcgfVxuICB8IHsgdHlwZTogJ0VOQUJMRSc7IG5hbWU6IHN0cmluZyB9XG4gIHwgeyB0eXBlOiAnSU5JVCc7IGZlYXR1cmVzOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXSB9XG4gIHwgeyB0eXBlOiAnU0VUX0FMTCc7IGZlYXR1cmVzOiB7IFtrZXk6IHN0cmluZ106IEZlYXR1cmVWYWx1ZSB9IH1cbiAgfCB7IHR5cGU6ICdTRVQnOyBuYW1lOiBzdHJpbmc7IHZhbHVlOiBGZWF0dXJlVmFsdWUgfVxuICB8IHsgdHlwZTogJ1RPR0dMRSc7IG5hbWU6IHN0cmluZyB9XG4gIHwgeyB0eXBlOiAnVU5TRVQnOyBuYW1lOiBzdHJpbmcgfTtcblxuZXhwb3J0IGludGVyZmFjZSBGZWF0dXJlc1R5cGVTdGF0ZSB7XG4gIHZhbHVlOiAncmVhZHknO1xuICBjb250ZXh0OiBGZWF0dXJlc0NvbnRleHQ7XG59XG5cbmV4cG9ydCB0eXBlIEZlYXR1cmVzU3RhdGUgPSBTdGF0ZUZyb208dHlwZW9mIEZlYXR1cmVzTWFjaGluZT47XG5leHBvcnQgdHlwZSBGZWF0dXJlc0Rpc3BhdGNoID0gSW50ZXJwcmV0ZXJGcm9tPHR5cGVvZiBGZWF0dXJlc01hY2hpbmU+WydzZW5kJ107XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZU9mRmVhdHVyZShmZWF0dXJlc1N0YXRlOiBGZWF0dXJlc1N0YXRlLCBmZWF0dXJlOiBzdHJpbmcpOiBbRmVhdHVyZVZhbHVlLCBib29sZWFuXSB7XG4gIGlmIChmZWF0dXJlc1N0YXRlLmNvbnRleHQuZmVhdHVyZXNbZmVhdHVyZV0gPT0gbnVsbCkge1xuICAgIHJldHVybiBbdW5kZWZpbmVkLCBmYWxzZV07XG4gIH1cbiAgY29uc3QgZmVhdHVyZVN0YXRlID0gZmVhdHVyZXNTdGF0ZS5jb250ZXh0LmZlYXR1cmVzW2ZlYXR1cmVdLmdldFNuYXBzaG90KCk7XG4gIGlmIChmZWF0dXJlU3RhdGUgIT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZUZvclN0YXRlKGZlYXR1cmVTdGF0ZSk7XG4gIH1cbiAgcmV0dXJuIFt1bmRlZmluZWQsIGZhbHNlXTtcbn1cblxuLy8vIHN0YXRlIG1hY2hpbmUgdGhhdCBtYW5hZ2VzIGEgc2V0IG9mIGZlYXR1cmVzIHdpdGggdXNlciwgb3JnLCBhbmQgbG9jYWwgb3ZlcnJpZGVzXG5leHBvcnQgY29uc3QgRmVhdHVyZXNNYWNoaW5lID0gY3JlYXRlTWFjaGluZTxGZWF0dXJlc0NvbnRleHQsIEZlYXR1cmVzQWN0aW9uLCBGZWF0dXJlc1R5cGVTdGF0ZT4oe1xuICBpZDogJ2ZlYXR1cmVzJyxcbiAgaW5pdGlhbDogJ2lkbGUnLFxuICBwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50czogdHJ1ZSxcbiAgY29udGV4dDoge1xuICAgIGZlYXR1cmVzOiB7fSxcbiAgfSxcbiAgc3RhdGVzOiB7XG4gICAgaWRsZToge1xuICAgICAgb246IHtcbiAgICAgICAgSU5JVDoge1xuICAgICAgICAgIHRhcmdldDogJ3JlYWR5JyxcbiAgICAgICAgICBjb25kOiAoXywgZSkgPT4gZS5mZWF0dXJlcy5sZW5ndGggPiAwLFxuICAgICAgICAgIGFjdGlvbnM6IGFzc2lnbih7XG4gICAgICAgICAgICBmZWF0dXJlczogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGZlYXR1cmVzOiB0eXBlb2YgY29udGV4dC5mZWF0dXJlcyA9IHt9O1xuXG4gICAgICAgICAgICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBldmVudC5mZWF0dXJlcykge1xuICAgICAgICAgICAgICAgIGZlYXR1cmVzW2ZlYXR1cmUubmFtZV0gPSBzcGF3bihGZWF0dXJlTWFjaGluZSwge1xuICAgICAgICAgICAgICAgICAgbmFtZTogZmVhdHVyZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgc3luYzogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmZWF0dXJlc1tmZWF0dXJlLm5hbWVdLnNlbmQoeyB0eXBlOiAnSU5JVCcsIGZlYXR1cmUgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGZlYXR1cmVzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHRoZSBmZWF0dXJlcyBhcmUgbG9hZGVkIGFuZCByZWFkeSB0byBiZSB1c2VkXG4gICAgcmVhZHk6IHtcbiAgICAgIG9uOiB7XG4gICAgICAgIERFX0lOSVQ6IHsgdGFyZ2V0OiAnaWRsZScsIGFjdGlvbnM6IGFzc2lnbih7IGZlYXR1cmVzOiAoXywgX18pID0+ICh7fSkgfSkgfSxcbiAgICAgICAgU0VUX0FMTDoge1xuICAgICAgICAgIGFjdGlvbnM6IGFzc2lnbih7XG4gICAgICAgICAgICBmZWF0dXJlczogKGN0eCwgZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBmZWF0dXJlcyA9IHsgLi4uY3R4LmZlYXR1cmVzIH07XG4gICAgICAgICAgICAgIC8vIEFsbCBjb25maWd1cmVkIGZlYXR1cmVzIGFyZSBzZXQgdG8gb24vb2ZmIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgICBPYmplY3Qua2V5cyhmZWF0dXJlcykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIGZlYXR1cmVzW25hbWVdLnNlbmQoeyB0eXBlOiAnU0VUJywgdmFsdWU6IGUuZmVhdHVyZXNbbmFtZV0gPz8gdW5kZWZpbmVkIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZlYXR1cmVzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBTZXQgYSBmZWF0dXJlIHRvIGEgdmFsdWVcbiAgICAgICAgU0VUOiB7XG4gICAgICAgICAgYWN0aW9uczogKGN0eCwgZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmVhdHVyZSA9IGN0eC5mZWF0dXJlc1tlLm5hbWVdO1xuICAgICAgICAgICAgaWYgKGZlYXR1cmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBmZWF0dXJlLnNlbmQoeyB0eXBlOiAnU0VUJywgdmFsdWU6IGUudmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB0b2dnbGUgYSBmZWF0dXJlXG4gICAgICAgIFRPR0dMRToge1xuICAgICAgICAgIGFjdGlvbnM6IChjdHgsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZlYXR1cmUgPSBjdHguZmVhdHVyZXNbZS5uYW1lXTtcbiAgICAgICAgICAgIGlmIChmZWF0dXJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgZmVhdHVyZS5zZW5kKHsgdHlwZTogJ1RPR0dMRScgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB3aGVuIGEgZmVhdHVyZSBpcyBlbmFibGVkLCBzZW5kIHRoZSBlbmFibGUgbWVzc2FnZSB0byB0aGUgYWN0b3JcbiAgICAgICAgRU5BQkxFOiB7XG4gICAgICAgICAgYWN0aW9uczogKGN0eCwgZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmVhdHVyZSA9IGN0eC5mZWF0dXJlc1tlLm5hbWVdO1xuICAgICAgICAgICAgaWYgKGZlYXR1cmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBmZWF0dXJlLnNlbmQoeyB0eXBlOiAnRU5BQkxFJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHdoZW4gYSBmZWF0dXJlIGlzIGRpc2FibGVkLCBzZW5kIHRoZSBkaXNhYmxlIG1lc3NhZ2UgdG8gdGhlIGFjdG9yXG4gICAgICAgIERJU0FCTEU6IHtcbiAgICAgICAgICBhY3Rpb25zOiAoY3R4LCBlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlID0gY3R4LmZlYXR1cmVzW2UubmFtZV07XG4gICAgICAgICAgICBpZiAoZmVhdHVyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIGZlYXR1cmUuc2VuZCh7IHR5cGU6ICdESVNBQkxFJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHdoZW4gYSBmZWF0dXJlIGlzIHVuc2V0LCBzZW5kIHRoZSB1bnNldCBtZXNzYWdlIHRvIHRoZSBhY3RvclxuICAgICAgICBVTlNFVDoge1xuICAgICAgICAgIGFjdGlvbnM6IChjdHgsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZlYXR1cmUgPSBjdHguZmVhdHVyZXNbZS5uYW1lXTtcbiAgICAgICAgICAgIGlmIChmZWF0dXJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgZmVhdHVyZS5zZW5kKHsgdHlwZTogJ1VOU0VUJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iLCAiaW1wb3J0IHsgYXNzaWduLCBjcmVhdGVNYWNoaW5lLCBEb25lSW52b2tlRXZlbnQsIEludGVycHJldGVyRnJvbSwgU3RhdGVGcm9tIH0gZnJvbSAneHN0YXRlJztcblxuLyoqXG4gKiBGZWF0dXJlIGlzIGVpdGhlciBvbiwgb2ZmLCBvciAndW5zZXQnLFxuICogd2hpY2ggbWVhbnMgaXQgd2lsbCBnbyB0byB0aGUgZGVmYXVsdCB2YWx1ZSBvciB0aGUgbGVzcyBzcGVjaWZpYyB2YWx1ZS5cbiAqL1xuZXhwb3J0IHR5cGUgRmVhdHVyZVZhbHVlID0gZmFsc2UgfCB0cnVlIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBGZWF0dXJlU3RhdGUgPSBTdGF0ZUZyb208dHlwZW9mIEZlYXR1cmVNYWNoaW5lPjtcbmV4cG9ydCB0eXBlIEZlYXR1cmVEaXNwYXRjaCA9IEludGVycHJldGVyRnJvbTx0eXBlb2YgRmVhdHVyZU1hY2hpbmU+WydzZW5kJ107XG5cbi8vLyBHaXZlbiBhIGZlYXR1cmVzdGF0ZSwgZGV0ZXJtaW5lIHRoZSB2YWx1ZSAob24sIG9mZiwgb3IgdW5zZXQpXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVGb3JTdGF0ZShmZWF0dXJlU3RhdGU6IEZlYXR1cmVTdGF0ZSk6IFtGZWF0dXJlVmFsdWUsIGJvb2xlYW5dIHtcbiAgcmV0dXJuIFtcbiAgICBmZWF0dXJlU3RhdGUubWF0Y2hlcygnZW5hYmxlZCcpID8gdHJ1ZSA6IGZlYXR1cmVTdGF0ZS5tYXRjaGVzKCdkaXNhYmxlZCcpID8gZmFsc2UgOiB1bmRlZmluZWQsXG4gICAgZmVhdHVyZVN0YXRlLmNvbnRleHQuZmVhdHVyZURlc2M/LmZvcmNlID8/IGZhbHNlLFxuICBdO1xufVxuXG4vKipcbiAqIERlZmluaXRpb24gb2YgYSBmZWF0dXJlIHRoYXQgY2FuIGJlIGVuYWJsZWQgb3IgZGlzYWJsZWQuXG4gKiBLIGlzIHRoZSB0eXBlIG9mIHRoZSBrZXkgdGhhdCBpcyB1c2VkIHRvIGlkZW50aWZ5IHRoZSBmZWF0dXJlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZlYXR1cmVEZXNjcmlwdGlvbjxLIGV4dGVuZHMgc3RyaW5nID0gc3RyaW5nPiB7XG4gIHJlYWRvbmx5IG5hbWU6IEs7XG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8vLyBJZiBzZXQsIHdpbGwgYmUgdXNlZCB0byB1cGRhdGUgdGhlIGZlYXR1cmUgZGVmYXVsdCBzdGF0ZSBpbnN0ZWFkIG9mIHNpbXBseSBvdmVycmlkaW5nLlxuICAvLy8gRm9yIGV4YW1wbGUsIHlvdSBtaWdodCB1c2UgdGhpcyB0byB1cGRhdGUgYSBmZWF0dXJlIGZsYWcgb24gYSBiYWNrZW5kIHNlcnZlci5cbiAgLy8vIHdoZW4gc2V0LCB0aGUgZmVhdHVyZSB3aWxsIGJlIHVwZGF0ZWQgb24gdGhlIGJhY2tlbmQgc2VydmVyLCBhbmQgdGhlIHJlc3VsdCBvZiB0aGUgYXN5bmNcbiAgLy8vIHdpbGwgYmUgdXNlZCBmb3IgdGhlIGZpbmFsIHN0YXRlIGFmdGVyIHRoZSBjaGFuZ2UuIHdoaWxlIGNoYW5naW5nLCB0aGUgZmVhdHVyZSB3aWxsIGJlXG4gIC8vLyBpbiB0aGUgJ2NoYW5naW5nJyBzdGF0ZS4gQWxzbyBub3RlIHRoYXQgdGhlIGZlYXR1cmUgd2lsbCBiZSBjaGFuZ2VkIGF0IHRoZSBcImRlZmF1bHRcIiBsYXllci5cbiAgcmVhZG9ubHkgb25DaGFuZ2VEZWZhdWx0PzogKG5hbWU6IEssIG5ld1ZhbHVlOiBGZWF0dXJlVmFsdWUpID0+IFByb21pc2U8RmVhdHVyZVZhbHVlPjtcblxuICAvLy8gaWYgc2V0IHRydWUsIHdpbGwgZm9yY2UgdGhlIGZpZWxkIHRvIHdoYXQgaXQgaXMgc2V0IGhlcmUgdGhyb3VnaCBsYXllcnMgb2Ygc3RhdGVzLlxuICAvLy8gdXNlZnVsIHRvIGludmVydCB0aGUgbGF5ZXJzLCBzaW1pbGFyIHRvICFpbXBvcnRhbnQgaW4gQ1NTLlxuICByZWFkb25seSBmb3JjZT86IGJvb2xlYW47XG5cbiAgLy8vIElmIHNldCB0byB0cnVlLCB0aGUgZmVhdHVyZSB3aWxsIG5vdCBiZSBvdmVycmlkYWJsZSBieSB0aGUgdXNlci5cbiAgcmVhZG9ubHkgbm9PdmVycmlkZT86IGJvb2xlYW47XG5cbiAgLy8vIGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgd2hhdCBzaG91bGQgaGFwcGVuIGlmIHRoZSBmZWF0dXJlIGlzIG5vdCBzZXQgdG8gYSBwYXJ0aWN1bGFyIHZhbHVlLlxuICByZWFkb25seSBkZWZhdWx0VmFsdWU/OiBGZWF0dXJlVmFsdWU7XG59XG5cbmludGVyZmFjZSBGZWF0dXJlQ29udGV4dCB7XG4gIGZlYXR1cmVEZXNjPzogRmVhdHVyZURlc2NyaXB0aW9uO1xufVxuXG50eXBlIEZlYXR1cmVUeXBlU3RhdGUgPVxuICB8IHtcbiAgICAgIHZhbHVlOiAnYXN5bmNEZW5hYmxlZCc7XG4gICAgICBjb250ZXh0OiBGZWF0dXJlQ29udGV4dDtcbiAgICB9XG4gIHwge1xuICAgICAgdmFsdWU6ICdhc3luY0Rpc2FibGVkJztcbiAgICAgIGNvbnRleHQ6IEZlYXR1cmVDb250ZXh0O1xuICAgIH1cbiAgfCB7XG4gICAgICB2YWx1ZTogJ2FzeW5jVW5zcGVjaWVkJztcbiAgICAgIGNvbnRleHQ6IEZlYXR1cmVDb250ZXh0O1xuICAgIH1cbiAgfCB7XG4gICAgICB2YWx1ZTogJ2Rpc2FibGVkJztcbiAgICAgIGNvbnRleHQ6IEZlYXR1cmVDb250ZXh0O1xuICAgIH1cbiAgfCB7XG4gICAgICB2YWx1ZTogJ2VuYWJsZWQnO1xuICAgICAgY29udGV4dDogRmVhdHVyZUNvbnRleHQ7XG4gICAgfVxuICB8IHtcbiAgICAgIHZhbHVlOiAnaW5pdGlhbCc7XG4gICAgICBjb250ZXh0OiBuZXZlcjtcbiAgICB9XG4gIHwge1xuICAgICAgdmFsdWU6ICd1bnNwZWNpZWQnO1xuICAgICAgY29udGV4dDogRmVhdHVyZUNvbnRleHQ7XG4gICAgfTtcblxuLyoqXG4gKiBBY3Rpb25zIHRoYXQgY2FuIGJlIHBlcmZvcm1lZCBvbiBhIGZlYXR1cmUuXG4gKi9cbmV4cG9ydCB0eXBlIEZlYXR1cmVBY3Rpb24gPVxuICB8IHsgdHlwZTogJ0RJU0FCTEUnIH1cbiAgfCB7IHR5cGU6ICdFTkFCTEUnIH1cbiAgfCB7IHR5cGU6ICdJTklUJzsgZmVhdHVyZTogRmVhdHVyZURlc2NyaXB0aW9uIH1cbiAgfCB7IHR5cGU6ICdTRVQnOyB2YWx1ZTogRmVhdHVyZVZhbHVlIH1cbiAgfCB7IHR5cGU6ICdUT0dHTEUnIH1cbiAgfCB7IHR5cGU6ICdVTlNFVCcgfTtcblxuLyoqXG4gKiBGdWxseSBkZXNjcmliZSB0aGUgc3RhdGVzIGEgZmVhdHVyZSBjYW4gYmUgaW5cbiAqL1xuZXhwb3J0IGNvbnN0IEZlYXR1cmVNYWNoaW5lID0gY3JlYXRlTWFjaGluZTxGZWF0dXJlQ29udGV4dCwgRmVhdHVyZUFjdGlvbiwgRmVhdHVyZVR5cGVTdGF0ZT4oe1xuICBpZDogJ2ZlYXR1cmUnLFxuICBpbml0aWFsOiAnaW5pdGlhbCcsXG4gIGNvbnRleHQ6IHt9LFxuICBwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50czogdHJ1ZSxcbiAgb246IHtcbiAgICBFTkFCTEU6IFtcbiAgICAgIHsgdGFyZ2V0OiAnYXN5bmNFbmFibGVkJywgY29uZDogKGN0eCkgPT4gY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCB9LFxuICAgICAgeyB0YXJnZXQ6ICdlbmFibGVkJyB9LFxuICAgIF0sXG5cbiAgICBUT0dHTEU6IFtcbiAgICAgIHsgdGFyZ2V0OiAnYXN5bmNFbmFibGVkJywgY29uZDogKGN0eCkgPT4gY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCB9LFxuICAgICAgeyB0YXJnZXQ6ICdlbmFibGVkJyB9LFxuICAgIF0sXG5cbiAgICBESVNBQkxFOiBbXG4gICAgICB7IHRhcmdldDogJ2FzeW5jRGlzYWJsZWQnLCBjb25kOiAoY3R4KSA9PiBjdHguZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsIH0sXG4gICAgICB7IHRhcmdldDogJ2Rpc2FibGVkJyB9LFxuICAgIF0sXG5cbiAgICBVTlNFVDogW1xuICAgICAgeyB0YXJnZXQ6ICdhc3luY1Vuc3BlY2llZCcsIGNvbmQ6IChjdHgpID0+IGN0eC5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwgfSxcbiAgICAgIHsgdGFyZ2V0OiAndW5zcGVjaWZpZWQnIH0sXG4gICAgXSxcblxuICAgIFNFVDogW1xuICAgICAge1xuICAgICAgICB0YXJnZXQ6ICdhc3luY0VuYWJsZWQnLFxuICAgICAgICBjb25kOiAoY3R4LCBlKSA9PiBlLnZhbHVlID09PSB0cnVlICYmIGN0eC5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0YXJnZXQ6ICdhc3luY0Rpc2FibGVkJyxcbiAgICAgICAgY29uZDogKGN0eCwgZSkgPT4gZS52YWx1ZSA9PT0gZmFsc2UgJiYgY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogJ2FzeW5jVW5zcGVjaWVkJyxcbiAgICAgICAgY29uZDogKGN0eCwgX2UpID0+IGN0eC5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0YXJnZXQ6ICdlbmFibGVkJyxcbiAgICAgICAgY29uZDogKF9jdHgsIGUpID0+IGUudmFsdWUgPT09IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0YXJnZXQ6ICdkaXNhYmxlZCcsXG4gICAgICAgIGNvbmQ6IChfY3R4LCBlKSA9PiBlLnZhbHVlID09PSBmYWxzZSxcbiAgICAgIH0sXG4gICAgICB7IHRhcmdldDogJ3Vuc3BlY2lmaWVkJyB9LFxuICAgIF0sXG4gIH0sXG5cbiAgc3RhdGVzOiB7XG4gICAgaW5pdGlhbDoge1xuICAgICAgb246IHtcbiAgICAgICAgSU5JVDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFjdGlvbnM6IGFzc2lnbih7IGZlYXR1cmVEZXNjOiAoXywgZSkgPT4gZS5mZWF0dXJlIH0pLFxuICAgICAgICAgICAgdGFyZ2V0OiAnZW5hYmxlZCcsXG4gICAgICAgICAgICBjb25kOiAoXywgZSkgPT4gZS5mZWF0dXJlLmRlZmF1bHRWYWx1ZSA9PT0gdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFjdGlvbnM6IGFzc2lnbih7IGZlYXR1cmVEZXNjOiAoXywgZSkgPT4gZS5mZWF0dXJlIH0pLFxuICAgICAgICAgICAgdGFyZ2V0OiAndW5zcGVjaWZpZWQnLFxuICAgICAgICAgICAgY29uZDogKF8sIGUpID0+IGUuZmVhdHVyZS5kZWZhdWx0VmFsdWUgPT09IHVuZGVmaW5lZCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFjdGlvbnM6IGFzc2lnbih7IGZlYXR1cmVEZXNjOiAoXywgZSkgPT4gZS5mZWF0dXJlIH0pLFxuICAgICAgICAgICAgdGFyZ2V0OiAnZGlzYWJsZWQnLFxuICAgICAgICAgICAgY29uZDogKF8sIGUpID0+IGUuZmVhdHVyZS5kZWZhdWx0VmFsdWUgPT09IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICB1bnNwZWNpZmllZDoge30sXG4gICAgZGlzYWJsZWQ6IHt9LFxuICAgIGVuYWJsZWQ6IHt9LFxuXG4gICAgYXN5bmNEaXNhYmxlZDoge1xuICAgICAgaW52b2tlOiB7XG4gICAgICAgIGlkOiAnc2V0LW9mZi11cHN0cmVhbScsXG4gICAgICAgIHNyYzogYXN5bmMgKGN0eCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9uY2hhbmdlID0gY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQ7XG4gICAgICAgICAgaWYgKG9uY2hhbmdlICE9IG51bGwgJiYgY3R4LmZlYXR1cmVEZXNjICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBvbmNoYW5nZShjdHguZmVhdHVyZURlc2MubmFtZSwgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9LFxuICAgICAgICBvbkRvbmU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdlbmFibGVkJyxcbiAgICAgICAgICAgIGNvbmQ6IChfY3R4LCBlOiBEb25lSW52b2tlRXZlbnQ8RmVhdHVyZVZhbHVlPikgPT4gZS5kYXRhID09PSB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGFyZ2V0OiAnZGlzYWJsZWQnLFxuICAgICAgICAgICAgY29uZDogKF9jdHgsIGU6IERvbmVJbnZva2VFdmVudDxGZWF0dXJlVmFsdWU+KSA9PiBlLmRhdGEgPT09IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0YXJnZXQ6ICd1bnNwZWNpZmllZCcgfSxcbiAgICAgICAgXSxcbiAgICAgICAgb25FcnJvcjogJ3Vuc3BlY2lmaWVkJyxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIGFzeW5jVW5zcGVjaWVkOiB7XG4gICAgICBpbnZva2U6IHtcbiAgICAgICAgaWQ6ICdzZXQtdW5zZXQtdXBzdHJlYW0nLFxuICAgICAgICBzcmM6IGFzeW5jIChjdHgpID0+IHtcbiAgICAgICAgICBjb25zdCBvbmNoYW5nZSA9IGN0eC5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0O1xuICAgICAgICAgIGlmIChvbmNoYW5nZSAhPSBudWxsICYmIGN0eC5mZWF0dXJlRGVzYyAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gb25jaGFuZ2UoY3R4LmZlYXR1cmVEZXNjLm5hbWUsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRG9uZTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRhcmdldDogJ2VuYWJsZWQnLFxuICAgICAgICAgICAgY29uZDogKF9jdHgsIGU6IERvbmVJbnZva2VFdmVudDxGZWF0dXJlVmFsdWU+KSA9PiBlLmRhdGEgPT09IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdkaXNhYmxlZCcsXG4gICAgICAgICAgICBjb25kOiAoX2N0eCwgZTogRG9uZUludm9rZUV2ZW50PEZlYXR1cmVWYWx1ZT4pID0+IGUuZGF0YSA9PT0gZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHRhcmdldDogJ3Vuc3BlY2lmaWVkJyB9LFxuICAgICAgICBdLFxuICAgICAgICBvbkVycm9yOiAndW5zcGVjaWZpZWQnLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgYXN5bmNFbmFibGVkOiB7XG4gICAgICBpbnZva2U6IHtcbiAgICAgICAgaWQ6ICdzZXQtb24tdXBzdHJlYW0nLFxuICAgICAgICBzcmM6IGFzeW5jIChjdHgpID0+IHtcbiAgICAgICAgICBjb25zdCBvbmNoYW5nZSA9IGN0eC5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0O1xuICAgICAgICAgIGlmIChvbmNoYW5nZSAhPSBudWxsICYmIGN0eC5mZWF0dXJlRGVzYyAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gb25jaGFuZ2UoY3R4LmZlYXR1cmVEZXNjLm5hbWUsIHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9LFxuICAgICAgICBvbkRvbmU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdlbmFibGVkJyxcbiAgICAgICAgICAgIGNvbmQ6IChfY3R4LCBlOiBEb25lSW52b2tlRXZlbnQ8RmVhdHVyZVZhbHVlPikgPT4gZS5kYXRhID09PSB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGFyZ2V0OiAnZGlzYWJsZWQnLFxuICAgICAgICAgICAgY29uZDogKF9jdHgsIGU6IERvbmVJbnZva2VFdmVudDxGZWF0dXJlVmFsdWU+KSA9PiBlLmRhdGEgPT09IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0YXJnZXQ6ICd1bnNwZWNpZmllZCcgfSxcbiAgICAgICAgXSxcbiAgICAgICAgb25FcnJvcjogJ3Vuc3BlY2lmaWVkJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIiwgImltcG9ydCBSZWFjdCwgeyB1c2VNZW1vLCBSZWFjdE5vZGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyB1c2VNYWNoaW5lIH0gZnJvbSAnQHhzdGF0ZS9yZWFjdCc7XG5cbmltcG9ydCB7IEVuYWJsZUNvbnRleHQgfSBmcm9tICcuL0VuYWJsZUNvbnRleHQnO1xuaW1wb3J0IHsgRmVhdHVyZUNvbnRleHQgfSBmcm9tICcuL0ZlYXR1cmVDb250ZXh0JztcbmltcG9ydCB7IEZlYXR1cmVzTWFjaGluZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgeyBGZWF0dXJlRGVzY3JpcHRpb24gfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5pbXBvcnQgdXNlQ29uc29sZU92ZXJyaWRlIGZyb20gJy4vdXNlQ29uc29sZU92ZXJyaWRlJztcbmltcG9ydCB1c2VQZXJzaXN0LCB7IEtFWSB9IGZyb20gJy4vdXNlUGVyc2lzdCc7XG5pbXBvcnQgdXNlVGVzdENhbGxiYWNrIGZyb20gJy4vdXNlVGVzdENhbGxiYWNrJztcblxuaW50ZXJmYWNlIEZlYXR1cmVQcm9wcyB7XG4gIHJlYWRvbmx5IGZlYXR1cmVzOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXTtcbiAgcmVhZG9ubHkgY2hpbGRyZW4/OiBSZWFjdE5vZGU7XG4gIHJlYWRvbmx5IGRpc2FibGVDb25zb2xlPzogYm9vbGVhbjtcbiAgcmVhZG9ubHkgc3RvcmFnZT86IFN0b3JhZ2U7XG59XG5cbi8qKlxuICogQSBtb3JlIGJhdHRlcmllcy1lbmFibGVkIHBhcmVudCBjb21wb25lbnQgdGhhdCBrZWVwcyB0cmFjayBvZiBmZWF0dXJlIHN0YXRlXG4gKiBpbnRlcm5hbGx5LCBhbmQgY3JlYXRlcyB3aW5kb3cuZmVhdHVyZS5lbmFibGUoXCJmXCIpIGFuZCB3aW5kb3cuZmVhdHVyZS5kaXNhYmxlKFwiZlwiKS5cbiAqIEtlZXBzIHRyYWNrIG9mIG92ZXJyaWRlcyBhbmQgZGVmYXVsdHMsIHdpdGggZGVmYXVsdHMgcG90ZW50aWFsbHkgY29taW5nIGZyb20geW91ciBwcm9wc1xuICogYW5kIG92ZXJyaWRlcyBiZWluZyBwZXJzaXN0ZWQgdG8geW91ciBjaG9pY2Ugb2Ygc3RvcmFnZSBsYXllci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmVzKHtcbiAgY2hpbGRyZW4sXG4gIGZlYXR1cmVzLFxuICBkaXNhYmxlQ29uc29sZSA9IGZhbHNlLFxuICBzdG9yYWdlID0gd2luZG93LnNlc3Npb25TdG9yYWdlLFxufTogRmVhdHVyZVByb3BzKTogSlNYLkVsZW1lbnQge1xuICAvLyBDYXB0dXJlIG9ubHkgZmlyc3QgdmFsdWU7IHdlIGRvbid0IGNhcmUgYWJvdXQgZnV0dXJlIHVwZGF0ZXNcbiAgY29uc3QgZmVhdHVyZXNSZWYgPSB1c2VSZWYoZmVhdHVyZXMpO1xuICBjb25zdCBbb3ZlcnJpZGVzU3RhdGUsIG92ZXJyaWRlc1NlbmRdID0gdXNlTWFjaGluZShGZWF0dXJlc01hY2hpbmUpO1xuICBjb25zdCBbZGVmYXVsdHNTdGF0ZSwgZGVmYXVsdHNTZW5kXSA9IHVzZU1hY2hpbmUoRmVhdHVyZXNNYWNoaW5lKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vLyBMb2FkIGRlZmF1bHRzXG4gICAgZGVmYXVsdHNTZW5kKHsgdHlwZTogJ0lOSVQnLCBmZWF0dXJlcyB9KTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZGVmYXVsdHNTZW5kKHsgdHlwZTogJ0RFX0lOSVQnIH0pO1xuICAgIH07XG4gIH0sIFtkZWZhdWx0c1NlbmQsIGZlYXR1cmVzXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgZjogUmVjb3JkPHN0cmluZywgYm9vbGVhbiB8IHVuZGVmaW5lZD4gPSB7fTtcbiAgICBpZiAoc3RvcmFnZSAhPSBudWxsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBmZWF0dXJlc0pzb24gPSBzdG9yYWdlLmdldEl0ZW0oS0VZKTtcbiAgICAgICAgaWYgKGZlYXR1cmVzSnNvbiAhPSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgZmggPSBKU09OLnBhcnNlKGZlYXR1cmVzSnNvbik7XG4gICAgICAgICAgZiA9IGZoLm92ZXJyaWRlcztcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBDYW4ndCBwYXJzZSBvciBnZXQgb3Igb3RoZXJ3aXNlOyBpZ25vcmVcbiAgICAgICAgY29uc29sZS5lcnJvcignZXJyb3IgaW4gbG9jYWxTdG9yYWdlJywgZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgb3ZlcnJpZGVzU2VuZCh7XG4gICAgICB0eXBlOiAnSU5JVCcsXG4gICAgICBmZWF0dXJlczogZmVhdHVyZXNSZWYuY3VycmVudFxuICAgICAgICAuZmlsdGVyKCh4KSA9PiB4Lm5vT3ZlcnJpZGUgIT09IHRydWUpXG4gICAgICAgIC5tYXAoKHgpID0+ICh7IG5hbWU6IHgubmFtZSwgZGVzY3JpcHRpb246IHguZGVzY3JpcHRpb24sIGRlZmF1bHRWYWx1ZTogZj8uW3gubmFtZV0gPz8gdW5kZWZpbmVkIH0pKSxcbiAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBvdmVycmlkZXNTZW5kKHsgdHlwZTogJ0RFX0lOSVQnIH0pO1xuICAgIH07XG4gIH0sIFtmZWF0dXJlc1JlZiwgb3ZlcnJpZGVzU2VuZCwgc3RvcmFnZV0pO1xuXG4gIHVzZVBlcnNpc3Qoc3RvcmFnZSwgZmVhdHVyZXNSZWYuY3VycmVudCwgb3ZlcnJpZGVzU3RhdGUpO1xuXG4gIGNvbnN0IHRlc3RDYWxsYmFjayA9IHVzZVRlc3RDYWxsYmFjayhvdmVycmlkZXNTdGF0ZSwgZGVmYXVsdHNTdGF0ZSk7XG4gIHVzZUNvbnNvbGVPdmVycmlkZSghZGlzYWJsZUNvbnNvbGUsIGZlYXR1cmVzUmVmLmN1cnJlbnQsIHRlc3RDYWxsYmFjaywgZGVmYXVsdHNTZW5kKTtcblxuICBjb25zdCBmZWF0dXJlVmFsdWUgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBvdmVycmlkZXNTZW5kLFxuICAgICAgZGVmYXVsdHNTZW5kLFxuICAgICAgZmVhdHVyZXNEZXNjcmlwdGlvbjogZmVhdHVyZXNSZWYuY3VycmVudCxcbiAgICAgIG92ZXJyaWRlc1N0YXRlLFxuICAgICAgZGVmYXVsdHNTdGF0ZSxcbiAgICAgIHRlc3Q6IHRlc3RDYWxsYmFjayxcbiAgICB9KSxcbiAgICBbb3ZlcnJpZGVzU2VuZCwgZGVmYXVsdHNTZW5kLCBvdmVycmlkZXNTdGF0ZSwgZGVmYXVsdHNTdGF0ZSwgdGVzdENhbGxiYWNrXVxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPEZlYXR1cmVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtmZWF0dXJlVmFsdWV9PlxuICAgICAgPEVuYWJsZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3Rlc3RDYWxsYmFja30+e2NoaWxkcmVufTwvRW5hYmxlQ29udGV4dC5Qcm92aWRlcj5cbiAgICA8L0ZlYXR1cmVDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufVxuIiwgImltcG9ydCB7IGNyZWF0ZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IEZlYXR1cmVWYWx1ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcblxuZXhwb3J0IHR5cGUgRW5hYmxlQ29udGV4dFR5cGUgPSAoZmVhdHVyZTogc3RyaW5nKSA9PiBGZWF0dXJlVmFsdWU7XG5cbi8qKlxuICogQ29udGFpbmVkIGZ1bmN0aW9uIGNhbiBjaGVjayB3aGV0aGVyIGEgZ2l2ZW4gZmVhdHVyZSBpcyBlbmFibGVkLlxuICovXG5leHBvcnQgY29uc3QgRW5hYmxlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8RW5hYmxlQ29udGV4dFR5cGU+KChfcykgPT4gZmFsc2UpO1xuIiwgImltcG9ydCB7IGNyZWF0ZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IEZlYXR1cmVzRGlzcGF0Y2gsIEZlYXR1cmVzU3RhdGUgfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuaW1wb3J0IHsgRmVhdHVyZURlc2NyaXB0aW9uLCBGZWF0dXJlVmFsdWUgfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5cbmV4cG9ydCBjb25zdCBGZWF0dXJlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8RmVhdHVyZUNvbnRleHRUeXBlIHwgbnVsbD4obnVsbCk7XG5cbi8vLyBHaXZlIGFjY2VzcyB0byB0aGUgb3ZlcnJpZGVzIGxheWVyXG5leHBvcnQgaW50ZXJmYWNlIEZlYXR1cmVDb250ZXh0VHlwZSB7XG4gIC8vIE1ha2UgY2hhbmdlcyB0byB0aGUgb3ZlcnJpZGVzXG4gIG92ZXJyaWRlc1NlbmQ6IEZlYXR1cmVzRGlzcGF0Y2g7XG5cbiAgLy8gTWFrZSBjaGFuZ2VzIHRvIGRlZmF1bHRzXG4gIGRlZmF1bHRzU2VuZDogRmVhdHVyZXNEaXNwYXRjaDtcblxuICBmZWF0dXJlc0Rlc2NyaXB0aW9uOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXTtcblxuICAvLyBTdGF0ZSBpcyBpbiBsYXllcnM7IG92ZXJyaWRlcyBhbmQgZGVmYXVsdHNcbiAgb3ZlcnJpZGVzU3RhdGU6IEZlYXR1cmVzU3RhdGU7XG4gIGRlZmF1bHRzU3RhdGU6IEZlYXR1cmVzU3RhdGU7XG5cbiAgLy8vIFRlc3Qgd2l0aCBwcm9wZXIgZmFsbGJhY2sgYW5kIHJlc3BlY3RpbmcgdGhlIHVzZXIncyBmb3JjZSBwcmVmZXJlbmNlXG4gIHRlc3Q6IChmbGFnOiBzdHJpbmcpID0+IEZlYXR1cmVWYWx1ZTtcbn1cbiIsICJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IEZlYXR1cmVzRGlzcGF0Y2ggfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuaW1wb3J0IHsgRmVhdHVyZURlc2NyaXB0aW9uLCBGZWF0dXJlVmFsdWUgfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5pbXBvcnQgeyBHbG9iYWxFbmFibGUgfSBmcm9tICcuL0dsb2JhbEVuYWJsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUNvbnNvbGVPdmVycmlkZShcbiAgY29uc29sZU92ZXJyaWRlOiBib29sZWFuLFxuICBmZWF0dXJlczogcmVhZG9ubHkgRmVhdHVyZURlc2NyaXB0aW9uW10sXG4gIHRlc3RGZWF0dXJlOiAoXzogc3RyaW5nKSA9PiBGZWF0dXJlVmFsdWUsXG4gIGRpc3BhdGNoOiBGZWF0dXJlc0Rpc3BhdGNoXG4pOiB2b2lkIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWNvbnNvbGVPdmVycmlkZSkge1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgLyogZW1wdHkgKi9cbiAgICAgIH07XG4gICAgfVxuICAgIHdpbmRvdy5mZWF0dXJlID0gbmV3IEdsb2JhbEVuYWJsZShkaXNwYXRjaCwgdGVzdEZlYXR1cmUsIGZlYXR1cmVzKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHdpbmRvdy5mZWF0dXJlICE9IG51bGwpIHtcbiAgICAgICAgZGVsZXRlIHdpbmRvdy5mZWF0dXJlO1xuICAgICAgfVxuICAgIH07XG4gIH0sIFtmZWF0dXJlcywgZGlzcGF0Y2gsIGNvbnNvbGVPdmVycmlkZSwgdGVzdEZlYXR1cmVdKTtcbn1cbiIsICJpbXBvcnQgeyBGZWF0dXJlc0Rpc3BhdGNoIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcbmltcG9ydCB7IEZlYXR1cmVEZXNjcmlwdGlvbiwgRmVhdHVyZVZhbHVlIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuXG5leHBvcnQgY2xhc3MgR2xvYmFsRW5hYmxlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBmZWF0dXJlRGVzYzogcmVhZG9ubHkgRmVhdHVyZURlc2NyaXB0aW9uW107XG4gIHByaXZhdGUgcmVhZG9ubHkgZGlzcGF0Y2g6IEZlYXR1cmVzRGlzcGF0Y2g7XG4gIHByaXZhdGUgcmVhZG9ubHkgdGVzdEZlYXR1cmU6ICh2YWx1ZTogc3RyaW5nKSA9PiBGZWF0dXJlVmFsdWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZGlzcGF0Y2g6IEZlYXR1cmVzRGlzcGF0Y2gsXG4gICAgdGVzdEZlYXR1cmU6IChfOiBzdHJpbmcpID0+IEZlYXR1cmVWYWx1ZSxcbiAgICBmZWF0dXJlRGVzYzogcmVhZG9ubHkgRmVhdHVyZURlc2NyaXB0aW9uW11cbiAgKSB7XG4gICAgdGhpcy5mZWF0dXJlRGVzYyA9IGZlYXR1cmVEZXNjO1xuICAgIHRoaXMuZGlzcGF0Y2ggPSBkaXNwYXRjaDtcbiAgICB0aGlzLnRlc3RGZWF0dXJlID0gdGVzdEZlYXR1cmU7XG4gIH1cblxuICBwdWJsaWMgdG9nZ2xlKGZlYXR1cmU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2goeyB0eXBlOiAnVE9HR0xFJywgbmFtZTogZmVhdHVyZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBlbmFibGUoZmVhdHVyZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaCh7IHR5cGU6ICdFTkFCTEUnLCBuYW1lOiBmZWF0dXJlIH0pO1xuICB9XG5cbiAgcHVibGljIHVuc2V0KGZlYXR1cmU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2goeyB0eXBlOiAnVU5TRVQnLCBuYW1lOiBmZWF0dXJlIH0pO1xuICB9XG5cbiAgcHVibGljIGRpc2FibGUoZmVhdHVyZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaCh7IHR5cGU6ICdESVNBQkxFJywgbmFtZTogZmVhdHVyZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRBbGwoZmVhdHVyZXM6IHsgW2tleTogc3RyaW5nXTogRmVhdHVyZVZhbHVlIH0pOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoKHsgdHlwZTogJ1NFVF9BTEwnLCBmZWF0dXJlcyB9KTtcbiAgfVxuXG4gIHB1YmxpYyBsaXN0RmVhdHVyZXMoKTogcmVhZG9ubHkgW3N0cmluZywgRmVhdHVyZVZhbHVlXVtdIHtcbiAgICByZXR1cm4gdGhpcy5mZWF0dXJlRGVzYy5tYXAoKGYpID0+IFtmLm5hbWUsIHRoaXMudGVzdEZlYXR1cmUoZi5uYW1lKV0pO1xuICB9XG59XG5kZWNsYXJlIGdsb2JhbCB7XG4gIGludGVyZmFjZSBXaW5kb3cge1xuICAgIGZlYXR1cmU/OiBHbG9iYWxFbmFibGU7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyB1c2VNZW1vLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IEZlYXR1cmVzU3RhdGUsIHZhbHVlT2ZGZWF0dXJlIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcbmltcG9ydCB7IEZlYXR1cmVEZXNjcmlwdGlvbiwgRmVhdHVyZVZhbHVlIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuXG5leHBvcnQgY29uc3QgS0VZID0gJ3JlYWN0LWVuYWJsZTpmZWF0dXJlLXZhbHVlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZVBlcnNpc3QoXG4gIHN0b3JhZ2U6IFN0b3JhZ2UgfCB1bmRlZmluZWQsXG4gIGZlYXR1cmVzOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXSxcbiAgb3ZlcnJpZGVTdGF0ZTogRmVhdHVyZXNTdGF0ZVxuKTogdm9pZCB7XG4gIGNvbnN0IG92ZXJyaWRlcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IG5ld092ZXJyaWRlczogeyBba2V5OiBzdHJpbmddOiBGZWF0dXJlVmFsdWUgfSA9IHt9O1xuICAgIGlmIChvdmVycmlkZVN0YXRlLm1hdGNoZXMoJ3JlYWR5JykpIHtcbiAgICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBmZWF0dXJlcykge1xuICAgICAgICBjb25zdCBbdmFsdWVdID0gdmFsdWVPZkZlYXR1cmUob3ZlcnJpZGVTdGF0ZSwgZmVhdHVyZS5uYW1lKTtcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICBuZXdPdmVycmlkZXNbZmVhdHVyZS5uYW1lXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdPdmVycmlkZXM7XG4gIH0sIFtmZWF0dXJlcywgb3ZlcnJpZGVTdGF0ZV0pO1xuXG4gIGNvbnN0IHN0clN0YXRlID0gT2JqZWN0LmtleXMob3ZlcnJpZGVzKS5sZW5ndGggPT09IDAgfHwgc3RvcmFnZSA9PSBudWxsID8gJ3t9JyA6IEpTT04uc3RyaW5naWZ5KHsgb3ZlcnJpZGVzIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChzdG9yYWdlICE9IG51bGwgJiYgb3ZlcnJpZGVTdGF0ZS5tYXRjaGVzKCdyZWFkeScpKSB7XG4gICAgICAgIHN0b3JhZ2Uuc2V0SXRlbShLRVksIHN0clN0YXRlKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBDYW4ndCBzZXQgZm9yIHNvbWUgcmVhc29uXG4gICAgfVxuICB9LCBbb3ZlcnJpZGVTdGF0ZSwgc3RvcmFnZSwgc3RyU3RhdGVdKTtcbn1cbiIsICJpbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRmVhdHVyZXNTdGF0ZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgdGVzdEZlYXR1cmUgZnJvbSAnLi90ZXN0RmVhdHVyZSc7XG5cbi8vLyBBIGNhbGxiYWNrIHRoYXQgY2FuIGJlIGNhbGxlZCB0byB0ZXN0IGlmIGEgZmVhdHVyZSBpcyBlbmFibGVkIG9yIGRpc2FibGVkXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VUZXN0Q2FsbGJhY2soXG4gIGRlZmF1bHRzU3RhdGU6IEZlYXR1cmVzU3RhdGUsXG4gIG92ZXJyaWRlc1N0YXRlOiBGZWF0dXJlc1N0YXRlXG4pOiAoZmVhdHVyZTogc3RyaW5nKSA9PiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHVzZUNhbGxiYWNrKChmOiBzdHJpbmcpID0+IHRlc3RGZWF0dXJlKGYsIFtkZWZhdWx0c1N0YXRlLCBvdmVycmlkZXNTdGF0ZV0pLCBbZGVmYXVsdHNTdGF0ZSwgb3ZlcnJpZGVzU3RhdGVdKTtcbn1cbiIsICJpbXBvcnQgeyBGZWF0dXJlc1N0YXRlLCB2YWx1ZU9mRmVhdHVyZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgeyBGZWF0dXJlVmFsdWUgfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5cbi8qKiBEZXRlcm1pbmUgaWYgdGhlIGZlYXR1cmUgaXMgZW5hYmxlZCBpbiBvbmUgb2YgdGhlIHN0YXRlIG1hY2hpbmVzLCBpbiBvcmRlclxuICpcbiAqIEBwYXJhbSBzdGF0ZSBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgbWFjaGluZVxuICogQHBhcmFtIGZlYXR1cmUgVGhlIGZlYXR1cmUgdG8gY2hlY2tcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0ZXN0RmVhdHVyZShmZWF0dXJlOiBzdHJpbmcsIHN0YXRlczogRmVhdHVyZXNTdGF0ZVtdKTogRmVhdHVyZVZhbHVlIHtcbiAgY29uc3QgdmFsdWVzID0gc3RhdGVzLm1hcCgoc3RhdGUpID0+IHZhbHVlT2ZGZWF0dXJlKHN0YXRlLCBmZWF0dXJlKSk7XG5cbiAgLy8gbG9vayBmb3IgYmVzdCBmb3JjZWQgb3B0aW9uLCBpbiBvcmRlclxuICBmb3IgKGNvbnN0IFtmZWF0dXJlVmFsdWUsIGZlYXR1cmVGb3JjZWRdIG9mIHZhbHVlcykge1xuICAgIGlmIChmZWF0dXJlVmFsdWUgIT0gbnVsbCAmJiBmZWF0dXJlRm9yY2VkKSB7XG4gICAgICByZXR1cm4gZmVhdHVyZVZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8vIGxvb2sgZm9yIGJlc3Qgbm9uLWZvcmNlZCBvcHRpb24sIGluIG9yZGVyXG4gIGZvciAoY29uc3QgW2ZlYXR1cmVWYWx1ZV0gb2YgdmFsdWVzKSB7XG4gICAgaWYgKGZlYXR1cmVWYWx1ZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gZmVhdHVyZVZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8vIHVuc2V0IGlmIG5vdGhpbmcgaGl0XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iLCAiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyB1c2VBbGxFbmFibGVkIH0gZnJvbSAnLi91c2VBbGxFbmFibGVkJztcbmltcG9ydCB7IHVzZUVuYWJsZWQgfSBmcm9tICcuL3VzZUVuYWJsZWQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVuYWJsZVByb3BzIHtcbiAgcmVhZG9ubHkgZmVhdHVyZT86IHN0cmluZ1tdIHwgc3RyaW5nO1xuICByZWFkb25seSBhbGxGZWF0dXJlcz86IHN0cmluZ1tdO1xuICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlO1xufVxuXG4vKipcbiAqIEZlYXR1cmUgd2lsbCBiZSBlbmFibGVkIGlmIGFueSBmZWF0dXJlIGluIHRoZSBsaXN0IGFyZSBlbmFibGVkLFxuICovXG5leHBvcnQgZnVuY3Rpb24gRW5hYmxlKHsgZmVhdHVyZSA9IFtdLCBhbGxGZWF0dXJlcyA9IFtdLCBjaGlsZHJlbiB9OiBFbmFibGVQcm9wcyk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IGlzQW55ID0gdXNlRW5hYmxlZChmZWF0dXJlKTtcbiAgY29uc3QgaXNBbGwgPSB1c2VBbGxFbmFibGVkKGFsbEZlYXR1cmVzKTtcblxuICBpZiAoaXNBbnkgfHwgaXNBbGwpIHtcbiAgICByZXR1cm4gPD57Y2hpbGRyZW59PC8+O1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCAiaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRW5hYmxlQ29udGV4dFR5cGUsIEVuYWJsZUNvbnRleHQgfSBmcm9tICcuL0VuYWJsZUNvbnRleHQnO1xuXG4vLyBIZWxwZXI6IGdldCByaWQgb2Ygc29tZSBib2lsZXJwbGF0ZS5cbi8vIGp1c3QgaW5wdXQgbWFzaGluZyBhbmQgc2FuaXRhdGlvbiwgcmVtb3ZpbmcgZXh0cmEgcmVuZGVycywgYW5kIGdldHRpbmcgdGVzdCBmdW5jdGlvblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVRlc3RBbmRDb252ZXJ0KGlucHV0Pzogc3RyaW5nW10gfCBzdHJpbmcgfCBudWxsKTogW0VuYWJsZUNvbnRleHRUeXBlLCBzdHJpbmdbXV0ge1xuICBjb25zdCB0ZXN0ID0gdXNlQ29udGV4dChFbmFibGVDb250ZXh0KTtcblxuICAvLyBXZSBtZW1vaXplIGp1c3QgdG8gcHJldmVudCByZS1yZW5kZXJzIHNpbmNlIHRoaXMgY291bGQgYmUgYXQgdGhlIGxlYWYgb2YgYSB0cmVlXG4gIGNvbnN0IGNvbnZlcnRlZCA9IHVzZU1lbW8oKCkgPT4gKGlucHV0ID09IG51bGwgPyBbXSA6IEFycmF5LmlzQXJyYXkoaW5wdXQpID8gaW5wdXQgOiBbaW5wdXRdKSwgW2lucHV0XSk7XG5cbiAgcmV0dXJuIFt0ZXN0LCBjb252ZXJ0ZWRdO1xufVxuIiwgImltcG9ydCB7IHVzZVRlc3RBbmRDb252ZXJ0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogcmV0dXJucyB0cnVlIGlmZiBhbGwgc3BlY2lmaWVkIGZlYXR1cmVzIGFyZSBlbmFibGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VBbGxFbmFibGVkKGFsbEZlYXR1cmVzOiBzdHJpbmdbXSB8IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBbdGVzdCwgcXVlcnlBbGxQcmVzZW50XSA9IHVzZVRlc3RBbmRDb252ZXJ0KGFsbEZlYXR1cmVzKTtcbiAgcmV0dXJuIHF1ZXJ5QWxsUHJlc2VudC5sZW5ndGggPiAwICYmIHF1ZXJ5QWxsUHJlc2VudC5ldmVyeSh0ZXN0KTtcbn1cbiIsICJpbXBvcnQgeyB1c2VUZXN0QW5kQ29udmVydCB9IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIHJldHVybnMgdHJ1ZSBpZmYgYW55IHNwZWNpZmllZCBmZWF0dXJlIGlzIGVuYWJsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUVuYWJsZWQoZmVhdHVyZTogc3RyaW5nW10gfCBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgW3Rlc3QsIHF1ZXJ5QW55UHJlc2VudF0gPSB1c2VUZXN0QW5kQ29udmVydChmZWF0dXJlKTtcbiAgcmV0dXJuIHF1ZXJ5QW55UHJlc2VudC5zb21lKHRlc3QpO1xufVxuIiwgImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgeyBFbmFibGVQcm9wcyB9IGZyb20gXCIuL0VuYWJsZVwiO1xuaW1wb3J0IHsgdXNlQWxsRGlzYWJsZWQgfSBmcm9tIFwiLi91c2VBbGxEaXNhYmxlZFwiO1xuaW1wb3J0IHsgdXNlRGlzYWJsZWQgfSBmcm9tIFwiLi91c2VEaXNhYmxlZFwiO1xuXG4vKipcbiAqIEZlYXR1cmUgd2lsbCBiZSBkaXNhYmxlZCBpZiBhbnkgaW4gdGhlIGxpc3QgYXJlIGVuYWJsZWRcbiAqL1xuZXhwb3J0IGNvbnN0IERpc2FibGU6IFJlYWN0LkZDPEVuYWJsZVByb3BzPiA9ICh7XG4gIGZlYXR1cmUgPSBbXSxcbiAgYWxsRmVhdHVyZXMgPSBbXSxcbiAgY2hpbGRyZW5cbn0pID0+IHtcbiAgY29uc3QgaXNBbnkgPSB1c2VEaXNhYmxlZChmZWF0dXJlKTtcbiAgY29uc3QgaXNBbGwgPSB1c2VBbGxEaXNhYmxlZChhbGxGZWF0dXJlcyk7XG5cbiAgaWYgKGlzQW55IHx8IGlzQWxsKSB7XG4gICAgcmV0dXJuIDw+e2NoaWxkcmVufTwvPjtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcbiIsICJpbXBvcnQgeyB1c2VUZXN0QW5kQ29udmVydCB9IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIHJldHVybnMgdHJ1ZSBpZmYgYWxsIHNwZWNpZmllZCBmZWF0dXJlcyBhcmUgZGlzYWJsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFsbERpc2FibGVkKHdpdGhvdXRBbGw6IHN0cmluZ1tdIHwgc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IFt0ZXN0LCBxdWVyeUFsbFdpdGhvdXRdID0gdXNlVGVzdEFuZENvbnZlcnQod2l0aG91dEFsbCk7XG4gIHJldHVybiB3aXRob3V0QWxsLmxlbmd0aCA+IDAgJiYgcXVlcnlBbGxXaXRob3V0LmV2ZXJ5KCh4KSA9PiAhKHRlc3QoeCkgPz8gZmFsc2UpKTtcbn1cbiIsICJpbXBvcnQgeyB1c2VUZXN0QW5kQ29udmVydCB9IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIHJldHVybnMgdHJ1ZSBpZmYgYW55IHNwZWNpZmllZCBmZWF0dXJlIGlzIGRpc2FibGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VEaXNhYmxlZCh3aXRob3V0OiBzdHJpbmdbXSB8IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBbdGVzdCwgcXVlcnlBbnlXaXRob3V0XSA9IHVzZVRlc3RBbmRDb252ZXJ0KHdpdGhvdXQpO1xuICByZXR1cm4gcXVlcnlBbnlXaXRob3V0LnNvbWUoKHgpID0+ICEodGVzdCh4KSA/PyBmYWxzZSkpO1xufVxuIiwgImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlQ2FsbGJhY2ssIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuXG5pbXBvcnQgeyBSYWRpb0dyb3VwIH0gZnJvbSAnQGhlYWRsZXNzdWkvcmVhY3QnO1xuXG5pbXBvcnQgeyBGZWF0dXJlQ29udGV4dCB9IGZyb20gJy4vRmVhdHVyZUNvbnRleHQnO1xuaW1wb3J0IHsgdmFsdWVPZkZlYXR1cmUgfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuaW1wb3J0IHsgRmVhdHVyZURlc2NyaXB0aW9uIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuLy8gQHRzLWV4cGVjdC1lcnJvciBidW5kbGVyIHdpbGwgdGFrZSBjYXJlIG9mIHRoaXNcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi90YWlsd2luZC5jc3MnO1xuXG5mdW5jdGlvbiBjbGFzc05hbWVzKC4uLmNsYXNzZXM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIGNsYXNzZXMuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gVG9nZ2xlRmVhdHVyZSh7IGZlYXR1cmUgfTogeyBmZWF0dXJlOiBGZWF0dXJlRGVzY3JpcHRpb24gfSk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEZlYXR1cmVDb250ZXh0KTtcbiAgY29uc3QgaGFuZGxlQ2hhbmdlU2VsZWN0aW9uID0gdXNlQ2FsbGJhY2soXG4gICAgKHZhbHVlOiAnZmFsc2UnIHwgJ3RydWUnIHwgJ3Vuc2V0JykgPT4ge1xuICAgICAgaWYgKGNvbnRleHQ/Lm92ZXJyaWRlc1NlbmQgIT0gbnVsbCkge1xuICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgICAgY2FzZSAndHJ1ZSc6IHtcbiAgICAgICAgICAgIGNvbnRleHQub3ZlcnJpZGVzU2VuZCh7IHR5cGU6ICdFTkFCTEUnLCBuYW1lOiBmZWF0dXJlLm5hbWUgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FzZSAnZmFsc2UnOiB7XG4gICAgICAgICAgICBjb250ZXh0Lm92ZXJyaWRlc1NlbmQoeyB0eXBlOiAnRElTQUJMRScsIG5hbWU6IGZlYXR1cmUubmFtZSB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlICd1bnNldCc6IHtcbiAgICAgICAgICAgIGNvbnRleHQub3ZlcnJpZGVzU2VuZCh7IHR5cGU6ICdVTlNFVCcsIG5hbWU6IGZlYXR1cmUubmFtZSB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgW2ZlYXR1cmUubmFtZSwgY29udGV4dF1cbiAgKTtcblxuICBpZiAoY29udGV4dCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB7IG92ZXJyaWRlc1N0YXRlLCB0ZXN0OiB0ZXN0RmVhdHVyZSwgZGVmYXVsdHNTdGF0ZSB9ID0gY29udGV4dDtcblxuICBjb25zdCB2YWx1ZUluRGVmYXVsdHMgPSAodmFsdWVPZkZlYXR1cmUoZGVmYXVsdHNTdGF0ZSwgZmVhdHVyZS5uYW1lKVswXSA/PyAndW5zZXQnKS50b1N0cmluZygpIGFzXG4gICAgfCAnZmFsc2UnXG4gICAgfCAndHJ1ZSdcbiAgICB8ICd1bnNldCc7XG5cbiAgY29uc3QgdmFsdWVJbk92ZXJyaWRlcyA9ICh2YWx1ZU9mRmVhdHVyZShvdmVycmlkZXNTdGF0ZSwgZmVhdHVyZS5uYW1lKVswXSA/PyAndW5zZXQnKS50b1N0cmluZygpIGFzXG4gICAgfCAnZmFsc2UnXG4gICAgfCAndHJ1ZSdcbiAgICB8ICd1bnNldCc7XG5cbiAgY29uc3QgYWN0dWFsQ2hlY2tlZCA9IHRlc3RGZWF0dXJlKGZlYXR1cmUubmFtZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8UmFkaW9Hcm91cCBkaXNhYmxlZD17ZmVhdHVyZS5ub092ZXJyaWRlfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlU2VsZWN0aW9ufSB2YWx1ZT17dmFsdWVJbk92ZXJyaWRlc30+XG4gICAgICA8UmFkaW9Hcm91cC5MYWJlbD5cbiAgICAgICAgPGg2IGNsYXNzTmFtZT1cInRleHQtZ3JheS05MDAgYWxpZ24tY2VudGVyIGZsZXggZmxleC1yb3cgZmxleC1ub3dyYXAgaXRlbXMtY2VudGVyIGdhcC0yIGxnOmdhcC00IGgtN1wiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbWVkaXVtXCI+XG4gICAgICAgICAgICBGZWF0dXJlOiA8Y29kZT57ZmVhdHVyZS5uYW1lfTwvY29kZT5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAge2ZlYXR1cmUubm9PdmVycmlkZSA9PT0gdHJ1ZSA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLW9yYW5nZS01MDAgdGV4dC1vcmFuZ2UtNTAwIGZsZXggZmxleC1ub3dyYXAgdGV4dC14cyBmbGV4LXJvdyBnYXAtMSByb3VuZGVkLXNtIGJvcmRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcHgtMiBweS0xXCI+XG4gICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImgtNCB3LTQgbWluLXctNFwiXG4gICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgY2xpcFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgIGQ9XCJNNSA5VjdhNSA1IDAgMDExMCAwdjJhMiAyIDAgMDEyIDJ2NWEyIDIgMCAwMS0yIDJINWEyIDIgMCAwMS0yLTJ2LTVhMiAyIDAgMDEyLTJ6bTgtMnYySDdWN2EzIDMgMCAwMTYgMHpcIlxuICAgICAgICAgICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgPGRpdj5ObyBPdmVycmlkZXM8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHthY3R1YWxDaGVja2VkID09PSB0cnVlID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtbm93cmFwIHRleHQteHMgdGV4dC1ncmVlbi01MDAgZmxleC1yb3cgZ2FwLTEgcm91bmRlZC1zbSBib3JkZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJvcmRlci1ncmVlbi01MDAgcHgtMiBweS0xXCI+XG4gICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImgtNCB3LTQgbWluLXctNFwiXG4gICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgY2xpcFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgIGQ9XCJNMTAgMThhOCA4IDAgMTAwLTE2IDggOCAwIDAwMCAxNnptMy43MDctOS4yOTNhMSAxIDAgMDAtMS40MTQtMS40MTRMOSAxMC41ODYgNy43MDcgOS4yOTNhMSAxIDAgMDAtMS40MTQgMS40MTRsMiAyYTEgMSAwIDAwMS40MTQgMGw0LTR6XCJcbiAgICAgICAgICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgIDxkaXY+e2FjdHVhbENoZWNrZWQgPyAnRW5hYmxlZCcgOiAnRGlzYWJsZWQnfTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvaDY+XG4gICAgICAgIHtmZWF0dXJlLmRlc2NyaXB0aW9uID09IG51bGwgPyBudWxsIDogPHAgY2xhc3NOYW1lPVwidGV4dC1iYXNlIHRleHQtZ3JheS01MDAgdGV4dC1zbVwiPntmZWF0dXJlLmRlc2NyaXB0aW9ufTwvcD59XG4gICAgICA8L1JhZGlvR3JvdXAuTGFiZWw+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgZ3JpZCBncmlkLWNvbHMtMSBnYXAteS02IHNtOmdyaWQtY29scy0zIHNtOmdhcC14LTRcIj5cbiAgICAgICAge1tcbiAgICAgICAgICB7IGlkOiAnZmFsc2UnLCB0aXRsZTogYERpc2FibGUgJHtmZWF0dXJlLm5hbWV9YCwgZGVzY3JpcHRpb246ICdPdmVycmlkZSB0aGUgZmVhdHVyZSB0byBiZSBkaXNhYmxlZCcgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3Vuc2V0JyxcbiAgICAgICAgICAgIHRpdGxlOiAnRGVmYXVsdCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0luaGVyaXQgZW5hYmxlZCBzdGF0ZSBmcm9tIGRlZmF1bHRzJyxcbiAgICAgICAgICAgIGRpc2FibGVkOiAoZmVhdHVyZS5ub092ZXJyaWRlID8/IGZhbHNlKSB8fCBmZWF0dXJlLmZvcmNlLFxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOlxuICAgICAgICAgICAgICB2YWx1ZUluRGVmYXVsdHMgPT09ICd0cnVlJyA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtZ3JlZW4tNTAwIGJvcmRlci1ncmVlbi01MDAgZmxleCBmbGV4LW5vd3JhcCB0ZXh0LXhzIGZsZXgtcm93IGdhcC0xIHJvdW5kZWQtc20gYm9yZGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBweC0yIHB5LTFcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPkVuYWJsZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDAgYm9yZGVyLXJlZC01MDAgZmxleCBmbGV4LW5vd3JhcCB0ZXh0LXhzIGZsZXgtcm93IGdhcC0xIHJvdW5kZWQtc20gYm9yZGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBweC0yIHB5LTFcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPkRpc2FibGVkPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyBpZDogJ3RydWUnLCB0aXRsZTogYEVuYWJsZSAke2ZlYXR1cmUubmFtZX1gLCBkZXNjcmlwdGlvbjogJ092ZXJyaWRlIHRoZSBmZWF0dXJlIHRvIGJlIGVuYWJsZWQnIH0sXG4gICAgICAgIF0ubWFwKChvcHRpb24pID0+IChcbiAgICAgICAgICA8UmFkaW9Hcm91cC5PcHRpb25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17KHsgY2hlY2tlZCwgYWN0aXZlLCBkaXNhYmxlZCB9KSA9PlxuICAgICAgICAgICAgICBjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgIGNoZWNrZWQgPyAnYm9yZGVyLXRyYW5zcGFyZW50JyA6ICdib3JkZXItZ3JheS0zMDAnLFxuICAgICAgICAgICAgICAgICFkaXNhYmxlZCAmJiBhY3RpdmUgPyAnYm9yZGVyLWJsdWUtNTAwIHJpbmctMiByaW5nLWJsdWUtNTAwJyA6ICcnLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkID8gJ2JvcmRlci10cmFuc3BhcmVudCByaW5nLWdyYXktNTAwIGN1cnNvci1ub3QtYWxsb3dlZCcgOiAnY3Vyc29yLXBvaW50ZXInLFxuICAgICAgICAgICAgICAgICdyZWxhdGl2ZSBiZy13aGl0ZSBib3JkZXIgcm91bmRlZC1sZyBzaGFkb3ctc20gcC0zIGZsZXggZm9jdXM6b3V0bGluZS1ub25lJ1xuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXNhYmxlZD17b3B0aW9uLmRpc2FibGVkfVxuICAgICAgICAgICAga2V5PXtvcHRpb24uaWR9XG4gICAgICAgICAgICB2YWx1ZT17b3B0aW9uLmlkfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsoeyBjaGVja2VkLCBhY3RpdmUsIGRpc2FibGVkIH0pID0+IChcbiAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ3Jvd1wiPlxuICAgICAgICAgICAgICAgICAgPFJhZGlvR3JvdXAuTGFiZWwgYXM9XCJzcGFuXCIgY2xhc3NOYW1lPVwiZmxleCBmbGV4LW5vd3JhcCBmbGV4LXJvdyBnYXAtMSBpdGVtcy1jZW50ZXIgc3BhY2UtYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS05MDAgZ3JvdyBzaHJpbmtcIj57b3B0aW9uLnRpdGxlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAge29wdGlvbi5kZWZhdWx0VmFsdWUgIT0gbnVsbCA/IG9wdGlvbi5kZWZhdWx0VmFsdWUgOiBudWxsfVxuICAgICAgICAgICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoIWNoZWNrZWQgPyAnaW52aXNpYmxlJyA6ICcnLCAnaC01IHctNSB0ZXh0LWJsdWUtNTAwIG1pbi13LTQnKX1cbiAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgZD1cIk0xMCAxOGE4IDggMCAxMDAtMTYgOCA4IDAgMDAwIDE2em0zLjcwNy05LjI5M2ExIDEgMCAwMC0xLjQxNC0xLjQxNEw5IDEwLjU4NiA3LjcwNyA5LjI5M2ExIDEgMCAwMC0xLjQxNCAxLjQxNGwyIDJhMSAxIDAgMDAxLjQxNCAwbDQtNHpcIlxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgIDwvUmFkaW9Hcm91cC5MYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxSYWRpb0dyb3VwLkRlc2NyaXB0aW9uIGFzPVwic3BhblwiIGNsYXNzTmFtZT1cIm10LTEgZmxleCBpdGVtcy1jZW50ZXIgdGV4dC1zbSB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAgICAgICAgICAgIHtvcHRpb24uZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgICA8L1JhZGlvR3JvdXAuRGVzY3JpcHRpb24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhcbiAgICAgICAgICAgICAgICAgICAgIWRpc2FibGVkICYmIGFjdGl2ZSA/ICdib3JkZXInIDogJ2JvcmRlci0yJyxcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZCA/IChkaXNhYmxlZCA/ICdib3JkZXItZ3JheS01MDAnIDogJ2JvcmRlci1ibHVlLTUwMCcpIDogJ2JvcmRlci10cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgICdhYnNvbHV0ZSAtaW5zZXQtcHggcm91bmRlZC1sZyBwb2ludGVyLWV2ZW50cy1ub25lJ1xuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9SYWRpb0dyb3VwLk9wdGlvbj5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICA8L1JhZGlvR3JvdXA+XG4gICk7XG59XG5cbmZ1bmN0aW9uIFNoYWRvd0NvbnRlbnQoeyByb290LCBjaGlsZHJlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdE5vZGU7IHJvb3Q6IEVsZW1lbnQgfSkge1xuICByZXR1cm4gUmVhY3RET00uY3JlYXRlUG9ydGFsKGNoaWxkcmVuLCByb290KTtcbn1cblxuLy8vIFBlcm1pdCB1c2VycyB0byBvdmVycmlkZSBmZWF0dXJlIGZsYWdzIHZpYSBhIEdVSS5cbi8vLyBSZW5kZXJzIGEgc21hbGwgZmxvYXRpbmcgYnV0dG9uIGluIGxvd2VyIGxlZnQgb3IgcmlnaHQsIHByZXNzaW5nIGl0IGJyaW5ncyB1cFxuLy8vIGEgbGlzdCBvZiBmZWF0dXJlcyB0byB0b2dnbGUgYW5kIHRoZWlyIGN1cnJlbnQgb3ZlcnJpZGUgc3RhdGUuIHlvdSBjYW4gb3ZlcnJpZGUgb24gb3Igb3ZlcnJpZGUgb2ZmLFxuLy8vIG9yIHVuc2V0IHRoZSBvdmVycmlkZSBhbmQgZ28gYmFjayB0byBkZWZhdWx0IHZhbHVlLlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5leHBvcnQgZnVuY3Rpb24gVG9nZ2xlRmVhdHVyZXMoeyBkZWZhdWx0T3BlbiA9IGZhbHNlIH06IHsgZGVmYXVsdE9wZW4/OiBib29sZWFuIH0pOiBKU1guRWxlbWVudCB8IG51bGwge1xuICBjb25zdCBbcm9vdCwgc2V0Q29yZVJvb3RdID0gdXNlU3RhdGU8SFRNTERpdkVsZW1lbnQgfCBudWxsPihudWxsKTtcblxuICBjb25zdCBzZXRSb290ID0gKGhvc3Q6IEhUTUxEaXZFbGVtZW50IHwgbnVsbCkgPT4ge1xuICAgIGlmIChob3N0ID09IG51bGwgfHwgcm9vdCAhPSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNoYWRvd1Jvb3QgPSBob3N0Py5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIGNvbnN0IHJlbmRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0eWxlLnRleHRDb250ZW50ID0gc3R5bGVzO1xuICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQocmVuZGVyRGl2KTtcbiAgICBzZXRDb3JlUm9vdChyZW5kZXJEaXYpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiByZWY9e3NldFJvb3R9IHN0eWxlPXt7IHpJbmRleDogOTk5OTksIHBvc2l0aW9uOiAnZml4ZWQnLCB3aWR0aDogJzAnLCBoZWlnaHQ6ICcwJywgYm90dG9tOiAwIH19PlxuICAgICAge3Jvb3QgIT0gbnVsbCA/IChcbiAgICAgICAgPFNoYWRvd0NvbnRlbnQgcm9vdD17cm9vdH0+XG4gICAgICAgICAgPFRvZ2dsZUZlYXR1cmVVbndyYXBwZWQgZGVmYXVsdE9wZW49e2RlZmF1bHRPcGVufSAvPlxuICAgICAgICA8L1NoYWRvd0NvbnRlbnQ+XG4gICAgICApIDogbnVsbH1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuLy8vIExpa2UgVG9nZ2xlRmVhdHVyZXMsIGJ1dCBkb2VzIG5vdCBpbmplY3Qgc3R5bGVzIGludG8gYSBzaGFkb3cgRE9NIHJvb3Qgbm9kZS5cbi8vLyB1c2VmdWwgaWYgeW91J3JlIHVzaW5nIHRhaWx3aW5kLlxuZXhwb3J0IGZ1bmN0aW9uIFRvZ2dsZUZlYXR1cmVVbndyYXBwZWQoeyBkZWZhdWx0T3BlbiA9IGZhbHNlIH06IHsgZGVmYXVsdE9wZW4/OiBib29sZWFuIH0pOiBKU1guRWxlbWVudCB8IG51bGwge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShkZWZhdWx0T3Blbik7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEZlYXR1cmVDb250ZXh0KTtcblxuICBpZiAoY29udGV4dCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBXZSB3YW50OiBSZWFsIHZhbHVlIGFmdGVyIGFsbCBuZXN0aW5ncywgdmFsdWUgb2YgdGhlIG92ZXJyaWRlLiB3ZSB0b2dnbGUgb3ZlcnJpZGVcbiAgY29uc3QgeyBmZWF0dXJlc0Rlc2NyaXB0aW9uIH0gPSBjb250ZXh0O1xuXG4gIGlmIChmZWF0dXJlc0Rlc2NyaXB0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGJvdHRvbS0wIGxlZnQtMCBteC00IG15LTRcIj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciB0ZXh0LXNtIGZvbnQtbWVkaXVtIHAtMSBoLTggdy04IGFsaWduLW1pZGRsZSBjdXJzb3ItcG9pbnRlciByb3VuZGVkLWZ1bGwgYmctYmx1ZS02MDAgdGV4dC13aGl0ZSAgYm9yZGVyIGJvcmRlci10cmFuc3BhcmVudCBqdXN0aWZ5LWNlbnRlciB0ZXh0LWJhc2UgZm9udC1tZWRpdW0gZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOnJpbmctMiBmb2N1czpyaW5nLW9mZnNldC0yIGZvY3VzOnJpbmctYmx1ZS02MDAgc206dGV4dC1zbVwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0T3Blbih0cnVlKX1cbiAgICAgICAgICB0aXRsZT1cIlRvZ2dsZSBmZWF0dXJlc1wiXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgID5cbiAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ3LTYgaC02IG1pbi1oLTYgbWluLXctNlwiXG4gICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjAgMjBcIlxuICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgY2xpcFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgZD1cIk0zIDZhMyAzIDAgMDEzLTNoMTBhMSAxIDAgMDEuOCAxLjZMMTQuMjUgOGwyLjU1IDMuNEExIDEgMCAwMTE2IDEzSDZhMSAxIDAgMDAtMSAxdjNhMSAxIDAgMTEtMiAwVjZ6XCJcbiAgICAgICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICB7IW9wZW4gPyBudWxsIDogKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIHotMTAgaW5zZXQtMCBvdmVyZmxvdy15LWF1dG9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtZW5kIGp1c3RpZnktZmxleC1zdGFydCBteC04IG15LTQgbWluLWgtc2NyZWVuIHB0LTQgcHgtNCBwYi0xMCBzbTpibG9jayBzbTpwLTBcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgaW5saW5lLWJsb2NrIGFsaWduLWJvdHRvbSBiZy13aGl0ZSByb3VuZGVkLWxnIHB4LTQgcHQtNSBwYi00IHRleHQtbGVmdCBvdmVyZmxvdy1oaWRkZW4gc2hhZG93LXhsIHRyYW5zZm9ybSB0cmFuc2l0aW9uLWFsbCBzbTpteS04IHNtOmFsaWduLW1pZGRsZSBzbTpwLTYgbGc6bWF4LXctWzgwJV0gbWF4LXctZnVsbFwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMSBzbTptdC0zXCI+XG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXJvdyBnYXAtNCBmbGV4LW5vd3JhcCBpdGVtcy1jZW50ZXIgc3BhY2UtYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyb3cgdGV4dC1sZyBsZWFkaW5nLTYgZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMFwiPkZlYXR1cmUgRmxhZyBPdmVycmlkZXM8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgRmVhdHVyZXMgY2FuIGJlIGVuYWJsZWQgb3IgZGlzYWJsZWQgdW5sZXNzIHRoZXkgYXJlIGZvcmNlZCB1cHN0cmVhbS4gWW91IGNhbiBhbHNvIHJldmVydCB0byBkZWZhdWx0LlxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC02XCI+XG4gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldCBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC05XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGxlZ2VuZCBjbGFzc05hbWU9XCJzci1vbmx5XCI+RmVhdHVyZSBGbGFnczwvbGVnZW5kPlxuICAgICAgICAgICAgICAgICAgICAgIHtmZWF0dXJlc0Rlc2NyaXB0aW9uLm1hcCgoZmVhdHVyZSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPFRvZ2dsZUZlYXR1cmUgZmVhdHVyZT17ZmVhdHVyZX0ga2V5PXtmZWF0dXJlLm5hbWV9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWNlbnRlciBpdGVtcy1jZW50ZXIgbXQtNSBzbTptdC02XCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgdGV4dC1zbSBmb250LW1lZGl1bSBwdC0wIHBiLTAgcHItNCBwbC00IGgtOCBsZWFkaW5nLTcgYWxpZ24tbWlkZGxlIGN1cnNvci1wb2ludGVyIHJvdW5kZWQtc20gYmctYmx1ZS02MDAgdGV4dC13aGl0ZSBib3JkZXIgYm9yZGVyLXRyYW5zcGFyZW50IGp1c3RpZnktY2VudGVyIHRleHQtYmFzZSBmb250LW1lZGl1bSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctb2Zmc2V0LTIgZm9jdXM6cmluZy1ibHVlLTYwMCBzbTp0ZXh0LXNtXCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKGZhbHNlKX1cbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIERvbmVcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogInFoQ0FBQSxrT0NBQSxNQUF1RixrQkNBdkYsTUFBbUYsa0JBWTVFLFdBQXVCLEVBQXFELENBWm5GLFFBYUUsTUFBTyxDQUNMLEVBQWEsUUFBUSxTQUFTLEVBQUksR0FBTyxFQUFhLFFBQVEsVUFBVSxFQUFJLEdBQVEsT0FDcEYsUUFBYSxRQUFRLGNBQXJCLGNBQWtDLFFBQWxDLE9BQTJDLEVBQzdDLENBQ0YsQ0E0RU8sR0FBTSxHQUFpQixvQkFBK0QsQ0FDM0YsR0FBSSxVQUNKLFFBQVMsVUFDVCxRQUFTLENBQUMsRUFDViwyQkFBNEIsR0FDNUIsR0FBSSxDQUNGLE9BQVEsQ0FDTixDQUFFLE9BQVEsZUFBZ0IsS0FBTSxBQUFDLEdBQUssQ0FwRzVDLE1Bb0crQyxZQUFJLGNBQUosY0FBaUIsa0JBQW1CLEtBQUssRUFDbEYsQ0FBRSxPQUFRLFNBQVUsQ0FDdEIsRUFFQSxPQUFRLENBQ04sQ0FBRSxPQUFRLGVBQWdCLEtBQU0sQUFBQyxHQUFLLENBekc1QyxNQXlHK0MsWUFBSSxjQUFKLGNBQWlCLGtCQUFtQixLQUFLLEVBQ2xGLENBQUUsT0FB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

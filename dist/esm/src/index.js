var $=Object.defineProperty;var B=Object.getOwnPropertySymbols;var Q=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable;var P=(t,e,r)=>e in t?$(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,U=(t,e)=>{for(var r in e||(e={}))Q.call(e,r)&&P(t,r,e[r]);if(B)for(var r of B(e))Z.call(e,r)&&P(t,r,e[r]);return t};var y=(t,e,r)=>new Promise((a,n)=>{var s=l=>{try{u(r.next(l))}catch(c){n(c)}},d=l=>{try{u(r.throw(l))}catch(c){n(c)}},u=l=>l.done?a(l.value):Promise.resolve(l.value).then(s,d);u((r=r.apply(t,e)).next())});import{assign as N,createMachine as ee,spawn as te}from"xstate";import{assign as C,createMachine as R}from"xstate";function G(t){var e,r;return[t.matches("enabled")?!0:t.matches("disabled")?!1:void 0,(r=(e=t.context.featureDesc)==null?void 0:e.force)!=null?r:!1]}var J=R({id:"feature",initial:"initial",context:{},on:{ENABLE:[{target:"asyncEnabled",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"enabled"}],TOGGLE:[{target:"asyncEnabled",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"enabled"}],DISABLE:[{target:"asyncDisabled",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"disabled"}],UNSET:[{target:"asyncUnspecied",cond:t=>{var e;return((e=t.featureDesc)==null?void 0:e.onChangeDefault)!=null}},{target:"unspecified"}],SET:[{target:"asyncEnabled",cond:(t,e)=>{var r;return e.value===!0&&((r=t.featureDesc)==null?void 0:r.onChangeDefault)!=null}},{target:"asyncDisabled",cond:(t,e)=>{var r;return e.value===!1&&((r=t.featureDesc)==null?void 0:r.onChangeDefault)!=null}},{target:"asyncUnspecied",cond:(t,e)=>{var r;return((r=t.featureDesc)==null?void 0:r.onChangeDefault)!=null}},{target:"enabled",cond:(t,e)=>e.value===!0},{target:"disabled",cond:(t,e)=>e.value===!1},{target:"unspecified"}]},states:{initial:{on:{INIT:[{actions:C({featureDesc:(t,e)=>e.feature}),target:"enabled",cond:(t,e)=>e.feature.defaultValue===!0},{actions:C({featureDesc:(t,e)=>e.feature}),target:"unspecified",cond:(t,e)=>e.feature.defaultValue===void 0},{actions:C({featureDesc:(t,e)=>e.feature}),target:"disabled",cond:(t,e)=>e.feature.defaultValue===!1}]}},unspecified:{},disabled:{},enabled:{},asyncDisabled:{invoke:{id:"set-off-upstream",src:t=>y(void 0,null,function*(){var r;let e=(r=t.featureDesc)==null?void 0:r.onChangeDefault;if(e!=null&&t.featureDesc!=null)return e(t.featureDesc.name,!1)}),onDone:[{target:"enabled",cond:(t,e)=>e.data===!0},{target:"disabled",cond:(t,e)=>e.data===!1},{target:"unspecified"}],onError:"unspecified"}},asyncUnspecied:{invoke:{id:"set-unset-upstream",src:t=>y(void 0,null,function*(){var r;let e=(r=t.featureDesc)==null?void 0:r.onChangeDefault;if(e!=null&&t.featureDesc!=null)return e(t.featureDesc.name,void 0)}),onDone:[{target:"enabled",cond:(t,e)=>e.data===!0},{target:"disabled",cond:(t,e)=>e.data===!1},{target:"unspecified"}],onError:"unspecified"}},asyncEnabled:{invoke:{id:"set-on-upstream",src:t=>y(void 0,null,function*(){var r;let e=(r=t.featureDesc)==null?void 0:r.onChangeDefault;if(e!=null&&t.featureDesc!=null)return e(t.featureDesc.name,!0)}),onDone:[{target:"enabled",cond:(t,e)=>e.data===!0},{target:"disabled",cond:(t,e)=>e.data===!1},{target:"unspecified"}],onError:"unspecified"}}}});function g(t,e){if(t.context.features[e]==null)return[void 0,!1];let r=t.context.features[e].getSnapshot();return r!=null?G(r):[void 0,!1]}var F=ee({id:"features",initial:"idle",context:{features:{}},states:{idle:{on:{INIT:{target:"ready",cond:(t,e)=>e.features.length>0,actions:N({features:(t,e)=>{let r={};for(let a of e.features)r[a.name]=te(J,{name:a.name,sync:!0}),r[a.name].send({type:"INIT",feature:a});return r}})}}},ready:{on:{DE_INIT:{target:"idle",actions:N({features:(t,e)=>({})})},SET_ALL:{actions:N({features:(t,e)=>{let r=U({},t.features);return Object.keys(r).forEach(a=>{var n;r[a].send({type:"SET",value:(n=e.features[a])!=null?n:void 0})}),r}})},SET:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"SET",value:e.value})}},TOGGLE:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"TOGGLE"})}},ENABLE:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"ENABLE"})}},DISABLE:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"DISABLE"})}},UNSET:{actions:(t,e)=>{let r=t.features[e.name];r!=null&&r.send({type:"UNSET"})}}}}}});import X,{useMemo as le,useEffect as H,useRef as de}from"react";import{useMachine as q}from"@xstate/react";import{createContext as re}from"react";var h=re(t=>!1);import{createContext as oe}from"react";var w=oe(null);import{useEffect as ae}from"react";var k=class{constructor(e,r,a){this.featureDesc=a,this.dispatch=e,this.testFeature=r}toggle(e){this.dispatch({type:"TOGGLE",name:e})}enable(e){this.dispatch({type:"ENABLE",name:e})}unset(e){this.dispatch({type:"UNSET",name:e})}disable(e){this.dispatch({type:"DISABLE",name:e})}setAll(e){this.dispatch({type:"SET_ALL",features:e})}listFeatures(){return this.featureDesc.map(e=>[e.name,this.testFeature(e.name)])}};function z(t,e,r,a){ae(()=>t?(window.feature=new k(a,r,e),()=>{window.feature!=null&&delete window.feature}):()=>{},[e,a,t,r])}import{useMemo as ne,useEffect as ie}from"react";var T="react-enable:feature-values";function A(t,e,r){let a=ne(()=>{let s={};if(r.matches("ready"))for(let d of e){let[u]=g(r,d.name);u!=null&&(s[d.name]=u)}return s},[e,r]),n=Object.keys(a).length===0||t==null?"{}":JSON.stringify({overrides:a});ie(()=>{try{t!=null&&r.matches("ready")&&t.setItem(T,n)}catch(s){}},[r,t,n])}import{useCallback as se}from"react";function I(t,e){let r=e.map(a=>g(a,t));for(let[a,n]of r)if(a!=null&&n)return a;for(let[a]of r)if(a!=null)return a}function V(t,e){return se(r=>I(r,[t,e]),[t,e])}function ue({children:t,features:e,disableConsole:r=!1,storage:a=window.sessionStorage}){let n=de(e),[s,d]=q(F),[u,l]=q(F);H(()=>(l({type:"INIT",features:e}),()=>{l({type:"DE_INIT"})}),[l,e]),H(()=>{let f={};if(a!=null)try{let i=a.getItem(T);i!=null&&(f=JSON.parse(i).overrides)}catch(i){console.error("error in localStorage",i)}return d({type:"INIT",features:n.current.filter(i=>i.noOverride!==!0).map(i=>{var p;return{name:i.name,description:i.description,defaultValue:(p=f==null?void 0:f[i.name])!=null?p:void 0}})}),()=>{d({type:"DE_INIT"})}},[n,d,a]),A(a,n.current,s);let c=V(s,u);z(!r,n.current,c,l);let v=le(()=>({overridesSend:d,defaultsSend:l,featuresDescription:n.current,overridesState:s,defaultsState:u,test:c}),[d,l,s,u,c]);return X.createElement(w.Provider,{value:v},X.createElement(h.Provider,{value:c},t))}import*as D from"react";import{useContext as ce,useMemo as pe}from"react";function m(t){let e=ce(h),r=pe(()=>t==null?[]:Array.isArray(t)?t:[t],[t]);return[e,r]}function L(t){let[e,r]=m(t);return r.length>0&&r.every(e)}function O(t){let[e,r]=m(t);return r.some(e)}function me({feature:t=[],allFeatures:e=[],children:r}){let a=O(t),n=L(e);return a||n?D.createElement(D.Fragment,null,r):null}import*as E from"react";function M(t){let[e,r]=m(t);return t.length>0&&r.every(a=>{var n;return!((n=e(a))!=null&&n)})}function _(t){let[e,r]=m(t);return r.some(a=>{var n;return!((n=e(a))!=null&&n)})}var fe=({feature:t=[],allFeatures:e=[],children:r})=>{let a=_(t),n=M(e);return a||n?E.createElement(E.Fragment,null,r):null};import o,{useContext as Y,useState as W,useCallback as be}from"react";import he from"react-dom";import{RadioGroup as x}from"@headlessui/react";var K=`/*
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

.mx-8 {
  margin-left: 2rem;
  margin-right: 2rem;
}

.my-8 {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
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
`;function j(...t){return t.filter(Boolean).join(" ")}function we({feature:t}){var c,v,f;let e=Y(w),r=be(i=>{if((e==null?void 0:e.overridesSend)!=null)switch(i){case"true":{e.overridesSend({type:"ENABLE",name:t.name});break}case"false":{e.overridesSend({type:"DISABLE",name:t.name});break}case"unset":{e.overridesSend({type:"UNSET",name:t.name});break}}},[t.name,e]);if(e==null)return null;let{overridesState:a,test:n,defaultsState:s}=e,d=((c=g(s,t.name)[0])!=null?c:"unset").toString(),u=((v=g(a,t.name)[0])!=null?v:"unset").toString(),l=n(t.name);return o.createElement(x,{disabled:t.noOverride,onChange:r,value:u},o.createElement(x.Label,null,o.createElement("h6",{className:"text-gray-900 align-center flex flex-row flex-nowrap items-center gap-2 lg:gap-4 h-7"},o.createElement("span",{className:"font-medium"},"Feature: ",o.createElement("code",null,t.name)),t.noOverride===!0?o.createElement("div",{className:"border-orange-500 text-orange-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"},o.createElement("svg",{"aria-hidden":"true",className:"h-4 w-4 min-w-4",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.createElement("path",{clipRule:"evenodd",d:"M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",fillRule:"evenodd"})),o.createElement("div",null,"No Overrides")):null,l===!0?o.createElement("div",{className:"flex flex-nowrap text-xs text-green-500 flex-row gap-1 rounded-sm border items-center justify-center border-green-500 px-2 py-1"},o.createElement("svg",{"aria-hidden":"true",className:"h-4 w-4 min-w-4",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.createElement("path",{clipRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",fillRule:"evenodd"})),o.createElement("div",null,l?"Enabled":"Disabled")):null),t.description==null?null:o.createElement("p",{className:"text-base text-gray-500 text-sm"},t.description)),o.createElement("div",{className:"mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"},[{id:"true",title:`Enable ${t.name}`,description:"Override the feature to be enabled"},{id:"unset",title:"Default",description:"Inherit enabled state from defaults",disabled:((f=t.noOverride)!=null?f:!1)||t.force,defaultValue:d==="true"?o.createElement("div",{className:"text-green-500 border-green-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"},o.createElement("span",null,"Enabled")):o.createElement("div",{className:"text-red-500 border-red-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1"},o.createElement("span",null,"Disabled"))},{id:"false",title:`Disable ${t.name}`,description:"Override the feature to be disabled"}].map(i=>o.createElement(x.Option,{className:({checked:p,active:S,disabled:b})=>j(p?"border-transparent":"border-gray-300",!b&&S?"border-blue-500 ring-2 ring-blue-500":"",b?"border-transparent ring-gray-500 cursor-not-allowed":"cursor-pointer","relative bg-white border rounded-lg shadow-sm p-3 flex focus:outline-none"),disabled:i.disabled,key:i.id,value:i.id},({checked:p,active:S,disabled:b})=>o.createElement(o.Fragment,null,o.createElement("div",{className:"flex flex-col grow"},o.createElement(x.Label,{as:"span",className:"flex flex-nowrap flex-row gap-1 items-center space-between"},o.createElement("span",{className:"text-sm font-medium text-gray-900 grow shrink"},i.title),i.defaultValue!=null?i.defaultValue:null,o.createElement("svg",{"aria-hidden":"true",className:j(p?"":"invisible","h-5 w-5 text-blue-500 min-w-4"),fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.createElement("path",{clipRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",fillRule:"evenodd"}))),o.createElement(x.Description,{as:"span",className:"mt-1 flex items-center text-sm text-gray-500"},i.description)),o.createElement("div",{"aria-hidden":"true",className:j(!b&&S?"border":"border-2",p?b?"border-gray-500":"border-blue-500":"border-transparent","absolute -inset-px rounded-lg pointer-events-none")}))))))}function xe({root:t,children:e}){return he.createPortal(e,t)}function ve({defaultOpen:t=!1}){let[e,r]=W(null);return o.createElement("div",{ref:n=>{if(n==null||e!=null)return;let s=n==null?void 0:n.attachShadow({mode:"open"}),d=document.createElement("style"),u=document.createElement("div");d.textContent=K,s.appendChild(d),s.appendChild(u),r(u)},style:{zIndex:99999,position:"fixed",width:"100%",height:"40px",bottom:0}},e!=null?o.createElement(xe,{root:e},o.createElement(ye,{defaultOpen:t})):null)}function ye({defaultOpen:t=!1}){let[e,r]=W(t),a=Y(w);if(a==null)return null;let{featuresDescription:n}=a;return n.length===0?null:o.createElement("div",{className:"relative"},o.createElement("div",{className:"absolute bottom-0 left-0 mx-8 my-8"},o.createElement("button",{className:"inline-flex items-center text-sm font-medium p-1 h-8 w-8 align-middle cursor-pointer rounded-full bg-blue-600 text-white  border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",onClick:()=>r(!0),title:"Toggle features",type:"button"},o.createElement("svg",{className:"w-6 h-6 min-h-6 min-w-6",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg"},o.createElement("path",{clipRule:"evenodd",d:"M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z",fillRule:"evenodd"})))),e?o.createElement("div",{className:"fixed z-10 inset-0 overflow-y-auto"},o.createElement("div",{className:"flex items-end justify-flex-start mx-8 my-4 min-h-screen pt-4 px-4 pb-10 sm:block sm:p-0"},o.createElement("div",{className:"relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 lg:max-w-[80%] max-w-full"},o.createElement("div",null,o.createElement("div",{className:"mt-1 sm:mt-3"},o.createElement("h3",{className:"flex flex-row gap-4 flex-nowrap items-center space-between"},o.createElement("div",{className:"grow text-lg leading-6 font-medium text-gray-900"},"Feature Flag Overrides")),o.createElement("p",{className:"text-sm text-gray-500"},"Features can be enabled or disabled unless they are forced upstream. You can also revert to default."),o.createElement("div",{className:"mt-6"},o.createElement("fieldset",{className:"flex flex-col gap-9"},o.createElement("legend",{className:"sr-only"},"Feature Flags"),n.map(s=>o.createElement(we,{feature:s,key:s.name})))),o.createElement("div",{className:"flex justify-center items-center mt-5 sm:mt-6"},o.createElement("button",{className:"inline-flex items-center text-sm font-medium pt-0 pb-0 pr-4 pl-4 h-8 leading-7 align-middle cursor-pointer rounded-sm bg-blue-600 text-white border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm",onClick:()=>r(!1),type:"button"},"Done"))))))):null)}export{fe as Disable,me as Enable,h as EnableContext,ue as Features,F as FeaturesMachine,ve as ToggleFeatures,M as useAllDisabled,L as useAllEnabled,_ as useDisabled,O as useEnabled};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL0ZlYXR1cmVzU3RhdGUudHN4IiwgIi4uLy4uLy4uL3NyYy9GZWF0dXJlU3RhdGUudHN4IiwgIi4uLy4uLy4uL3NyYy9GZWF0dXJlcy50c3giLCAiLi4vLi4vLi4vc3JjL0VuYWJsZUNvbnRleHQudHN4IiwgIi4uLy4uLy4uL3NyYy9GZWF0dXJlQ29udGV4dC50c3giLCAiLi4vLi4vLi4vc3JjL3VzZUNvbnNvbGVPdmVycmlkZS50c3giLCAiLi4vLi4vLi4vc3JjL0dsb2JhbEVuYWJsZS50c3giLCAiLi4vLi4vLi4vc3JjL3VzZVBlcnNpc3QudHN4IiwgIi4uLy4uLy4uL3NyYy91c2VUZXN0Q2FsbGJhY2sudHN4IiwgIi4uLy4uLy4uL3NyYy90ZXN0RmVhdHVyZS50c3giLCAiLi4vLi4vLi4vc3JjL0VuYWJsZS50c3giLCAiLi4vLi4vLi4vc3JjL3V0aWxzLnRzIiwgIi4uLy4uLy4uL3NyYy91c2VBbGxFbmFibGVkLnRzeCIsICIuLi8uLi8uLi9zcmMvdXNlRW5hYmxlZC50c3giLCAiLi4vLi4vLi4vc3JjL0Rpc2FibGUudHN4IiwgIi4uLy4uLy4uL3NyYy91c2VBbGxEaXNhYmxlZC50c3giLCAiLi4vLi4vLi4vc3JjL3VzZURpc2FibGVkLnRzeCIsICIuLi8uLi8uLi9zcmMvVG9nZ2xlRmVhdHVyZXMudHN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBBY3RvclJlZkZyb20sIEludGVycHJldGVyRnJvbSwgU3RhdGVGcm9tLCBhc3NpZ24sIGNyZWF0ZU1hY2hpbmUsIHNwYXduIH0gZnJvbSAneHN0YXRlJztcblxuaW1wb3J0IHsgRmVhdHVyZU1hY2hpbmUsIEZlYXR1cmVEZXNjcmlwdGlvbiwgRmVhdHVyZVZhbHVlLCB2YWx1ZUZvclN0YXRlIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZlYXR1cmVzQ29udGV4dCB7XG4gIC8vIGZlYXR1cmVzIGFyZSBsYXllcmVkOlxuICAvLyAgLSBkZWZhdWx0czogaWYgbm90aGluZyBlbHNlIG1hdGNoZXMsIHByb3ZpZGVkIGEgdmFsdWUgZm9yIGZlYXR1cmVcbiAgLy8gIC0gYnJvd3NlcjogYnJvd3Nlci1sb2NhbCB2YWx1ZXMgZm9yIGZlYXR1cmVzIChrZXB0IGluIGxvY2FsIHN0b3JhZ2UsIGV0YylcbiAgLy8gIC0gdXNlcjogdmFsdWVzIGZyb20gdGhlIHVzZXIncyBwcm9maWxlLCBpZiBhbnlcbiAgLy8gIC0gb3JnOiB2YWx1ZSBmcm9tIHRoZSBvcmcncyBwcm9maWxlLCBpZiBhbnlcbiAgZmVhdHVyZXM6IHsgW3g6IHN0cmluZ106IEFjdG9yUmVmRnJvbTx0eXBlb2YgRmVhdHVyZU1hY2hpbmU+IH07XG59XG5cbmV4cG9ydCB0eXBlIEZlYXR1cmVzQWN0aW9uID1cbiAgfCB7IHR5cGU6ICdERV9JTklUJyB9XG4gIHwgeyB0eXBlOiAnRElTQUJMRSc7IG5hbWU6IHN0cmluZyB9XG4gIHwgeyB0eXBlOiAnRU5BQkxFJzsgbmFtZTogc3RyaW5nIH1cbiAgfCB7IHR5cGU6ICdJTklUJzsgZmVhdHVyZXM6IHJlYWRvbmx5IEZlYXR1cmVEZXNjcmlwdGlvbltdIH1cbiAgfCB7IHR5cGU6ICdTRVRfQUxMJzsgZmVhdHVyZXM6IHsgW2tleTogc3RyaW5nXTogRmVhdHVyZVZhbHVlIH0gfVxuICB8IHsgdHlwZTogJ1NFVCc7IG5hbWU6IHN0cmluZzsgdmFsdWU6IEZlYXR1cmVWYWx1ZSB9XG4gIHwgeyB0eXBlOiAnVE9HR0xFJzsgbmFtZTogc3RyaW5nIH1cbiAgfCB7IHR5cGU6ICdVTlNFVCc7IG5hbWU6IHN0cmluZyB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIEZlYXR1cmVzVHlwZVN0YXRlIHtcbiAgdmFsdWU6ICdyZWFkeSc7XG4gIGNvbnRleHQ6IEZlYXR1cmVzQ29udGV4dDtcbn1cblxuZXhwb3J0IHR5cGUgRmVhdHVyZXNTdGF0ZSA9IFN0YXRlRnJvbTx0eXBlb2YgRmVhdHVyZXNNYWNoaW5lPjtcbmV4cG9ydCB0eXBlIEZlYXR1cmVzRGlzcGF0Y2ggPSBJbnRlcnByZXRlckZyb208dHlwZW9mIEZlYXR1cmVzTWFjaGluZT5bJ3NlbmQnXTtcblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlT2ZGZWF0dXJlKGZlYXR1cmVzU3RhdGU6IEZlYXR1cmVzU3RhdGUsIGZlYXR1cmU6IHN0cmluZyk6IFtGZWF0dXJlVmFsdWUsIGJvb2xlYW5dIHtcbiAgaWYgKGZlYXR1cmVzU3RhdGUuY29udGV4dC5mZWF0dXJlc1tmZWF0dXJlXSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFt1bmRlZmluZWQsIGZhbHNlXTtcbiAgfVxuICBjb25zdCBmZWF0dXJlU3RhdGUgPSBmZWF0dXJlc1N0YXRlLmNvbnRleHQuZmVhdHVyZXNbZmVhdHVyZV0uZ2V0U25hcHNob3QoKTtcbiAgaWYgKGZlYXR1cmVTdGF0ZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlRm9yU3RhdGUoZmVhdHVyZVN0YXRlKTtcbiAgfVxuICByZXR1cm4gW3VuZGVmaW5lZCwgZmFsc2VdO1xufVxuXG4vLy8gc3RhdGUgbWFjaGluZSB0aGF0IG1hbmFnZXMgYSBzZXQgb2YgZmVhdHVyZXMgd2l0aCB1c2VyLCBvcmcsIGFuZCBsb2NhbCBvdmVycmlkZXNcbmV4cG9ydCBjb25zdCBGZWF0dXJlc01hY2hpbmUgPSBjcmVhdGVNYWNoaW5lPEZlYXR1cmVzQ29udGV4dCwgRmVhdHVyZXNBY3Rpb24sIEZlYXR1cmVzVHlwZVN0YXRlPih7XG4gIGlkOiAnZmVhdHVyZXMnLFxuICBpbml0aWFsOiAnaWRsZScsXG4gIGNvbnRleHQ6IHtcbiAgICBmZWF0dXJlczoge30sXG4gIH0sXG4gIHN0YXRlczoge1xuICAgIGlkbGU6IHtcbiAgICAgIG9uOiB7XG4gICAgICAgIElOSVQ6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdyZWFkeScsXG4gICAgICAgICAgY29uZDogKF8sIGUpID0+IGUuZmVhdHVyZXMubGVuZ3RoID4gMCxcbiAgICAgICAgICBhY3Rpb25zOiBhc3NpZ24oe1xuICAgICAgICAgICAgZmVhdHVyZXM6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBmZWF0dXJlczogdHlwZW9mIGNvbnRleHQuZmVhdHVyZXMgPSB7fTtcblxuICAgICAgICAgICAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgZXZlbnQuZmVhdHVyZXMpIHtcbiAgICAgICAgICAgICAgICBmZWF0dXJlc1tmZWF0dXJlLm5hbWVdID0gc3Bhd24oRmVhdHVyZU1hY2hpbmUsIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGZlYXR1cmUubmFtZSxcbiAgICAgICAgICAgICAgICAgIHN5bmM6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZmVhdHVyZXNbZmVhdHVyZS5uYW1lXS5zZW5kKHsgdHlwZTogJ0lOSVQnLCBmZWF0dXJlIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBmZWF0dXJlcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICAvLyB0aGUgZmVhdHVyZXMgYXJlIGxvYWRlZCBhbmQgcmVhZHkgdG8gYmUgdXNlZFxuICAgIHJlYWR5OiB7XG4gICAgICBvbjoge1xuICAgICAgICBERV9JTklUOiB7IHRhcmdldDogJ2lkbGUnLCBhY3Rpb25zOiBhc3NpZ24oeyBmZWF0dXJlczogKF8sIF9fKSA9PiAoe30pIH0pIH0sXG4gICAgICAgIFNFVF9BTEw6IHtcbiAgICAgICAgICBhY3Rpb25zOiBhc3NpZ24oe1xuICAgICAgICAgICAgZmVhdHVyZXM6IChjdHgsIGUpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgZmVhdHVyZXMgPSB7IC4uLmN0eC5mZWF0dXJlcyB9O1xuICAgICAgICAgICAgICAvLyBBbGwgY29uZmlndXJlZCBmZWF0dXJlcyBhcmUgc2V0IHRvIG9uL29mZiBvciB1bmRlZmluZWRcbiAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZmVhdHVyZXMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBmZWF0dXJlc1tuYW1lXS5zZW5kKHsgdHlwZTogJ1NFVCcsIHZhbHVlOiBlLmZlYXR1cmVzW25hbWVdID8/IHVuZGVmaW5lZCB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBmZWF0dXJlcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gU2V0IGEgZmVhdHVyZSB0byBhIHZhbHVlXG4gICAgICAgIFNFVDoge1xuICAgICAgICAgIGFjdGlvbnM6IChjdHgsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZlYXR1cmUgPSBjdHguZmVhdHVyZXNbZS5uYW1lXTtcbiAgICAgICAgICAgIGlmIChmZWF0dXJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgZmVhdHVyZS5zZW5kKHsgdHlwZTogJ1NFVCcsIHZhbHVlOiBlLnZhbHVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gdG9nZ2xlIGEgZmVhdHVyZVxuICAgICAgICBUT0dHTEU6IHtcbiAgICAgICAgICBhY3Rpb25zOiAoY3R4LCBlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlID0gY3R4LmZlYXR1cmVzW2UubmFtZV07XG4gICAgICAgICAgICBpZiAoZmVhdHVyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIGZlYXR1cmUuc2VuZCh7IHR5cGU6ICdUT0dHTEUnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gd2hlbiBhIGZlYXR1cmUgaXMgZW5hYmxlZCwgc2VuZCB0aGUgZW5hYmxlIG1lc3NhZ2UgdG8gdGhlIGFjdG9yXG4gICAgICAgIEVOQUJMRToge1xuICAgICAgICAgIGFjdGlvbnM6IChjdHgsIGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZlYXR1cmUgPSBjdHguZmVhdHVyZXNbZS5uYW1lXTtcbiAgICAgICAgICAgIGlmIChmZWF0dXJlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgZmVhdHVyZS5zZW5kKHsgdHlwZTogJ0VOQUJMRScgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB3aGVuIGEgZmVhdHVyZSBpcyBkaXNhYmxlZCwgc2VuZCB0aGUgZGlzYWJsZSBtZXNzYWdlIHRvIHRoZSBhY3RvclxuICAgICAgICBESVNBQkxFOiB7XG4gICAgICAgICAgYWN0aW9uczogKGN0eCwgZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmVhdHVyZSA9IGN0eC5mZWF0dXJlc1tlLm5hbWVdO1xuICAgICAgICAgICAgaWYgKGZlYXR1cmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICBmZWF0dXJlLnNlbmQoeyB0eXBlOiAnRElTQUJMRScgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB3aGVuIGEgZmVhdHVyZSBpcyB1bnNldCwgc2VuZCB0aGUgdW5zZXQgbWVzc2FnZSB0byB0aGUgYWN0b3JcbiAgICAgICAgVU5TRVQ6IHtcbiAgICAgICAgICBhY3Rpb25zOiAoY3R4LCBlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlID0gY3R4LmZlYXR1cmVzW2UubmFtZV07XG4gICAgICAgICAgICBpZiAoZmVhdHVyZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIGZlYXR1cmUuc2VuZCh7IHR5cGU6ICdVTlNFVCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIiwgImltcG9ydCB7IGFzc2lnbiwgY3JlYXRlTWFjaGluZSwgRG9uZUludm9rZUV2ZW50LCBJbnRlcnByZXRlckZyb20sIFN0YXRlRnJvbSB9IGZyb20gJ3hzdGF0ZSc7XG5cbi8qKlxuICogRmVhdHVyZSBpcyBlaXRoZXIgb24sIG9mZiwgb3IgJ3Vuc2V0JyxcbiAqIHdoaWNoIG1lYW5zIGl0IHdpbGwgZ28gdG8gdGhlIGRlZmF1bHQgdmFsdWUgb3IgdGhlIGxlc3Mgc3BlY2lmaWMgdmFsdWUuXG4gKi9cbmV4cG9ydCB0eXBlIEZlYXR1cmVWYWx1ZSA9IGZhbHNlIHwgdHJ1ZSB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgRmVhdHVyZVN0YXRlID0gU3RhdGVGcm9tPHR5cGVvZiBGZWF0dXJlTWFjaGluZT47XG5leHBvcnQgdHlwZSBGZWF0dXJlRGlzcGF0Y2ggPSBJbnRlcnByZXRlckZyb208dHlwZW9mIEZlYXR1cmVNYWNoaW5lPlsnc2VuZCddO1xuXG4vLy8gR2l2ZW4gYSBmZWF0dXJlc3RhdGUsIGRldGVybWluZSB0aGUgdmFsdWUgKG9uLCBvZmYsIG9yIHVuc2V0KVxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlRm9yU3RhdGUoZmVhdHVyZVN0YXRlOiBGZWF0dXJlU3RhdGUpOiBbRmVhdHVyZVZhbHVlLCBib29sZWFuXSB7XG4gIHJldHVybiBbXG4gICAgZmVhdHVyZVN0YXRlLm1hdGNoZXMoJ2VuYWJsZWQnKSA/IHRydWUgOiBmZWF0dXJlU3RhdGUubWF0Y2hlcygnZGlzYWJsZWQnKSA/IGZhbHNlIDogdW5kZWZpbmVkLFxuICAgIGZlYXR1cmVTdGF0ZS5jb250ZXh0LmZlYXR1cmVEZXNjPy5mb3JjZSA/PyBmYWxzZSxcbiAgXTtcbn1cblxuLyoqXG4gKiBEZWZpbml0aW9uIG9mIGEgZmVhdHVyZSB0aGF0IGNhbiBiZSBlbmFibGVkIG9yIGRpc2FibGVkLlxuICogSyBpcyB0aGUgdHlwZSBvZiB0aGUga2V5IHRoYXQgaXMgdXNlZCB0byBpZGVudGlmeSB0aGUgZmVhdHVyZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGZWF0dXJlRGVzY3JpcHRpb248SyBleHRlbmRzIHN0cmluZyA9IHN0cmluZz4ge1xuICByZWFkb25seSBuYW1lOiBLO1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvLy8gSWYgc2V0LCB3aWxsIGJlIHVzZWQgdG8gdXBkYXRlIHRoZSBmZWF0dXJlIGRlZmF1bHQgc3RhdGUgaW5zdGVhZCBvZiBzaW1wbHkgb3ZlcnJpZGluZy5cbiAgLy8vIEZvciBleGFtcGxlLCB5b3UgbWlnaHQgdXNlIHRoaXMgdG8gdXBkYXRlIGEgZmVhdHVyZSBmbGFnIG9uIGEgYmFja2VuZCBzZXJ2ZXIuXG4gIC8vLyB3aGVuIHNldCwgdGhlIGZlYXR1cmUgd2lsbCBiZSB1cGRhdGVkIG9uIHRoZSBiYWNrZW5kIHNlcnZlciwgYW5kIHRoZSByZXN1bHQgb2YgdGhlIGFzeW5jXG4gIC8vLyB3aWxsIGJlIHVzZWQgZm9yIHRoZSBmaW5hbCBzdGF0ZSBhZnRlciB0aGUgY2hhbmdlLiB3aGlsZSBjaGFuZ2luZywgdGhlIGZlYXR1cmUgd2lsbCBiZVxuICAvLy8gaW4gdGhlICdjaGFuZ2luZycgc3RhdGUuIEFsc28gbm90ZSB0aGF0IHRoZSBmZWF0dXJlIHdpbGwgYmUgY2hhbmdlZCBhdCB0aGUgXCJkZWZhdWx0XCIgbGF5ZXIuXG4gIHJlYWRvbmx5IG9uQ2hhbmdlRGVmYXVsdD86IChuYW1lOiBLLCBuZXdWYWx1ZTogRmVhdHVyZVZhbHVlKSA9PiBQcm9taXNlPEZlYXR1cmVWYWx1ZT47XG5cbiAgLy8vIGlmIHNldCB0cnVlLCB3aWxsIGZvcmNlIHRoZSBmaWVsZCB0byB3aGF0IGl0IGlzIHNldCBoZXJlIHRocm91Z2ggbGF5ZXJzIG9mIHN0YXRlcy5cbiAgLy8vIHVzZWZ1bCB0byBpbnZlcnQgdGhlIGxheWVycywgc2ltaWxhciB0byAhaW1wb3J0YW50IGluIENTUy5cbiAgcmVhZG9ubHkgZm9yY2U/OiBib29sZWFuO1xuXG4gIC8vLyBJZiBzZXQgdG8gdHJ1ZSwgdGhlIGZlYXR1cmUgd2lsbCBub3QgYmUgb3ZlcnJpZGFibGUgYnkgdGhlIHVzZXIuXG4gIHJlYWRvbmx5IG5vT3ZlcnJpZGU/OiBib29sZWFuO1xuXG4gIC8vLyBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHdoYXQgc2hvdWxkIGhhcHBlbiBpZiB0aGUgZmVhdHVyZSBpcyBub3Qgc2V0IHRvIGEgcGFydGljdWxhciB2YWx1ZS5cbiAgcmVhZG9ubHkgZGVmYXVsdFZhbHVlPzogRmVhdHVyZVZhbHVlO1xufVxuXG5pbnRlcmZhY2UgRmVhdHVyZUNvbnRleHQge1xuICBmZWF0dXJlRGVzYz86IEZlYXR1cmVEZXNjcmlwdGlvbjtcbn1cblxudHlwZSBGZWF0dXJlVHlwZVN0YXRlID1cbiAgfCB7XG4gICAgICB2YWx1ZTogJ2FzeW5jRGVuYWJsZWQnO1xuICAgICAgY29udGV4dDogRmVhdHVyZUNvbnRleHQ7XG4gICAgfVxuICB8IHtcbiAgICAgIHZhbHVlOiAnYXN5bmNEaXNhYmxlZCc7XG4gICAgICBjb250ZXh0OiBGZWF0dXJlQ29udGV4dDtcbiAgICB9XG4gIHwge1xuICAgICAgdmFsdWU6ICdhc3luY1Vuc3BlY2llZCc7XG4gICAgICBjb250ZXh0OiBGZWF0dXJlQ29udGV4dDtcbiAgICB9XG4gIHwge1xuICAgICAgdmFsdWU6ICdkaXNhYmxlZCc7XG4gICAgICBjb250ZXh0OiBGZWF0dXJlQ29udGV4dDtcbiAgICB9XG4gIHwge1xuICAgICAgdmFsdWU6ICdlbmFibGVkJztcbiAgICAgIGNvbnRleHQ6IEZlYXR1cmVDb250ZXh0O1xuICAgIH1cbiAgfCB7XG4gICAgICB2YWx1ZTogJ2luaXRpYWwnO1xuICAgICAgY29udGV4dDogbmV2ZXI7XG4gICAgfVxuICB8IHtcbiAgICAgIHZhbHVlOiAndW5zcGVjaWVkJztcbiAgICAgIGNvbnRleHQ6IEZlYXR1cmVDb250ZXh0O1xuICAgIH07XG5cbi8qKlxuICogQWN0aW9ucyB0aGF0IGNhbiBiZSBwZXJmb3JtZWQgb24gYSBmZWF0dXJlLlxuICovXG5leHBvcnQgdHlwZSBGZWF0dXJlQWN0aW9uID1cbiAgfCB7IHR5cGU6ICdESVNBQkxFJyB9XG4gIHwgeyB0eXBlOiAnRU5BQkxFJyB9XG4gIHwgeyB0eXBlOiAnSU5JVCc7IGZlYXR1cmU6IEZlYXR1cmVEZXNjcmlwdGlvbiB9XG4gIHwgeyB0eXBlOiAnU0VUJzsgdmFsdWU6IEZlYXR1cmVWYWx1ZSB9XG4gIHwgeyB0eXBlOiAnVE9HR0xFJyB9XG4gIHwgeyB0eXBlOiAnVU5TRVQnIH07XG5cbi8qKlxuICogRnVsbHkgZGVzY3JpYmUgdGhlIHN0YXRlcyBhIGZlYXR1cmUgY2FuIGJlIGluXG4gKi9cbmV4cG9ydCBjb25zdCBGZWF0dXJlTWFjaGluZSA9IGNyZWF0ZU1hY2hpbmU8RmVhdHVyZUNvbnRleHQsIEZlYXR1cmVBY3Rpb24sIEZlYXR1cmVUeXBlU3RhdGU+KHtcbiAgaWQ6ICdmZWF0dXJlJyxcbiAgaW5pdGlhbDogJ2luaXRpYWwnLFxuICBjb250ZXh0OiB7fSxcblxuICBvbjoge1xuICAgIEVOQUJMRTogW1xuICAgICAgeyB0YXJnZXQ6ICdhc3luY0VuYWJsZWQnLCBjb25kOiAoY3R4KSA9PiBjdHguZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsIH0sXG4gICAgICB7IHRhcmdldDogJ2VuYWJsZWQnIH0sXG4gICAgXSxcblxuICAgIFRPR0dMRTogW1xuICAgICAgeyB0YXJnZXQ6ICdhc3luY0VuYWJsZWQnLCBjb25kOiAoY3R4KSA9PiBjdHguZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsIH0sXG4gICAgICB7IHRhcmdldDogJ2VuYWJsZWQnIH0sXG4gICAgXSxcblxuICAgIERJU0FCTEU6IFtcbiAgICAgIHsgdGFyZ2V0OiAnYXN5bmNEaXNhYmxlZCcsIGNvbmQ6IChjdHgpID0+IGN0eC5mZWF0dXJlRGVzYz8ub25DaGFuZ2VEZWZhdWx0ICE9IG51bGwgfSxcbiAgICAgIHsgdGFyZ2V0OiAnZGlzYWJsZWQnIH0sXG4gICAgXSxcblxuICAgIFVOU0VUOiBbXG4gICAgICB7IHRhcmdldDogJ2FzeW5jVW5zcGVjaWVkJywgY29uZDogKGN0eCkgPT4gY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCB9LFxuICAgICAgeyB0YXJnZXQ6ICd1bnNwZWNpZmllZCcgfSxcbiAgICBdLFxuXG4gICAgU0VUOiBbXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogJ2FzeW5jRW5hYmxlZCcsXG4gICAgICAgIGNvbmQ6IChjdHgsIGUpID0+IGUudmFsdWUgPT09IHRydWUgJiYgY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogJ2FzeW5jRGlzYWJsZWQnLFxuICAgICAgICBjb25kOiAoY3R4LCBlKSA9PiBlLnZhbHVlID09PSBmYWxzZSAmJiBjdHguZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdCAhPSBudWxsLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGFyZ2V0OiAnYXN5bmNVbnNwZWNpZWQnLFxuICAgICAgICBjb25kOiAoY3R4LCBfZSkgPT4gY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQgIT0gbnVsbCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogJ2VuYWJsZWQnLFxuICAgICAgICBjb25kOiAoX2N0eCwgZSkgPT4gZS52YWx1ZSA9PT0gdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRhcmdldDogJ2Rpc2FibGVkJyxcbiAgICAgICAgY29uZDogKF9jdHgsIGUpID0+IGUudmFsdWUgPT09IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHsgdGFyZ2V0OiAndW5zcGVjaWZpZWQnIH0sXG4gICAgXSxcbiAgfSxcblxuICBzdGF0ZXM6IHtcbiAgICBpbml0aWFsOiB7XG4gICAgICBvbjoge1xuICAgICAgICBJTklUOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYWN0aW9uczogYXNzaWduKHsgZmVhdHVyZURlc2M6IChfLCBlKSA9PiBlLmZlYXR1cmUgfSksXG4gICAgICAgICAgICB0YXJnZXQ6ICdlbmFibGVkJyxcbiAgICAgICAgICAgIGNvbmQ6IChfLCBlKSA9PiBlLmZlYXR1cmUuZGVmYXVsdFZhbHVlID09PSB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYWN0aW9uczogYXNzaWduKHsgZmVhdHVyZURlc2M6IChfLCBlKSA9PiBlLmZlYXR1cmUgfSksXG4gICAgICAgICAgICB0YXJnZXQ6ICd1bnNwZWNpZmllZCcsXG4gICAgICAgICAgICBjb25kOiAoXywgZSkgPT4gZS5mZWF0dXJlLmRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgYWN0aW9uczogYXNzaWduKHsgZmVhdHVyZURlc2M6IChfLCBlKSA9PiBlLmZlYXR1cmUgfSksXG4gICAgICAgICAgICB0YXJnZXQ6ICdkaXNhYmxlZCcsXG4gICAgICAgICAgICBjb25kOiAoXywgZSkgPT4gZS5mZWF0dXJlLmRlZmF1bHRWYWx1ZSA9PT0gZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIHVuc3BlY2lmaWVkOiB7fSxcbiAgICBkaXNhYmxlZDoge30sXG4gICAgZW5hYmxlZDoge30sXG5cbiAgICBhc3luY0Rpc2FibGVkOiB7XG4gICAgICBpbnZva2U6IHtcbiAgICAgICAgaWQ6ICdzZXQtb2ZmLXVwc3RyZWFtJyxcbiAgICAgICAgc3JjOiBhc3luYyAoY3R4KSA9PiB7XG4gICAgICAgICAgY29uc3Qgb25jaGFuZ2UgPSBjdHguZmVhdHVyZURlc2M/Lm9uQ2hhbmdlRGVmYXVsdDtcbiAgICAgICAgICBpZiAob25jaGFuZ2UgIT0gbnVsbCAmJiBjdHguZmVhdHVyZURlc2MgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG9uY2hhbmdlKGN0eC5mZWF0dXJlRGVzYy5uYW1lLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRG9uZTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRhcmdldDogJ2VuYWJsZWQnLFxuICAgICAgICAgICAgY29uZDogKF9jdHgsIGU6IERvbmVJbnZva2VFdmVudDxGZWF0dXJlVmFsdWU+KSA9PiBlLmRhdGEgPT09IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdkaXNhYmxlZCcsXG4gICAgICAgICAgICBjb25kOiAoX2N0eCwgZTogRG9uZUludm9rZUV2ZW50PEZlYXR1cmVWYWx1ZT4pID0+IGUuZGF0YSA9PT0gZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHRhcmdldDogJ3Vuc3BlY2lmaWVkJyB9LFxuICAgICAgICBdLFxuICAgICAgICBvbkVycm9yOiAndW5zcGVjaWZpZWQnLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgYXN5bmNVbnNwZWNpZWQ6IHtcbiAgICAgIGludm9rZToge1xuICAgICAgICBpZDogJ3NldC11bnNldC11cHN0cmVhbScsXG4gICAgICAgIHNyYzogYXN5bmMgKGN0eCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9uY2hhbmdlID0gY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQ7XG4gICAgICAgICAgaWYgKG9uY2hhbmdlICE9IG51bGwgJiYgY3R4LmZlYXR1cmVEZXNjICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBvbmNoYW5nZShjdHguZmVhdHVyZURlc2MubmFtZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSxcbiAgICAgICAgb25Eb25lOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGFyZ2V0OiAnZW5hYmxlZCcsXG4gICAgICAgICAgICBjb25kOiAoX2N0eCwgZTogRG9uZUludm9rZUV2ZW50PEZlYXR1cmVWYWx1ZT4pID0+IGUuZGF0YSA9PT0gdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRhcmdldDogJ2Rpc2FibGVkJyxcbiAgICAgICAgICAgIGNvbmQ6IChfY3R4LCBlOiBEb25lSW52b2tlRXZlbnQ8RmVhdHVyZVZhbHVlPikgPT4gZS5kYXRhID09PSBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgdGFyZ2V0OiAndW5zcGVjaWZpZWQnIH0sXG4gICAgICAgIF0sXG4gICAgICAgIG9uRXJyb3I6ICd1bnNwZWNpZmllZCcsXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBhc3luY0VuYWJsZWQ6IHtcbiAgICAgIGludm9rZToge1xuICAgICAgICBpZDogJ3NldC1vbi11cHN0cmVhbScsXG4gICAgICAgIHNyYzogYXN5bmMgKGN0eCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG9uY2hhbmdlID0gY3R4LmZlYXR1cmVEZXNjPy5vbkNoYW5nZURlZmF1bHQ7XG4gICAgICAgICAgaWYgKG9uY2hhbmdlICE9IG51bGwgJiYgY3R4LmZlYXR1cmVEZXNjICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBvbmNoYW5nZShjdHguZmVhdHVyZURlc2MubmFtZSwgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRG9uZTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRhcmdldDogJ2VuYWJsZWQnLFxuICAgICAgICAgICAgY29uZDogKF9jdHgsIGU6IERvbmVJbnZva2VFdmVudDxGZWF0dXJlVmFsdWU+KSA9PiBlLmRhdGEgPT09IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0YXJnZXQ6ICdkaXNhYmxlZCcsXG4gICAgICAgICAgICBjb25kOiAoX2N0eCwgZTogRG9uZUludm9rZUV2ZW50PEZlYXR1cmVWYWx1ZT4pID0+IGUuZGF0YSA9PT0gZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHRhcmdldDogJ3Vuc3BlY2lmaWVkJyB9LFxuICAgICAgICBdLFxuICAgICAgICBvbkVycm9yOiAndW5zcGVjaWZpZWQnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iLCAiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIFJlYWN0Tm9kZSwgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IHVzZU1hY2hpbmUgfSBmcm9tICdAeHN0YXRlL3JlYWN0JztcblxuaW1wb3J0IHsgRW5hYmxlQ29udGV4dCB9IGZyb20gJy4vRW5hYmxlQ29udGV4dCc7XG5pbXBvcnQgeyBGZWF0dXJlQ29udGV4dCB9IGZyb20gJy4vRmVhdHVyZUNvbnRleHQnO1xuaW1wb3J0IHsgRmVhdHVyZXNNYWNoaW5lIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcbmltcG9ydCB7IEZlYXR1cmVEZXNjcmlwdGlvbiB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcbmltcG9ydCB1c2VDb25zb2xlT3ZlcnJpZGUgZnJvbSAnLi91c2VDb25zb2xlT3ZlcnJpZGUnO1xuaW1wb3J0IHVzZVBlcnNpc3QsIHsgS0VZIH0gZnJvbSAnLi91c2VQZXJzaXN0JztcbmltcG9ydCB1c2VUZXN0Q2FsbGJhY2sgZnJvbSAnLi91c2VUZXN0Q2FsbGJhY2snO1xuXG5pbnRlcmZhY2UgRmVhdHVyZVByb3BzIHtcbiAgcmVhZG9ubHkgZmVhdHVyZXM6IHJlYWRvbmx5IEZlYXR1cmVEZXNjcmlwdGlvbltdO1xuICByZWFkb25seSBjaGlsZHJlbj86IFJlYWN0Tm9kZTtcbiAgcmVhZG9ubHkgZGlzYWJsZUNvbnNvbGU/OiBib29sZWFuO1xuICByZWFkb25seSBzdG9yYWdlPzogU3RvcmFnZTtcbn1cblxuLyoqXG4gKiBBIG1vcmUgYmF0dGVyaWVzLWVuYWJsZWQgcGFyZW50IGNvbXBvbmVudCB0aGF0IGtlZXBzIHRyYWNrIG9mIGZlYXR1cmUgc3RhdGVcbiAqIGludGVybmFsbHksIGFuZCBjcmVhdGVzIHdpbmRvdy5mZWF0dXJlLmVuYWJsZShcImZcIikgYW5kIHdpbmRvdy5mZWF0dXJlLmRpc2FibGUoXCJmXCIpLlxuICogS2VlcHMgdHJhY2sgb2Ygb3ZlcnJpZGVzIGFuZCBkZWZhdWx0cywgd2l0aCBkZWZhdWx0cyBwb3RlbnRpYWxseSBjb21pbmcgZnJvbSB5b3VyIHByb3BzXG4gKiBhbmQgb3ZlcnJpZGVzIGJlaW5nIHBlcnNpc3RlZCB0byB5b3VyIGNob2ljZSBvZiBzdG9yYWdlIGxheWVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gRmVhdHVyZXMoe1xuICBjaGlsZHJlbixcbiAgZmVhdHVyZXMsXG4gIGRpc2FibGVDb25zb2xlID0gZmFsc2UsXG4gIHN0b3JhZ2UgPSB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UsXG59OiBGZWF0dXJlUHJvcHMpOiBKU1guRWxlbWVudCB7XG4gIC8vIENhcHR1cmUgb25seSBmaXJzdCB2YWx1ZTsgd2UgZG9uJ3QgY2FyZSBhYm91dCBmdXR1cmUgdXBkYXRlc1xuICBjb25zdCBmZWF0dXJlc1JlZiA9IHVzZVJlZihmZWF0dXJlcyk7XG4gIGNvbnN0IFtvdmVycmlkZXNTdGF0ZSwgb3ZlcnJpZGVzU2VuZF0gPSB1c2VNYWNoaW5lKEZlYXR1cmVzTWFjaGluZSk7XG4gIGNvbnN0IFtkZWZhdWx0c1N0YXRlLCBkZWZhdWx0c1NlbmRdID0gdXNlTWFjaGluZShGZWF0dXJlc01hY2hpbmUpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8vIExvYWQgZGVmYXVsdHNcbiAgICBkZWZhdWx0c1NlbmQoeyB0eXBlOiAnSU5JVCcsIGZlYXR1cmVzIH0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkZWZhdWx0c1NlbmQoeyB0eXBlOiAnREVfSU5JVCcgfSk7XG4gICAgfTtcbiAgfSwgW2RlZmF1bHRzU2VuZCwgZmVhdHVyZXNdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCBmOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuIHwgdW5kZWZpbmVkPiA9IHt9O1xuICAgIGlmIChzdG9yYWdlICE9IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZlYXR1cmVzSnNvbiA9IHN0b3JhZ2UuZ2V0SXRlbShLRVkpO1xuICAgICAgICBpZiAoZmVhdHVyZXNKc29uICE9IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBmaCA9IEpTT04ucGFyc2UoZmVhdHVyZXNKc29uKTtcbiAgICAgICAgICBmID0gZmgub3ZlcnJpZGVzO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIENhbid0IHBhcnNlIG9yIGdldCBvciBvdGhlcndpc2U7IGlnbm9yZVxuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciBpbiBsb2NhbFN0b3JhZ2UnLCBlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvdmVycmlkZXNTZW5kKHtcbiAgICAgIHR5cGU6ICdJTklUJyxcbiAgICAgIGZlYXR1cmVzOiBmZWF0dXJlc1JlZi5jdXJyZW50XG4gICAgICAgIC5maWx0ZXIoKHgpID0+IHgubm9PdmVycmlkZSAhPT0gdHJ1ZSlcbiAgICAgICAgLm1hcCgoeCkgPT4gKHsgbmFtZTogeC5uYW1lLCBkZXNjcmlwdGlvbjogeC5kZXNjcmlwdGlvbiwgZGVmYXVsdFZhbHVlOiBmPy5beC5uYW1lXSA/PyB1bmRlZmluZWQgfSkpLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIG92ZXJyaWRlc1NlbmQoeyB0eXBlOiAnREVfSU5JVCcgfSk7XG4gICAgfTtcbiAgfSwgW2ZlYXR1cmVzUmVmLCBvdmVycmlkZXNTZW5kLCBzdG9yYWdlXSk7XG5cbiAgdXNlUGVyc2lzdChzdG9yYWdlLCBmZWF0dXJlc1JlZi5jdXJyZW50LCBvdmVycmlkZXNTdGF0ZSk7XG5cbiAgY29uc3QgdGVzdENhbGxiYWNrID0gdXNlVGVzdENhbGxiYWNrKG92ZXJyaWRlc1N0YXRlLCBkZWZhdWx0c1N0YXRlKTtcbiAgdXNlQ29uc29sZU92ZXJyaWRlKCFkaXNhYmxlQ29uc29sZSwgZmVhdHVyZXNSZWYuY3VycmVudCwgdGVzdENhbGxiYWNrLCBkZWZhdWx0c1NlbmQpO1xuXG4gIGNvbnN0IGZlYXR1cmVWYWx1ZSA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIG92ZXJyaWRlc1NlbmQsXG4gICAgICBkZWZhdWx0c1NlbmQsXG4gICAgICBmZWF0dXJlc0Rlc2NyaXB0aW9uOiBmZWF0dXJlc1JlZi5jdXJyZW50LFxuICAgICAgb3ZlcnJpZGVzU3RhdGUsXG4gICAgICBkZWZhdWx0c1N0YXRlLFxuICAgICAgdGVzdDogdGVzdENhbGxiYWNrLFxuICAgIH0pLFxuICAgIFtvdmVycmlkZXNTZW5kLCBkZWZhdWx0c1NlbmQsIG92ZXJyaWRlc1N0YXRlLCBkZWZhdWx0c1N0YXRlLCB0ZXN0Q2FsbGJhY2tdXG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8RmVhdHVyZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e2ZlYXR1cmVWYWx1ZX0+XG4gICAgICA8RW5hYmxlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dGVzdENhbGxiYWNrfT57Y2hpbGRyZW59PC9FbmFibGVDb250ZXh0LlByb3ZpZGVyPlxuICAgIDwvRmVhdHVyZUNvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59XG4iLCAiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRmVhdHVyZVZhbHVlIH0gZnJvbSAnLi9GZWF0dXJlU3RhdGUnO1xuXG5leHBvcnQgdHlwZSBFbmFibGVDb250ZXh0VHlwZSA9IChmZWF0dXJlOiBzdHJpbmcpID0+IEZlYXR1cmVWYWx1ZTtcblxuLyoqXG4gKiBDb250YWluZWQgZnVuY3Rpb24gY2FuIGNoZWNrIHdoZXRoZXIgYSBnaXZlbiBmZWF0dXJlIGlzIGVuYWJsZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBFbmFibGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxFbmFibGVDb250ZXh0VHlwZT4oKF9zKSA9PiBmYWxzZSk7XG4iLCAiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRmVhdHVyZXNEaXNwYXRjaCwgRmVhdHVyZXNTdGF0ZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgeyBGZWF0dXJlRGVzY3JpcHRpb24sIEZlYXR1cmVWYWx1ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcblxuZXhwb3J0IGNvbnN0IEZlYXR1cmVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxGZWF0dXJlQ29udGV4dFR5cGUgfCBudWxsPihudWxsKTtcblxuLy8vIEdpdmUgYWNjZXNzIHRvIHRoZSBvdmVycmlkZXMgbGF5ZXJcbmV4cG9ydCBpbnRlcmZhY2UgRmVhdHVyZUNvbnRleHRUeXBlIHtcbiAgLy8gTWFrZSBjaGFuZ2VzIHRvIHRoZSBvdmVycmlkZXNcbiAgb3ZlcnJpZGVzU2VuZDogRmVhdHVyZXNEaXNwYXRjaDtcblxuICAvLyBNYWtlIGNoYW5nZXMgdG8gZGVmYXVsdHNcbiAgZGVmYXVsdHNTZW5kOiBGZWF0dXJlc0Rpc3BhdGNoO1xuXG4gIGZlYXR1cmVzRGVzY3JpcHRpb246IHJlYWRvbmx5IEZlYXR1cmVEZXNjcmlwdGlvbltdO1xuXG4gIC8vIFN0YXRlIGlzIGluIGxheWVyczsgb3ZlcnJpZGVzIGFuZCBkZWZhdWx0c1xuICBvdmVycmlkZXNTdGF0ZTogRmVhdHVyZXNTdGF0ZTtcbiAgZGVmYXVsdHNTdGF0ZTogRmVhdHVyZXNTdGF0ZTtcblxuICAvLy8gVGVzdCB3aXRoIHByb3BlciBmYWxsYmFjayBhbmQgcmVzcGVjdGluZyB0aGUgdXNlcidzIGZvcmNlIHByZWZlcmVuY2VcbiAgdGVzdDogKGZsYWc6IHN0cmluZykgPT4gRmVhdHVyZVZhbHVlO1xufVxuIiwgImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRmVhdHVyZXNEaXNwYXRjaCB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgeyBGZWF0dXJlRGVzY3JpcHRpb24sIEZlYXR1cmVWYWx1ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcbmltcG9ydCB7IEdsb2JhbEVuYWJsZSB9IGZyb20gJy4vR2xvYmFsRW5hYmxlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQ29uc29sZU92ZXJyaWRlKFxuICBjb25zb2xlT3ZlcnJpZGU6IGJvb2xlYW4sXG4gIGZlYXR1cmVzOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXSxcbiAgdGVzdEZlYXR1cmU6IChfOiBzdHJpbmcpID0+IEZlYXR1cmVWYWx1ZSxcbiAgZGlzcGF0Y2g6IEZlYXR1cmVzRGlzcGF0Y2hcbik6IHZvaWQge1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghY29uc29sZU92ZXJyaWRlKSB7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAvKiBlbXB0eSAqL1xuICAgICAgfTtcbiAgICB9XG4gICAgd2luZG93LmZlYXR1cmUgPSBuZXcgR2xvYmFsRW5hYmxlKGRpc3BhdGNoLCB0ZXN0RmVhdHVyZSwgZmVhdHVyZXMpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAod2luZG93LmZlYXR1cmUgIT0gbnVsbCkge1xuICAgICAgICBkZWxldGUgd2luZG93LmZlYXR1cmU7XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW2ZlYXR1cmVzLCBkaXNwYXRjaCwgY29uc29sZU92ZXJyaWRlLCB0ZXN0RmVhdHVyZV0pO1xufVxuIiwgImltcG9ydCB7IEZlYXR1cmVzRGlzcGF0Y2ggfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuaW1wb3J0IHsgRmVhdHVyZURlc2NyaXB0aW9uLCBGZWF0dXJlVmFsdWUgfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5cbmV4cG9ydCBjbGFzcyBHbG9iYWxFbmFibGUge1xuICBwcml2YXRlIHJlYWRvbmx5IGZlYXR1cmVEZXNjOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXTtcbiAgcHJpdmF0ZSByZWFkb25seSBkaXNwYXRjaDogRmVhdHVyZXNEaXNwYXRjaDtcbiAgcHJpdmF0ZSByZWFkb25seSB0ZXN0RmVhdHVyZTogKHZhbHVlOiBzdHJpbmcpID0+IEZlYXR1cmVWYWx1ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBkaXNwYXRjaDogRmVhdHVyZXNEaXNwYXRjaCxcbiAgICB0ZXN0RmVhdHVyZTogKF86IHN0cmluZykgPT4gRmVhdHVyZVZhbHVlLFxuICAgIGZlYXR1cmVEZXNjOiByZWFkb25seSBGZWF0dXJlRGVzY3JpcHRpb25bXVxuICApIHtcbiAgICB0aGlzLmZlYXR1cmVEZXNjID0gZmVhdHVyZURlc2M7XG4gICAgdGhpcy5kaXNwYXRjaCA9IGRpc3BhdGNoO1xuICAgIHRoaXMudGVzdEZlYXR1cmUgPSB0ZXN0RmVhdHVyZTtcbiAgfVxuXG4gIHB1YmxpYyB0b2dnbGUoZmVhdHVyZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaCh7IHR5cGU6ICdUT0dHTEUnLCBuYW1lOiBmZWF0dXJlIH0pO1xuICB9XG5cbiAgcHVibGljIGVuYWJsZShmZWF0dXJlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoKHsgdHlwZTogJ0VOQUJMRScsIG5hbWU6IGZlYXR1cmUgfSk7XG4gIH1cblxuICBwdWJsaWMgdW5zZXQoZmVhdHVyZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaCh7IHR5cGU6ICdVTlNFVCcsIG5hbWU6IGZlYXR1cmUgfSk7XG4gIH1cblxuICBwdWJsaWMgZGlzYWJsZShmZWF0dXJlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoKHsgdHlwZTogJ0RJU0FCTEUnLCBuYW1lOiBmZWF0dXJlIH0pO1xuICB9XG5cbiAgcHVibGljIHNldEFsbChmZWF0dXJlczogeyBba2V5OiBzdHJpbmddOiBGZWF0dXJlVmFsdWUgfSk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2goeyB0eXBlOiAnU0VUX0FMTCcsIGZlYXR1cmVzIH0pO1xuICB9XG5cbiAgcHVibGljIGxpc3RGZWF0dXJlcygpOiByZWFkb25seSBbc3RyaW5nLCBGZWF0dXJlVmFsdWVdW10ge1xuICAgIHJldHVybiB0aGlzLmZlYXR1cmVEZXNjLm1hcCgoZikgPT4gW2YubmFtZSwgdGhpcy50ZXN0RmVhdHVyZShmLm5hbWUpXSk7XG4gIH1cbn1cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgZmVhdHVyZT86IEdsb2JhbEVuYWJsZTtcbiAgfVxufVxuIiwgImltcG9ydCB7IHVzZU1lbW8sIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRmVhdHVyZXNTdGF0ZSwgdmFsdWVPZkZlYXR1cmUgfSBmcm9tICcuL0ZlYXR1cmVzU3RhdGUnO1xuaW1wb3J0IHsgRmVhdHVyZURlc2NyaXB0aW9uLCBGZWF0dXJlVmFsdWUgfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG5cbmV4cG9ydCBjb25zdCBLRVkgPSAncmVhY3QtZW5hYmxlOmZlYXR1cmUtdmFsdWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlUGVyc2lzdChcbiAgc3RvcmFnZTogU3RvcmFnZSB8IHVuZGVmaW5lZCxcbiAgZmVhdHVyZXM6IHJlYWRvbmx5IEZlYXR1cmVEZXNjcmlwdGlvbltdLFxuICBvdmVycmlkZVN0YXRlOiBGZWF0dXJlc1N0YXRlXG4pOiB2b2lkIHtcbiAgY29uc3Qgb3ZlcnJpZGVzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgbmV3T3ZlcnJpZGVzOiB7IFtrZXk6IHN0cmluZ106IEZlYXR1cmVWYWx1ZSB9ID0ge307XG4gICAgaWYgKG92ZXJyaWRlU3RhdGUubWF0Y2hlcygncmVhZHknKSkge1xuICAgICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIGZlYXR1cmVzKSB7XG4gICAgICAgIGNvbnN0IFt2YWx1ZV0gPSB2YWx1ZU9mRmVhdHVyZShvdmVycmlkZVN0YXRlLCBmZWF0dXJlLm5hbWUpO1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgIG5ld092ZXJyaWRlc1tmZWF0dXJlLm5hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld092ZXJyaWRlcztcbiAgfSwgW2ZlYXR1cmVzLCBvdmVycmlkZVN0YXRlXSk7XG5cbiAgY29uc3Qgc3RyU3RhdGUgPSBPYmplY3Qua2V5cyhvdmVycmlkZXMpLmxlbmd0aCA9PT0gMCB8fCBzdG9yYWdlID09IG51bGwgPyAne30nIDogSlNPTi5zdHJpbmdpZnkoeyBvdmVycmlkZXMgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKHN0b3JhZ2UgIT0gbnVsbCAmJiBvdmVycmlkZVN0YXRlLm1hdGNoZXMoJ3JlYWR5JykpIHtcbiAgICAgICAgc3RvcmFnZS5zZXRJdGVtKEtFWSwgc3RyU3RhdGUpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIENhbid0IHNldCBmb3Igc29tZSByZWFzb25cbiAgICB9XG4gIH0sIFtvdmVycmlkZVN0YXRlLCBzdG9yYWdlLCBzdHJTdGF0ZV0pO1xufVxuIiwgImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBGZWF0dXJlc1N0YXRlIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcbmltcG9ydCB0ZXN0RmVhdHVyZSBmcm9tICcuL3Rlc3RGZWF0dXJlJztcblxuLy8vIEEgY2FsbGJhY2sgdGhhdCBjYW4gYmUgY2FsbGVkIHRvIHRlc3QgaWYgYSBmZWF0dXJlIGlzIGVuYWJsZWQgb3IgZGlzYWJsZWRcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZVRlc3RDYWxsYmFjayhcbiAgZGVmYXVsdHNTdGF0ZTogRmVhdHVyZXNTdGF0ZSxcbiAgb3ZlcnJpZGVzU3RhdGU6IEZlYXR1cmVzU3RhdGVcbik6IChmZWF0dXJlOiBzdHJpbmcpID0+IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICByZXR1cm4gdXNlQ2FsbGJhY2soKGY6IHN0cmluZykgPT4gdGVzdEZlYXR1cmUoZiwgW2RlZmF1bHRzU3RhdGUsIG92ZXJyaWRlc1N0YXRlXSksIFtkZWZhdWx0c1N0YXRlLCBvdmVycmlkZXNTdGF0ZV0pO1xufVxuIiwgImltcG9ydCB7IEZlYXR1cmVzU3RhdGUsIHZhbHVlT2ZGZWF0dXJlIH0gZnJvbSAnLi9GZWF0dXJlc1N0YXRlJztcbmltcG9ydCB7IEZlYXR1cmVWYWx1ZSB9IGZyb20gJy4vRmVhdHVyZVN0YXRlJztcblxuLyoqIERldGVybWluZSBpZiB0aGUgZmVhdHVyZSBpcyBlbmFibGVkIGluIG9uZSBvZiB0aGUgc3RhdGUgbWFjaGluZXMsIGluIG9yZGVyXG4gKlxuICogQHBhcmFtIHN0YXRlIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBtYWNoaW5lXG4gKiBAcGFyYW0gZmVhdHVyZSBUaGUgZmVhdHVyZSB0byBjaGVja1xuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlc3RGZWF0dXJlKGZlYXR1cmU6IHN0cmluZywgc3RhdGVzOiBGZWF0dXJlc1N0YXRlW10pOiBGZWF0dXJlVmFsdWUge1xuICBjb25zdCB2YWx1ZXMgPSBzdGF0ZXMubWFwKChzdGF0ZSkgPT4gdmFsdWVPZkZlYXR1cmUoc3RhdGUsIGZlYXR1cmUpKTtcblxuICAvLyBsb29rIGZvciBiZXN0IGZvcmNlZCBvcHRpb24sIGluIG9yZGVyXG4gIGZvciAoY29uc3QgW2ZlYXR1cmVWYWx1ZSwgZmVhdHVyZUZvcmNlZF0gb2YgdmFsdWVzKSB7XG4gICAgaWYgKGZlYXR1cmVWYWx1ZSAhPSBudWxsICYmIGZlYXR1cmVGb3JjZWQpIHtcbiAgICAgIHJldHVybiBmZWF0dXJlVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLy8gbG9vayBmb3IgYmVzdCBub24tZm9yY2VkIG9wdGlvbiwgaW4gb3JkZXJcbiAgZm9yIChjb25zdCBbZmVhdHVyZVZhbHVlXSBvZiB2YWx1ZXMpIHtcbiAgICBpZiAoZmVhdHVyZVZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBmZWF0dXJlVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLy8gdW5zZXQgaWYgbm90aGluZyBoaXRcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiIsICJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IHVzZUFsbEVuYWJsZWQgfSBmcm9tICcuL3VzZUFsbEVuYWJsZWQnO1xuaW1wb3J0IHsgdXNlRW5hYmxlZCB9IGZyb20gJy4vdXNlRW5hYmxlZCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW5hYmxlUHJvcHMge1xuICByZWFkb25seSBmZWF0dXJlPzogc3RyaW5nW10gfCBzdHJpbmc7XG4gIHJlYWRvbmx5IGFsbEZlYXR1cmVzPzogc3RyaW5nW107XG4gIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGU7XG59XG5cbi8qKlxuICogRmVhdHVyZSB3aWxsIGJlIGVuYWJsZWQgaWYgYW55IGZlYXR1cmUgaW4gdGhlIGxpc3QgYXJlIGVuYWJsZWQsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBFbmFibGUoeyBmZWF0dXJlID0gW10sIGFsbEZlYXR1cmVzID0gW10sIGNoaWxkcmVuIH06IEVuYWJsZVByb3BzKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgaXNBbnkgPSB1c2VFbmFibGVkKGZlYXR1cmUpO1xuICBjb25zdCBpc0FsbCA9IHVzZUFsbEVuYWJsZWQoYWxsRmVhdHVyZXMpO1xuXG4gIGlmIChpc0FueSB8fCBpc0FsbCkge1xuICAgIHJldHVybiA8PntjaGlsZHJlbn08Lz47XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsICJpbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBFbmFibGVDb250ZXh0VHlwZSwgRW5hYmxlQ29udGV4dCB9IGZyb20gJy4vRW5hYmxlQ29udGV4dCc7XG5cbi8vIEhlbHBlcjogZ2V0IHJpZCBvZiBzb21lIGJvaWxlcnBsYXRlLlxuLy8ganVzdCBpbnB1dCBtYXNoaW5nIGFuZCBzYW5pdGF0aW9uLCByZW1vdmluZyBleHRyYSByZW5kZXJzLCBhbmQgZ2V0dGluZyB0ZXN0IGZ1bmN0aW9uXG5leHBvcnQgZnVuY3Rpb24gdXNlVGVzdEFuZENvbnZlcnQoaW5wdXQ/OiBzdHJpbmdbXSB8IHN0cmluZyB8IG51bGwpOiBbRW5hYmxlQ29udGV4dFR5cGUsIHN0cmluZ1tdXSB7XG4gIGNvbnN0IHRlc3QgPSB1c2VDb250ZXh0KEVuYWJsZUNvbnRleHQpO1xuXG4gIC8vIFdlIG1lbW9pemUganVzdCB0byBwcmV2ZW50IHJlLXJlbmRlcnMgc2luY2UgdGhpcyBjb3VsZCBiZSBhdCB0aGUgbGVhZiBvZiBhIHRyZWVcbiAgY29uc3QgY29udmVydGVkID0gdXNlTWVtbygoKSA9PiAoaW5wdXQgPT0gbnVsbCA/IFtdIDogQXJyYXkuaXNBcnJheShpbnB1dCkgPyBpbnB1dCA6IFtpbnB1dF0pLCBbaW5wdXRdKTtcblxuICByZXR1cm4gW3Rlc3QsIGNvbnZlcnRlZF07XG59XG4iLCAiaW1wb3J0IHsgdXNlVGVzdEFuZENvbnZlcnQgfSBmcm9tICcuL3V0aWxzJztcblxuLyoqXG4gKiByZXR1cm5zIHRydWUgaWZmIGFsbCBzcGVjaWZpZWQgZmVhdHVyZXMgYXJlIGVuYWJsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFsbEVuYWJsZWQoYWxsRmVhdHVyZXM6IHN0cmluZ1tdIHwgc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IFt0ZXN0LCBxdWVyeUFsbFByZXNlbnRdID0gdXNlVGVzdEFuZENvbnZlcnQoYWxsRmVhdHVyZXMpO1xuICByZXR1cm4gcXVlcnlBbGxQcmVzZW50Lmxlbmd0aCA+IDAgJiYgcXVlcnlBbGxQcmVzZW50LmV2ZXJ5KHRlc3QpO1xufVxuIiwgImltcG9ydCB7IHVzZVRlc3RBbmRDb252ZXJ0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogcmV0dXJucyB0cnVlIGlmZiBhbnkgc3BlY2lmaWVkIGZlYXR1cmUgaXMgZW5hYmxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlRW5hYmxlZChmZWF0dXJlOiBzdHJpbmdbXSB8IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBbdGVzdCwgcXVlcnlBbnlQcmVzZW50XSA9IHVzZVRlc3RBbmRDb252ZXJ0KGZlYXR1cmUpO1xuICByZXR1cm4gcXVlcnlBbnlQcmVzZW50LnNvbWUodGVzdCk7XG59XG4iLCAiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCB7IEVuYWJsZVByb3BzIH0gZnJvbSBcIi4vRW5hYmxlXCI7XG5pbXBvcnQgeyB1c2VBbGxEaXNhYmxlZCB9IGZyb20gXCIuL3VzZUFsbERpc2FibGVkXCI7XG5pbXBvcnQgeyB1c2VEaXNhYmxlZCB9IGZyb20gXCIuL3VzZURpc2FibGVkXCI7XG5cbi8qKlxuICogRmVhdHVyZSB3aWxsIGJlIGRpc2FibGVkIGlmIGFueSBpbiB0aGUgbGlzdCBhcmUgZW5hYmxlZFxuICovXG5leHBvcnQgY29uc3QgRGlzYWJsZTogUmVhY3QuRkM8RW5hYmxlUHJvcHM+ID0gKHtcbiAgZmVhdHVyZSA9IFtdLFxuICBhbGxGZWF0dXJlcyA9IFtdLFxuICBjaGlsZHJlblxufSkgPT4ge1xuICBjb25zdCBpc0FueSA9IHVzZURpc2FibGVkKGZlYXR1cmUpO1xuICBjb25zdCBpc0FsbCA9IHVzZUFsbERpc2FibGVkKGFsbEZlYXR1cmVzKTtcblxuICBpZiAoaXNBbnkgfHwgaXNBbGwpIHtcbiAgICByZXR1cm4gPD57Y2hpbGRyZW59PC8+O1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuIiwgImltcG9ydCB7IHVzZVRlc3RBbmRDb252ZXJ0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogcmV0dXJucyB0cnVlIGlmZiBhbGwgc3BlY2lmaWVkIGZlYXR1cmVzIGFyZSBkaXNhYmxlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlQWxsRGlzYWJsZWQod2l0aG91dEFsbDogc3RyaW5nW10gfCBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgW3Rlc3QsIHF1ZXJ5QWxsV2l0aG91dF0gPSB1c2VUZXN0QW5kQ29udmVydCh3aXRob3V0QWxsKTtcbiAgcmV0dXJuIHdpdGhvdXRBbGwubGVuZ3RoID4gMCAmJiBxdWVyeUFsbFdpdGhvdXQuZXZlcnkoKHgpID0+ICEodGVzdCh4KSA/PyBmYWxzZSkpO1xufVxuIiwgImltcG9ydCB7IHVzZVRlc3RBbmRDb252ZXJ0IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogcmV0dXJucyB0cnVlIGlmZiBhbnkgc3BlY2lmaWVkIGZlYXR1cmUgaXMgZGlzYWJsZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZURpc2FibGVkKHdpdGhvdXQ6IHN0cmluZ1tdIHwgc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IFt0ZXN0LCBxdWVyeUFueVdpdGhvdXRdID0gdXNlVGVzdEFuZENvbnZlcnQod2l0aG91dCk7XG4gIHJldHVybiBxdWVyeUFueVdpdGhvdXQuc29tZSgoeCkgPT4gISh0ZXN0KHgpID8/IGZhbHNlKSk7XG59XG4iLCAiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VDYWxsYmFjaywgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5cbmltcG9ydCB7IFJhZGlvR3JvdXAgfSBmcm9tICdAaGVhZGxlc3N1aS9yZWFjdCc7XG5cbmltcG9ydCB7IEZlYXR1cmVDb250ZXh0IH0gZnJvbSAnLi9GZWF0dXJlQ29udGV4dCc7XG5pbXBvcnQgeyB2YWx1ZU9mRmVhdHVyZSB9IGZyb20gJy4vRmVhdHVyZXNTdGF0ZSc7XG5pbXBvcnQgeyBGZWF0dXJlRGVzY3JpcHRpb24gfSBmcm9tICcuL0ZlYXR1cmVTdGF0ZSc7XG4vLyBAdHMtZXhwZWN0LWVycm9yIGJ1bmRsZXIgd2lsbCB0YWtlIGNhcmUgb2YgdGhpc1xuaW1wb3J0IHN0eWxlcyBmcm9tICcuL3RhaWx3aW5kLmNzcyc7XG5cbmZ1bmN0aW9uIGNsYXNzTmFtZXMoLi4uY2xhc3Nlczogc3RyaW5nW10pOiBzdHJpbmcge1xuICByZXR1cm4gY2xhc3Nlcy5maWx0ZXIoQm9vbGVhbikuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBUb2dnbGVGZWF0dXJlKHsgZmVhdHVyZSB9OiB7IGZlYXR1cmU6IEZlYXR1cmVEZXNjcmlwdGlvbiB9KTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoRmVhdHVyZUNvbnRleHQpO1xuICBjb25zdCBoYW5kbGVDaGFuZ2VTZWxlY3Rpb24gPSB1c2VDYWxsYmFjayhcbiAgICAodmFsdWU6ICdmYWxzZScgfCAndHJ1ZScgfCAndW5zZXQnKSA9PiB7XG4gICAgICBpZiAoY29udGV4dD8ub3ZlcnJpZGVzU2VuZCAhPSBudWxsKSB7XG4gICAgICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgICAgICBjYXNlICd0cnVlJzoge1xuICAgICAgICAgICAgY29udGV4dC5vdmVycmlkZXNTZW5kKHsgdHlwZTogJ0VOQUJMRScsIG5hbWU6IGZlYXR1cmUubmFtZSB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlICdmYWxzZSc6IHtcbiAgICAgICAgICAgIGNvbnRleHQub3ZlcnJpZGVzU2VuZCh7IHR5cGU6ICdESVNBQkxFJywgbmFtZTogZmVhdHVyZS5uYW1lIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhc2UgJ3Vuc2V0Jzoge1xuICAgICAgICAgICAgY29udGV4dC5vdmVycmlkZXNTZW5kKHsgdHlwZTogJ1VOU0VUJywgbmFtZTogZmVhdHVyZS5uYW1lIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBbZmVhdHVyZS5uYW1lLCBjb250ZXh0XVxuICApO1xuXG4gIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHsgb3ZlcnJpZGVzU3RhdGUsIHRlc3Q6IHRlc3RGZWF0dXJlLCBkZWZhdWx0c1N0YXRlIH0gPSBjb250ZXh0O1xuXG4gIGNvbnN0IHZhbHVlSW5EZWZhdWx0cyA9ICh2YWx1ZU9mRmVhdHVyZShkZWZhdWx0c1N0YXRlLCBmZWF0dXJlLm5hbWUpWzBdID8/ICd1bnNldCcpLnRvU3RyaW5nKCkgYXNcbiAgICB8ICdmYWxzZSdcbiAgICB8ICd0cnVlJ1xuICAgIHwgJ3Vuc2V0JztcblxuICBjb25zdCB2YWx1ZUluT3ZlcnJpZGVzID0gKHZhbHVlT2ZGZWF0dXJlKG92ZXJyaWRlc1N0YXRlLCBmZWF0dXJlLm5hbWUpWzBdID8/ICd1bnNldCcpLnRvU3RyaW5nKCkgYXNcbiAgICB8ICdmYWxzZSdcbiAgICB8ICd0cnVlJ1xuICAgIHwgJ3Vuc2V0JztcblxuICBjb25zdCBhY3R1YWxDaGVja2VkID0gdGVzdEZlYXR1cmUoZmVhdHVyZS5uYW1lKTtcblxuICByZXR1cm4gKFxuICAgIDxSYWRpb0dyb3VwIGRpc2FibGVkPXtmZWF0dXJlLm5vT3ZlcnJpZGV9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2VTZWxlY3Rpb259IHZhbHVlPXt2YWx1ZUluT3ZlcnJpZGVzfT5cbiAgICAgIDxSYWRpb0dyb3VwLkxhYmVsPlxuICAgICAgICA8aDYgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTkwMCBhbGlnbi1jZW50ZXIgZmxleCBmbGV4LXJvdyBmbGV4LW5vd3JhcCBpdGVtcy1jZW50ZXIgZ2FwLTIgbGc6Z2FwLTQgaC03XCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tZWRpdW1cIj5cbiAgICAgICAgICAgIEZlYXR1cmU6IDxjb2RlPntmZWF0dXJlLm5hbWV9PC9jb2RlPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICB7ZmVhdHVyZS5ub092ZXJyaWRlID09PSB0cnVlID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItb3JhbmdlLTUwMCB0ZXh0LW9yYW5nZS01MDAgZmxleCBmbGV4LW5vd3JhcCB0ZXh0LXhzIGZsZXgtcm93IGdhcC0xIHJvdW5kZWQtc20gYm9yZGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBweC0yIHB5LTFcIj5cbiAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC00IHctNCBtaW4tdy00XCJcbiAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgZD1cIk01IDlWN2E1IDUgMCAwMTEwIDB2MmEyIDIgMCAwMTIgMnY1YTIgMiAwIDAxLTIgMkg1YTIgMiAwIDAxLTItMnYtNWEyIDIgMCAwMTItMnptOC0ydjJIN1Y3YTMgMyAwIDAxNiAwelwiXG4gICAgICAgICAgICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICA8ZGl2Pk5vIE92ZXJyaWRlczwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAge2FjdHVhbENoZWNrZWQgPT09IHRydWUgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1ub3dyYXAgdGV4dC14cyB0ZXh0LWdyZWVuLTUwMCBmbGV4LXJvdyBnYXAtMSByb3VuZGVkLXNtIGJvcmRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYm9yZGVyLWdyZWVuLTUwMCBweC0yIHB5LTFcIj5cbiAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC00IHctNCBtaW4tdy00XCJcbiAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgZD1cIk0xMCAxOGE4IDggMCAxMDAtMTYgOCA4IDAgMDAwIDE2em0zLjcwNy05LjI5M2ExIDEgMCAwMC0xLjQxNC0xLjQxNEw5IDEwLjU4NiA3LjcwNyA5LjI5M2ExIDEgMCAwMC0xLjQxNCAxLjQxNGwyIDJhMSAxIDAgMDAxLjQxNCAwbDQtNHpcIlxuICAgICAgICAgICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgPGRpdj57YWN0dWFsQ2hlY2tlZCA/ICdFbmFibGVkJyA6ICdEaXNhYmxlZCd9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9oNj5cbiAgICAgICAge2ZlYXR1cmUuZGVzY3JpcHRpb24gPT0gbnVsbCA/IG51bGwgOiA8cCBjbGFzc05hbWU9XCJ0ZXh0LWJhc2UgdGV4dC1ncmF5LTUwMCB0ZXh0LXNtXCI+e2ZlYXR1cmUuZGVzY3JpcHRpb259PC9wPn1cbiAgICAgIDwvUmFkaW9Hcm91cC5MYWJlbD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBncmlkIGdyaWQtY29scy0xIGdhcC15LTYgc206Z3JpZC1jb2xzLTMgc206Z2FwLXgtNFwiPlxuICAgICAgICB7W1xuICAgICAgICAgIHsgaWQ6ICd0cnVlJywgdGl0bGU6IGBFbmFibGUgJHtmZWF0dXJlLm5hbWV9YCwgZGVzY3JpcHRpb246ICdPdmVycmlkZSB0aGUgZmVhdHVyZSB0byBiZSBlbmFibGVkJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAndW5zZXQnLFxuICAgICAgICAgICAgdGl0bGU6ICdEZWZhdWx0JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSW5oZXJpdCBlbmFibGVkIHN0YXRlIGZyb20gZGVmYXVsdHMnLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IChmZWF0dXJlLm5vT3ZlcnJpZGUgPz8gZmFsc2UpIHx8IGZlYXR1cmUuZm9yY2UsXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6XG4gICAgICAgICAgICAgIHZhbHVlSW5EZWZhdWx0cyA9PT0gJ3RydWUnID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1ncmVlbi01MDAgYm9yZGVyLWdyZWVuLTUwMCBmbGV4IGZsZXgtbm93cmFwIHRleHQteHMgZmxleC1yb3cgZ2FwLTEgcm91bmRlZC1zbSBib3JkZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB4LTIgcHktMVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+RW5hYmxlZDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtcmVkLTUwMCBib3JkZXItcmVkLTUwMCBmbGV4IGZsZXgtbm93cmFwIHRleHQteHMgZmxleC1yb3cgZ2FwLTEgcm91bmRlZC1zbSBib3JkZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB4LTIgcHktMVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+RGlzYWJsZWQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IGlkOiAnZmFsc2UnLCB0aXRsZTogYERpc2FibGUgJHtmZWF0dXJlLm5hbWV9YCwgZGVzY3JpcHRpb246ICdPdmVycmlkZSB0aGUgZmVhdHVyZSB0byBiZSBkaXNhYmxlZCcgfSxcbiAgICAgICAgXS5tYXAoKG9wdGlvbikgPT4gKFxuICAgICAgICAgIDxSYWRpb0dyb3VwLk9wdGlvblxuICAgICAgICAgICAgY2xhc3NOYW1lPXsoeyBjaGVja2VkLCBhY3RpdmUsIGRpc2FibGVkIH0pID0+XG4gICAgICAgICAgICAgIGNsYXNzTmFtZXMoXG4gICAgICAgICAgICAgICAgY2hlY2tlZCA/ICdib3JkZXItdHJhbnNwYXJlbnQnIDogJ2JvcmRlci1ncmF5LTMwMCcsXG4gICAgICAgICAgICAgICAgIWRpc2FibGVkICYmIGFjdGl2ZSA/ICdib3JkZXItYmx1ZS01MDAgcmluZy0yIHJpbmctYmx1ZS01MDAnIDogJycsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQgPyAnYm9yZGVyLXRyYW5zcGFyZW50IHJpbmctZ3JheS01MDAgY3Vyc29yLW5vdC1hbGxvd2VkJyA6ICdjdXJzb3ItcG9pbnRlcicsXG4gICAgICAgICAgICAgICAgJ3JlbGF0aXZlIGJnLXdoaXRlIGJvcmRlciByb3VuZGVkLWxnIHNoYWRvdy1zbSBwLTMgZmxleCBmb2N1czpvdXRsaW5lLW5vbmUnXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtvcHRpb24uZGlzYWJsZWR9XG4gICAgICAgICAgICBrZXk9e29wdGlvbi5pZH1cbiAgICAgICAgICAgIHZhbHVlPXtvcHRpb24uaWR9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgeyh7IGNoZWNrZWQsIGFjdGl2ZSwgZGlzYWJsZWQgfSkgPT4gKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBncm93XCI+XG4gICAgICAgICAgICAgICAgICA8UmFkaW9Hcm91cC5MYWJlbCBhcz1cInNwYW5cIiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtbm93cmFwIGZsZXgtcm93IGdhcC0xIGl0ZW1zLWNlbnRlciBzcGFjZS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMCBncm93IHNocmlua1wiPntvcHRpb24udGl0bGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICB7b3B0aW9uLmRlZmF1bHRWYWx1ZSAhPSBudWxsID8gb3B0aW9uLmRlZmF1bHRWYWx1ZSA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyghY2hlY2tlZCA/ICdpbnZpc2libGUnIDogJycsICdoLTUgdy01IHRleHQtYmx1ZS01MDAgbWluLXctNCcpfVxuICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjAgMjBcIlxuICAgICAgICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBkPVwiTTEwIDE4YTggOCAwIDEwMC0xNiA4IDggMCAwMDAgMTZ6bTMuNzA3LTkuMjkzYTEgMSAwIDAwLTEuNDE0LTEuNDE0TDkgMTAuNTg2IDcuNzA3IDkuMjkzYTEgMSAwIDAwLTEuNDE0IDEuNDE0bDIgMmExIDEgMCAwMDEuNDE0IDBsNC00elwiXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgPC9SYWRpb0dyb3VwLkxhYmVsPlxuICAgICAgICAgICAgICAgICAgPFJhZGlvR3JvdXAuRGVzY3JpcHRpb24gYXM9XCJzcGFuXCIgY2xhc3NOYW1lPVwibXQtMSBmbGV4IGl0ZW1zLWNlbnRlciB0ZXh0LXNtIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICAgICAgICAgICAge29wdGlvbi5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICAgIDwvUmFkaW9Hcm91cC5EZXNjcmlwdGlvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgICAgICAhZGlzYWJsZWQgJiYgYWN0aXZlID8gJ2JvcmRlcicgOiAnYm9yZGVyLTInLFxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkID8gKGRpc2FibGVkID8gJ2JvcmRlci1ncmF5LTUwMCcgOiAnYm9yZGVyLWJsdWUtNTAwJykgOiAnYm9yZGVyLXRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgICAgJ2Fic29sdXRlIC1pbnNldC1weCByb3VuZGVkLWxnIHBvaW50ZXItZXZlbnRzLW5vbmUnXG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L1JhZGlvR3JvdXAuT3B0aW9uPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvUmFkaW9Hcm91cD5cbiAgKTtcbn1cblxuZnVuY3Rpb24gU2hhZG93Q29udGVudCh7IHJvb3QsIGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0Tm9kZTsgcm9vdDogRWxlbWVudCB9KSB7XG4gIHJldHVybiBSZWFjdERPTS5jcmVhdGVQb3J0YWwoY2hpbGRyZW4sIHJvb3QpO1xufVxuXG4vLy8gUGVybWl0IHVzZXJzIHRvIG92ZXJyaWRlIGZlYXR1cmUgZmxhZ3MgdmlhIGEgR1VJLlxuLy8vIFJlbmRlcnMgYSBzbWFsbCBmbG9hdGluZyBidXR0b24gaW4gbG93ZXIgbGVmdCBvciByaWdodCwgcHJlc3NpbmcgaXQgYnJpbmdzIHVwXG4vLy8gYSBsaXN0IG9mIGZlYXR1cmVzIHRvIHRvZ2dsZSBhbmQgdGhlaXIgY3VycmVudCBvdmVycmlkZSBzdGF0ZS4geW91IGNhbiBvdmVycmlkZSBvbiBvciBvdmVycmlkZSBvZmYsXG4vLy8gb3IgdW5zZXQgdGhlIG92ZXJyaWRlIGFuZCBnbyBiYWNrIHRvIGRlZmF1bHQgdmFsdWUuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbmV4cG9ydCBmdW5jdGlvbiBUb2dnbGVGZWF0dXJlcyh7IGRlZmF1bHRPcGVuID0gZmFsc2UgfTogeyBkZWZhdWx0T3Blbj86IGJvb2xlYW4gfSk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IFtyb290LCBzZXRDb3JlUm9vdF0gPSB1c2VTdGF0ZTxIVE1MRGl2RWxlbWVudCB8IG51bGw+KG51bGwpO1xuXG4gIGNvbnN0IHNldFJvb3QgPSAoaG9zdDogSFRNTERpdkVsZW1lbnQgfCBudWxsKSA9PiB7XG4gICAgaWYgKGhvc3QgPT0gbnVsbCB8fCByb290ICE9IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc2hhZG93Um9vdCA9IGhvc3Q/LmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcbiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgY29uc3QgcmVuZGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3R5bGUudGV4dENvbnRlbnQgPSBzdHlsZXM7XG4gICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgc2hhZG93Um9vdC5hcHBlbmRDaGlsZChyZW5kZXJEaXYpO1xuICAgIHNldENvcmVSb290KHJlbmRlckRpdik7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHJlZj17c2V0Um9vdH0gc3R5bGU9e3sgekluZGV4OiA5OTk5OSwgcG9zaXRpb246ICdmaXhlZCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzQwcHgnLCBib3R0b206IDAgfX0+XG4gICAgICB7cm9vdCAhPSBudWxsID8gKFxuICAgICAgICA8U2hhZG93Q29udGVudCByb290PXtyb290fT5cbiAgICAgICAgICA8VG9nZ2xlRmVhdHVyZVVud3JhcHBlZCBkZWZhdWx0T3Blbj17ZGVmYXVsdE9wZW59IC8+XG4gICAgICAgIDwvU2hhZG93Q29udGVudD5cbiAgICAgICkgOiBudWxsfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG4vLy8gTGlrZSBUb2dnbGVGZWF0dXJlcywgYnV0IGRvZXMgbm90IGluamVjdCBzdHlsZXMgaW50byBhIHNoYWRvdyBET00gcm9vdCBub2RlLlxuLy8vIHVzZWZ1bCBpZiB5b3UncmUgdXNpbmcgdGFpbHdpbmQuXG5leHBvcnQgZnVuY3Rpb24gVG9nZ2xlRmVhdHVyZVVud3JhcHBlZCh7IGRlZmF1bHRPcGVuID0gZmFsc2UgfTogeyBkZWZhdWx0T3Blbj86IGJvb2xlYW4gfSk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGRlZmF1bHRPcGVuKTtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoRmVhdHVyZUNvbnRleHQpO1xuXG4gIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIFdlIHdhbnQ6IFJlYWwgdmFsdWUgYWZ0ZXIgYWxsIG5lc3RpbmdzLCB2YWx1ZSBvZiB0aGUgb3ZlcnJpZGUuIHdlIHRvZ2dsZSBvdmVycmlkZVxuICBjb25zdCB7IGZlYXR1cmVzRGVzY3JpcHRpb24gfSA9IGNvbnRleHQ7XG5cbiAgaWYgKGZlYXR1cmVzRGVzY3JpcHRpb24ubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgYm90dG9tLTAgbGVmdC0wIG14LTggbXktOFwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIHRleHQtc20gZm9udC1tZWRpdW0gcC0xIGgtOCB3LTggYWxpZ24tbWlkZGxlIGN1cnNvci1wb2ludGVyIHJvdW5kZWQtZnVsbCBiZy1ibHVlLTYwMCB0ZXh0LXdoaXRlICBib3JkZXIgYm9yZGVyLXRyYW5zcGFyZW50IGp1c3RpZnktY2VudGVyIHRleHQtYmFzZSBmb250LW1lZGl1bSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctb2Zmc2V0LTIgZm9jdXM6cmluZy1ibHVlLTYwMCBzbTp0ZXh0LXNtXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKHRydWUpfVxuICAgICAgICAgIHRpdGxlPVwiVG9nZ2xlIGZlYXR1cmVzXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInctNiBoLTYgbWluLWgtNiBtaW4tdy02XCJcbiAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyMCAyMFwiXG4gICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICBkPVwiTTMgNmEzIDMgMCAwMTMtM2gxMGExIDEgMCAwMS44IDEuNkwxNC4yNSA4bDIuNTUgMy40QTEgMSAwIDAxMTYgMTNINmExIDEgMCAwMC0xIDF2M2ExIDEgMCAxMS0yIDBWNnpcIlxuICAgICAgICAgICAgICBmaWxsUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIHshb3BlbiA/IG51bGwgOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgei0xMCBpbnNldC0wIG92ZXJmbG93LXktYXV0b1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1lbmQganVzdGlmeS1mbGV4LXN0YXJ0IG14LTggbXktNCBtaW4taC1zY3JlZW4gcHQtNCBweC00IHBiLTEwIHNtOmJsb2NrIHNtOnAtMFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBpbmxpbmUtYmxvY2sgYWxpZ24tYm90dG9tIGJnLXdoaXRlIHJvdW5kZWQtbGcgcHgtNCBwdC01IHBiLTQgdGV4dC1sZWZ0IG92ZXJmbG93LWhpZGRlbiBzaGFkb3cteGwgdHJhbnNmb3JtIHRyYW5zaXRpb24tYWxsIHNtOm15LTggc206YWxpZ24tbWlkZGxlIHNtOnAtNiBsZzptYXgtdy1bODAlXSBtYXgtdy1mdWxsXCI+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xIHNtOm10LTNcIj5cbiAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmbGV4IGZsZXgtcm93IGdhcC00IGZsZXgtbm93cmFwIGl0ZW1zLWNlbnRlciBzcGFjZS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JvdyB0ZXh0LWxnIGxlYWRpbmctNiBmb250LW1lZGl1bSB0ZXh0LWdyYXktOTAwXCI+RmVhdHVyZSBGbGFnIE92ZXJyaWRlczwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTUwMFwiPlxuICAgICAgICAgICAgICAgICAgICBGZWF0dXJlcyBjYW4gYmUgZW5hYmxlZCBvciBkaXNhYmxlZCB1bmxlc3MgdGhleSBhcmUgZm9yY2VkIHVwc3RyZWFtLiBZb3UgY2FuIGFsc28gcmV2ZXJ0IHRvIGRlZmF1bHQuXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTZcIj5cbiAgICAgICAgICAgICAgICAgICAgPGZpZWxkc2V0IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTlcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGVnZW5kIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5GZWF0dXJlIEZsYWdzPC9sZWdlbmQ+XG4gICAgICAgICAgICAgICAgICAgICAge2ZlYXR1cmVzRGVzY3JpcHRpb24ubWFwKChmZWF0dXJlKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8VG9nZ2xlRmVhdHVyZSBmZWF0dXJlPXtmZWF0dXJlfSBrZXk9e2ZlYXR1cmUubmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktY2VudGVyIGl0ZW1zLWNlbnRlciBtdC01IHNtOm10LTZcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciB0ZXh0LXNtIGZvbnQtbWVkaXVtIHB0LTAgcGItMCBwci00IHBsLTQgaC04IGxlYWRpbmctNyBhbGlnbi1taWRkbGUgY3Vyc29yLXBvaW50ZXIgcm91bmRlZC1zbSBiZy1ibHVlLTYwMCB0ZXh0LXdoaXRlIGJvcmRlciBib3JkZXItdHJhbnNwYXJlbnQganVzdGlmeS1jZW50ZXIgdGV4dC1iYXNlIGZvbnQtbWVkaXVtIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1vZmZzZXQtMiBmb2N1czpyaW5nLWJsdWUtNjAwIHNtOnRleHQtc21cIlxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldE9wZW4oZmFsc2UpfVxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgRG9uZVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAic2lCQUFBLGdFQ0FBLG1EQVlPLFdBQXVCLEVBQXFELENBWm5GLFFBYUUsTUFBTyxDQUNMLEVBQWEsUUFBUSxTQUFTLEVBQUksR0FBTyxFQUFhLFFBQVEsVUFBVSxFQUFJLEdBQVEsT0FDcEYsUUFBYSxRQUFRLGNBQXJCLGNBQWtDLFFBQWxDLE9BQTJDLEVBQzdDLENBQ0YsQ0E0RU8sR0FBTSxHQUFpQixFQUErRCxDQUMzRixHQUFJLFVBQ0osUUFBUyxVQUNULFFBQVMsQ0FBQyxFQUVWLEdBQUksQ0FDRixPQUFRLENBQ04sQ0FBRSxPQUFRLGVBQWdCLEtBQU0sQUFBQyxHQUFLLENBcEc1QyxNQW9HK0MsWUFBSSxjQUFKLGNBQWlCLGtCQUFtQixLQUFLLEVBQ2xGLENBQUUsT0FBUSxTQUFVLENB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

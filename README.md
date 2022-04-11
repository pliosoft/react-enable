# React-Enable for feature flags

Easy and fast way to toggle features in your project.

Features include:

- Toggle parts of your project dynamically or at startup
- Built in state management for active features
- Roll your own state manager using the minimal functional interface

## Installation and usage

To install,

```sh
npm add --save react-enable react
```

Then most users will use it in the following manner:

```typescript
import React, { lazy } from 'react';
import { Features, ToggleFeature, Disable, Enable, FeatureDescription } from 'react-enable';

const NewVersion = lazy(() => import('./src/new-version'));
const OldVersion = lazy(() => import('./src/old-version'));

// All available features should be declared up-front, with default values
const FEATURES: FeatureDescription[] = [{ name: 'v2', defaultValue: true }];

function RestOfApp(): JSX.Element {
  return (
    <div>
      <Enable feature="v2">
        <NewVersion />
      </Enable>
      <Disable feature="v2">
        <OldVersion />
      </Disable>
    </div>
  );
}

function App(): JSX.Element {
  return (
    <Features features={FEATURES}>
      <RestOfApp />
      <ToggleFeatures />
    </Features>
  );
}
```

## Documentation

### `Features` component

Provides state and context for managing a set of features.

Available props:

- `features: FeatureDescription[]`: description of available features.
- `disableConsole?: boolean`: indicate the console API
  should not be enabled (default false)
- `storage?: Storage`: where to persist
  overrides (default `window.sessionStorage`)

### `Enabled` and `Disabled` components

Render children depending on which set of features are active.

Props:

- `feature: string | string[]`: if one of these is enabled,
  the children will render (or not, with Disabled)
- `allFeatures: string[]`: only if all the specified features are
  enabled will it render children (or not, with Disabled)

### Hooks

- `useEnabled(features: string | string[])`: return true
  if any specified features are enabled.
- `useAllEnabled(features: string | string[])`: return true
  if all specified features are enabled.
- `useAllDisabled(features: string | string[])`: return true
  if all specified features are disabled.
- `useDisabled(features: string | string[])`: return true
  iff any specified features are disabled.

### `ToggleFeatures` component

Renders all current features specified in `Features`,
and whether they are enabled or disabled,
with checkboxes to toggle them.
Rendered HTML has class `toggle-features` for custom styling.
You might use this in a Portal,
and style it to float on top of the screen in developer builds.

### `EnableContext` component

This component can be used if you want to do your own state management
or custom feature storage.
Instead of using `Features`,
you would wrap your tree,
providing a custom test function.

```js
  return (
    <EnableContext.Provider test={feature => myCustomFeatureEnabled(feature)}>
      ...
    </EnableContext.Provider>
  >
```

### `console` Interface

In addition to `ToggleFeatures`,
it is possible to toggle features on the console,
if configured.
To enable pass a boolean to `consoleOverride` prop
(you might want to feed this from an environment variable for
dev vs prod builds, for example):

```js
<Features features={FEATURES}>
  <RestOfApp />
</Features>
```

Then in the browser console,
you can use features:

```js
// toggle feature from enabled<->disabled, unset->enabled
window.feature.toggle('foo');

// force to enabled or disabled, respectively
window.feature.enable('foo');
window.feature.disable('foo');

// Unset the override, and hence let the default take over
window.feature.unset('foo');

// show all configured feature names and the current state of the feature
window.feature.listFeatures();
```

This can be useful for toggling features in production builds.

# React-Enable for feature flags

Easy and fast way to toggle features in your project.

Features include:

- Toggle parts of your project dynamically or at startup
- Percentage-based rollouts for gradual feature adoption and A/B testing
- Built in state management for active features
- Roll your own state manager using the minimal functional interface

## Installation and usage

**Requirements:** Node.js 18.0.0 or higher

To install,

```sh
npm add --save react-enable react
```

Then most users will use it in the following manner:

```typescript
import React, { lazy } from 'react';
import { Features, ToggleFeatures, Disable, Enable, FeatureDescription } from 'react-enable';

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

## Percentage-based Rollouts and A/B Testing

React-Enable supports gradual rollouts and A/B testing through percentage-based feature flags. This allows you to enable features for a specific percentage of users.

```typescript
import { Features, Enable } from 'react-enable';

// Enable the feature for 30% of users
const FEATURES: FeatureDescription[] = [
  { name: 'newDesign', enableFor: 0.3 }  // 30% rollout
];

function App(): JSX.Element {
  const userId = getUserId(); // Get a stable user identifier

  return (
    <Features features={FEATURES} rolloutStableId={userId}>
      <Enable feature="newDesign">
        <NewDesign />
      </Enable>
      <Disable feature="newDesign">
        <OldDesign />
      </Disable>
    </Features>
  );
}
```

### Key Features

- **Deterministic Assignment**: The same user (based on `rolloutStableId`) will always see the same features, ensuring consistent user experience
- **Auto-generated IDs**: If `rolloutStableId` is not provided, an ID is automatically generated and persisted to sessionStorage
- **Gradual Rollouts**: Easily increase feature adoption by adjusting the `enableFor` value (0.0 to 1.0)
- **A/B Testing**: Use different percentage values to test multiple feature variants

### Best Practices

- Use a stable user identifier (user ID, session ID, etc.) for `rolloutStableId` to ensure consistency across page loads
- Start with small percentages (e.g., 0.05 for 5%) and gradually increase as you validate the feature
- Combine with manual overrides using `ToggleFeatures` component for testing

## Documentation

### `Features` component

Provides state and context for managing a set of features.

Available props:

- `features: FeatureDescription[]`: description of available features.
- `rolloutStableId?: string`: stable identifier for percentage-based rollouts
  (e.g., user ID, session ID). If not provided, an ID is auto-generated
  and persisted to sessionStorage
- `disableConsole?: boolean`: indicate the console API
  should not be enabled (default false)
- `storage?: Storage`: where to persist
  overrides (default `window.sessionStorage`)

### `FeatureDescription` type

Defines a feature flag with the following properties:

- `name: string`: unique identifier for the feature
- `defaultValue?: boolean`: whether the feature is enabled by default (default false)
- `enableFor?: number`: percentage of users to enable this feature for (0.0 to 1.0).
  When specified, this takes precedence over `defaultValue` and uses deterministic
  hashing based on `rolloutStableId` to ensure consistent assignment

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

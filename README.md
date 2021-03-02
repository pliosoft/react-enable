# React-Enable for feature flags

Easy and fast way to toggle features in your project.

Features include:

* Toggle parts of your project dynamically or at startup
* Built in state management for active features
* Roll your own state manager using the minimal functional interface

## Installation and usage

To install,

```sh
npm add --save react-enable react fp-ts
```

Then most users will use it in the following manner:

```js
import React, { lazy } from 'react'
import { Features, Enable } from 'react-enable'

const NewVersion = lazy(() => import('./src/new-version'))
const OldVersion = lazy(() => import('./src/old-version'))

// All available features should be declared up-front
const FEATURES : Feature[] = [
  { name: "fancy-feature" }
]

// Perhaps from backend, or from build environment
const ENABLED = ["fancy-feature"]

const RestOfApp : FC = () => {
  return (
    <div>
      <Enable feature="fancy-feature">
        <NewVersion />
      </Enable>
      <Disable feature="fancy-feature">
        <OldVersion />
      </Disable>
    </div>
  )
}

const App : FC = () => {
  return (
    <Features features={FEATURES} defaultEnabled={ENABLED}>
      <RestOfApp />
      <ToggleFeatures />
    </Features>
  )
}
```

## Documentation

### `Features` component

Provides state and context for managing a set of features.

props:

- `features: Feature[]`: list of available features.
- `defaultEnabled`: list of enabled features at startup. Does not update after mount.

### `Enabled` and `Disabled` components

Render children depending on which set of features are active.

props:

- `feature: string | string[]`: if one of these is enabled, the children will render (or not, with Disabled)
- `allFeatures: string[]`: only if all of the specified features are enabled will it render children (or not, with Disabled)

### Hooks

- `useEnabled(features: string | string[])`: return true iff any specified features are enabled.
- `useAllEnabled(features: string | string[])`:  return true iff all specified features are enabled.
- `useAllDisabled(features: string | string[])`: return true iff all specified features are disabled.
- `useDisabled(features: string | string[])`: return true iff any specified features are disabled.

### `ToggleFeatures` component

Renders all current features specified in `Features`, 
 and whether they are enabled or disabled,
  with checkboxes to toggle them.
Rendered html has class `toggle-features` for custom styling. 
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
 (you might want to feed this from an environment variable for dev vs prod builds, for example):

```js
    <Features features={FEATURES} enabled={ENABLED} consoleOverride={true}>
      <RestOfApp />
    </Features>
```

Then in the browser console, 
 you can toggle features:

```js
> window.feature.enable("foo")
> window.feature.disable("foo")
```

This can be useful for toggling features in production builds.


# React-Enable for feature flags

Easy and fast way to toggle features in your project.

Features include:

* Toggle parts of your project dynamically or at startup
* Built in state management for active features
* Roll your own state manager using the minimal functional interface

## Installation and usage

To install,

```sh
npm add --save react-enable
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
      <Enable without="fancy-feature">
        <OldVersion />
      </Enable>
    </div>
  )
}

const App : FC = () => {
  return (
    <Features features={FEATURES} enabled={ENABLED}>
      <RestOfApp />
    </Features>
  )
}
```

## Documentation

### `Features` component

Provides state and context for managing a set of features.

props:

- `features: Feature[]`: list of available features
- `enabled`: list of enabled features

### `Enabled` component

Render children depending on which set of features are active.

props:

- `feature: string | string[]`: if one of these is enabled, the children will render
- `allFeatures: string[]`: enable only if all of the specified features are enabled
- `without: string | string[]`: if one of these is enabled, the children will not render (even if `feature`
  or `allFeatures` props indicate it should be enabled)
- `withoutAll: string[]`: if none of features in list are specified, children will render

### `ToggleFeatures` component

Renders all current features specified in `Features`, and whether they are enabled or disabled,
with checkboxes to toggle them.
Rendered html has class `toggle-features` for custom styling. You might use this a Portal,
and style it to float on top of the screen in developer builds.

### `EnableContext` component

This component can be used if you want to do your own state management.
Instead of using `Features`, you would wrap your tree, providing a custom test function.

```js
  return (
    <EnableContext.Provider test={(feature) => myCustomFeatureEnabled(feature)}>
      ...
    </EnableContext.Provider>
  >
```

### Hooks

- `useAllEnabled(features: string[])`:  return true iff all specified features are enabled.
- `useAllDisabled(features: string[])`: return true iff all specified features are disabled.
- `useEnabled(features: string | string[])`: return true iff any specified features are enabled.
- `useDisabled(features: string | string[])`: return true iff any specified features are disabled.


### `console` Interface

In addition to ToggleFeatures, it is possible to toggle features on the console, if configured. To enable,
pass a boolean to `consoleOverride` prop (you might want to feed this from an environment variable for dev vs
prod builds, for example):

```js
    <Features features={FEATURES} enabled={ENABLED} consoleOverride={true}>
      <RestOfApp />
    </Features>
```

Then, in the browser console, you can toggle features:

```js
> window.features.enable("foo")
> window.features.disable("foo")
```


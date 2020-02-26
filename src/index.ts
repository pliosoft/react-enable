import {
  FC,
  createElement as h,
  Dispatch,
  Fragment,
  createContext,
  Reducer,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
  useContext
} from 'react'

interface EnableProps {
  readonly feature?: string | string[]
  readonly without?: string | string[]

  readonly allFeatures?: string[]
  readonly withoutAll?: string[]
}

type EnableContextType = (feature: String) => boolean

/**
 * Provide a function that can be used to check whether a given feature is enabled.
 */
export const EnableContext = createContext<EnableContextType>((_s) => false)

/**
 * Given a feature name (or names), will determine if that feature (or any one) is enabled
 * Second argument allows for negation.
 */
export function useEnabledFull(props: EnableProps): boolean {
  const {feature = [], without = [], allFeatures = [], withoutAll = []} = props
  const test = useContext(EnableContext)
  if (test == null) {
    return false
  }

  let someFeatureList = Array.isArray(feature) ? feature : [feature]
  let maybeEnabled = someFeatureList.some(test) || allFeatures.every(test)
  if (!maybeEnabled) {
    return false
  }

  let someWithoutList = Array.isArray(without) ? without : [without]
  let maybeDisabled = someWithoutList.some(test) || withoutAll.every(test)
  if (maybeDisabled) {
    return false
  }

  return true
}

/**
 * returns true iff all specified features are enabled
 */
export function useAllEnabled(allFeatures: string[]) {
  return useEnabledFull({allFeatures})
}

/**
 * returns true iff all specified features are disabled
 */
export function useAllDisabled(withoutAll: string[]) {
  return useEnabledFull({withoutAll})
}

/**
 * returns true iff any specified feature is enabled
 */
export function useEnabled(feature: string | string[]) {
  return useEnabledFull({feature})
}

/**
 * returns true iff any specified feature is disabled
 */
export function useDisabled(without: string | string[]) {
  return useEnabledFull({without})
}

/**
 * Feature will be enabled if any feature in the list are enabled, but without wins.
 * This allows you to enable things except if some other feature is active, for instance.
 */
export const Enable: FC<EnableProps> = ({
  feature = [], without = [], allFeatures = [], withoutAll = [], children
}) => {
  if (useEnabledFull({feature, without, allFeatures, withoutAll})) {
    return h(Fragment, {}, children)
  }

  return null
}

interface Feature {
  readonly name: string
  readonly description?: string
}

interface EnableState {
  readonly features: Feature[]
  readonly active: Set<string>
}

interface DisableFeature {
  type: 'disable'
  readonly feature: string
}

interface ToggleFeature {
  type: 'toggle'
  readonly feature: string
}

interface EnableFeature {
  type: 'enable'
  readonly feature: string
}

interface SetActiveFeatures {
  type: 'set-active'
  readonly active: string[]
}

type EnableAction =
  | EnableFeature
  | DisableFeature
  | ToggleFeature
  | SetActiveFeatures

const reducer: Reducer<EnableState, EnableAction> = (state, action) => {
  switch (action.type) {
    case 'enable': {
      state.active.add(action.feature)
      return {
        ...state,
        active: state.active
      }
    }

    case 'disable': {
      state.active.delete(action.feature)
      return {
        ...state,
        active: state.active
      }
    }

    case 'toggle': {
      if (state.active.has(action.feature)) {
        state.active.delete(action.feature)
      }
      else {
        state.active.add(action.feature)
      }

      return {
        ...state,
        active: state.active
      }
    }

    case 'set-active': {
      return {
        ...state,
        active: new Set(action.active)
      }
    }

    default:
      throw new Error("Unsupported action")
  }
}

interface FeatureProps {
  readonly features: Feature[]
  readonly active: string[]
}

class GlobalEnable {
  readonly dispatch: Dispatch<EnableAction>

  constructor(dispatch: Dispatch<EnableAction>) {
    this.dispatch = dispatch
  }

  public toggle(feature: string) {
    this.dispatch({type: 'toggle', feature})
  }

  public enable(feature: string) {
    this.dispatch({type: 'enable', feature})
  }

  public disable(feature: string) {
    this.dispatch({type: 'disable', feature})
  }
}

declare global {
  interface Window {
    feature?: GlobalEnable
  }
}

interface FeatureContextType {
  dispatch: Dispatch<EnableAction>
  state: EnableState
}

const FeatureContext = createContext<FeatureContextType | null>(null)

/**
 * A more batteries-enabled parent component that keeps track of feature state
 * internally, and creates window.feature.enable("f") and window.feature.disable("f").
 */
export const Features: FC<FeatureProps> = ({features, active, children}) => {
  const initial: EnableState = {features, active: new Set(active)}
  const [state, dispatch] = useReducer(reducer, initial)

  useEffect(() => {
    dispatch({type: 'set-active', active})
  }, [active])

  useEffect(() => {
    window.feature = new GlobalEnable(dispatch)
    return () => {
      window.feature = undefined
    }
  }, [dispatch])

  const featureValue = useMemo(() => (
    {dispatch, state}
  ), [dispatch, state])

  const testCallback = useCallback((f: string) =>
    state.active.has(f), [state, state.active])

  return (
    h(FeatureContext.Provider, {value: featureValue},
      h(EnableContext.Provider, {value: testCallback},
        children
      )
    )
  )
}

// A GUI for toggling features that are configured by nearest `Features` parent.
// might be put into a floating window that can be mounted in a portal, and then
// dev users can toggle features.
export const ToggleFeatures: FC = () => {
  const context = useContext(FeatureContext)
  if (context == null) {
    return null
  }

  const {dispatch, state} = context

  const handleChange = useCallback(feature => {
    dispatch({type: 'toggle', feature})
  }, [dispatch])

  return h("aside", {className: "toggle-features"},
    state.features.map(feature =>
      h("div", {}, [
        h("h4", {}, [
          h("main", {}, feature.name),
        ]),
        h("h5", {}, feature.description),
        h("input", {
          "type": "checkbox",
          onChange: () => handleChange(feature.name),
          value: state.active.has(feature.name)
        },
          [])
      ])
    )
  )

}



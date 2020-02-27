import * as React from 'react'
import {insert, remove, elem, fromArray} from 'fp-ts/lib/Set'
import {eqString} from 'fp-ts/lib/Eq'

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
export const EnableContext = React.createContext<EnableContextType>((_s) => false)

/**
 * Given a feature name (or names), will determine if that feature (or any one) is enabled
 * Second argument allows for negation.
 */
export function useEnabledFull(props: EnableProps): boolean {
  const {feature = [], without = [], allFeatures = [], withoutAll = []} = props
  const test = React.useContext(EnableContext)
  if (test == null) {
    return false
  }

  let someFeatureList = Array.isArray(feature) ? feature : [feature]
  let maybeEnabled = someFeatureList.some(test) || allFeatures.length > 0 && allFeatures.every(test)
  if (!maybeEnabled && feature.length > 0) {
    return false
  }

  let someWithoutList = Array.isArray(without) ? without : [without]
  let maybeDisabled = someWithoutList.some(test) || withoutAll.length > 0 && withoutAll.every(test)
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
export const Enable: React.FC<EnableProps> = ({
  feature = [], without = [], allFeatures = [], withoutAll = [], children
}) => {
  if (useEnabledFull({feature, without, allFeatures, withoutAll})) {
    return <>{children}</>
  }

  return null
}

export interface Feature {
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

const insertStr = insert(eqString)
const removeStr = remove(eqString)
const elemStr = elem(eqString)

const reducer: React.Reducer<EnableState, EnableAction> = (state, action) => {
  switch (action.type) {
    case 'enable': {
      //state.active.add(action.feature)
      return {
        ...state,
        active: insertStr(action.feature)(state.active)
      }
    }

    case 'disable': {
      return {
        ...state,
        active: removeStr(action.feature)(state.active)
      }
    }

    case 'toggle': {

      return {
        ...state,
        active: (elemStr(action.feature, state.active)) ?
          removeStr(action.feature)(state.active) :
          insertStr(action.feature)(state.active)
      }
    }

    case 'set-active': {
      return {
        ...state,
        active: fromArray(eqString)(action.active)
      }
    }

    default:
      throw new Error("Unsupported action")
  }
}

interface FeatureProps {
  readonly features: Feature[]
  readonly defaultEnabled: string[]
  readonly consoleOverride?: boolean
}

class GlobalEnable {
  private readonly dispatch: React.Dispatch<EnableAction>

  constructor(dispatch: React.Dispatch<EnableAction>) {
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
  dispatch: React.Dispatch<EnableAction>
  state: EnableState
}

const FeatureContext = React.createContext<FeatureContextType | null>(null)

/**
 * A more batteries-enabled parent component that keeps track of feature state
 * internally, and creates window.feature.enable("f") and window.feature.disable("f").
 */
export const Features: React.FC<FeatureProps> = ({features, defaultEnabled, consoleOverride = false, children}) => {
  const initial: EnableState = {features, active: new Set(defaultEnabled)}
  const [state, dispatch] = React.useReducer(reducer, initial)

  React.useEffect(() => {
    if (!consoleOverride) {
      return () => { /* empty */}
    }
    window.feature = new GlobalEnable(dispatch)
    return () => {
      window.feature = undefined
    }
  }, [dispatch])

  const featureValue = React.useMemo(() => (
    {dispatch, state}
  ), [dispatch, state, state.active])

  const testCallback = React.useCallback((f: string) =>
    state.active.has(f), [state, state.active])

  return (
    <FeatureContext.Provider value={featureValue}>
      <EnableContext.Provider value={testCallback}>
        {children}
      </EnableContext.Provider>
    </FeatureContext.Provider>
  )
}

// A GUI for toggling features that are configured by nearest `Features` parent.
// might be put into a floating window that can be mounted in a portal, and then
// dev users can toggle features.
export const ToggleFeatures: React.FC = () => {
  const [hide, setHide] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)
  const dragElement = React.useRef<HTMLDivElement | null>(null)
  const start = React.useRef([100, 100])
  const offset = React.useRef([0, 0])
  const [current, setCurrent] = React.useState([0, 0])
  const context = React.useContext(FeatureContext)

  const handleMouseMove = React.useCallback((e) => {
    e.preventDefault()
    setCurrent([
      (e.clientX - start.current[0]) - offset.current[0],
      (e.clientY - start.current[1]) - offset.current[1]
    ])
  }, [setCurrent, start, offset])

  const handleMouseUp = React.useCallback((e) => {
    e.preventDefault()
    setDragging(false)
  }, [setDragging])


  React.useEffect(() => {
    if (!dragging) {
      return () => {/* */}
    }
    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [dragging, handleMouseMove])

  const position = React.useMemo(() =>
    [start.current[0] + current[0], start.current[1] + current[1]]
    , [start.current[0], start.current[1], current[0], current[1]])

  const handleMouseDown = React.useCallback((e) => {
    e.preventDefault()
    offset.current = [e.clientX - position[0], e.clientY - position[1]]
    start.current = [position[0], position[1]]
    setCurrent([
      (e.clientX - start.current[0]) - offset.current[0],
      (e.clientY - start.current[1]) - offset.current[1]
    ])
    setDragging(true)
  }, [setDragging, start, offset, position[0], position[1]])

  React.useEffect(() => {
    dragElement.current?.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      dragElement.current?.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dragElement, handleMouseDown, handleMouseUp])


  if (context == null) {
    return null
  }
  const {dispatch, state} = context

  if (state.features.length === 0) {
    return null
  }

  return (
    <aside className="feature-flags" style={{
      position: "fixed",
      left: `${position[0]}px`,
      top: `${position[1]}px`,
      width: "200px",
      height: "100px",
      background: "white",
      border: "1px solid gray",
      zIndex: 100000,
      opacity: "0.7",
      display: hide ? "none" : "flex",
      flexDirection: "column"
    }}>
      <div style={{
        display: "flex",
        borderBottom: "1px solid gray",
        background: "#eee",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 0 0 10px"

      }}>
        <button onClick={() => setHide(true)}>Hide</button>
        <span>Toggle Features</span>
        <div ref={dragElement} style={{
          fontSize: "28px",
          cursor: "move",
          width: "27px",
          height: "32px",
          lineHeight: "30px",
        }}>⦷</div>
      </div>
      {state.features.map(feature => (
        <div key={feature.name}>
          <label>
            <input
              type="checkbox"
              onChange={() => {
                dispatch({type: 'toggle', feature: feature.name})
              }}
              checked={state.active.has(feature.name)} />
            {feature.name}
          </label>
          {feature.description != null ? <p style={{
            marginTop: "0",
            marginLeft: "1.5em",
            fontSize: "0.5rem",
            lineHeight: "0.5rem"
          }}>{feature.description}</p> : null}
        </div>))}
    </aside>
  )

}



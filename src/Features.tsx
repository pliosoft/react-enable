import * as React from 'react';
import { EnableContext } from './EnableContext';
import { FeatureContext } from './FeatureContext';
import { FeatureDescription } from './FeatureState';
import { useMachine } from '@xstate/react';
import { FeaturesMachine } from './FeaturesState';
import useConsoleOverride from './useConsoleOverride';
import useTestCallback from './useTestCallback';
import usePersist from './usePersist';

interface FeatureProps {
  readonly features: readonly FeatureDescription[];
  readonly children: React.ReactNode;
  readonly disableConsole?: boolean;
  readonly storage?: Storage;
}

/**
 * A more batteries-enabled parent component that keeps track of feature state
 * internally, and creates window.feature.enable("f") and window.feature.disable("f").
 * Keeps track of overrides and defaults, with defaults potentially coming from your props
 * and overrides being persisted to your choice of storage layer.
 */
export function Features({
  children,
  features,
  disableConsole = false,
  storage = window.sessionStorage,
}: FeatureProps): JSX.Element {
  // Capture only first value; we don't care about future updates
  const featuresRef = React.useRef(features);
  const [overridesState, overridesSend] = useMachine(FeaturesMachine);
  const [defaultsState, defaultsSend] = useMachine(FeaturesMachine);

  React.useEffect(() => {
    /// Load the user overrides
    defaultsSend({ type: 'INIT', features: featuresRef.current });
    overridesSend({ type: 'INIT', features: featuresRef.current });
    return () => {
      // Forget features if we change them
      defaultsSend({ type: 'DE_INIT' });
      overridesSend({ type: 'DE_INIT' });
    };
  }, [featuresRef]);

  usePersist(storage, overridesSend, featuresRef.current, overridesState);

  const testCallback = useTestCallback([defaultsState, overridesState]);
  useConsoleOverride(!disableConsole, featuresRef.current, testCallback, defaultsSend);

  const featureValue = React.useMemo(
    () => ({
      send: overridesSend,
      featuresDescription: featuresRef.current,
      overridesState,
      defaultsState,
      test: testCallback,
    }),
    [overridesState, featuresRef, overridesSend, testCallback]
  );

  return (
    <FeatureContext.Provider value={featureValue}>
      <EnableContext.Provider value={testCallback}>{children}</EnableContext.Provider>
    </FeatureContext.Provider>
  );
}

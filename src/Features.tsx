import { useMachine } from '@xstate/react';
import React, { type ReactNode, useEffect, useMemo, useRef } from 'react';

import { EnableContext } from './EnableContext';
import { FeatureContext } from './FeatureContext';
import type { FeatureDescription } from './FeatureState';
import { FeaturesMachine } from './FeaturesState';
import useConsoleOverride from './useConsoleOverride';
import usePersist, { KEY } from './usePersist';
import useTestCallback from './useTestCallback';

interface FeatureProps {
  readonly features: readonly FeatureDescription[];
  readonly children?: ReactNode;
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
  const featuresRef = useRef(features);
  const [overridesState, overridesSend] = useMachine(FeaturesMachine);
  const [defaultsState, defaultsSend] = useMachine(FeaturesMachine);

  useEffect(() => {
    /// Load defaults
    defaultsSend({ type: 'INIT', features });
    return () => {
      defaultsSend({ type: 'DE_INIT' });
    };
  }, [defaultsSend, features]);

  useEffect(() => {
    let f: Record<string, boolean | undefined> = {};
    if (storage != null) {
      try {
        const featuresJson = storage.getItem(KEY);
        if (featuresJson != null) {
          const fh = JSON.parse(featuresJson);
          f = fh.overrides;
        }
      } catch (e) {
        // Can't parse or get or otherwise; ignore
        console.error('error in localStorage', e);
      }
    }

    overridesSend({
      type: 'INIT',
      features: featuresRef.current
        .filter((x) => x.noOverride !== true)
        .map((x) => ({
          name: x.name,
          description: x.description,
          defaultValue: f?.[x.name] ?? undefined,
        })),
    });

    return () => {
      overridesSend({ type: 'DE_INIT' });
    };
  }, [featuresRef, overridesSend, storage]);

  usePersist(storage, featuresRef.current, overridesState);

  const testCallback = useTestCallback(overridesState, defaultsState);
  useConsoleOverride(
    !disableConsole,
    featuresRef.current,
    testCallback,
    defaultsSend,
  );

  const featureValue = useMemo(
    () => ({
      overridesSend,
      defaultsSend,
      featuresDescription: featuresRef.current,
      overridesState,
      defaultsState,
      test: testCallback,
    }),
    [overridesSend, defaultsSend, overridesState, defaultsState, testCallback],
  );

  return (
    <FeatureContext.Provider value={featureValue}>
      <EnableContext.Provider value={testCallback}>
        {children}
      </EnableContext.Provider>
    </FeatureContext.Provider>
  );
}

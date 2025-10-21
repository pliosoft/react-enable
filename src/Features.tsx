import type * as React from 'react';
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { EnableContext } from './EnableContext';
import { FeatureContext } from './FeatureContext';
import type { FeatureDescription } from './FeatureState';
import { featuresReducer, initialFeaturesState } from './FeaturesState';
import useConsoleOverride from './useConsoleOverride';
import usePersist, { KEY } from './usePersist';
import useTestCallback from './useTestCallback';

const ROLLOUT_ID_KEY = 'react-enable:rollout-stable-id';

interface FeatureProps {
  readonly features: readonly FeatureDescription[];
  readonly children?: ReactNode;
  readonly disableConsole?: boolean;
  readonly storage?: Storage;

  /// Stable identifier for percentage-based rollouts. If not provided, one will be
  /// auto-generated and persisted to storage. This ensures consistent feature assignment
  /// for the same user/session across page loads.
  readonly rolloutStableId?: string;
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
  rolloutStableId,
}: FeatureProps): React.JSX.Element {
  // Capture only first value; we don't care about future updates
  const featuresRef = useRef(features);

  // Generate or retrieve stable ID for rollouts
  const stableId = useMemo(() => {
    if (rolloutStableId != null) {
      return rolloutStableId;
    }

    // Try to retrieve existing ID from storage
    if (storage != null) {
      try {
        const existingId = storage.getItem(ROLLOUT_ID_KEY);
        if (existingId != null) {
          return existingId;
        }
      } catch (_e) {
        // Can't read from storage; generate new ID
      }
    }

    // Generate new stable ID
    const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Persist to storage
    if (storage != null) {
      try {
        storage.setItem(ROLLOUT_ID_KEY, newId);
      } catch (_e) {
        // Can't persist; ID will still work for this session
      }
    }

    return newId;
  }, [rolloutStableId, storage]);
  const [overridesState, overridesDispatch] = useReducer(
    featuresReducer,
    initialFeaturesState,
  );
  const [defaultsState, defaultsDispatch] = useReducer(
    featuresReducer,
    initialFeaturesState,
  );

  useLayoutEffect(() => {
    /// Load defaults
    defaultsDispatch({ type: 'INIT', features });
    return () => {
      defaultsDispatch({ type: 'DE_INIT' });
    };
  }, [features]);

  useLayoutEffect(() => {
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

    overridesDispatch({
      type: 'INIT',
      features: (featuresRef.current ?? [])
        .filter((x) => x.noOverride !== true)
        .map((x) => ({
          name: x.name,
          description: x.description,
          defaultValue: f?.[x.name] ?? undefined,
        })),
    });

    return () => {
      overridesDispatch({ type: 'DE_INIT' });
    };
  }, [storage]);

  // Handle async operations for features with onChangeDefault
  useEffect(() => {
    if (defaultsState.value !== 'ready') {
      return;
    }

    // Check for features in async states and handle them
    Object.entries(defaultsState.context.features).forEach(
      ([name, feature]) => {
        if (
          feature.value === 'asyncEnabled' ||
          feature.value === 'asyncDisabled' ||
          feature.value === 'asyncUnspecified'
        ) {
          const targetValue =
            feature.value === 'asyncEnabled'
              ? true
              : feature.value === 'asyncDisabled'
                ? false
                : undefined;

          const onChangeDefault = feature.featureDesc?.onChangeDefault;
          if (onChangeDefault != null && feature.featureDesc != null) {
            onChangeDefault(feature.featureDesc.name, targetValue)
              .then((result) => {
                defaultsDispatch({ type: 'ASYNC_DONE', name, value: result });
              })
              .catch(() => {
                defaultsDispatch({
                  type: 'ASYNC_DONE',
                  name,
                  value: undefined,
                });
              });
          }
        }
      },
    );
  }, [defaultsState]);

  usePersist(storage, featuresRef.current, overridesState);

  const testCallback = useTestCallback(overridesState, defaultsState, stableId);
  useConsoleOverride(
    !disableConsole,
    featuresRef.current,
    testCallback,
    defaultsDispatch,
  );

  const featureValue = useMemo(
    () => ({
      overridesSend: overridesDispatch,
      defaultsSend: defaultsDispatch,
      featuresDescription: featuresRef.current,
      overridesState,
      defaultsState,
      test: testCallback,
    }),
    [overridesState, defaultsState, testCallback],
  );

  return (
    <FeatureContext.Provider value={featureValue}>
      <EnableContext.Provider value={testCallback}>
        {children}
      </EnableContext.Provider>
    </FeatureContext.Provider>
  );
}

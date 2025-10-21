import * as React from 'react';
import { Dispatch, ReactNode } from 'react';

interface EnableProps {
    readonly feature?: string[] | string;
    readonly allFeatures?: string[];
    children: React.ReactNode;
}
/**
 * Feature will be enabled if any feature in the list are enabled,
 */
declare function Enable({ feature, allFeatures, children, }: EnableProps): JSX.Element | null;

/**
 * Feature will be disabled if any in the list are enabled
 */
declare const Disable: React.FC<EnableProps>;

/**
 * Feature is either on, off, or 'unset',
 * which means it will go to the default value or the less specific value.
 */
type FeatureValue = false | true | undefined;
type FeatureStateValue = 'initial' | 'enabled' | 'disabled' | 'unspecified' | 'asyncEnabled' | 'asyncDisabled' | 'asyncUnspecified';
interface FeatureState {
    value: FeatureStateValue;
    featureDesc?: FeatureDescription;
}
type FeatureDispatch = Dispatch<FeatureAction>;
/**
 * Definition of a feature that can be enabled or disabled.
 * K is the type of the key that is used to identify the feature.
 */
interface FeatureDescription<K extends string = string> {
    readonly name: K;
    readonly description?: string;
    readonly onChangeDefault?: (name: K, newValue: FeatureValue) => Promise<FeatureValue>;
    readonly force?: boolean;
    readonly noOverride?: boolean;
    readonly defaultValue?: FeatureValue;
    readonly enableFor?: number;
}
/**
 * Actions that can be performed on a feature.
 */
type FeatureAction = {
    type: 'DISABLE';
} | {
    type: 'ENABLE';
} | {
    type: 'INIT';
    feature: FeatureDescription;
} | {
    type: 'SET';
    value: FeatureValue;
} | {
    type: 'TOGGLE';
} | {
    type: 'UNSET';
} | {
    type: 'ASYNC_DONE';
    value: FeatureValue;
};

type EnableContextType = (feature: string) => FeatureValue;
/**
 * Contained function can check whether a given feature is enabled.
 */
declare const EnableContext: React.Context<EnableContextType>;

interface FeaturesContext {
    features: {
        [x: string]: FeatureState;
    };
}
type FeaturesAction = {
    type: 'DE_INIT';
} | {
    type: 'DISABLE';
    name: string;
} | {
    type: 'ENABLE';
    name: string;
} | {
    type: 'INIT';
    features: readonly FeatureDescription[];
} | {
    type: 'SET_ALL';
    features: {
        [key: string]: FeatureValue;
    };
} | {
    type: 'SET';
    name: string;
    value: FeatureValue;
} | {
    type: 'TOGGLE';
    name: string;
} | {
    type: 'UNSET';
    name: string;
} | {
    type: 'ASYNC_DONE';
    name: string;
    value: FeatureValue;
};
interface FeaturesState {
    value: 'idle' | 'ready';
    context: FeaturesContext;
}
type FeaturesDispatch = Dispatch<FeaturesAction>;

interface FeatureContextType {
    overridesSend: FeaturesDispatch;
    defaultsSend: FeaturesDispatch;
    featuresDescription: readonly FeatureDescription[];
    overridesState: FeaturesState;
    defaultsState: FeaturesState;
    test: (flag: string) => FeatureValue;
}

interface FeatureProps {
    readonly features: readonly FeatureDescription[];
    readonly children?: ReactNode;
    readonly disableConsole?: boolean;
    readonly storage?: Storage;
    readonly rolloutStableId?: string;
}
/**
 * A more batteries-enabled parent component that keeps track of feature state
 * internally, and creates window.feature.enable("f") and window.feature.disable("f").
 * Keeps track of overrides and defaults, with defaults potentially coming from your props
 * and overrides being persisted to your choice of storage layer.
 */
declare function Features({ children, features, disableConsole, storage, rolloutStableId, }: FeatureProps): JSX.Element;

declare function ToggleFeatures({ defaultOpen, hidden, }: {
    defaultOpen?: boolean;
    hidden?: boolean;
}): JSX.Element | null;

/**
 * returns true iff all specified features are disabled
 */
declare function useAllDisabled(withoutAll: string[] | string): boolean;

/**
 * returns true iff all specified features are enabled
 */
declare function useAllEnabled(allFeatures: string[] | string): boolean;

/**
 * returns true iff any specified feature is disabled
 */
declare function useDisabled(without: string[] | string): boolean;

/**
 * returns true iff any specified feature is enabled
 */
declare function useEnabled(feature: string[] | string): boolean;

export { Disable, Enable, EnableContext, type EnableContextType, type FeatureContextType, type FeatureDescription, type FeatureDispatch, type FeatureState, type FeatureValue, Features, ToggleFeatures, useAllDisabled, useAllEnabled, useDisabled, useEnabled };

import React, { FC, Dispatch } from 'react';
interface EnableProps {
    readonly feature?: string | string[];
    readonly without?: string | string[];
    readonly allFeatures?: string[];
    readonly withoutAll?: string[];
}
declare type EnableContextType = (feature: String) => boolean;
export declare const EnableContext: React.Context<EnableContextType>;
export declare function useEnabledFull(props: EnableProps): boolean;
export declare function useAllEnabled(allFeatures: string[]): boolean;
export declare function useAllDisabled(withoutAll: string[]): boolean;
export declare function useEnabled(feature: string | string[]): boolean;
export declare function useDisabled(without: string | string[]): boolean;
export declare const Enable: FC<EnableProps>;
export interface Feature {
    readonly name: string;
    readonly description?: string;
}
interface DisableFeature {
    type: 'disable';
    readonly feature: string;
}
interface ToggleFeature {
    type: 'toggle';
    readonly feature: string;
}
interface EnableFeature {
    type: 'enable';
    readonly feature: string;
}
interface SetActiveFeatures {
    type: 'set-active';
    readonly active: string[];
}
declare type EnableAction = EnableFeature | DisableFeature | ToggleFeature | SetActiveFeatures;
interface FeatureProps {
    readonly features: Feature[];
    readonly enabled: string[];
}
declare class GlobalEnable {
    readonly dispatch: Dispatch<EnableAction>;
    constructor(dispatch: Dispatch<EnableAction>);
    toggle(feature: string): void;
    enable(feature: string): void;
    disable(feature: string): void;
}
declare global {
    interface Window {
        feature?: GlobalEnable;
    }
}
export declare const Features: FC<FeatureProps>;
export declare const ToggleFeatures: FC;
export {};

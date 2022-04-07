import * as React from "react";
export declare const fromStrArray: (as: string[]) => Set<string>;
export declare const elemStr: {
    (a: string): (set: Set<string>) => boolean;
    (a: string, set: Set<string>): boolean;
};
export interface FeatureState {
    readonly features: Feature[];
    readonly forceEnable: Set<string>;
    readonly forceDisable: Set<string>;
    readonly defaultActive: Set<string>;
    readonly currentEnabled: Set<string>;
}
export interface Feature {
    readonly name: string;
    readonly description?: string;
}
interface DisableFeature {
    type: "disable";
    readonly feature: string;
}
interface ToggleFeature {
    type: "toggle";
    readonly feature: string;
}
interface SetDefaultFeatures {
    type: "set-default";
    readonly defaultEnabled: string[];
}
interface EnableFeature {
    type: "enable";
    readonly feature: string;
}
interface SetActiveFeatures {
    type: "set-active";
    readonly values: {
        on: string[];
        off: string[];
    };
}
export declare type EnableAction = EnableFeature | DisableFeature | ToggleFeature | SetDefaultFeatures | SetActiveFeatures;
export declare const reducer: React.Reducer<FeatureState, EnableAction>;
export declare type DispatchFeature = React.Dispatch<EnableAction>;
export {};

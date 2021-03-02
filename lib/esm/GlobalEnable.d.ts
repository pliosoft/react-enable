import { DispatchFeature } from "./FeatureState";
export declare class GlobalEnable {
    private readonly dispatch;
    constructor(dispatch: DispatchFeature);
    toggle(feature: string): void;
    enable(feature: string): void;
    disable(feature: string): void;
}
declare global {
    interface Window {
        feature?: GlobalEnable;
    }
}

export type { EnableContextType } from "./EnableContext";
export type { FeatureContextType } from "./FeatureContext";
export { ToggleFeatures } from "./ToggleFeatures";
export { Features } from "./Features";
export { EnableContext } from "./EnableContext";
export declare function useAllEnabled(allFeatures: string | string[]): boolean;
export declare function useAllDisabled(withoutAll: string | string[]): boolean;
export declare function useEnabled(feature: string | string[]): boolean;
export declare function useDisabled(without: string | string[]): boolean;

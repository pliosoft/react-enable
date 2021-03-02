import * as React from "react";
import { Feature } from "./FeatureState";
interface FeatureProps {
    readonly features: Feature[];
    readonly defaultEnabled: string[];
    readonly consoleOverride?: boolean;
    readonly storage?: Storage;
}
export declare const Features: React.FC<FeatureProps>;
export {};

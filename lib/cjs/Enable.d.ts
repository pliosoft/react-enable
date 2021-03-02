import * as React from "react";
export interface EnableProps {
    readonly feature?: string | string[];
    readonly without?: string | string[];
    readonly allFeatures?: string[];
    readonly withoutAll?: string[];
}
export declare const Enable: React.FC<EnableProps>;

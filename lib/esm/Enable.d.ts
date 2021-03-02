import * as React from "react";
export interface EnableProps {
    readonly feature?: string | string[];
    readonly allFeatures?: string[];
}
export declare const Enable: React.FC<EnableProps>;

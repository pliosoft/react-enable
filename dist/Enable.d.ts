import * as React from 'react';
export interface EnableProps {
    readonly feature?: string[] | string;
    readonly allFeatures?: string[];
    children: React.ReactNode;
}
export declare function Enable({ feature, allFeatures, children }: EnableProps): JSX.Element | null;

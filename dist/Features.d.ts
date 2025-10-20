import { type ReactNode } from 'react';
import type { FeatureDescription } from './FeatureState';
interface FeatureProps {
    readonly features: readonly FeatureDescription[];
    readonly children?: ReactNode;
    readonly disableConsole?: boolean;
    readonly storage?: Storage;
}
export declare function Features({ children, features, disableConsole, storage, }: FeatureProps): JSX.Element;
export {};

import { FeaturesState } from './FeaturesState';
export default function useTestCallback(defaultsState: FeaturesState, overridesState: FeaturesState): (feature: string) => boolean | undefined;

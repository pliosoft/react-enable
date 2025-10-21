import type { FeatureValue } from './FeatureState';
import { type FeaturesState, valueOfFeature } from './FeaturesState';
import { isInRollout } from './rolloutHash';

/** Determine if the feature is enabled in one of the state machines, in order
 *
 * @param state The current state of the machine
 * @param feature The feature to check
 * @param rolloutStableId Optional stable identifier for percentage-based rollouts
 */

export default function testFeature(
  feature: string,
  states: FeaturesState[],
  rolloutStableId?: string,
): FeatureValue {
  const values = states.map((state) => valueOfFeature(state, feature));

  // look for best forced option, in order
  for (const [featureValue, featureForced] of values) {
    if (featureValue != null && featureForced) {
      return featureValue;
    }
  }

  // look for best non-forced option, in order
  for (const [featureValue] of values) {
    if (featureValue != null) {
      return featureValue;
    }
  }

  // Check for percentage-based rollout if no explicit value is set
  if (rolloutStableId != null) {
    // Look through states to find the feature description with enableFor
    for (const state of states) {
      if (state.value === 'ready' && state.context.features[feature] != null) {
        const featureState = state.context.features[feature];
        const enableFor = featureState.featureDesc?.enableFor;

        if (enableFor != null) {
          return isInRollout(feature, rolloutStableId, enableFor);
        }
      }
    }
  }

  // unset if nothing hit
  return undefined;
}

import { FeaturesState, valueOfFeature } from './FeaturesState';
import { FeatureValue } from './FeatureState';

/** Determine if the feature is enabled in one of the state machines, in order
 *
 * @param state The current state of the machine
 * @param feature The feature to check
 */

export default function testFeature(feature: string, states: FeaturesState[]): FeatureValue {
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

  // unset if nothing hit
  return undefined;
}

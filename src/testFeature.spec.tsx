import {
  type FeaturesState,
  featuresReducer,
  initialFeaturesState,
} from './FeaturesState';
import testFeature from './testFeature';

// Helper function to create a features state with specific feature values
function createFeaturesState(
  features: Array<{ name: string; defaultValue?: boolean; force?: boolean }>,
): FeaturesState {
  return featuresReducer(initialFeaturesState, {
    type: 'INIT',
    features: features.map((f) => ({
      name: f.name,
      description: `${f.name} description`,
      defaultValue: f.defaultValue ?? false,
      force: f.force ?? false,
    })),
  });
}

// Helper to set feature values in a state
function setFeatureValue(
  state: FeaturesState,
  name: string,
  value: boolean | undefined,
): FeaturesState {
  return featuresReducer(state, { type: 'SET', name, value });
}

describe('testFeature', () => {
  describe('single state machine', () => {
    it('should return undefined when feature does not exist', () => {
      const state = createFeaturesState([{ name: 'Feature1' }]);
      const result = testFeature('NonExistent', [state]);
      expect(result).toBeUndefined();
    });

    it('should return true when feature is enabled', () => {
      let state = createFeaturesState([
        { name: 'Feature1', defaultValue: false },
      ]);
      state = setFeatureValue(state, 'Feature1', true);
      const result = testFeature('Feature1', [state]);
      expect(result).toBe(true);
    });

    it('should return false when feature is disabled', () => {
      let state = createFeaturesState([
        { name: 'Feature1', defaultValue: true },
      ]);
      state = setFeatureValue(state, 'Feature1', false);
      const result = testFeature('Feature1', [state]);
      expect(result).toBe(false);
    });

    it('should return undefined when feature is unspecified', () => {
      let state = createFeaturesState([
        { name: 'Feature1', defaultValue: true },
      ]);
      state = setFeatureValue(state, 'Feature1', undefined);
      const result = testFeature('Feature1', [state]);
      expect(result).toBeUndefined();
    });

    it('should return default value when no override is set', () => {
      const state = createFeaturesState([
        { name: 'Feature1', defaultValue: true },
      ]);
      const result = testFeature('Feature1', [state]);
      expect(result).toBe(true);
    });
  });

  describe('multiple state machines - layering', () => {
    it('should prioritize first state machine with non-null value', () => {
      let state1 = createFeaturesState([
        { name: 'Feature1', defaultValue: false },
      ]);
      state1 = setFeatureValue(state1, 'Feature1', true);

      let state2 = createFeaturesState([
        { name: 'Feature1', defaultValue: false },
      ]);
      state2 = setFeatureValue(state2, 'Feature1', false);

      const result = testFeature('Feature1', [state1, state2]);
      expect(result).toBe(true);
    });

    it('should fall back to second state machine if first returns undefined', () => {
      let state1 = createFeaturesState([
        { name: 'Feature1', defaultValue: false },
      ]);
      state1 = setFeatureValue(state1, 'Feature1', undefined);

      const state2 = createFeaturesState([
        { name: 'Feature1', defaultValue: true },
      ]);

      const result = testFeature('Feature1', [state1, state2]);
      expect(result).toBe(true);
    });

    it('should fall back through multiple states until finding non-null value', () => {
      let state1 = createFeaturesState([
        { name: 'Feature1', defaultValue: false },
      ]);
      state1 = setFeatureValue(state1, 'Feature1', undefined);

      let state2 = createFeaturesState([
        { name: 'Feature1', defaultValue: false },
      ]);
      state2 = setFeatureValue(state2, 'Feature1', undefined);

      const state3 = createFeaturesState([
        { name: 'Feature1', defaultValue: true },
      ]);

      const result = testFeature('Feature1', [state1, state2, state3]);
      expect(result).toBe(true);
    });

    it('should return undefined if all states return undefined', () => {
      let state1 = createFeaturesState([
        { name: 'Feature1', defaultValue: false },
      ]);
      state1 = setFeatureValue(state1, 'Feature1', undefined);

      let state2 = createFeaturesState([
        { name: 'Feature1', defaultValue: false },
      ]);
      state2 = setFeatureValue(state2, 'Feature1', undefined);

      const result = testFeature('Feature1', [state1, state2]);
      expect(result).toBeUndefined();
    });
  });

  describe('forced values', () => {
    it('should prioritize forced value over non-forced value', () => {
      // Create state with force=true and value=true
      let state1 = featuresReducer(initialFeaturesState, {
        type: 'INIT',
        features: [
          {
            name: 'Feature1',
            description: 'Test',
            defaultValue: false,
            force: true,
          },
        ],
      });
      state1 = setFeatureValue(state1, 'Feature1', true);

      // Create state with force=false and value=false
      let state2 = createFeaturesState([
        { name: 'Feature1', defaultValue: false, force: false },
      ]);
      state2 = setFeatureValue(state2, 'Feature1', false);

      // Forced value should win even though it's in second position
      const result = testFeature('Feature1', [state2, state1]);
      expect(result).toBe(true);
    });

    it('should use first forced value when multiple forced values exist', () => {
      // Create first state with force=true and value=true
      let state1 = featuresReducer(initialFeaturesState, {
        type: 'INIT',
        features: [
          {
            name: 'Feature1',
            description: 'Test',
            defaultValue: false,
            force: true,
          },
        ],
      });
      state1 = setFeatureValue(state1, 'Feature1', true);

      // Create second state with force=true and value=false
      let state2 = featuresReducer(initialFeaturesState, {
        type: 'INIT',
        features: [
          {
            name: 'Feature1',
            description: 'Test',
            defaultValue: false,
            force: true,
          },
        ],
      });
      state2 = setFeatureValue(state2, 'Feature1', false);

      // First forced value should win
      const result = testFeature('Feature1', [state1, state2]);
      expect(result).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty states array', () => {
      const result = testFeature('Feature1', []);
      expect(result).toBeUndefined();
    });

    it('should handle feature not present in any state', () => {
      const state1 = createFeaturesState([{ name: 'Feature1' }]);
      const state2 = createFeaturesState([{ name: 'Feature2' }]);
      const result = testFeature('Feature3', [state1, state2]);
      expect(result).toBeUndefined();
    });

    it('should handle mixed presence of feature across states', () => {
      const state1 = createFeaturesState([{ name: 'Other' }]);
      const state2 = createFeaturesState([
        { name: 'Feature1', defaultValue: true },
      ]);

      const result = testFeature('Feature1', [state1, state2]);
      expect(result).toBe(true);
    });
  });
});

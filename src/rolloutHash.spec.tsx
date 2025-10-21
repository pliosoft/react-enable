import { hashToPercentage, isInRollout } from './rolloutHash';

describe('rolloutHash', () => {
  describe('hashToPercentage', () => {
    it('should return a number between 0 and 1', () => {
      const testStrings = [
        'user-1',
        'user-2',
        'feature-a',
        'very-long-string-with-many-characters',
        '123456789',
        'special!@#$%^&*()characters',
      ];

      for (const str of testStrings) {
        const result = hashToPercentage(str);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      }
    });

    it('should be deterministic (same input always gives same output)', () => {
      const testString = 'consistent-test-string';
      const result1 = hashToPercentage(testString);
      const result2 = hashToPercentage(testString);
      const result3 = hashToPercentage(testString);

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it('should produce different values for different inputs', () => {
      const hash1 = hashToPercentage('user-1');
      const hash2 = hashToPercentage('user-2');
      const hash3 = hashToPercentage('user-3');

      // While not guaranteed, extremely unlikely all three are the same
      const uniqueHashes = new Set([hash1, hash2, hash3]);
      expect(uniqueHashes.size).toBeGreaterThan(1);
    });

    it('should handle empty string', () => {
      const result = hashToPercentage('');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });

    it('should produce well-distributed values', () => {
      // Generate many hashes with diverse strings and check distribution
      const hashes: number[] = [];
      const testStrings = [
        'alice@example.com',
        'bob@example.com',
        'charlie@example.com',
        'david@example.com',
        'eve@example.com',
        'frank@example.com',
        'grace@example.com',
        'heidi@example.com',
        'ivan@example.com',
        'judy@example.com',
      ];

      // Test with multiple feature names to get more data points
      for (const featureName of ['feature-a', 'feature-b', 'feature-c', 'feature-d']) {
        for (const userId of testStrings) {
          hashes.push(hashToPercentage(`${featureName}:${userId}`));
        }
      }

      // Check that we have values in different ranges
      const inFirstQuarter = hashes.filter((h) => h < 0.25).length;
      const inSecondQuarter = hashes.filter((h) => h >= 0.25 && h < 0.5).length;
      const inThirdQuarter = hashes.filter((h) => h >= 0.5 && h < 0.75).length;
      const inFourthQuarter = hashes.filter((h) => h >= 0.75).length;

      // Each quarter should have at least some values (not perfect distribution, but reasonable)
      expect(inFirstQuarter).toBeGreaterThan(0);
      expect(inSecondQuarter).toBeGreaterThan(0);
      expect(inThirdQuarter).toBeGreaterThan(0);
      expect(inFourthQuarter).toBeGreaterThan(0);
    });
  });

  describe('isInRollout', () => {
    it('should always return false for percentage 0', () => {
      expect(isInRollout('feature', 'user-1', 0)).toBe(false);
      expect(isInRollout('feature', 'user-2', 0)).toBe(false);
      expect(isInRollout('feature', 'user-3', 0)).toBe(false);
    });

    it('should always return true for percentage 1', () => {
      expect(isInRollout('feature', 'user-1', 1)).toBe(true);
      expect(isInRollout('feature', 'user-2', 1)).toBe(true);
      expect(isInRollout('feature', 'user-3', 1)).toBe(true);
    });

    it('should always return false for negative percentage', () => {
      expect(isInRollout('feature', 'user-1', -0.5)).toBe(false);
      expect(isInRollout('feature', 'user-2', -1)).toBe(false);
    });

    it('should always return true for percentage > 1', () => {
      expect(isInRollout('feature', 'user-1', 1.5)).toBe(true);
      expect(isInRollout('feature', 'user-2', 2)).toBe(true);
    });

    it('should be consistent for the same feature and user', () => {
      const result1 = isInRollout('feature-a', 'user-123', 0.5);
      const result2 = isInRollout('feature-a', 'user-123', 0.5);
      const result3 = isInRollout('feature-a', 'user-123', 0.5);

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it('should vary for different users', () => {
      // Use diverse user identifiers that will hash differently
      const results = [
        isInRollout('feature', 'alice@example.com', 0.5),
        isInRollout('feature', 'bob@example.com', 0.5),
        isInRollout('feature', 'charlie@example.com', 0.5),
        isInRollout('feature', 'david@example.com', 0.5),
        isInRollout('feature', 'eve@example.com', 0.5),
        isInRollout('feature', 'frank@example.com', 0.5),
        isInRollout('feature', 'grace@example.com', 0.5),
        isInRollout('feature', 'heidi@example.com', 0.5),
      ];

      // Should have a mix of true and false for 50% rollout
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(2); // Should have both true and false
    });

    it('should vary for different features with the same user', () => {
      const user = 'alice@example.com';
      const results = [
        isInRollout('new-dashboard', user, 0.5),
        isInRollout('beta-search', user, 0.5),
        isInRollout('dark-mode', user, 0.5),
        isInRollout('premium-features', user, 0.5),
        isInRollout('experimental-ui', user, 0.5),
        isInRollout('advanced-analytics', user, 0.5),
        isInRollout('mobile-app', user, 0.5),
        isInRollout('ai-assistant', user, 0.5),
      ];

      // Should have a mix of true and false
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(2); // Should have both true and false
    });

    it('should respect rollout percentage approximately', () => {
      const percentage = 0.3; // 30%
      const numTests = 1000;

      let enabledCount = 0;
      for (let i = 0; i < numTests; i++) {
        // Use more diverse test data by combining multiple varying components
        const userId = `user-${i}-${Math.floor(i / 10)}-${i % 7}@domain${i % 5}.com`;
        if (isInRollout('test-feature', userId, percentage)) {
          enabledCount++;
        }
      }

      const actualPercentage = enabledCount / numTests;
      // Should be roughly 30%, allow 10% margin of error
      expect(actualPercentage).toBeGreaterThan(0.2);
      expect(actualPercentage).toBeLessThan(0.4);
    });
  });
});

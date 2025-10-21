/**
 * Simple hash function to convert a string into a number between 0 and 1.
 * This is used for percentage-based rollouts to ensure consistent feature
 * assignment for the same user/session.
 * Uses a variant of the djb2 hash algorithm.
 *
 * @param str - The string to hash (typically featureName + rolloutStableId)
 * @returns A number between 0 and 1
 */
export function hashToPercentage(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) + hash + char) | 0; // hash * 33 + char
  }
  // Convert to unsigned 32-bit integer and normalize to 0-1
  const unsigned = hash >>> 0;
  return unsigned / 4294967296; // 2^32
}

/**
 * Determines if a feature should be enabled based on percentage rollout.
 *
 * @param featureName - Name of the feature
 * @param rolloutStableId - Stable identifier for consistent hashing
 * @param percentage - Target percentage (0-1)
 * @returns true if the feature should be enabled for this user
 */
export function isInRollout(
  featureName: string,
  rolloutStableId: string,
  percentage: number,
): boolean {
  if (percentage <= 0) return false;
  if (percentage >= 1) return true;

  const combinedKey = `${featureName}:${rolloutStableId}`;
  const hash = hashToPercentage(combinedKey);
  return hash < percentage;
}

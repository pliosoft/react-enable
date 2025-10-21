import { renderHook } from '@testing-library/react';
// biome-ignore lint/style/useImportType: JSX requires React at runtime
import * as React from 'react';

import { EnableContext } from './EnableContext';
import type { FeatureValue } from './FeatureState';
import { useTestAndConvert } from './utils';

describe('useTestAndConvert', () => {
  const mockTest = jest.fn((feature: string): FeatureValue => {
    return feature === 'EnabledFeature';
  });

  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <EnableContext.Provider value={mockTest}>{children}</EnableContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('context retrieval', () => {
    it('should return the test function from context', () => {
      const { result } = renderHook(() => useTestAndConvert('Feature1'), {
        wrapper,
      });

      const [test] = result.current;
      expect(test).toBe(mockTest);
    });

    it('should return default context value when no provider exists', () => {
      const { result } = renderHook(() => useTestAndConvert('Feature1'));

      const [test] = result.current;
      // Default context returns false for any feature
      expect(test('anyFeature')).toBe(false);
    });
  });

  describe('string input conversion', () => {
    it('should convert string to array with single element', () => {
      const { result } = renderHook(() => useTestAndConvert('Feature1'), {
        wrapper,
      });

      const [, converted] = result.current;
      expect(converted).toEqual(['Feature1']);
    });

    it('should handle empty string', () => {
      const { result } = renderHook(() => useTestAndConvert(''), { wrapper });

      const [, converted] = result.current;
      expect(converted).toEqual(['']);
    });
  });

  describe('array input conversion', () => {
    it('should return array as-is', () => {
      const input = ['Feature1', 'Feature2', 'Feature3'];
      const { result } = renderHook(() => useTestAndConvert(input), {
        wrapper,
      });

      const [, converted] = result.current;
      expect(converted).toEqual(input);
    });

    it('should handle empty array', () => {
      const { result } = renderHook(() => useTestAndConvert([]), { wrapper });

      const [, converted] = result.current;
      expect(converted).toEqual([]);
    });

    it('should handle array with one element', () => {
      const { result } = renderHook(
        () => useTestAndConvert(['SingleFeature']),
        { wrapper },
      );

      const [, converted] = result.current;
      expect(converted).toEqual(['SingleFeature']);
    });
  });

  describe('null and undefined input conversion', () => {
    it('should convert undefined to empty array', () => {
      const { result } = renderHook(() => useTestAndConvert(undefined), {
        wrapper,
      });

      const [, converted] = result.current;
      expect(converted).toEqual([]);
    });

    it('should convert null to empty array', () => {
      const { result } = renderHook(() => useTestAndConvert(null), { wrapper });

      const [, converted] = result.current;
      expect(converted).toEqual([]);
    });

    it('should convert no argument to empty array', () => {
      const { result } = renderHook(() => useTestAndConvert(), { wrapper });

      const [, converted] = result.current;
      expect(converted).toEqual([]);
    });
  });

  describe('memoization', () => {
    it('should memoize the converted array for same input', () => {
      const { result, rerender } = renderHook(
        ({ input }) => useTestAndConvert(input),
        {
          wrapper,
          initialProps: {
            input: 'Feature1' as string[] | string | null | undefined,
          },
        },
      );

      const firstResult = result.current[1] as string[];
      rerender({ input: 'Feature1' });
      const secondResult = result.current[1] as string[];

      expect(firstResult).toBe(secondResult);
    });

    it('should return new array when input changes', () => {
      const { result, rerender } = renderHook(
        ({ input }) => useTestAndConvert(input),
        {
          wrapper,
          initialProps: {
            input: 'Feature1' as string[] | string | null | undefined,
          },
        },
      );

      const firstResult = result.current[1] as string[];
      rerender({ input: 'Feature2' });
      const secondResult = result.current[1] as string[];

      expect(firstResult).not.toBe(secondResult);
      expect(firstResult).toEqual(['Feature1']);
      expect(secondResult).toEqual(['Feature2']);
    });

    it('should memoize empty array for null input', () => {
      const { result, rerender } = renderHook(
        ({ input }) => useTestAndConvert(input),
        {
          wrapper,
          initialProps: { input: null as string[] | string | null | undefined },
        },
      );

      const firstResult = result.current[1] as string[];
      rerender({ input: null });
      const secondResult = result.current[1] as string[];

      expect(firstResult).toBe(secondResult);
      expect(firstResult).toEqual([]);
    });

    it('should return new array when switching from null to undefined', () => {
      const { result, rerender } = renderHook(
        ({ input }) => useTestAndConvert(input),
        {
          wrapper,
          initialProps: { input: null as string[] | string | null | undefined },
        },
      );

      const firstResult = result.current[1] as string[];
      rerender({ input: undefined });
      const secondResult = result.current[1] as string[];

      // Both should be empty arrays but different references since null !== undefined
      expect(firstResult).not.toBe(secondResult);
      expect(firstResult).toEqual([]);
      expect(secondResult).toEqual([]);
    });

    it('should handle array reference changes correctly', () => {
      const array1 = ['Feature1'];
      const array2 = ['Feature1'];

      const { result, rerender } = renderHook(
        ({ input }) => useTestAndConvert(input),
        {
          wrapper,
          initialProps: {
            input: array1 as string[] | string | null | undefined,
          },
        },
      );

      const firstResult = result.current[1] as string[];
      expect(firstResult).toBe(array1);

      rerender({ input: array2 });
      const secondResult = result.current[1] as string[];
      expect(secondResult).toBe(array2);
      expect(firstResult).not.toBe(secondResult);
    });
  });

  describe('integration', () => {
    it('should work correctly with test function', () => {
      const { result } = renderHook(() => useTestAndConvert('EnabledFeature'), {
        wrapper,
      });

      const [test, converted] = result.current;
      expect(converted).toEqual(['EnabledFeature']);
      expect(test(converted[0])).toBe(true);
    });

    it('should handle multiple features with test function', () => {
      const { result } = renderHook(
        () => useTestAndConvert(['EnabledFeature', 'DisabledFeature']),
        {
          wrapper,
        },
      );

      const [test, converted] = result.current;
      expect(converted).toEqual(['EnabledFeature', 'DisabledFeature']);
      expect(test(converted[0])).toBe(true);
      expect(test(converted[1])).toBe(false);
    });
  });
});

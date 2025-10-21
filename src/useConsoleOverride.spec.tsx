import { renderHook } from '@testing-library/react';
import type { FeatureDescription, FeatureValue } from './FeatureState';
import type { FeaturesDispatch } from './FeaturesState';
import { GlobalEnable } from './GlobalEnable';
import useConsoleOverride from './useConsoleOverride';

describe('useConsoleOverride', () => {
  const testFeatures: FeatureDescription[] = [
    { name: 'Feature1', description: 'Test Feature 1', defaultValue: false },
    { name: 'Feature2', description: 'Test Feature 2', defaultValue: true },
  ];

  const mockTestFeature = (name: string): FeatureValue => {
    return name === 'Feature2';
  };

  const mockDispatch: FeaturesDispatch = jest.fn();

  beforeEach(() => {
    if (window.feature !== undefined) {
      window.feature = undefined;
    }
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (window.feature !== undefined) {
      window.feature = undefined;
    }
  });

  it('should set window.feature when consoleOverride is true', () => {
    renderHook(() =>
      useConsoleOverride(true, testFeatures, mockTestFeature, mockDispatch),
    );

    expect(window.feature).toBeDefined();
    expect(window.feature).toBeInstanceOf(GlobalEnable);
  });

  it('should not set window.feature when consoleOverride is false', () => {
    renderHook(() =>
      useConsoleOverride(false, testFeatures, mockTestFeature, mockDispatch),
    );

    expect(window.feature).toBeUndefined();
  });

  it('should cleanup window.feature on unmount', () => {
    const { unmount } = renderHook(() =>
      useConsoleOverride(true, testFeatures, mockTestFeature, mockDispatch),
    );

    expect(window.feature).toBeDefined();

    unmount();

    expect(window.feature).toBeUndefined();
  });

  it('should not cleanup if consoleOverride is false', () => {
    const { unmount } = renderHook(() =>
      useConsoleOverride(false, testFeatures, mockTestFeature, mockDispatch),
    );

    expect(window.feature).toBeUndefined();

    unmount();

    // Should not throw
    expect(window.feature).toBeUndefined();
  });

  it('should update window.feature when dependencies change', () => {
    const { rerender } = renderHook(
      ({ features, dispatch }) =>
        useConsoleOverride(true, features, mockTestFeature, dispatch),
      {
        initialProps: { features: testFeatures, dispatch: mockDispatch },
      },
    );

    const firstInstance = window.feature;
    expect(firstInstance).toBeDefined();

    const newFeatures = [
      ...testFeatures,
      { name: 'Feature3', description: 'New', defaultValue: false },
    ];
    const newDispatch: FeaturesDispatch = jest.fn();

    rerender({ features: newFeatures, dispatch: newDispatch });

    // Window.feature should be recreated
    expect(window.feature).toBeDefined();
    // It should be a different instance
    expect(window.feature).not.toBe(firstInstance);
  });

  it('should handle existing window.feature gracefully', () => {
    const existingFeature = new GlobalEnable(
      mockDispatch,
      mockTestFeature,
      testFeatures,
    );
    window.feature = existingFeature;

    const { unmount } = renderHook(() =>
      useConsoleOverride(true, testFeatures, mockTestFeature, mockDispatch),
    );

    expect(window.feature).toBeDefined();
    expect(window.feature).not.toBe(existingFeature);

    unmount();

    expect(window.feature).toBeUndefined();
  });
});

describe('GlobalEnable', () => {
  const testFeatures: FeatureDescription[] = [
    { name: 'Feature1', description: 'Test Feature 1', defaultValue: false },
    { name: 'Feature2', description: 'Test Feature 2', defaultValue: true },
  ];

  const mockTestFeature = jest.fn((name: string): FeatureValue => {
    return name === 'Feature2';
  });

  const mockDispatch = jest.fn();

  let globalEnable: GlobalEnable;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTestFeature.mockImplementation((name: string): FeatureValue => {
      return name === 'Feature2';
    });
    globalEnable = new GlobalEnable(
      mockDispatch,
      mockTestFeature,
      testFeatures,
    );
  });

  describe('enable', () => {
    it('should dispatch ENABLE action', () => {
      globalEnable.enable('Feature1');

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'ENABLE',
        name: 'Feature1',
      });
    });

    it('should work with any feature name', () => {
      globalEnable.enable('SomeFeature');

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'ENABLE',
        name: 'SomeFeature',
      });
    });
  });

  describe('disable', () => {
    it('should dispatch DISABLE action', () => {
      globalEnable.disable('Feature2');

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'DISABLE',
        name: 'Feature2',
      });
    });

    it('should work with any feature name', () => {
      globalEnable.disable('SomeFeature');

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'DISABLE',
        name: 'SomeFeature',
      });
    });
  });

  describe('toggle', () => {
    it('should dispatch TOGGLE action', () => {
      globalEnable.toggle('Feature1');

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'TOGGLE',
        name: 'Feature1',
      });
    });

    it('should work with any feature name', () => {
      globalEnable.toggle('SomeFeature');

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'TOGGLE',
        name: 'SomeFeature',
      });
    });
  });

  describe('unset', () => {
    it('should dispatch UNSET action', () => {
      globalEnable.unset('Feature1');

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UNSET',
        name: 'Feature1',
      });
    });

    it('should work with any feature name', () => {
      globalEnable.unset('SomeFeature');

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UNSET',
        name: 'SomeFeature',
      });
    });
  });

  describe('setAll', () => {
    it('should dispatch SET_ALL action with feature map', () => {
      const features = { Feature1: true, Feature2: false };
      globalEnable.setAll(features);

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_ALL', features });
    });

    it('should handle empty feature map', () => {
      globalEnable.setAll({});

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_ALL',
        features: {},
      });
    });

    it('should handle undefined values', () => {
      const features = { Feature1: true, Feature2: undefined };
      globalEnable.setAll(features);

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_ALL', features });
    });
  });

  describe('listFeatures', () => {
    it('should return array of feature names and values', () => {
      const result = globalEnable.listFeatures();

      expect(result).toEqual([
        ['Feature1', false],
        ['Feature2', true],
      ]);
      expect(mockTestFeature).toHaveBeenCalledWith('Feature1');
      expect(mockTestFeature).toHaveBeenCalledWith('Feature2');
    });

    it('should call testFeature for each feature', () => {
      globalEnable.listFeatures();

      expect(mockTestFeature).toHaveBeenCalledTimes(2);
    });

    it('should return current feature values', () => {
      mockTestFeature.mockImplementation((name: string): FeatureValue => {
        if (name === 'Feature1') {
          return true;
        }
        if (name === 'Feature2') {
          return false;
        }
        return undefined;
      });

      const result = globalEnable.listFeatures();

      expect(result).toEqual([
        ['Feature1', true],
        ['Feature2', false],
      ]);
    });

    it('should handle undefined feature values', () => {
      mockTestFeature.mockReturnValue(undefined);

      const result = globalEnable.listFeatures();

      expect(result).toEqual([
        ['Feature1', undefined],
        ['Feature2', undefined],
      ]);
    });
  });

  describe('integration', () => {
    it('should allow chaining operations', () => {
      globalEnable.enable('Feature1');
      globalEnable.disable('Feature2');
      globalEnable.toggle('Feature1');

      expect(mockDispatch).toHaveBeenCalledTimes(3);
    });

    it('should maintain consistent behavior across multiple calls', () => {
      globalEnable.enable('Feature1');
      globalEnable.enable('Feature1');
      globalEnable.enable('Feature1');

      expect(mockDispatch).toHaveBeenCalledTimes(3);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'ENABLE',
        name: 'Feature1',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        type: 'ENABLE',
        name: 'Feature1',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(3, {
        type: 'ENABLE',
        name: 'Feature1',
      });
    });
  });
});

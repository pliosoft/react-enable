import { renderHook } from '@testing-library/react-hooks';
import { interpret } from 'xstate';
import type { FeatureDescription } from './FeatureState';
import { FeaturesMachine, type FeaturesState } from './FeaturesState';
import usePersist, { KEY } from './usePersist';

class LocalStorageMock {
  store: Record<string, string>;
  length = 1;

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  removeItem(key: string) {
    const { [key]: _, ...rest } = this.store;
    this.store = rest;
  }

  key(_: number): string | null {
    return null;
  }
}

function createReadyState(features: FeatureDescription[]): FeaturesState {
  const service = interpret(FeaturesMachine);
  service.start();
  service.send({ type: 'INIT', features });
  return service.getSnapshot();
}

function setFeatureInState(
  state: FeaturesState,
  name: string,
  value: boolean | undefined,
): FeaturesState {
  const service = interpret(FeaturesMachine).start(state);
  service.send({ type: 'SET', name, value });
  return service.getSnapshot();
}

describe('usePersist', () => {
  const testFeatures: FeatureDescription[] = [
    { name: 'Feature1', description: 'Test Feature 1', defaultValue: false },
    { name: 'Feature2', description: 'Test Feature 2', defaultValue: false },
    { name: 'Feature3', description: 'Test Feature 3', defaultValue: true },
  ];

  it('should persist empty object when no overrides are set', () => {
    const storage = new LocalStorageMock();
    const state = createReadyState(testFeatures);

    renderHook(() => usePersist(storage, testFeatures, state));

    expect(storage.getItem(KEY)).toBe('{}');
  });

  it('should persist feature overrides to storage', () => {
    const storage = new LocalStorageMock();
    let state = createReadyState(testFeatures);
    state = setFeatureInState(state, 'Feature1', true);

    renderHook(() => usePersist(storage, testFeatures, state));

    const stored = JSON.parse(storage.getItem(KEY) ?? '{}');
    expect(stored.overrides).toEqual({ Feature1: true });
  });

  it('should persist multiple feature overrides', () => {
    const storage = new LocalStorageMock();
    let state = createReadyState(testFeatures);
    state = setFeatureInState(state, 'Feature1', true);
    state = setFeatureInState(state, 'Feature2', false);
    state = setFeatureInState(state, 'Feature3', true);

    renderHook(() => usePersist(storage, testFeatures, state));

    const stored = JSON.parse(storage.getItem(KEY) ?? '{}');
    expect(stored.overrides).toEqual({
      Feature1: true,
      Feature2: false,
      Feature3: true,
    });
  });

  it('should update storage when state changes', () => {
    const storage = new LocalStorageMock();
    let state = createReadyState(testFeatures);

    const { rerender } = renderHook(
      ({ overrideState }) => usePersist(storage, testFeatures, overrideState),
      {
        initialProps: { overrideState: state },
      },
    );

    expect(storage.getItem(KEY)).toBe('{}');

    state = setFeatureInState(state, 'Feature1', true);
    rerender({ overrideState: state });

    const stored = JSON.parse(storage.getItem(KEY) ?? '{}');
    expect(stored.overrides).toEqual({ Feature1: true });
  });

  it('should not persist when storage is undefined', () => {
    let state = createReadyState(testFeatures);
    state = setFeatureInState(state, 'Feature1', true);

    renderHook(() => usePersist(undefined, testFeatures, state));

    // No error should be thrown
  });

  it('should handle storage setItem errors gracefully', () => {
    const storage = new LocalStorageMock();
    storage.setItem = jest.fn(() => {
      throw new Error('Storage quota exceeded');
    });

    let state = createReadyState(testFeatures);
    state = setFeatureInState(state, 'Feature1', true);

    // Should not throw
    expect(() => {
      renderHook(() => usePersist(storage, testFeatures, state));
    }).not.toThrow();
  });

  it('should not persist if state is not ready', () => {
    const storage = new LocalStorageMock();
    const service = interpret(FeaturesMachine);
    service.start();
    const state = service.getSnapshot(); // idle state

    renderHook(() => usePersist(storage, testFeatures, state));

    expect(storage.store).toEqual({});
  });

  it('should only persist non-null feature values', () => {
    const storage = new LocalStorageMock();
    let state = createReadyState(testFeatures);
    state = setFeatureInState(state, 'Feature1', true);
    state = setFeatureInState(state, 'Feature2', undefined);
    state = setFeatureInState(state, 'Feature3', false);

    renderHook(() => usePersist(storage, testFeatures, state));

    const stored = JSON.parse(storage.getItem(KEY) ?? '{}');
    expect(stored.overrides).toEqual({
      Feature1: true,
      Feature3: false,
    });
  });

  it('should persist empty object when all overrides are unset', () => {
    const storage = new LocalStorageMock();
    let state = createReadyState(testFeatures);
    state = setFeatureInState(state, 'Feature1', undefined);
    state = setFeatureInState(state, 'Feature2', undefined);
    state = setFeatureInState(state, 'Feature3', undefined);

    renderHook(() => usePersist(storage, testFeatures, state));

    expect(storage.getItem(KEY)).toBe('{}');
  });

  it('should update storage when features list changes', () => {
    const storage = new LocalStorageMock();
    let state = createReadyState(testFeatures);
    state = setFeatureInState(state, 'Feature1', true);

    const { rerender } = renderHook(
      ({ features }) => usePersist(storage, features, state),
      {
        initialProps: { features: testFeatures },
      },
    );

    const newFeatures = [
      ...testFeatures,
      { name: 'Feature4', description: 'New Feature', defaultValue: false },
    ];
    rerender({ features: newFeatures });

    const stored = JSON.parse(storage.getItem(KEY) ?? '{}');
    expect(stored.overrides).toEqual({ Feature1: true });
  });

  it('should serialize boolean values correctly', () => {
    const storage = new LocalStorageMock();
    let state = createReadyState(testFeatures);
    state = setFeatureInState(state, 'Feature1', true);
    state = setFeatureInState(state, 'Feature2', false);

    renderHook(() => usePersist(storage, testFeatures, state));

    const stored = JSON.parse(storage.getItem(KEY) ?? '{}');
    expect(stored.overrides.Feature1).toBe(true);
    expect(stored.overrides.Feature2).toBe(false);
    expect(typeof stored.overrides.Feature1).toBe('boolean');
    expect(typeof stored.overrides.Feature2).toBe('boolean');
  });
});

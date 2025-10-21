import { act, renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';

import { FeatureContext } from './FeatureContext';
import { Features } from './Features';
import {
  useAllDisabled,
  useAllEnabled,
  useDisabled,
  useEnabled,
} from './index';

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
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.store[key];
  }

  key(_: number): string | null {
    // not used
    return null;
  }
}

const featuresA = [
  {
    name: 'Feature 1',
    description: 'Feature 1 is the feature',
    defaultValue: false,
  },
  {
    name: 'Feature 2',
    description: 'Feature 2 is the feature',
    defaultValue: false,
  },
  {
    name: 'Feature 3',
    description: 'Feature 3 is the feature',
    defaultValue: false,
  },
  {
    name: 'Default Enabled',
    description: 'Enabled by default',
    defaultValue: false,
  },
];

const featuresB = [
  {
    name: 'Feature 1',
    description: 'Feature 1 is the feature',
    defaultValue: false,
  },
  {
    name: 'Feature 2',
    description: 'Feature 2 is the feature',
    defaultValue: false,
  },
  {
    name: 'Feature 3',
    description: 'Feature 3 is the feature',
    defaultValue: false,
  },
  {
    name: 'Default Enabled',
    description: 'Enabled by default',
    defaultValue: true,
  },
];

describe('Basic Features', () => {
  it('without a feature, should be false', () => {
    const { result } = renderHook(() => useEnabled([]));
    expect(result.current).toEqual(false);
  });

  it('should be disabled without a context', () => {
    const { result: r1 } = renderHook(() => useEnabled('Feature 1'));
    const { result: r2 } = renderHook(() => useDisabled('Feature 1'));
    expect(r1.current).toBe(false);
    expect(r2.current).toBe(true);
  });

  it('feature should be disabled by default', () => {
    const { result: r1, unmount: u1 } = renderHook(
      () => useEnabled('Feature 1'),
      {
        wrapper: Features,
        initialProps: { features: featuresA },
      },
    );
    u1();
    const { result: r2 } = renderHook(() => useDisabled('Feature 1'), {
      wrapper: Features,
      initialProps: {
        features: featuresA,
      },
    });
    expect(r1.current).toBe(false);
    expect(r2.current).toBe(true);
  });

  it('default-enabled should be enabled by default', async () => {
    const { result: r1, unmount: u1 } = renderHook(
      () => useEnabled('Default Enabled'),
      {
        wrapper: Features,
        initialProps: { features: featuresB },
      },
    );
    await waitFor(() => expect(r1.current).toBe(true));
    u1();
    const { result: r2, unmount: u2 } = renderHook(
      () => useDisabled('Default Enabled'),
      {
        wrapper: Features,
        initialProps: { features: featuresB },
      },
    );
    await waitFor(() => expect(r2.current).toBe(false));
    u2();
  });

  it('changes are persisted', async () => {
    const storage = new LocalStorageMock();

    const { result: r1, unmount: u1 } = renderHook(
      () => {
        const f1 = useEnabled('Feature 1');
        const f2 = useDisabled('Feature 2');
        const f3 = useEnabled('Feature 3');
        const x = React.useContext(FeatureContext);
        return { f1, f2, f3, g: x?.overridesSend };
      },
      {
        wrapper: Features,
        initialProps: { features: featuresA, storage: storage },
      },
    );

    await waitFor(() => {
      expect(r1.current.f1).toBe(false);
      expect(r1.current.f2).toBe(true);
      expect(r1.current.f3).toBe(false);
    });

    act(() => {
      if (r1.current.g != null) {
        r1.current.g({ type: 'TOGGLE', name: 'Feature 1' });
        r1.current.g({ type: 'TOGGLE', name: 'Feature 2' });
        r1.current.g({ type: 'TOGGLE', name: 'Feature 3' });
      }
    });

    await waitFor(() => {
      expect(r1.current.f1).toBe(true);
      expect(r1.current.f2).toBe(false);
      expect(r1.current.f3).toBe(true);
    });

    u1();

    const { result: r2, unmount: u2 } = renderHook(
      () => {
        const f1 = useEnabled('Feature 1');
        const f2 = useDisabled('Feature 2');
        const f3 = useEnabled('Feature 3');
        const x = React.useContext(FeatureContext);
        return { f1, f2, f3, g: x?.overridesSend };
      },
      {
        wrapper: Features,
        initialProps: { features: featuresA, storage: storage },
      },
    );

    expect(r2.current.f1).toBe(r1.current.f1);
    expect(r2.current.f2).toBe(r1.current.f2);
    expect(r2.current.f3).toBe(r1.current.f3);
    expect(storage.getItem('react-enable:feature-values')).toEqual(
      '{"overrides":{"Feature 1":true,"Feature 2":true,"Feature 3":true}}',
    );
    u2();
  });

  it('all queries should be false for empty queries', () => {
    const { result, unmount } = renderHook(
      () => {
        const f1 = useAllEnabled([]);
        const f2 = useAllDisabled([]);
        return { f1, f2 };
      },
      { wrapper: Features, initialProps: { features: featuresA } },
    );

    expect(result.current.f1).toBe(false);
    expect(result.current.f2).toBe(false);
    unmount();
  });

  it('feature should be enabled after enabling', () => {
    const { result, unmount } = renderHook(
      () => {
        const f1 = useEnabled('Feature 1');
        const f2 = useDisabled('Feature 1');
        const f3 = useEnabled('Feature 2');
        const x = React.useContext(FeatureContext);
        return { f1, f2, f3, g: x?.overridesSend };
      },
      { wrapper: Features, initialProps: { features: featuresA } },
    );

    expect(result.current.f3).toBe(false);

    act(() => {
      if (result.current.g != null) {
        result.current.g({ type: 'ENABLE', name: 'Feature 1' });
      }
    });

    expect(result.current.f1).toBe(true);
    expect(result.current.f2).toBe(false);
    expect(result.current.f3).toBe(false);
    unmount();
  });

  it('default-enabled should be possible to disable', () => {
    const { result } = renderHook(
      () => {
        const f1 = useEnabled('Default Enabled');
        const f2 = useDisabled('Default Enabled');
        const f3 = useEnabled('Feature 2');
        const x = React.useContext(FeatureContext);
        return { f1, f2, f3, g: x?.overridesSend };
      },
      { wrapper: Features, initialProps: { features: featuresB } },
    );

    expect(result.current.f1).toBe(true);
    expect(result.current.f2).toBe(false);
    expect(result.current.f3).toBe(false);
    act(() => {
      if (result.current.g != null) {
        result.current.g({ type: 'DISABLE', name: 'Default Enabled' });
      }
    });

    expect(result.current.f1).toBe(false);
    expect(result.current.f2).toBe(true);
    expect(result.current.f3).toBe(false);
  });
});

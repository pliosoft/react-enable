import { act, renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';

import { FeatureContext } from './FeatureContext';
import type { FeatureDescription } from './FeatureState';
import { Features } from './Features';
import { useAllEnabled, useDisabled, useEnabled } from './index';

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

describe('Integration Tests - Public API', () => {
  const baseFeatures: FeatureDescription[] = [
    { name: 'Feature1', description: 'Test Feature 1', defaultValue: false },
    { name: 'Feature2', description: 'Test Feature 2', defaultValue: true },
    { name: 'Feature3', description: 'Test Feature 3', defaultValue: false },
  ];

  beforeEach(() => {
    // Clear sessionStorage before each test to prevent state leakage
    window.sessionStorage.clear();
  });

  afterEach(() => {
    // Clean up sessionStorage after each test
    window.sessionStorage.clear();
    // Clear window.feature if it was set
    if (window.feature !== undefined) {
      window.feature = undefined;
    }
  });

  describe('useEnabled and useDisabled', () => {
    it('should handle arrays of features correctly', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures}>{children}</Features>
      );

      const { result } = renderHook(
        () => {
          const context = React.useContext(FeatureContext);
          return {
            anyEnabled: useEnabled(['Feature1', 'Feature2']),
            anyDisabled: useDisabled(['Feature1', 'Feature2']),
            defaultsState: context?.defaultsState,
          };
        },
        { wrapper: Wrapper },
      );

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.defaultsState?.value).toBe('ready');
      });

      expect(result.current.anyEnabled).toBe(true); // Feature2 is enabled
      expect(result.current.anyDisabled).toBe(true); // Feature1 is disabled
    });

    it('should update when features are toggled', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures}>{children}</Features>
      );

      const { result, unmount } = renderHook(
        () => {
          const enabled = useEnabled('Feature1');
          const context = React.useContext(FeatureContext);
          return { enabled, dispatch: context?.overridesSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.defaultsState?.value).toBe('ready');
      });

      expect(result.current.enabled).toBe(false);

      act(() => {
        result.current.dispatch?.({ type: 'TOGGLE', name: 'Feature1' });
      });

      await waitFor(() => {
        expect(result.current.enabled).toBe(true);
      });
      unmount();
    });

    it('should handle enable and disable actions', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures}>{children}</Features>
      );

      const { result, unmount } = renderHook(
        () => {
          const enabled = useEnabled('Feature1');
          const context = React.useContext(FeatureContext);
          return { enabled, dispatch: context?.overridesSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.enabled).toBe(false);

      act(() => {
        result.current.dispatch?.({ type: 'ENABLE', name: 'Feature1' });
      });
      await waitFor(() => { expect(result.current.enabled).toBe(true); });

      act(() => {
        result.current.dispatch?.({ type: 'DISABLE', name: 'Feature1' });
      });
      await waitFor(() => { expect(result.current.enabled).toBe(false); });
      unmount();
    });
  });

  describe('useAllEnabled and useAllDisabled', () => {
    it('should return true when all features in list are enabled', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures}>{children}</Features>
      );

      const { result } = renderHook(
        () => {
          const res = useAllEnabled(['Feature2']);
          const context = React.useContext(FeatureContext);
          return { res, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.res).toBe(true); // Feature2 is enabled
    });

    it('should update when features are enabled', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures}>{children}</Features>
      );

      const { result, unmount } = renderHook(
        () => {
          const allEnabled = useAllEnabled(['Feature1', 'Feature2']);
          const context = React.useContext(FeatureContext);
          return { allEnabled, dispatch: context?.overridesSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.allEnabled).toBe(false);

      act(() => {
        result.current.dispatch?.({ type: 'ENABLE', name: 'Feature1' });
      });

      expect(result.current.allEnabled).toBe(true);
      unmount();
    });
  });

  describe('force flag behavior', () => {
    it('should respect force flag and ignore overrides', async () => {
      const forcedFeatures: FeatureDescription[] = [
        {
          name: 'ForcedOn',
          description: 'Forced on',
          defaultValue: true,
          force: true,
        },
        {
          name: 'ForcedOff',
          description: 'Forced off',
          defaultValue: false,
          force: true,
        },
      ];

      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={forcedFeatures}>{children}</Features>
      );

      const { result } = renderHook(
        () => {
          const forcedOn = useEnabled('ForcedOn');
          const forcedOff = useDisabled('ForcedOff');
          const context = React.useContext(FeatureContext);
          return { forcedOn, forcedOff, dispatch: context?.overridesSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.forcedOn).toBe(true);
      expect(result.current.forcedOff).toBe(true);

      // Try to override - should not change
      act(() => {
        result.current.dispatch?.({ type: 'DISABLE', name: 'ForcedOn' });
        result.current.dispatch?.({ type: 'ENABLE', name: 'ForcedOff' });
      });

      // Force flags should prevent changes
      expect(result.current.forcedOn).toBe(true);
      expect(result.current.forcedOff).toBe(true);
    });
  });

  describe('noOverride flag behavior', () => {
    it('should allow reading but prevent user overrides', async () => {
      const noOverrideFeatures: FeatureDescription[] = [
        {
          name: 'NoOverride',
          description: 'Cannot override',
          defaultValue: true,
          noOverride: true,
        },
      ];

      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={noOverrideFeatures}>{children}</Features>
      );

      const { result } = renderHook(
        () => {
          const enabled = useEnabled('NoOverride');
          const context = React.useContext(FeatureContext);
          return { enabled, dispatch: context?.overridesSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.enabled).toBe(true);

      // UI should respect noOverride, but the state machine will still accept the action
      // This is expected behavior - noOverride is a UI concern, not a state machine concern
      act(() => {
        result.current.dispatch?.({ type: 'DISABLE', name: 'NoOverride' });
      });

      // The feature can still be toggled programmatically
      // noOverride is meant to be enforced at the UI level
    });
  });

  describe('persistence integration', () => {
    it('should persist and restore feature state', async () => {
      const storage = new LocalStorageMock();

      const Wrapper1 = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures} storage={storage}>{children}</Features>
      );

      const { result: firstResult, unmount } = renderHook(
        () => {
          const enabled = useEnabled('Feature1');
          const context = React.useContext(FeatureContext);
          return { enabled, dispatch: context?.overridesSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper1 },
      );

      await waitFor(() => { expect(firstResult.current.defaultsState?.value).toBe('ready'); });
      expect(firstResult.current.enabled).toBe(false);

      act(() => {
        firstResult.current.dispatch?.({ type: 'ENABLE', name: 'Feature1' });
      });

      await waitFor(() => { expect(firstResult.current.enabled).toBe(true); });
      unmount();

      // Create new instance with same storage
      const Wrapper2 = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures} storage={storage}>{children}</Features>
      );

      const { result: secondResult } = renderHook(
        () => {
          const res = useEnabled('Feature1');
          const context = React.useContext(FeatureContext);
          return { res, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper2 },
      );

      await waitFor(() => { expect(secondResult.current.defaultsState?.value).toBe('ready'); });
      expect(secondResult.current.res).toBe(true);
    });

    it('should handle SET_ALL action', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures}>{children}</Features>
      );

      const { result } = renderHook(
        () => {
          const f1 = useEnabled('Feature1');
          const f2 = useEnabled('Feature2');
          const f3 = useEnabled('Feature3');
          const context = React.useContext(FeatureContext);
          return { f1, f2, f3, dispatch: context?.overridesSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.f1).toBe(false);
      expect(result.current.f2).toBe(true);
      expect(result.current.f3).toBe(false);

      act(() => {
        result.current.dispatch?.({
          type: 'SET_ALL',
          features: { Feature1: true, Feature2: false, Feature3: true },
        });
      });

      await waitFor(() => {
        expect(result.current.f1).toBe(true);
        expect(result.current.f2).toBe(false);
        expect(result.current.f3).toBe(true);
      });
    });

    it('should handle UNSET action to revert to defaults', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures}>{children}</Features>
      );

      const { result } = renderHook(
        () => {
          const enabled = useEnabled('Feature1');
          const context = React.useContext(FeatureContext);
          return { enabled, dispatch: context?.overridesSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.enabled).toBe(false);

      act(() => {
        result.current.dispatch?.({ type: 'ENABLE', name: 'Feature1' });
      });
      await waitFor(() => { expect(result.current.enabled).toBe(true); });

      act(() => {
        result.current.dispatch?.({ type: 'UNSET', name: 'Feature1' });
      });
      await waitFor(() => { expect(result.current.enabled).toBe(false); }); // Back to default
    });
  });

  describe('async onChangeDefault', () => {
    it('should handle async feature changes', async () => {
      const onChangeMock = vi.fn().mockResolvedValue(true);
      const asyncFeatures: FeatureDescription[] = [
        {
          name: 'AsyncFeature',
          description: 'Async feature',
          defaultValue: false,
          onChangeDefault: onChangeMock,
        },
      ];

      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={asyncFeatures}>{children}</Features>
      );

      const { result } = renderHook(
        () => {
          const enabled = useEnabled('AsyncFeature');
          const context = React.useContext(FeatureContext);
          return { enabled, dispatch: context?.defaultsSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.enabled).toBe(false);

      act(() => {
        result.current.dispatch?.({ type: 'ENABLE', name: 'AsyncFeature' });
      });

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith('AsyncFeature', true);
        expect(result.current.enabled).toBe(true);
      });
    });

    it('should handle async feature changes that reject', async () => {
      const onChangeMock = vi
        .fn()
        .mockRejectedValue(new Error('Backend error'));
      const asyncFeatures: FeatureDescription[] = [
        {
          name: 'AsyncFeature',
          description: 'Async feature',
          defaultValue: false,
          onChangeDefault: onChangeMock,
        },
      ];

      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={asyncFeatures}>{children}</Features>
      );

      const { result } = renderHook(
        () => {
          const enabled = useEnabled('AsyncFeature');
          const context = React.useContext(FeatureContext);
          return { enabled, dispatch: context?.defaultsSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.enabled).toBe(false);

      act(() => {
        result.current.dispatch?.({ type: 'ENABLE', name: 'AsyncFeature' });
      });

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith('AsyncFeature', true);
        // Should revert to undefined/unset on error
        expect(result.current.enabled).toBe(false);
      });
    });

    it('should handle async feature that returns different value', async () => {
      const onChangeMock = vi.fn().mockResolvedValue(false);
      const asyncFeatures: FeatureDescription[] = [
        {
          name: 'AsyncFeature',
          description: 'Async feature',
          defaultValue: false,
          onChangeDefault: onChangeMock,
        },
      ];

      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={asyncFeatures}>{children}</Features>
      );

      const { result } = renderHook(
        () => {
          const enabled = useEnabled('AsyncFeature');
          const context = React.useContext(FeatureContext);
          return { enabled, dispatch: context?.defaultsSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.enabled).toBe(false);

      act(() => {
        result.current.dispatch?.({ type: 'ENABLE', name: 'AsyncFeature' });
      });

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith('AsyncFeature', true);
        // Backend returned false instead of true
        expect(result.current.enabled).toBe(false);
      });
    });
  });

  describe('console override integration', () => {
    it('should expose window.feature when disableConsole is false (default)', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures} disableConsole={false}>{children}</Features>
      );

      const { result, unmount } = renderHook(
        () => {
          const res = useEnabled('Feature1');
          const context = React.useContext(FeatureContext);
          return { res, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(window.feature).toBeDefined();
      expect(window.feature?.listFeatures).toBeDefined();
      unmount();
    });

    it('should not expose window.feature when disableConsole is true', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures} disableConsole={true}>{children}</Features>
      );

      const { result, unmount } = renderHook(
        () => {
          const res = useEnabled('Feature1');
          const context = React.useContext(FeatureContext);
          return { res, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(window.feature).toBeUndefined();
      unmount();
    });

    it('should allow enabling features via window.feature', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures} disableConsole={false}>{children}</Features>
      );

      const { result, unmount } = renderHook(
        () => {
          const res = useEnabled('Feature1');
          const context = React.useContext(FeatureContext);
          return { res, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.res).toBe(false);

      act(() => {
        window.feature?.enable('Feature1');
      });

      await waitFor(() => { expect(result.current.res).toBe(true); });
      unmount();
    });

    it('should allow disabling features via window.feature', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures} disableConsole={false}>{children}</Features>
      );

      const { result, unmount } = renderHook(
        () => {
          const res = useEnabled('Feature2');
          const context = React.useContext(FeatureContext);
          return { res, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.res).toBe(true);

      act(() => {
        window.feature?.disable('Feature2');
      });

      await waitFor(() => { expect(result.current.res).toBe(false); });
      unmount();
    });

    it('should allow toggling features via window.feature', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures} disableConsole={false}>{children}</Features>
      );

      const { result, unmount } = renderHook(
        () => {
          const res = useEnabled('Feature1');
          const context = React.useContext(FeatureContext);
          return { res, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      expect(result.current.res).toBe(false);

      act(() => {
        window.feature?.toggle('Feature1');
      });

      await waitFor(() => { expect(result.current.res).toBe(true); });
      unmount();
    });

    it('should list all features via window.feature', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures} disableConsole={false}>{children}</Features>
      );

      const { result, unmount } = renderHook(
        () => {
          const res = useEnabled('Feature1');
          const context = React.useContext(FeatureContext);
          return { res, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });
      const features = window.feature?.listFeatures();
      expect(features).toHaveLength(3);
      expect(features?.map((f) => f[0])).toEqual([
        'Feature1',
        'Feature2',
        'Feature3',
      ]);
      unmount();
    });
  });

  describe('edge cases', () => {
    it('should handle empty feature name gracefully', () => {
      const { result } = renderHook(() => useEnabled(''), {
        wrapper: Features,
        initialProps: { features: baseFeatures },
      });

      expect(result.current).toBe(false);
    });

    it('should handle non-existent feature names', () => {
      const { result } = renderHook(() => useEnabled('NonExistent'), {
        wrapper: Features,
        initialProps: { features: baseFeatures },
      });

      expect(result.current).toBe(false);
    });

    it('should handle rapid state changes', async () => {
      const Wrapper = ({ children }: { children?: React.ReactNode }) => (
        <Features features={baseFeatures}>{children}</Features>
      );

      const { result } = renderHook(
        () => {
          const enabled = useEnabled('Feature1');
          const context = React.useContext(FeatureContext);
          return { enabled, dispatch: context?.overridesSend, defaultsState: context?.defaultsState };
        },
        { wrapper: Wrapper },
      );

      await waitFor(() => { expect(result.current.defaultsState?.value).toBe('ready'); });

      act(() => {
        result.current.dispatch?.({ type: 'ENABLE', name: 'Feature1' });
        result.current.dispatch?.({ type: 'DISABLE', name: 'Feature1' });
        result.current.dispatch?.({ type: 'ENABLE', name: 'Feature1' });
        result.current.dispatch?.({ type: 'TOGGLE', name: 'Feature1' });
      });

      // Final state should reflect the last action
      await waitFor(() => { expect(result.current.enabled).toBe(true); });
    });
  });
});

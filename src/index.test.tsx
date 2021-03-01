import * as React from "react";
import { renderHook, act } from '@testing-library/react-hooks'
import { useEnabled, useDisabled, Features, FeatureContext, useAllEnabled, useAllDisabled } from './index'

 class LocalStorageMock {
	store: Record<string, string>
	length = 1

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  removeItem(key: string) {
    delete this.store[key];
  }

	key(_: number): string | null {
		// not used
		return null
	}

};


const wrapper: React.FC<{defaultEnabled: string[]}> = ({children, defaultEnabled = []}) => 
  <Features features={[
      { name: "Feature 1", description: "Feature 1 is the feature" },
      { name: "Feature 2", description: "Feature 2 is the feature" },
      { name: "Feature 3", description: "Feature 3 is the feature" },
      { name: "Default Enabled", description: "Enabled by default" }
    ]} defaultEnabled={defaultEnabled}>
    {children}
  </Features>

test('without a feature, should fail', () => {
  const { result } = renderHook(() => useEnabled([]));
  expect(result.error).toEqual(Error("Can't have empty array of features"));
})

test('should be disabled without a context', () => {
  const { result: r1 } = renderHook(() => useEnabled("Feature 1"));
  const { result: r2 } = renderHook(() => useDisabled("Feature 1"));
  expect(r1.current).toBe(false);
  expect(r2.current).toBe(true);
})

test('feature should be disabled by default', () => {
  const { result: r1 } = renderHook(() => useEnabled("Feature 1"), {wrapper});
  const { result: r2 } = renderHook(() => useDisabled("Feature 1"), {wrapper});
  expect(r1.current).toBe(false);
  expect(r2.current).toBe(true);
})

test('default-enabled should be enabled by default', () => {
  const { result: r1 } = renderHook(() => useEnabled("Default Enabled"), 
                                    {wrapper, initialProps: {defaultEnabled:["Default Enabled"]}});
  const { result: r2 } = renderHook(() => useDisabled("Default Enabled"), 
                                    {wrapper, initialProps: {defaultEnabled:["Default Enabled"]}});
  expect(r1.current).toBe(true);
  expect(r2.current).toBe(false);
})

test('feature should be enabled after enabling', () => {
  const { result } = renderHook(() => {
    const f1 = useEnabled("Feature 1")
    const f2 = useDisabled("Feature 1")
    const f3 = useEnabled("Feature 2")
    const x = React.useContext(FeatureContext)
    return {f1, f2, f3, g: x?.dispatch}
  }, {wrapper});

  expect(result.current.f3).toBe(false);

  act(() => {
    if (result.current.g) {
      result.current.g({ type: "enable", feature: "Feature 1" });
    }
  })

  expect(result.current.f1).toBe(true);
  expect(result.current.f2).toBe(false);
  expect(result.current.f3).toBe(false);
})

test('default-enabled should be possible to disable', () => {
  const { result } = renderHook(() => {
    const f1 = useEnabled("Default Enabled")
    const f2 = useDisabled("Default Enabled")
    const f3 = useEnabled("Feature 2")
    const x = React.useContext(FeatureContext)
    return {f1, f2, f3, g: x?.dispatch}
  }, 
  {wrapper, initialProps: {defaultEnabled:["Default Enabled"]}});

  expect(result.current.f1).toBe(true);
  expect(result.current.f2).toBe(false);
  expect(result.current.f3).toBe(false);
  act(() => {
    if (result.current.g) {
      result.current.g({ type: "disable", feature: "Default Enabled"  });
    }
  })

  expect(result.current.f1).toBe(false);
  expect(result.current.f2).toBe(true);
  expect(result.current.f3).toBe(false);
})

test('feature should be enabled after toggling', () => {
  const { result } = renderHook(() => {
    const f1 = useEnabled("Feature 1")
    const f2 = useDisabled("Feature 1")
    const f3 = useEnabled("Feature 2")
    const x = React.useContext(FeatureContext)
    return {f1, f2, f3, g: x?.dispatch}
  }, {wrapper});

  expect(result.current.f3).toBe(false);

  act(() => {
    if (result.current.g) {
      result.current.g({ type: "disable", feature: "Feature 1" });
      result.current.g({ type: "toggle", feature: "Feature 1" });
    }
  })

  expect(result.current.f1).toBe(true);
  expect(result.current.f2).toBe(false);
  expect(result.current.f3).toBe(false);
})

test('feature should be disable after toggling twice', () => {
  const { result } = renderHook(() => {
    const f1 = useEnabled("Feature 1")
    const f2 = useDisabled("Feature 1")
    const f3 = useEnabled("Feature 2")
    const x = React.useContext(FeatureContext)
    return {f1, f2, f3, g: x?.dispatch}
  }, {wrapper});

  expect(result.current.f3).toBe(false);
  expect(result.current.f1).toBe(false);
  expect(result.current.f2).toBe(true);

  act(() => {
    if (result.current.g) {
      result.current.g({ type: "toggle", feature: "Feature 1" });
      result.current.g({ type: "toggle", feature: "Feature 1" });
    }
  })

  expect(result.current.f1).toBe(false);
  expect(result.current.f2).toBe(true);
  expect(result.current.f3).toBe(false);
})

test('checking for any feature enabled', () => {
  const { result } = renderHook(() => {
    const f1 = useEnabled(["Feature 1", "Feature 2"])
    const f2 = useDisabled(["Feature 1", "Feature 2"])
    const x = React.useContext(FeatureContext)
    return {f1, f2, g: x?.dispatch}
  }, {wrapper});

  expect(result.current.f1).toBe(false);
  expect(result.current.f2).toBe(true);
  act(() => {
    if (result.current.g) {
      result.current.g({ type: "toggle", feature: "Feature 1" });
      result.current.g({ type: "toggle", feature: "Feature 1" });
    }
  })
  expect(result.current.f1).toBe(false);
  expect(result.current.f2).toBe(true);

  act(() => {
    if (result.current.g) {
      result.current.g({ type: "toggle", feature: "Feature 2" });
    }
  })

  expect(result.current.f1).toBe(true);
  expect(result.current.f2).toBe(true);

  act(() => {
    if (result.current.g) {
      result.current.g({ type: "toggle", feature: "Feature 1" });
    }
  })

  expect(result.current.f1).toBe(true);
  expect(result.current.f2).toBe(false);
})


test('checking for all features enabled', () => {
  const { result } = renderHook(() => {
    const f1 = useAllEnabled(["Feature 1", "Feature 2"])
    const f2 = useAllDisabled(["Feature 1", "Feature 2"])
    const x = React.useContext(FeatureContext)
    return {f1, f2, g: x?.dispatch}
  }, {wrapper});

  expect(result.current.f1).toBe(false);
  expect(result.current.f2).toBe(true);
  act(() => {
    if (result.current.g) {
      result.current.g({ type: "toggle", feature: "Feature 1" });
      result.current.g({ type: "toggle", feature: "Feature 1" });
    }
  })
  expect(result.current.f1).toBe(false);
  expect(result.current.f2).toBe(true);

  act(() => {
    if (result.current.g) {
      result.current.g({ type: "toggle", feature: "Feature 2" });
    }
  })

  expect(result.current.f1).toBe(false);
  expect(result.current.f2).toBe(false);

  act(() => {
    if (result.current.g) {
      result.current.g({ type: "toggle", feature: "Feature 1" });
    }
  })

  expect(result.current.f1).toBe(true);
  expect(result.current.f2).toBe(false);
})


test('change default-enabled should change available features', () => {
  const { result, rerender } = renderHook(() => {
    const f1 = useEnabled("Default Enabled")
    const f2 = useDisabled("Default Enabled")
    const f3 = useEnabled("Feature 2")
    const x = React.useContext(FeatureContext)
    return {f1, f2, f3, g: x?.dispatch}
  }, 
  {wrapper, initialProps: {defaultEnabled:["Default Enabled"]}});

  expect(result.current.f1).toBe(true);
  expect(result.current.f2).toBe(false);
  expect(result.current.f3).toBe(false);

  rerender({defaultEnabled: ["Feature 2"]})

  expect(result.current.f1).toBe(false);
  expect(result.current.f2).toBe(true);
  expect(result.current.f3).toBe(true);
})


test('changes are persisted', () => {
	const storage = new LocalStorageMock();
	const wrapper: React.FC<{defaultEnabled: string[]}> = ({children, defaultEnabled = []}) => 
		<Features storage={storage} features={[
				{ name: "Feature 1", description: "Feature 1 is the feature" },
				{ name: "Feature 2", description: "Feature 2 is the feature" },
				{ name: "Feature 3", description: "Feature 3 is the feature" },
				{ name: "Default Enabled", description: "Enabled by default" }
			]} defaultEnabled={defaultEnabled}>
			{children}
		</Features>

  const { result: r1 } = renderHook(() => {
    const f1 = useEnabled("Feature 1")
    const f2 = useDisabled("Feature 2")
    const f3 = useEnabled("Feature 3")
    const x = React.useContext(FeatureContext)
    return {f1, f2, f3, g: x?.dispatch}
  }, {wrapper, initialProps: {defaultEnabled:[]}});

  expect(r1.current.f1).toBe(false);
  expect(r1.current.f2).toBe(true);
  expect(r1.current.f3).toBe(false);

  act(() => {
    if (r1.current.g) {
      r1.current.g({ type: "toggle", feature: "Feature 1" });
      r1.current.g({ type: "toggle", feature: "Feature 2" });
      r1.current.g({ type: "toggle", feature: "Feature 3" });
    }
  });

  expect(r1.current.f1).toBe(true);
  expect(r1.current.f2).toBe(false);
  expect(r1.current.f3).toBe(true);

  const { result: r2 } = renderHook(() => {
    const f1 = useEnabled("Feature 1")
    const f2 = useDisabled("Feature 2")
    const f3 = useEnabled("Feature 3")
    const x = React.useContext(FeatureContext)
    return {f1, f2, f3, g: x?.dispatch}
  }, {wrapper, initialProps: {defaultEnabled:[]}});

  expect(r2.current.f1).toBe(true);
  expect(r2.current.f2).toBe(false);
  expect(r2.current.f3).toBe(true);
	expect(storage.getItem("react-enable:features")).
		toEqual("{\"on\":[\"Feature 1\",\"Feature 2\",\"Feature 3\"],\"off\":[\"Feature 1\",\"Feature 2\"]}");
})



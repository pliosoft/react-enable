import React from 'react';
import { FeatureContext } from './FeatureContext';
import { valueOfFeature } from './FeaturesState';

/// Permit users to override feature flags via a GUI.
/// Renders a small floating button in lower left or right, pressing it brings up
/// a list of features to toggle and their current override state. you can override on or override off,
/// or unset the override and go back to default value.
export function ToggleFeatures({}): JSX.Element | null {
  const [showDrawer, setShowDrawer] = React.useState(false);
  const context = React.useContext(FeatureContext);

  if (context == null) {
    return null;
  }

  // We want: Real value after all nestings, value of the override. we toggle override
  const { send, featuresDescription, overridesState, defaultsState, test } = context;

  if (featuresDescription.length === 0) {
    return null;
  }
  return (
    <aside>
      <main>
        {featuresDescription.map((feature) => (
          <div key={feature.name}>
            <label>
              <input
                type="checkbox"
                onChange={() => {
                  send({ type: 'TOGGLE', name: feature.name });
                }}
                checked={valueOfFeature(overridesState, feature.name)[0]}
              />
              {feature.name}
            </label>
            {feature.description != null ? <p>{feature.description}</p> : null}
          </div>
        ))}
      </main>
      <div onClick={() => setShowDrawer((old) => !old)}>
        <button
          style={{
            border: 'none',
            fontSize: '8px',
            background: 'transparent',
            padding: '2px',
            cursor: 'pointer',
          }}
        >
          {showDrawer ? '🎛 Hide' : '🎛 Show'}
        </button>
      </div>
    </aside>
  );
}

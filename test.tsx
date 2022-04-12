import React from 'react';
import { createRoot } from 'react-dom/client';

import { Disable } from './Disable';
import { Enable } from './Enable';
import { Features } from './Features';
import styles from './tailwind.css';
import { ToggleFeatures } from './ToggleFeatures';

const FEATURES = [
  {
    name: 'v1',
    defaultValue: true,
    noOverride: true,
    description: 'Our original feature set, which should not change',
  },
  { name: 'v2', defaultValue: true, description: 'v2 optional features' },
  { name: 'v3', defaultValue: false, description: 'some special features' },
  { name: 'v4', defaultValue: false, description: 'flam flim', force: false },
];

const App = () => {
  return (
    <Features storage={window.sessionStorage} features={FEATURES}>
      <div>
        <div className="font-bold text-lg">App</div>
        <Enable feature="v1">
          <div>v1 App</div>
        </Enable>
        <Enable feature="v2">
          <div>v2 App</div>
        </Enable>
        <Disable feature="v3">
          <div>Not v3</div>
        </Disable>
        <Enable feature="v4">
          <div>v4 App features</div>
        </Enable>
      </div>
      <ToggleFeatures />
    </Features>
  );
};

const rootNode1 = document.getElementById('root1');

if (rootNode1 != null) {
  const shadow1 = rootNode1.attachShadow({ mode: 'closed' });
  const style1 = document.createElement('style');
  style1.textContent = styles;
  shadow1.appendChild(style1);
  const root1 = createRoot(shadow1);
  root1.render(<App />);
} else {
  // eslint-disable-next-line no-undef
  console.error('root node not found');
}

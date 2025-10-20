import * as React from 'react';

import { render } from '@testing-library/react';

import { Disable } from './Disable';
import { Enable } from './Enable';
import { Features } from './Features';

const testFeatures = [
  {
    name: 'Feature 1',
    description: 'Feature 1 description',
    defaultValue: true,
  },
  {
    name: 'Feature 2',
    description: 'Feature 2 description',
    defaultValue: false,
  },
  {
    name: 'Feature 3',
    description: 'Feature 3 description',
    defaultValue: true,
  },
];

describe('Enable Component', () => {
  it('should render children when single feature is enabled', () => {
    const { getByText } = render(
      <Features features={testFeatures}>
        <Enable feature="Feature 1">
          <div>Feature 1 Content</div>
        </Enable>
      </Features>
    );

    expect(getByText('Feature 1 Content')).toBeTruthy();
  });

  it('should not render children when single feature is disabled', () => {
    const { queryByText } = render(
      <Features features={testFeatures}>
        <Enable feature="Feature 2">
          <div>Feature 2 Content</div>
        </Enable>
      </Features>
    );

    expect(queryByText('Feature 2 Content')).toBeNull();
  });

  it('should render children when any feature in array is enabled', () => {
    const { getByText } = render(
      <Features features={testFeatures}>
        <Enable feature={['Feature 1', 'Feature 2']}>
          <div>Content</div>
        </Enable>
      </Features>
    );

    expect(getByText('Content')).toBeTruthy();
  });

  it('should not render children when all features in array are disabled', () => {
    const { queryByText } = render(
      <Features features={testFeatures}>
        <Enable feature={['Feature 2']}>
          <div>Content</div>
        </Enable>
      </Features>
    );

    expect(queryByText('Content')).toBeNull();
  });

  it('should render children when all features in allFeatures are enabled', () => {
    const { getByText } = render(
      <Features features={testFeatures}>
        <Enable allFeatures={['Feature 1', 'Feature 3']}>
          <div>All Enabled Content</div>
        </Enable>
      </Features>
    );

    expect(getByText('All Enabled Content')).toBeTruthy();
  });

  it('should not render children when not all features in allFeatures are enabled', () => {
    const { queryByText } = render(
      <Features features={testFeatures}>
        <Enable allFeatures={['Feature 1', 'Feature 2']}>
          <div>All Enabled Content</div>
        </Enable>
      </Features>
    );

    expect(queryByText('All Enabled Content')).toBeNull();
  });

  it('should render when either feature or allFeatures condition is met', () => {
    const { getByText } = render(
      <Features features={testFeatures}>
        <Enable feature="Feature 1" allFeatures={['Feature 2']}>
          <div>Either Content</div>
        </Enable>
      </Features>
    );

    expect(getByText('Either Content')).toBeTruthy();
  });

  it('should handle empty feature array', () => {
    const { queryByText } = render(
      <Features features={testFeatures}>
        <Enable feature={[]}>
          <div>Empty Array Content</div>
        </Enable>
      </Features>
    );

    expect(queryByText('Empty Array Content')).toBeNull();
  });

  it('should handle undefined feature prop', () => {
    const { queryByText } = render(
      <Features features={testFeatures}>
        <Enable>
          <div>Undefined Feature Content</div>
        </Enable>
      </Features>
    );

    expect(queryByText('Undefined Feature Content')).toBeNull();
  });

  it('should render without Features context (feature disabled by default)', () => {
    const { queryByText } = render(
      <Enable feature="Feature 1">
        <div>No Context Content</div>
      </Enable>
    );

    expect(queryByText('No Context Content')).toBeNull();
  });
});

describe('Disable Component', () => {
  it('should render children when single feature is disabled', () => {
    const { getByText } = render(
      <Features features={testFeatures}>
        <Disable feature="Feature 2">
          <div>Feature 2 Disabled Content</div>
        </Disable>
      </Features>
    );

    expect(getByText('Feature 2 Disabled Content')).toBeTruthy();
  });

  it('should not render children when single feature is enabled', () => {
    const { queryByText } = render(
      <Features features={testFeatures}>
        <Disable feature="Feature 1">
          <div>Feature 1 Disabled Content</div>
        </Disable>
      </Features>
    );

    expect(queryByText('Feature 1 Disabled Content')).toBeNull();
  });

  it('should render children when any feature in array is disabled', () => {
    const { getByText } = render(
      <Features features={testFeatures}>
        <Disable feature={['Feature 1', 'Feature 2']}>
          <div>Content</div>
        </Disable>
      </Features>
    );

    expect(getByText('Content')).toBeTruthy();
  });

  it('should not render children when all features in array are enabled', () => {
    const { queryByText } = render(
      <Features features={testFeatures}>
        <Disable feature={['Feature 1', 'Feature 3']}>
          <div>Content</div>
        </Disable>
      </Features>
    );

    expect(queryByText('Content')).toBeNull();
  });

  it('should render children when all features in allFeatures are disabled', () => {
    const { getByText } = render(
      <Features features={testFeatures}>
        <Disable allFeatures={['Feature 2']}>
          <div>All Disabled Content</div>
        </Disable>
      </Features>
    );

    expect(getByText('All Disabled Content')).toBeTruthy();
  });

  it('should not render children when not all features in allFeatures are disabled', () => {
    const { queryByText } = render(
      <Features features={testFeatures}>
        <Disable allFeatures={['Feature 1', 'Feature 2']}>
          <div>All Disabled Content</div>
        </Disable>
      </Features>
    );

    expect(queryByText('All Disabled Content')).toBeNull();
  });

  it('should render when either feature or allFeatures condition is met', () => {
    const { getByText } = render(
      <Features features={testFeatures}>
        <Disable feature="Feature 2" allFeatures={['Feature 1']}>
          <div>Either Content</div>
        </Disable>
      </Features>
    );

    expect(getByText('Either Content')).toBeTruthy();
  });

  it('should handle empty feature array', () => {
    const { queryByText } = render(
      <Features features={testFeatures}>
        <Disable feature={[]}>
          <div>Empty Array Content</div>
        </Disable>
      </Features>
    );

    expect(queryByText('Empty Array Content')).toBeNull();
  });

  it('should handle undefined feature prop', () => {
    const { queryByText } = render(
      <Features features={testFeatures}>
        <Disable>
          <div>Undefined Feature Content</div>
        </Disable>
      </Features>
    );

    expect(queryByText('Undefined Feature Content')).toBeNull();
  });

  it('should render without Features context (feature enabled by default, so disabled is false)', () => {
    const { getByText } = render(
      <Disable feature="Feature 1">
        <div>No Context Content</div>
      </Disable>
    );

    expect(getByText('No Context Content')).toBeTruthy();
  });
});

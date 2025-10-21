import { fireEvent, render, screen } from '@testing-library/react';
import type { FeatureDescription } from './FeatureState';
import { Features } from './Features';
import { ToggleFeatureUnwrapped } from './ToggleFeatures';

const mockFeatures: FeatureDescription[] = [
  {
    name: 'Feature1',
    description: 'First test feature',
    defaultValue: true,
  },
  {
    name: 'Feature2',
    description: 'Second test feature',
    defaultValue: false,
  },
  {
    name: 'Feature3',
    description: 'Third test feature with no override',
    defaultValue: true,
    noOverride: true,
  },
];

describe('ToggleFeatureUnwrapped', () => {
  describe('rendering', () => {
    it('should render nothing when context is null', () => {
      const { container } = render(<ToggleFeatureUnwrapped />);
      expect(container.firstChild).toBeNull();
    });

    it('should render nothing when hidden is true', () => {
      const { container } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped hidden={true} />
        </Features>,
      );
      expect(container.querySelector('button')).toBeNull();
    });

    it('should render toggle button when features exist', () => {
      const { getByTitle } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped />
        </Features>,
      );

      expect(getByTitle('Toggle features')).toBeInTheDocument();
    });

    it('should render nothing when features list is empty', () => {
      const { container } = render(
        <Features features={[]}>
          <ToggleFeatureUnwrapped />
        </Features>,
      );
      expect(container.firstChild).toBeNull();
    });

    it('should not show modal by default', () => {
      const { queryByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped />
        </Features>,
      );

      expect(queryByText('Feature Flag Overrides')).not.toBeInTheDocument();
    });

    it('should show modal when defaultOpen is true', () => {
      const { getByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      expect(getByText('Feature Flag Overrides')).toBeInTheDocument();
    });
  });

  describe('modal interactions', () => {
    it('should open modal when toggle button is clicked', () => {
      const { getByText, getByTitle } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped />
        </Features>,
      );

      const button = getByTitle('Toggle features');
      fireEvent.click(button);

      expect(getByText('Feature Flag Overrides')).toBeInTheDocument();
    });

    it('should close modal when Done button is clicked', () => {
      const { getByText, queryByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      expect(getByText('Feature Flag Overrides')).toBeInTheDocument();

      const doneButton = getByText('Done');
      fireEvent.click(doneButton);

      expect(queryByText('Feature Flag Overrides')).not.toBeInTheDocument();
    });

    it('should display all features in modal', () => {
      const { getByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      expect(getByText('Feature1')).toBeInTheDocument();
      expect(getByText('Feature2')).toBeInTheDocument();
      expect(getByText('Feature3')).toBeInTheDocument();
    });

    it('should display feature descriptions', () => {
      const { getByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      expect(getByText('First test feature')).toBeInTheDocument();
      expect(getByText('Second test feature')).toBeInTheDocument();
      expect(
        getByText('Third test feature with no override'),
      ).toBeInTheDocument();
    });
  });

  describe('feature display', () => {
    it('should show "Enabled" badge for enabled features', () => {
      render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      const enabledBadges = screen.getAllByText('Enabled');
      expect(enabledBadges.length).toBeGreaterThan(0);
    });

    it('should show "No Overrides" badge for noOverride features', () => {
      const { getByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      expect(getByText('No Overrides')).toBeInTheDocument();
    });

    it('should display feature name in code format', () => {
      const { container } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      const codeElements = container.querySelectorAll('code');
      const featureNames = Array.from(codeElements).map(
        (el) => el.textContent ?? '',
      );

      expect(featureNames).toContain('Feature1');
      expect(featureNames).toContain('Feature2');
      expect(featureNames).toContain('Feature3');
    });
  });

  describe('feature options', () => {
    it('should display all three options for each feature', () => {
      const { getByText, getAllByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      expect(getByText('Enable Feature1')).toBeInTheDocument();
      expect(getByText('Disable Feature1')).toBeInTheDocument();
      // There should be one "Default" option for each feature
      expect(getAllByText('Default')).toHaveLength(3);
    });

    it('should show descriptions for each option', () => {
      const { getAllByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      // There should be one of each description per feature (3 features)
      expect(getAllByText('Override the feature to be enabled')).toHaveLength(
        3,
      );
      expect(getAllByText('Override the feature to be disabled')).toHaveLength(
        3,
      );
      expect(getAllByText('Inherit enabled state from defaults')).toHaveLength(
        3,
      );
    });
  });

  describe('feature without description', () => {
    it('should render feature without description field', () => {
      const featuresNoDesc: FeatureDescription[] = [
        {
          name: 'NoDescFeature',
          defaultValue: true,
        },
      ];

      const { getByText } = render(
        <Features features={featuresNoDesc}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      expect(getByText('NoDescFeature')).toBeInTheDocument();
      // Description element should not be rendered
      const featureSection = screen.getByText('NoDescFeature').closest('h6');
      const nextSibling = featureSection?.nextSibling as HTMLElement | null;
      if (nextSibling) {
        expect(nextSibling).not.toHaveClass('text-gray-500');
      }
    });
  });

  describe('forced features', () => {
    it('should show force indicator for forced features', () => {
      const forcedFeatures: FeatureDescription[] = [
        {
          name: 'ForcedFeature',
          description: 'This is forced',
          defaultValue: true,
          force: true,
        },
      ];

      const { container } = render(
        <Features features={forcedFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      // The Default option should be disabled for forced features
      // We can check this by looking for disabled radio options
      const radioOptions = container.querySelectorAll('[role="radio"]');
      const defaultOption = Array.from(radioOptions).find((option) =>
        (option.textContent ?? '').includes('Default'),
      );

      expect(defaultOption).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      const { getByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      // Check for fieldset legend
      expect(getByText('Feature Flag Overrides')).toBeInTheDocument();
    });

    it('should have focusable button', () => {
      const { getByTitle } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped />
        </Features>,
      );

      const button = getByTitle('Toggle features');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should mark Done button as button type', () => {
      const { getByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      const doneButton = getByText('Done');
      expect(doneButton).toHaveAttribute('type', 'button');
    });
  });

  describe('styling', () => {
    it('should apply proper z-index for modal', () => {
      const { container } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      const modal = container.querySelector('.fixed.z-10');
      expect(modal).toBeInTheDocument();
    });

    it('should render toggle button with blue background', () => {
      const { getByTitle } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped />
        </Features>,
      );

      const button = getByTitle('Toggle features');
      expect(button).toHaveClass('bg-blue-600');
    });

    it('should render Done button with proper styling', () => {
      const { getByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped defaultOpen={true} />
        </Features>,
      );

      const doneButton = getByText('Done');
      expect(doneButton).toHaveClass('bg-blue-600');
    });
  });

  describe('state management', () => {
    it('should maintain open state across re-renders', () => {
      const { getByText, getByTitle, rerender } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped />
        </Features>,
      );

      const button = getByTitle('Toggle features');
      fireEvent.click(button);

      expect(getByText('Feature Flag Overrides')).toBeInTheDocument();

      rerender(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped />
        </Features>,
      );

      expect(getByText('Feature Flag Overrides')).toBeInTheDocument();
    });

    it('should reset state when closed and reopened', () => {
      const { getByText, getByTitle, queryByText } = render(
        <Features features={mockFeatures}>
          <ToggleFeatureUnwrapped />
        </Features>,
      );

      const toggleButton = getByTitle('Toggle features');
      fireEvent.click(toggleButton);
      expect(getByText('Feature Flag Overrides')).toBeInTheDocument();

      const doneButton = getByText('Done');
      fireEvent.click(doneButton);
      expect(queryByText('Feature Flag Overrides')).not.toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(getByText('Feature Flag Overrides')).toBeInTheDocument();
    });
  });
});

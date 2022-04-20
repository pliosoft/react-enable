import React, { useContext, useState, useCallback, ReactNode } from 'react';
import ReactDOM from 'react-dom';

import { RadioGroup } from '@headlessui/react';

import { FeatureContext } from './FeatureContext';
import { valueOfFeature } from './FeaturesState';
import { FeatureDescription } from './FeatureState';
// @ts-expect-error bundler will take care of this
import styles from './tailwind.css';

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

function ToggleFeature({ feature }: { feature: FeatureDescription }): JSX.Element | null {
  const context = useContext(FeatureContext);
  const handleChangeSelection = useCallback(
    (value: 'false' | 'true' | 'unset') => {
      if (context?.overridesSend != null) {
        switch (value) {
          case 'true': {
            context.overridesSend({ type: 'ENABLE', name: feature.name });
            break;
          }
          case 'false': {
            context.overridesSend({ type: 'DISABLE', name: feature.name });
            break;
          }
          case 'unset': {
            context.overridesSend({ type: 'UNSET', name: feature.name });
            break;
          }
        }
      }
    },
    [feature.name, context]
  );

  if (context == null) {
    return null;
  }

  const { overridesState, test: testFeature, defaultsState } = context;

  const valueInDefaults = (valueOfFeature(defaultsState, feature.name)[0] ?? 'unset').toString() as
    | 'false'
    | 'true'
    | 'unset';

  const valueInOverrides = (valueOfFeature(overridesState, feature.name)[0] ?? 'unset').toString() as
    | 'false'
    | 'true'
    | 'unset';

  const actualChecked = testFeature(feature.name);

  return (
    <RadioGroup disabled={feature.noOverride} onChange={handleChangeSelection} value={valueInOverrides}>
      <RadioGroup.Label>
        <h6 className="text-gray-900 align-center flex flex-row flex-nowrap items-center gap-2 lg:gap-4 h-7">
          <span className="font-medium">
            Feature: <code>{feature.name}</code>
          </span>
          {feature.noOverride === true ? (
            <div className="border-orange-500 text-orange-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1">
              <svg
                aria-hidden="true"
                className="h-4 w-4 min-w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  fillRule="evenodd"
                />
              </svg>
              <div>No Overrides</div>
            </div>
          ) : null}
          {actualChecked === true ? (
            <div className="flex flex-nowrap text-xs text-green-500 flex-row gap-1 rounded-sm border items-center justify-center border-green-500 px-2 py-1">
              <svg
                aria-hidden="true"
                className="h-4 w-4 min-w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  fillRule="evenodd"
                />
              </svg>
              <div>{actualChecked ? 'Enabled' : 'Disabled'}</div>
            </div>
          ) : null}
        </h6>
        {feature.description == null ? null : <p className="text-base text-gray-500 text-sm">{feature.description}</p>}
      </RadioGroup.Label>
      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {[
          { id: 'true', title: `Enable ${feature.name}`, description: 'Override the feature to be enabled' },
          {
            id: 'unset',
            title: 'Default',
            description: 'Inherit enabled state from defaults',
            disabled: (feature.noOverride ?? false) || feature.force,
            defaultValue:
              valueInDefaults === 'true' ? (
                <div className="text-green-500 border-green-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1">
                  <span>Enabled</span>
                </div>
              ) : (
                <div className="text-red-500 border-red-500 flex flex-nowrap text-xs flex-row gap-1 rounded-sm border items-center justify-center px-2 py-1">
                  <span>Disabled</span>
                </div>
              ),
          },
          { id: 'false', title: `Disable ${feature.name}`, description: 'Override the feature to be disabled' },
        ].map((option) => (
          <RadioGroup.Option
            className={({ checked, active, disabled }) =>
              classNames(
                checked ? 'border-transparent' : 'border-gray-300',
                !disabled && active ? 'border-blue-500 ring-2 ring-blue-500' : '',
                disabled ? 'border-transparent ring-gray-500 cursor-not-allowed' : 'cursor-pointer',
                'relative bg-white border rounded-lg shadow-sm p-3 flex focus:outline-none'
              )
            }
            disabled={option.disabled}
            key={option.id}
            value={option.id}
          >
            {({ checked, active, disabled }) => (
              <>
                <div className="flex flex-col grow">
                  <RadioGroup.Label as="span" className="flex flex-nowrap flex-row gap-1 items-center space-between">
                    <span className="text-sm font-medium text-gray-900 grow shrink">{option.title}</span>
                    {option.defaultValue != null ? option.defaultValue : null}
                    <svg
                      aria-hidden="true"
                      className={classNames(!checked ? 'invisible' : '', 'h-5 w-5 text-blue-500 min-w-4')}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </RadioGroup.Label>
                  <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                    {option.description}
                  </RadioGroup.Description>
                </div>
                <div
                  aria-hidden="true"
                  className={classNames(
                    !disabled && active ? 'border' : 'border-2',
                    checked ? (disabled ? 'border-gray-500' : 'border-blue-500') : 'border-transparent',
                    'absolute -inset-px rounded-lg pointer-events-none'
                  )}
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}

function ShadowContent({ root, children }: { children: ReactNode; root: Element }) {
  return ReactDOM.createPortal(children, root);
}

/// Permit users to override feature flags via a GUI.
/// Renders a small floating button in lower left or right, pressing it brings up
/// a list of features to toggle and their current override state. you can override on or override off,
/// or unset the override and go back to default value.
// eslint-disable-next-line no-undef
export function ToggleFeatures({ defaultOpen = false }: { defaultOpen?: boolean }): JSX.Element | null {
  const [root, setCoreRoot] = useState<HTMLDivElement | null>(null);

  const setRoot = (host: HTMLDivElement | null) => {
    if (host == null || root != null) {
      return;
    }
    const shadowRoot = host?.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    const renderDiv = document.createElement('div');
    style.textContent = styles;
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(renderDiv);
    setCoreRoot(renderDiv);
  };

  return (
    <div ref={setRoot} style={{ zIndex: 99999, position: 'fixed', width: '100%', height: '40px', bottom: 0 }}>
      {root != null ? (
        <ShadowContent root={root}>
          <ToggleFeatureUnwrapped defaultOpen={defaultOpen} />
        </ShadowContent>
      ) : null}
    </div>
  );
}

/// Like ToggleFeatures, but does not inject styles into a shadow DOM root node.
/// useful if you're using tailwind.
export function ToggleFeatureUnwrapped({ defaultOpen = false }: { defaultOpen?: boolean }): JSX.Element | null {
  const [open, setOpen] = useState(defaultOpen);
  const context = useContext(FeatureContext);

  if (context == null) {
    return null;
  }

  // We want: Real value after all nestings, value of the override. we toggle override
  const { featuresDescription } = context;

  if (featuresDescription.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-0 mx-8 my-8">
        <button
          className="inline-flex items-center text-sm font-medium p-1 h-8 w-8 align-middle cursor-pointer rounded-full bg-blue-600 text-white  border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm"
          onClick={() => setOpen(true)}
          title="Toggle features"
          type="button"
        >
          <svg
            className="w-6 h-6 min-h-6 min-w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {!open ? null : (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-flex-start mx-8 my-4 min-h-screen pt-4 px-4 pb-10 sm:block sm:p-0">
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 lg:max-w-[80%] max-w-full">
              <div>
                <div className="mt-1 sm:mt-3">
                  <h3 className="flex flex-row gap-4 flex-nowrap items-center space-between">
                    <div className="grow text-lg leading-6 font-medium text-gray-900">Feature Flag Overrides</div>
                  </h3>
                  <p className="text-sm text-gray-500">
                    Features can be enabled or disabled unless they are forced upstream. You can also revert to default.
                  </p>
                  <div className="mt-6">
                    <fieldset className="flex flex-col gap-9">
                      <legend className="sr-only">Feature Flags</legend>
                      {featuresDescription.map((feature) => (
                        <ToggleFeature feature={feature} key={feature.name} />
                      ))}
                    </fieldset>
                  </div>
                  <div className="flex justify-center items-center mt-5 sm:mt-6">
                    <button
                      className="inline-flex items-center text-sm font-medium pt-0 pb-0 pr-4 pl-4 h-8 leading-7 align-middle cursor-pointer rounded-sm bg-blue-600 text-white border border-transparent justify-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:text-sm"
                      onClick={() => setOpen(false)}
                      type="button"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

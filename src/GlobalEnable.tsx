import { FeaturesDispatch } from './FeaturesState';
import { FeatureDescription, FeatureValue } from './FeatureState';

export class GlobalEnable {
  private readonly featureDesc: readonly FeatureDescription[];
  private readonly dispatch: FeaturesDispatch;
  private readonly testFeature: (value: string) => FeatureValue;

  constructor(
    dispatch: FeaturesDispatch,
    testFeature: (_: string) => FeatureValue,
    featureDesc: readonly FeatureDescription[]
  ) {
    this.featureDesc = featureDesc;
    this.dispatch = dispatch;
    this.testFeature = testFeature;
  }

  public toggle(feature: string): void {
    this.dispatch({ type: 'TOGGLE', name: feature });
  }

  public enable(feature: string): void {
    this.dispatch({ type: 'ENABLE', name: feature });
  }

  public unset(feature: string): void {
    this.dispatch({ type: 'UNSET', name: feature });
  }

  public disable(feature: string): void {
    this.dispatch({ type: 'DISABLE', name: feature });
  }

  public setAll(features: { [key: string]: FeatureValue }): void {
    this.dispatch({ type: 'SET_ALL', features });
  }

  public listFeatures(): readonly [string, FeatureValue][] {
    return this.featureDesc.map((f) => [f.name, this.testFeature(f.name)]);
  }
}
declare global {
  interface Window {
    feature?: GlobalEnable;
  }
}

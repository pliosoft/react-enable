import { DispatchFeature } from "./FeatureState";
export class GlobalEnable {
  private readonly dispatch: DispatchFeature;
  constructor(dispatch: DispatchFeature) {
    this.dispatch = dispatch;
  }
  public toggle(feature: string) {
    this.dispatch({ type: "toggle", feature });
  }
  public enable(feature: string) {
    this.dispatch({ type: "enable", feature });
  }
  public disable(feature: string) {
    this.dispatch({ type: "disable", feature });
  }
}
declare global {
  interface Window {
    feature?: GlobalEnable;
  }
}

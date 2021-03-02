var GlobalEnable = (function () {
    function GlobalEnable(dispatch) {
        this.dispatch = dispatch;
    }
    GlobalEnable.prototype.toggle = function (feature) {
        this.dispatch({ type: "toggle", feature: feature });
    };
    GlobalEnable.prototype.enable = function (feature) {
        this.dispatch({ type: "enable", feature: feature });
    };
    GlobalEnable.prototype.disable = function (feature) {
        this.dispatch({ type: "disable", feature: feature });
    };
    return GlobalEnable;
}());
export { GlobalEnable };

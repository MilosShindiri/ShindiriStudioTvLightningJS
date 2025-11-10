import { Lightning, Utils } from "@lightningjs/sdk";

export default class LoadingScreenComponent extends Lightning.Component {
  static _template() {
    return {
      Spinner: {
        x: 960,
        y: 540,
        w: 80,
        h: 80,
        mount: 0.5,
        texture: Lightning.Tools.getSvgTexture(
          Utils.asset("images/spinner.svg"),
          80,
          80
        ),
      },
    };
  }

  get _Spinner() {
    return this.tag("Spinner");
  }

  _init() {
    this._spin();
  }

  _spin() {
    this._spinnerAnimation = this._Spinner.animation({
      duration: 2,
      repeat: -1,
      actions: [{ p: "rotation", v: { 0: 0, 1: 2 * Math.PI } }],
    });
    this._spinnerAnimation.start();
  }

  _disable() {
    if (this._spinnerAnimation) {
      this._spinnerAnimation.stop();
      this._spinnerAnimation = null;
    }
  }
}

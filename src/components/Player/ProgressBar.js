import { Lightning } from "@lightningjs/sdk";

export default class ProgressBar extends Lightning.Component {
  static _template() {
    return {
      BackgroundBar: {
        rect: true,
      },
      Progress: {
        rect: true,
        w: 0,
      },
    };
  }

  get _BackgroundBar() {
    return this.tag("BackgroundBar");
  }
  get _Progress() {
    return this.tag("Progress");
  }

  set props(props) {
    const { backgroundBarColor, progressColor, width, height, flexItem } =
      this._props;

    this.patch({
      flexItem,
      w: width,
      h: height,
      BackgroundBar: {
        texture: Lightning.Tools.getRoundReact(
          1404,
          9,
          0,
          0,
          undefined,
          true,
          backgroundBarColor
        ),
        h: height,
        w: width,
      },
      Progress: {
        color: progressColor,
        h: height,
      },
    });
  }

  _init() {}

  _getFocused() {}

  static _states() {
    return [];
  }
}

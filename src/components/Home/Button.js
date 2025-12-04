import { Lightning } from "@lightningjs/sdk";

export default class Button extends Lightning.Component {
  static _template() {
    return {
      w: 352,
      h: 67,
      rect: true,
      color: 0xff2f2f2f,

      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 30,
      },
      Label: {
        mountX: 0.4,
        mountY: 0.5,
        x: 150,
        y: 35,

        text: {
          text: "GO TO LIVE PLAYER",
          fontFace: "InterBold",
          fontSize: 24,
          letterSpacing: 2,
        },
      },
    };
  }

  _handleHover() {
    this.fireAncestors("$handleHoverState", this.ref);
  }

  _focus() {
    this.patch({
      color: 0xffed1c24,
    });
  }

  _unfocus() {
    this.patch({
      color: 0xff2f2f2f,
    });
  }
}

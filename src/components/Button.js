import { Lightning, Router } from "@lightningjs/sdk";
import colors from "../styles/colors";

export default class Button extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 30,
      },
      Wrapper: {
        flex: {
          direction: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        Icon: {
          w: 24,
          h: 24,
        },
        Label: {
          text: {
            text: "",
            fontSize: 17,
            fontFace: "InterBold",
            textColor: colors.text,
            letterSpacing: 2,
            paddingLeft: 5,
          },
        },
      },
    };
  }

  get _Icon() {
    return this.tag("Icon");
  }

  _init() {
    this._unfocusedColor = 0xff2f2f2f;
    this._focusedColor = 0xffff0000;
  }

  set props(config) {
    const {
      label = "",
      icon = null,
      unfocusedColor = 0xff2f2f2f,
      focusedColor = 0xffff0000,
    } = config;

    this._unfocusedColor = unfocusedColor;
    this._focusedColor = focusedColor;

    this.patch({
      color: unfocusedColor,
      Wrapper: {
        Label: {
          text: {
            text: label,
          },
        },
      },
    });

    if (icon) {
      this.tag("Icon").patch({
        src: icon,
      });
    } else {
      this.tag("Icon").visible = false;
    }
  }

  _handleHover() {
    this.fireAncestors("$handleHoverState", this.ref);
  }

  _focus() {
    this.patch({
      smooth: { color: this._focusedColor, scale: 1.05 },
    });
  }

  _unfocus() {
    this.patch({
      smooth: { color: this._unfocusedColor, scale: 1 },
    });
  }
}

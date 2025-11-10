import { Lightning, Router } from "@lightningjs/sdk";
import { COLORS } from "../../../constants/colors";

export default class NavElement extends Lightning.Component {
  static _template() {
    return {
      flexItem: { marginRight: 130 },
      Label: {
        text: {
          fontSize: 24,
          fontFace: "Inter-Bold",
          letterSpacing: 3,
          textColor: COLORS.GRAY,
        },
      },
    };
  }

  set item(data) {
    this._item = data;
    this.patch({
      Label: { text: { text: data.label } },
    });

    this.tag("Label").once("txLoaded", () => {
      this._labelWidth = this.tag("Label").renderWidth;
      this._labelReady = true;
      if (this._isFocused) {
        this._applyFocus();
      }
    });
  }

  _focus() {
    this._isFocused = true;
    if (this._labelReady) {
      this._applyFocus();
    }
  }

  _unfocus() {
    this._isFocused = false;
    this.patch({
      Label: { text: { textColor: COLORS.GRAY } },
      Underline: undefined,
    });
  }

  _applyFocus() {
    const extraPadding = 20;

    this.patch({
      Label: { text: { textColor: COLORS.WHITE } },
      Underline: {
        x: -extraPadding,
        y: 38,
        w: this._labelWidth + extraPadding * 2,
        h: 4,
        rect: true,
        color: COLORS.RED,
      },
    });
  }

  _handleEnter() {
    const label = this._item.label.toLowerCase();

    Router.navigate(label);

    return true;
  }
}

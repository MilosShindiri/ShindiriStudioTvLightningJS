import { Lightning, Router } from "@lightningjs/sdk";
import { COLORS } from "../../../constants/colors";

export default class NavElement extends Lightning.Component {
  _item = null;
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
  get item() {
    return this._item;
  }
  set item(data) {
    this._item = data;
    this.patch({ Label: { text: { text: data.label } } });

    this.tag("Label").once("txLoaded", () => {
      this._labelWidth = this.tag("Label").renderWidth;
      this._labelReady = true;
      this._applyVisualState();
    });
  }

  set props(props) {
    console.log(this._item);
    const { route } = props;
    console.log("Doslo do element zadnji", props);
    if (!route || !this._item) return;

    const label = this._item.label;
    this._selected = route === label.toLowerCase(); // exact match
    this._applyVisualState();
    console.log(this._selected);
    console.log(route);
    console.log(label);
  }

  _focus() {
    this._isFocused = true;
    this._applyVisualState();
  }

  _unfocus() {
    this._isFocused = false;
    this._applyVisualState();
  }

  _applyVisualState() {
    const extraPadding = 20;

    const color =
      this._isFocused || this._selected ? COLORS.WHITE : COLORS.GRAY;

    const patch = {
      Label: { text: { textColor: color } },
      Underline: undefined,
    };

    if (this._isFocused && this._labelReady) {
      patch.Underline = {
        x: -extraPadding,
        y: 38,
        w: this._labelWidth + extraPadding * 2,
        h: 4,
        rect: true,
        color: COLORS.RED,
      };
    }

    this.patch(patch);
  }

  _handleEnter() {
    Router.navigate(this._item.label.toLowerCase());
    return true;
  }
}

import { Lightning, Router } from "@lightningjs/sdk";
import { COLORS } from "../../constants/colors";

export default class NavElement extends Lightning.Component {
  _item = null;
  _selected = false;
  _isFocused = false;
  _labelReady = false;
  _labelWidth = 0;

  static _template() {
    return {
      collision: true, // Omogućava hover/klik
      h: 20, // Fiksna visina
      Label: {
        // y: 18, // Centriraj tekst vertikalno
        text: {
          fontSize: 24,
          fontFace: "InterBold",
          letterSpacing: 3,
          textColor: COLORS.GRAY,
        },
      },
    };
  }

  set item(data) {
    this._item = data;
    this.tag("Label").text = data.label;

    this.tag("Label").once("txLoaded", () => {
      this._labelWidth = this.tag("Label").renderWidth;
      this._labelReady = true;

      // Dinamički postavljamo širinu komponenti na osnovu teksta + padding
      this.w = this._labelWidth + 40; // 20px padding levo/desno
      this._applyVisualState();
    });
  }

  set selected(val) {
    this._selected = val;
    this._applyVisualState();
  }

  set props(props) {
    const { route } = props;
    if (!route || !this._item) return;

    const label = this._item.label;
    this._selected = route === label.toLowerCase();
    this._applyVisualState();
  }

  _handleHover() {
    this._focus();
    this.fireAncestors("$handleItemHover", this.parent.children.indexOf(this));
    Router.focusWidget("Menu");
  }

  // _handleHover() {
  //   this._focus();
  //   this.fireAncestors("$handleItemHover", this.parent.children.indexOf(this));
  //   console.log(this.parent.children.indexOf(this));
  // }

  // _handleHover() {
  //   const index = this.parent.children.indexOf(this);
  //   this.fireAncestors("$handleHoverIndex", index);
  // }

  _handleUnhover() {
    Router.focusPage();
  }

  _handleClick() {
    this._handleEnter();
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

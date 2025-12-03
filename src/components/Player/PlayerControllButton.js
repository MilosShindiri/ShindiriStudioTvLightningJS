import { Colors, Lightning, VideoPlayer, Utils } from "@lightningjs/sdk";
import colors from "../../styles/colors";

export default class PlayerControllButton extends Lightning.Component {
  _props = {
    callback: null,
  };

  static _template() {
    return {
      collision: true,
    };
  }
  set props(props) {
    const { w, h, x, src, label, callback } = props;
    this.patch({
      w: w,
      h: h,
      x: x,
      rect: true,
      mountY: 0.5,
      src: Utils.asset(src),
      color: Colors("#ffffff").alpha(0.3).get(),
    });
    this._props.label = label;
    this._props.callback = callback;
  }

  _focus() {
    this.patch({ color: Colors("#ed1c24").get() });
  }

  _unfocus() {
    this.patch({ color: Colors("#ffffff").alpha(0.3).get() });
  }

  _handleEnter() {
    this._props.callback();
  }

  _handleClick() {
    this._props.callback();
  }

  _handleHover() {
    this._focus();
    this.fireAncestors("$handleItemHover", this.parent.children.indexOf(this));
  }
}

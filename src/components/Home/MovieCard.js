import { Lightning, Utils } from "@lightningjs/sdk";
import colors from "../../styles/colors";
import { MovieService } from "../../services/movieService";
import { Img } from "@lightningjs/sdk";

export default class MovieCard extends Lightning.Component {
  static _template() {
    return {
      collision: true,
      rect: true,
      flex: { direction: "column", paddingRight: 24 },
      // flexItem: { marginLeft: 0 },
      color: 0x00000000,
      w: 229,
      h: 359,
      Image: {
        w: 229,
        h: 300,
        src: Utils.asset("/images/placeholder.png"),
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 8,
        },
      },
      Title: {
        w: 229,
        h: 43,
        flexItem: { marginTop: 16 },
        text: {
          text: "Loading...",
          fontSize: 24,
          textColor: 0x99ffffff,
          fontFace: "InterRegular",
          wordWrapWidth: 229,
          maxLines: 1,
        },
      },
    };
  }

  set movie(data) {
    this._movie = data;
    this.tag("Image").texture = Img(data.thumbnail).exact(229, 300);
    // this.tag("Image").src = data.thumbnail;
    this.tag("Title").text = data.title;
  }

  _focus() {
    this.tag("Image").patch({
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 8,
        stroke: 4,
        strokeColor: 0xffff0000,
      },
    });
    this.tag("Title").patch({
      text: {
        textColor: colors.white,
      },
    });
  }

  _unfocus() {
    this.tag("Image").patch({
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 8,
        stroke: 0,
      },
    });
    this.tag("Title").patch({
      text: {
        textColor: 0x99ffffff,
      },
    });
  }

  _handleHover() {
    console.log("%c[MOVIE CARD] HOVER", "color: lightgreen", {
      cardIndex: this.parent.children.indexOf(this),
      focusPath: this.stage.focusPath,
    });
    this._focus();
    console.log("asdf index: ", this.parent.children.indexOf(this));
    this.fireAncestors("$handleItemHover", this.parent.children.indexOf(this));
  }

  _handleClick() {
    this._handleEnter();
  }
}

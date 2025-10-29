import { Lightning, Utils } from "@lightningjs/sdk";
import { MovieService } from "../services/movieService";

export default class extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      flex: { direction: "column" },
      color: 0x00000000,
      w: 229,
      h: 359,
      Image: {
        w: 229,
        h: 300,
        src: Utils.asset("/static/images/placeholder.png"),
      },
      Title: {
        w: 229,
        h: 43,
        flexItem: { marginTop: 16 },
        text: { text: "Loading...", fontSize: 24, textColor: 0x99ffffff },
      },
    };
  }
  set movie(data) {
    this._movie = data;
    this.tag("Image").src = data.thumbnail;
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
  }

  _unfocus() {
    this.tag("Image").patch({
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 8,
        stroke: 0,
      },
    });
  }
}

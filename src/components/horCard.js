import { Lightning, Img, Router } from "@lightningjs/sdk";

export default class HorCard extends Lightning.Component {
  static _template() {
    return {
      w: 440,
      h: 330,
      color: 0xff222222,
      Image: {
        w: 440,
        h: 278,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 16,
          stroke: 0,
        },
      },
      Title: {
        y: 285,
        text: {
          fontSize: 20,
          fontFace: "InterRegular",
          textColor: 0xffffffff,
        },
      },
    };
  }

  set item(data) {
    this._item = data;

    if (data.image) {
      this.tag("Image").patch({
        src: data.image,
      });
    }

    this.tag("Title").text.text = data.title;
  }

  _focus() {
    const shader = this.tag("Image").shader;
    if (shader) {
      shader.stroke = 3;
      shader.strokeColor = 0xffe50914;
    }
  }

  _unfocus() {
    const shader = this.tag("Image").shader;
    if (shader) {
      shader.stroke = 0;
    }
  }

  _handleEnter() {
    Router.navigate(`details/${this._item.id}`, {
      movie: this._item,
      index: this._item.index,
    });
    console.log(`details/${this._item.id}`, { movie: this._item });
  }
}

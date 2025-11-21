import { Lightning, Img } from "@lightningjs/sdk";
import colors from "../../styles/colors";

export default class VerticalItem extends Lightning.Component {
  static _template() {
    return {
      w: 280,
      h: 136,
      rect: true,
      color: 0xff181818,
      shader: { type: Lightning.shaders.RoundedRectangle, radius: 16 },
      flexItem: { marginTop: 16 },

      PaddingWrapper: {
        x: 16,
        y: 24,
        w: 248, // 280 - (16 + 16)
        h: 88, // 136 - (24 + 24)

        flex: {
          direction: "column",
          alignItems: "center",
          justifyContent: "center",
        },

        Image: {
          w: 45,
          h: 45,
          rect: true,
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 8 },
          smoothing: false,
          src: "",
        },

        Title: {
          shader: null,
          y: 16,
          text: {
            text: "",
            fontFace: "InterRegular",
            fontSize: 16,
            lineHeight: 20,
            textColor: colors.text,
          },
        },
      },
    };
  }

  set itemData(data) {
    this.patch({
      PaddingWrapper: {
        Image: {
          texture: Img(data.image).exact(45, 45),
          // ako je SVG:
          // texture: Lightning.Tools.getSvgTexture(data.image, 45, 45, { precision: 4.0 }),
        },
        Title: {
          text: {
            text: data.title || "",
          },
        },
      },
    });
  }

  _focus() {
    this.patch({
      color: 0xff222222,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 16,
        stroke: 3,
        strokeColor: 0xffe50914,
      },
    });
  }

  _unfocus() {
    this.patch({
      color: 0xff181818,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 16,
        stroke: 0,
      },
    });
  }
}

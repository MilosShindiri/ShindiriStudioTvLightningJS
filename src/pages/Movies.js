import { Lightning } from "@lightningjs/sdk";

export default class Movies extends Lightning.Component {
  static _template() {
    return {
      Label: {
        mountX: 0.4,
        mountY: 0.5,
        x: 150,
        y: 35,

        text: {
          text: "Movies Stranica",
          fontFace: "InterBold",
          fontSize: 24,
          letterSpacing: 2,
        },
      },
    };
  }
}

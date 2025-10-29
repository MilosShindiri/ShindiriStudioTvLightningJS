import { Router } from "@lightningjs/sdk";
import router from "./router.js";
import colors from "./styles/colors.js";

export default class App extends Router.App {
  static _template() {
    return {
      Background: { w: 1920, h: 1080, rect: true, color: colors.background },
      Pages: {},
      Widgets: {},
    };
  }

  _setup() {
    router();
  }
}

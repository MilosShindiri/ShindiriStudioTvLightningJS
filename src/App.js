import { Router, Utils } from "@lightningjs/sdk";
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
  static getFonts() {
    return [
      //700
      {
        family: "InterBold",
        url: Utils.asset("../static/fonts/Inter_18pt-Bold.ttf"),
      },
      //600
      {
        family: "InterSemiBold",
        url: Utils.asset("../static/fonts/Inter_18pt-SemiBold.ttf"),
      },
      // 400
      {
        family: "InterRegular",
        url: Utils.asset("../static/fonts/Inter_18pt-Regular.ttf"),
      },
      {
        family: "Ema",
        url: Utils.asset("../static/fonts/Inter_28pt-Bold.ttf"),
      },
    ];
  }
  _setup() {
    router();
  }
}

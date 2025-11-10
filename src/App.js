import { Router, Utils, Lightning } from "@lightningjs/sdk";
import setupRouter from "./router.js";
import colors from "./styles/colors.js";
import LoadingScreenComponent from "./components/LoadingScreen/LoadingScreenComponent.js";
import Navbar from "./components/Widgets/Navbar/Navbar.js";
import "@lightningjs/core/inspector";

export default class App extends Router.App {
  static _template() {
    return {
      ...super._template(),

      // Background: {
      //   w: 1920,
      //   h: 1080,
      //   rect: true,
      //   color: colors.background,
      //   zIndex: -1,
      // },

      Pages: {
        w: 1920,
        h: 1080,
      },

      Widgets: {
        Menu: {
          type: Navbar,
        },
      },

      Loading: {
        type: LoadingScreenComponent,
        alpha: 0,
      },
    };
  }

  static getFonts() {
    return [
      {
        family: "InterBold",
        url: Utils.asset("../static/fonts/Inter_18pt-Bold.ttf"),
      },
      {
        family: "InterSemiBold",
        url: Utils.asset("../static/fonts/Inter_18pt-SemiBold.ttf"),
      },
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
    setupRouter();
  }

  // Globalne kontrole loadera
  // showLoader() {
  //   console.log("[App] showLoader()");
  //   this.tag("Loading").setSmooth("alpha", 1);
  // }

  // hideLoader() {
  //   console.log("[App] hideLoader()");
  //   this.tag("Loading").setSmooth("alpha", 0);
  // }
}

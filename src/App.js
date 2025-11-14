import { Router, Utils, Lightning } from "@lightningjs/sdk";
import setupRouter from "./router.js";
import colors from "./styles/colors.js";
import LoadingScreenComponent from "./components/LoadingScreen/LoadingScreenComponent.js";
import Navbar from "./components/Widgets/Navbar/Navbar.js";
import "@lightningjs/core/inspector";
import router from "./router";

export default class App extends Router.App {
  static _template() {
    return {
      ...super._template(),

      Pages: {
        collision: true,
        w: 1920,
        h: 1080,
      },
      Loading: {
        type: LoadingScreenComponent,
        // alpha: 0,
        visible: false,
        zIndex: 200,
      },
      Widgets: {
        Menu: {
          type: Navbar,
        },
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
    Router.startRouter(
      {
        ...router,
        afterEachRoute: (request) => {
          console.log("Current route _hash:", request._hash);
          this.patch({
            Widgets: { Menu: { props: { route: request._hash } } },
          });
        },
      },
      this
    );
  }

  $showLoader() {
    this.tag("Loading").visible = true;
  }

  $hideLoader() {
    this.tag("Loading").visible = false;
  }

  // showLoader() {
  //   this.tag("Loading").setSmooth("alpha", 1);
  // }

  // hideLoader() {
  //   this.tag("Loading").setSmooth("alpha", 0);
  // }

  $exitApp() {
    this.application.closeApp();
  }
}

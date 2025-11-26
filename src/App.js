import { Router, Utils, Lightning, Colors } from "@lightningjs/sdk";
import "@lightningjs/core/inspector";

import setupRouter from "./router.js";
import router from "./router";
import { SCREEN } from "./constants/dimensions";
import PAGE_PATHS from "./constants/pagePaths.js";

import colors from "./styles/colors.js";

import Navbar from "./widgets/Navbar/NavBar.js";
import LoadingScreenComponent from "./components/LoadingScreen/LoadingScreenComponent.js";
import BRANDING from "./constants/fonts";
import { getDevice } from "./utils/device.js";

export default class App extends Router.App {
  static _template() {
    return {
      ...super._template(),
      Background: {
        w: SCREEN.w,
        h: SCREEN.h,
      },
      Loading: {
        type: LoadingScreenComponent,
        visible: false,
        rect: true,
        w: 1920,
        h: 1080,
        // zIndex: 100000,
        color: Colors("#000000").get(),
        props: {
          xPos: 960,
          yPos: 540,
        },
      },
      Pages: {
        collision: true,
        w: SCREEN.w,
        h: SCREEN.h,
      },
      Widgets: {
        Menu: {
          type: Navbar,
        },
      },
    };
  }

  static getFonts() {
    return BRANDING.FONTS.map(({ family, descriptors, path }) => ({
      family,
      descriptors,
      url: Utils.asset(path),
    }));
  }

  _setup() {
    Router.startRouter(
      {
        ...router,
        afterEachRoute: (request) => {
          this.Menu.props = { route: request._hash };
        },
      },
      this
    );
  }

  // _firstEnable() {
  //   Router.navigate(PAGE_PATHS.SPLASH);
  // }

  $showLoader() {
    this.Loading.visible = true;
  }

  $hideLoader() {
    this.Loading.visible = false;
  }

  $punchHole() {
    this.tag("Background").shader = {
      type: Lightning.shaders.Hole,
      w: SCREEN.w,
      h: SCREEN.h,
    };
  }
  $unpunchHole() {
    this.tag("Background").shader = {
      w: 0,
      h: 0,
    };
  }

  $exitApp() {
    this.application.closeApp();
  }

  $appClose() {
    const dialog = this._Dialog;
    dialog.open({
      message: t("exit_label"),
      actions: [
        {
          label: t("no_resume"),
          action: () => {
            dialog.close();
          },
        },
        {
          label: t("yes_exit"),
          action: () => {
            const device = getDevice();
            // Router navigation for "Yes, exit now"
            switch (device) {
              case "metrological":
                this.application.closeApp();
                break;
              case "tizen":
                window.tizen.application.getCurrentApplication().exit();
                break;
              default:
                window.close();
                break;
            }
          },
        },
      ],
    });
  }

  get Loading() {
    return this.tag("Loading");
  }

  get Menu() {
    return this.tag("Widgets.Menu");
  }
}

//TODO uradi isto i za Background
// Dodaj enum za globalne sirine i visine - reseno
// widget treba da ti bude u widgets folderu - reseno
// dodaj enum za pagePaths - reseno

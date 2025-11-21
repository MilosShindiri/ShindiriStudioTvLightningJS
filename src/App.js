import { Router, Utils, Lightning, Colors } from "@lightningjs/sdk";
import "@lightningjs/core/inspector";

import setupRouter from "./router.js";
import router from "./router";
import { SCREEN } from "./constants/dimensions";

import colors from "./styles/colors.js";

import Navbar from "./components/Widgets/Navbar/Navbar.js";
import LoadingScreenComponent from "./components/LoadingScreen/LoadingScreenComponent.js";
import BRANDING from "./constants/fonts";

export default class App extends Router.App {
  static _template() {
    return {
      ...super._template(),

      Background: {
        w: SCREEN.w,
        h: SCREEN.h,
      },

      Pages: {
        // collision: true, ovo ti sluzi za magic remote
        w: SCREEN.w,
        h: SCREEN.h,
      },
      Loading: {
        type: LoadingScreenComponent,
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

  get Loading() {
    return this.tag("Loading");
  }

  get Menu() {
    return this.tag("Widgets.Menu");
  }
}
//TODO uradi isto i za Background
// Dodaj enum za globalne sirine i visine
// widget treba da ti bude u widgets folderu
// dodaj enum za pagePaths

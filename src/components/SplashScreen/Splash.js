import { Lightning, Router, Utils } from "@lightningjs/sdk";
import colors from "../../styles/colors";

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: colors.black,
        src: Utils.asset("images/backgroundImage.png"),
      },
      Logo: {
        x: 760,
        y: 340,
        w: 400,
        h: 400,
        src: Utils.asset("images/appLogo.png"),
        // alpha: 0,
      },
      LoadingText: {
        //iskoritsti flex za centriranje
        x: 830,
        y: 780,
        text: {
          text: "Loading...",
          fontFace: "InterRegular",
          fontSize: 32,
          textColor: colors.text,
        },
        // alpha: 0,
      },
    };
  }

  _init() {
    // jednostavna animacija za fade-in
    this._fadeInAnimation = this.animation({
      duration: 1.5,
      actions: [
        { t: "Logo", p: "alpha", v: { 0: 0, 1: 1 } },
        { t: "LoadingText", p: "alpha", v: { 0: 0, 1: 1 } },
      ],
    });

    this._fadeInAnimation.start();
  }

  async _active() {
    console.log("Splash aktiviran");

    // Simulira učitavanje 3 sekunde
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("Prelazak na Home ekran...");
    Router.navigate("home");
  }

  // async _active() {
  //   simulacija inicijalnog fetcha (npr. učitavanje podataka ili fontova)
  //   await this._simulateLoading();

  //   nakon što sve završi, idi na Home
  //   Router.navigate("home");
  // }
  //todo iskoristi na jedno mesto
  _simulateLoading() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 3000); // 3 sekunde splash
    });
  }

  _disable() {
    // čišćenje animacija
    if (this._fadeInAnimation) {
      this._fadeInAnimation.stop();
      this._fadeInAnimation = null;
    }
  }
}

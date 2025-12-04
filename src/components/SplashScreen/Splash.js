import { Lightning, Router, Utils } from "@lightningjs/sdk";
import PAGE_PATHS from "../../constants/pagePaths.js";

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: 0xff000000,
        // src: Utils.asset("images/backgroundImage.png"),
      },
      Logo: {
        x: 760,
        y: 340,
        w: 400,
        h: 400,
        src: Utils.asset("images/movie.png"),
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
          textColor: 0xffffffff,
        },
        // alpha: 0,
      },
    };
  }

  _init() {
    this._fadeInAnimation = this.animation({
      duration: 1.5,
      actions: [
        { t: "Logo", p: "alpha", v: { 0: 0, 1: 1 } },
        { t: "LoadingText", p: "alpha", v: { 0: 0, 1: 1 } },
      ],
    });
  }

  async _active() {
    await new Promise((res) => requestAnimationFrame(res));

    this._fadeInAnimation.start();
    await this._fadeInAnimation;

    await new Promise((res) => setTimeout(res, 9000));

    Router.navigate(PAGE_PATHS.HOME);
  }

  _disable() {
    if (this._fadeInAnimation) {
      this._fadeInAnimation.stop();
      this._fadeInAnimation = null;
    }
  }
}

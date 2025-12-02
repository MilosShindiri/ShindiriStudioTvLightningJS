import { Lightning, Utils, Router } from "@lightningjs/sdk";
import { SCREEN } from "../constants/dimensions";
import Content from "../components/Home/Content";
import TopChannels from "../components/Home/TopChannels";
import Button from "../components/Home/Button";
import colors from "../styles/colors";

export default class Home extends Lightning.Component {
  static _template() {
    return {
      w: SCREEN.w,
      h: SCREEN.h,
      // rect: true,

      Background: {
        src: Utils.asset("images/backgroundImage.png"),
        shader: null,
        // colors: colors.black,
      },
      Content: {
        collision: true,
        x: 64,
        y: 125,
        w: 1241,
        h: 837,
        type: Content,
      },
      TopChannels: {
        x: 1415,
        y: 122,
        type: TopChannels,
      },
      Button: {
        x: 64,
        y: 971,
        collision: true,
        type: Button,
      },
    };
  }

  get Content() {
    return this.tag("Content");
  }

  get TopChannels() {
    return this.tag("TopChannels");
  }

  get Button() {
    return this.tag("Button");
  }

  // forward router-provided props (e.g. movies/series from fetchHomeData) to Content
  set props(props) {
    // if Content exists, immediately forward; otherwise store pending
    if (this.tag("Content")) {
      this.tag("Content").props = props;
    } else {
      this._pendingProps = props;
    }
  }

  _init() {
    this._setState("Content");
    // Router.focusWidget("Menu");
    // apply any props that were set before init
    if (this._pendingProps && this.tag("Content")) {
      this.tag("Content").props = this._pendingProps;
      this._pendingProps = null;
    }
  }

  _handleBack(e) {
    if (Router.isNavigating()) {
      return;
    }
    e.preventDefault();

    this.fireAncestors("$appClose");
  }
  // _handleHover() {
  //   Router.focusPage();
  // }
  // $setStateOnScroll(nextState) {
  //   this._setState(nextState);
  // }

  $handleHoverState(ref) {
    console.log(ref);
    const currentState = this._getState();
    console.warn("WSTV handle", ref !== currentState);
    if (ref !== currentState) {
      if (currentState) this.tag(currentState)._unfocus();
      this._setState(ref);
    }
  }

  // _captureKey() {
  //   // console.log("key pressed", this._getState());
  //   return false;
  // }

  //   // ako želiš da koristiš currentState
  // }

  static _states() {
    return [
      class Button extends this {
        $enter() {
          this.Button.setSmooth("alpha", 1);
          this.Content.setSmooth("alpha", 0.6);
          this.TopChannels.setSmooth("alpha", 0.6);
        }

        _getFocused() {
          return this.Button;
        }

        _handleUp() {
          this._setState("ContentState");
          return true;
        }
      },
      class Content extends this {
        $enter() {
          this.Content.setSmooth("alpha", 1);
          this.TopChannels.setSmooth("alpha", 0.6);
          this.Button.setSmooth("alpha", 0.6);
        }

        _getFocused() {
          return this.Content;
        }

        _handleUp() {
          Router.focusWidget("Menu");
          return true;
        }
        _handleRight() {
          this._setState("TopChannels");
          return true;
        }

        // _handleDown() {
        //   this._setState("ButtonState");
        //   return true;
        // }
      },

      class TopChannels extends this {
        $enter() {
          this.Content.setSmooth("alpha", 0.6);
          this.Button.setSmooth("alpha", 0.6);
          this.TopChannels.setSmooth("alpha", 1);
        }

        _getFocused() {
          return this.TopChannels;
        }

        _handleLeft() {
          this._setState("Content");
          return true;
        }
      },
    ];
  }
}

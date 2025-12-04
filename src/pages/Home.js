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

      Background: {
        src: Utils.asset("images/backgroundImage.png"),
        shader: null,
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

  set props(props) {
    if (this.tag("Content")) {
      this.tag("Content").props = props;
    } else {
      this._pendingProps = props;
    }
  }

  _init() {
    this._setState("Content");

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

  $handleHoverState(ref) {
    if (Router.getActiveWidget()) {
      Router.focusPage();
    }
    const currentState = this._getState();

    if (ref !== currentState) {
      if (currentState) {
        // this.tag(currentState)._unfocus();
      }

      this._setState(ref);
    }
  }

  _getFocused() {
    return this[this._getState()];
  }

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

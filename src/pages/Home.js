import { Lightning, Utils, Router } from "@lightningjs/sdk";
import Content from "../components/Home/Content";
import TopChannels from "../components/Home/TopChannels";
import Button from "../components/Home/Button";

export default class Home extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      rect: true,
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset("images/backgroundImage.png"),
        shader: null,
      },
      Content: {
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

  _init() {
    this._setState("ContentState");
    Router.focusWidget("Menu");
  }

  static _states() {
    return [
      class ButtonState extends this {
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
      class ContentState extends this {
        $enter() {
          this.Content.setSmooth("alpha", 1);
          this.TopChannels.setSmooth("alpha", 0.6);
          this.Button.setSmooth("alpha", 0.6);
        }

        // _handleUp() {
        //   Router.focusWidget("Menu");
        //   return true;
        // }

        _getFocused() {
          return this.Content;
        }
        _handleUp() {
          Router.focusWidget("Menu");
          return true;
        }
        _handleRight() {
          this._setState("TopChannelsState");
          return true;
        }

        _handleDown() {
          this._setState("ButtonState");
          return true;
        }
      },

      class TopChannelsState extends this {
        $enter() {
          this.Content.setSmooth("alpha", 0.6);
          this.Button.setSmooth("alpha", 0.6);
          this.TopChannels.setSmooth("alpha", 1);
        }

        _getFocused() {
          return this.TopChannels;
        }

        _handleLeft() {
          this._setState("ContentState");
          return true;
        }
      },
    ];
  }
}

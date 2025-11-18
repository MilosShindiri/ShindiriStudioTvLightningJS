import { Lightning, VideoPlayer, Colors, Router } from "@lightningjs/sdk";
import { loader, unloader } from "../components/Player/HLS";
import PlayerControllButton from "../components/Player/PlayerControllButton";
import HorizontaContainer from "../components/HorizontalContainer/HorizontalContainer";
import ProgressBar from "../components/Player/ProgressBar";

const buttons = [
  { label: "rewind", src: "rewind.png" },
  { label: "playPause", src: "pause.png" },
  { label: "forward", src: "forward.png" },
];
export default class Player extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
      rect: true,
      colorTop: Colors("#000000").alpha(0).get(),
      colorBottom: Colors("#000000").get(),
      Controller: {
        w: 1690,
        h: 156,
        x: 115,
        y: 836,
        ButtonWrapper: {
          w: 995,
          h: 90,
          BackButton: {
            w: 66,
            h: 66,
            type: PlayerControllButton,
            color: Colors("#ffffff").alpha(0.3).get(),
            props: {
              w: 66,
              h: 66,
              src: "images/player/back.png",
              label: "back",
            },
          },
          CenteredButtonWrapper: {
            x: 845,
            mountX: 0.5,
            w: 312,
            flex: {
              direction: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
            type: HorizontaContainer,
            // disableScroll: true,
          },
          ProgressBarWrapper: {
            w: 1690,
            h: 31,
            x: 115,
            y: 961,
            flex: {
              flex: "row",
              justifyContent: "center",
              alignItems: "center",
            },
            CurrentTime: {
              color: 0xffffffff,
              Text: {
                w: 79,
                h: 31,
                text: {
                  text: "",
                  fontSize: 26,
                  textAlign: "center",
                },
              },
            },
            ProgressBar: {
              type: ProgressBar,
              w: 1404,
              h: 9,
              alpha: 0.1,
              flexItem: {
                marginLeft: 44,
                marginRight: 44,
              },
            },
            EndTime: {
              color: 0xffffffff,
              Text: {
                w: 119,
                h: 31,
                text: {
                  text: "",
                  fontSize: 26,
                  textAlign: "center",
                },
              },
            },
          },
        },
      },
    };
  }

  _init() {
    const buttonsMaped = buttons.map((item) => ({
      type: PlayerControllButton,
      props: {
        w: 66,
        h: 66,
        src: "images/player/" + item.src,
        label: item.label,
      },
    }));
    this.patch({
      Controller: {
        ButtonWrapper: {
          CenteredButtonWrapper: {
            props: {
              items: buttonsMaped,
              targetIndex: 1,
              disableScroll: true,
            },
          },
        },
      },
    });
    this._setState("CenteredButtonWrapper");

    this._targetIndex = 1;
    this._CenteredButtonWrapper._refocus();
  }

  _getFocused() {
    return this._CenteredButtonWrapper._getFocused();
  }

  get _BackButton() {
    return this.tag("BackButton");
  }

  _handleLeft() {
    return this._CenteredButtonWrapper._handleLeft();
  }

  _handleRight() {
    return this._CenteredButtonWrapper._handleRight();
  }

  get _Rewind() {
    return this.tag("Rewind");
  }

  get _PlayPauseButton() {
    return this.tag("PlayPauseButton");
  }

  get _Forward() {
    return this.tag("Forward");
  }

  get _CenteredButtonWrapper() {
    return this.tag("CenteredButtonWrapper");
  }

  get _ProgressBarWrapper() {
    return this.tag("ProgressBarWrapper");
  }

  get _CurrentTime() {
    return this.tag("CurrentTime.Text");
  }

  get _EndTime() {
    return this.tag("EndTime.Text");
  }

  _enable() {
    this.fireAncestors("$punchHole");
    VideoPlayer.position(0, 0);
    VideoPlayer.size(1920, 1080);
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
    VideoPlayer.loop(false);
    VideoPlayer.open("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
    VideoPlayer.play();
  }

  _disable() {
    this.fireAncestors("$unpunchHole");
    VideoPlayer.clear();
  }

  $exitVideo(e) {
    VideoPlayer.close();
    Router.back();
  }

  static _states() {
    return [
      class BackButton extends this {
        _getFocused() {
          return this._BackButton;
        }
        _handleRight() {
          this._setState("CenteredButtonWrapper");
        }
      },
      class CenteredButtonWrapper extends this {
        _getFocused() {
          return this._CenteredButtonWrapper;
        }
        _handleLeft() {
          this._setState("BackButton");
        }
      },
    ];
  }
}

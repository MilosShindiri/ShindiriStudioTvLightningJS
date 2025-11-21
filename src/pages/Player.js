import {
  Lightning,
  VideoPlayer,
  Colors,
  Router,
  Utils,
} from "@lightningjs/sdk";
import { SCREEN } from "../constants/dimensions";
import colors from "../styles/colors";
import { loader, unloader } from "../components/Player/HLS";
import PlayerControllButton from "../components/Player/PlayerControllButton";
import HorizontaContainer from "../components/HorizontalContainer/HorizontalContainer";
import ProgressBar from "../components/Player/ProgressBar";
import formatTimeHMS from "../utils/formatTimeHMS";

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
      w: SCREEN.w,
      h: SCREEN.h,
      rect: true,
      colorTop: Colors(colors.black).alpha(0).get(),
      colorBottom: Colors(colors.black).get(),
      Spinner: {
        w: 100,
        h: 100,
        x: SCREEN.w_half,
        y: SCREEN.h_half,
        texture: Lightning.Tools.getSvgTexture(
          Utils.asset("images/spinner.svg"),
          100,
          100
        ),
        mount: 0.5,
        rotation: 0,
      },
      Controller: {
        w: 1690,
        h: 156,
        x: 115,
        y: 836,
        ButtonWrapper: {
          w: 995,
          h: 90,
          BackButton: {
            y: 45,
            type: PlayerControllButton,
            color: Colors(colors.white).alpha(0.3).get(),
            props: {
              w: 66,
              h: 66,
              src: "images/player/back.png",
              label: "back",
            },
          },
          CenteredButtonWrapper: {
            x: 845,
            y: 45,
            mountX: 0.5,
            w: 312,
            h: 200,
            flex: {
              direction: "row",
              alignItems: "center",
              justifyContent: "center",
            },
            type: HorizontaContainer,
          },
        },
        ProgressBar: {
          y: 125,
          type: ProgressBar,
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

    // this._CenteredButtonWrapper._refocus();
    this._spin();
  }

  $videoPlayerLoadedData() {
    this._ProgressBar._EndTime.patch({
      text: {
        text: formatTimeHMS(VideoPlayer.duration),
        fontFace: "InterRegular",
        fontSize: 26,
      },
    });
    this._hideSpinner();
  }

  $videoPlayerPlaying() {
    this._hideSpinner();
  }

  $videoPlayerSeeking() {
    if (!this._Spinner.visible) this._Spinner.visible = true;
  }
  $videoPlayerSeeked() {
    this._Spinner.visible = false;
  }

  $videoPlayerTimeUpdate() {
    this._ProgressBar._updateProgressBar();
  }

  _showSpinner() {
    this._Spinner.visible = true;
  }

  _hideSpinner() {
    this._Spinner.visible = false;
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

  get _Spinner() {
    return this.tag("Spinner");
  }

  get _ProgressBar() {
    return this.tag("ProgressBar");
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
    VideoPlayer.size(SCREEN.w, SCREEN.h);
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
        _handleDown() {
          this._setState("ProgressBar");
        }
      },
      class CenteredButtonWrapper extends this {
        _getFocused() {
          return this._CenteredButtonWrapper;
        }
        _handleDown() {
          this._setState("ProgressBar");
        }
        _handleLeft() {
          this._setState("BackButton");
        }
      },
      class ProgressBar extends this {
        _getFocused() {
          return this._ProgressBar;
        }
        _handleUp() {
          this._setState("CenteredButtonWrapper");
        }
        _handleBack() {
          this._setState("CenteredButtonWrapper");
        }
      },
    ];
  }
  _spin() {
    this._Spinner
      .animation({
        duration: 2, // animation duration in seconds
        repeat: -1, // repeat indefinitely
        actions: [
          { p: "rotation", v: { 0: 0, 1: 10 * Math.PI } }, // rotate 360 degrees
        ],
      })
      .start();
  }
}

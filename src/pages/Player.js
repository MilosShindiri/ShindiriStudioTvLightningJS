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
import HorizontalContainer from "../components/HorizontalContainer/HorizontalContainer";
import ProgressBar from "../components/Player/ProgressBar";
import formatTimeHMS from "../utils/formatTimeHMS";

export default class Player extends Lightning.Component {
  _isPlaying = true;
  _isSeeking = false;
  _isEnded = false;
  _buttons = [
    {
      label: "back",
      src: "back.png",
      size: 66,
      handler: "_handleBack",
      x: -610,
    },
    {
      label: "rewind",
      src: "rewind.png",
      size: 66,
      handler: "_handleBackwards",
      x: 20,
    },
    {
      label: "playPause",
      src: "pause.png",
      size: 90,
      handler: "_handlePlayPause",
      x: 20,
    },
    {
      label: "forward",
      src: "forward.png",
      size: 66,
      handler: "_handleForward",
      x: 20,
    },
  ];
  static _template() {
    return {
      Spinner: {
        w: 100,
        h: 100,
        x: 960,
        y: 540,
        texture: Lightning.Tools.getSvgTexture(
          Utils.asset("images/spinner.svg"),
          100,
          100
        ),
        mount: 0.5,
        rotation: 0,
        zIndex: 30,
      },
      PlayerControl: {
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        visible: false,
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
            CenteredButtonWrapper: {
              x: 790,
              y: 45,
              mountX: 0.5,
              w: 312,
              h: 200,
              type: HorizontalContainer,
            },
          },
          ProgressBar: {
            y: 125,
            signals: {
              setIsPlaying: true,
            },
            type: ProgressBar,
          },
        },
      },
    };
  }

  _captureKey() {
    if (this._PlayerControl.visible === false) {
      this._PlayerControl.visible = true;
      this._hidePlayerControlDebounce();
      return true;
    }
    this._hidePlayerControlDebounce();
    return false;
  }

  _handleBack() {
    if (Router.isNavigating()) {
      return true;
    }
    this.$exitVideo();
  }
  _handleForward() {
    VideoPlayer.skip(5);
  }
  _handleBackwards() {
    VideoPlayer.skip(-5);
  }
  _handlePlayPause() {
    if (!this._isSeeking) {
      VideoPlayer.playPause();
      this._isPlaying = !this._isPlaying;
      this.setIsPlaying(this._isPlaying);
    }
  }
  $handleHoverState(ref) {
    const currentState = this._getState();
    if (ref !== currentState) {
      if (currentState) this.tag(currentState)._unfocus();
      this._setState(ref);
    }
  }
  _hidePlayerControlDebounce() {
    clearTimeout(this._hideWrapperTimeout);
    if (!this._PlayerControl.visible || this._ProgressBar._newTime !== null)
      return;

    this._hideWrapperTimeout = setTimeout(() => {
      this._PlayerControl.visible = false;
    }, 5000);
  }
  _init() {
    window.addEventListener("mousemove", () => {
      if (this._PlayerControl.visible === false) {
        this._PlayerControl.visible = true;
        this._hidePlayerControlDebounce();
      }
    });
    const buttonsMaped = this._buttons.map((item) => ({
      type: PlayerControllButton,
      props: {
        w: item.size,
        h: item.size,
        src: "images/player/" + item.src,
        label: item.label,
        x: item.x,
        flex: { alignSelf: "center" },
        callback: this[item.handler].bind(this),
      },
    }));
    this.patch({
      PlayerControl: {
        Controller: {
          ButtonWrapper: {
            CenteredButtonWrapper: {
              props: {
                items: buttonsMaped,
                targetIndex: 2,
                disableScroll: true,
              },
            },
          },
        },
      },
    });
    this._setState("CenteredButtonWrapper");
    this._spin();
  }
  setIsPlaying(status) {
    this._isPlaying = status;
    this._PlayPauseButton.patch({
      src: Utils.asset(
        this._isPlaying ? "images/player/pause.png" : "images/player/play.png"
      ),
    });
  }

  $getIsPlaying() {
    return this._isPlaying;
  }

  $videoPlayerLoadedData() {
    this._ProgressBar._EndTime.patch({
      text: {
        text: formatTimeHMS(VideoPlayer.duration),
        fontFace: "InterRegular",
        fontSize: 26,
      },
    });
  }

  $videoPlayerEnded() {
    this.setIsPlaying(false);
    this._PlayPauseButton.patch({
      src: Utils.asset("images/player/replay.png"),
    });
    this._isEnded = true;
  }

  $videoPlayerError(e) {
    if (e.event.name === "NotAllowedError") Router.navigate("home");
  }

  $getIsSeeking() {
    return this._isSeeking;
  }

  $videoPlayerSeeked() {
    this._isSeeking = false;
    this._Spinner.visible = false;
    if (this._isEnded) {
      this.setIsPlaying(this._isPlaying);
      this._isEnded = false;
    }
    this._hidePlayerControlDebounce();
  }
  $videoPlayerSeeking() {
    this._isSeeking = true;
    this._Spinner.visible = true;
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

  $videoPlayerCanPlay() {
    this._hideSpinner();
  }

  $videoPlayerWaiting() {
    this._showSpinner();
  }

  _getFocused() {
    return this._CenteredButtonWrapper._getFocused();
  }

  get _ProgressBar() {
    return this.tag("ProgressBar");
  }

  get _Rewind() {
    return this.tag("Rewind");
  }

  get _BackButton() {
    return this.tag("BackButton");
  }

  get _PlayPauseButton() {
    return this._CenteredButtonWrapper.Items.children.find(
      (element) => element._props.label === "playPause"
    );
  }

  get _PlayerControl() {
    return this.tag("PlayerControl");
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

  $exitVideo() {
    VideoPlayer.close();
    Router.back();
  }

  static _states() {
    return [
      class CenteredButtonWrapper extends this {
        _getFocused() {
          return this._CenteredButtonWrapper;
        }
        _handleDown() {
          this._setState("ProgressBar");
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
          if (Router.isNavigating()) {
            return;
          }
          this._setState("CenteredButtonWrapper");
        }
      },
    ];
  }
  _spin() {
    this._Spinner
      .animation({
        duration: 2,
        repeat: -1,
        actions: [{ p: "rotation", v: { 0: 0, 1: 10 * Math.PI } }],
      })
      .start();
  }
}

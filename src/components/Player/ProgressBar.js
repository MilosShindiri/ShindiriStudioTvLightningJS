import { Colors, Lightning, VideoPlayer } from "@lightningjs/sdk";
import formatTimeHMS from "../../utils/formatTimeHMS";

export default class ProgressBar extends Lightning.Component {
  _newTime = null;
  _skipInterval = null;
  _isHoldingRight = false;
  _isHoldingLeft = false;
  _props = {
    onActivity: null, // Player će poslati funkciju
  };

  static _template() {
    return {
      w: 1690,
      h: 31,
      flex: {
        direction: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      CurrentTime: {
        w: 119,
        text: {
          text: "00:00:00",
          fontFace: "InterRegular",
          fontSize: 26,
        },
      },
      Bar: {
        w: 1404,
        h: 13,
        BackgroundBar: {
          w: 1404,
          h: 13,
          texture: Lightning.Tools.getRoundRect(
            1404,
            13,
            0,
            2,
            Colors("#d9d9d9").alpha(0.1).get(),
            true,
            Colors("#d9d9d9").alpha(0.1).get()
          ),
        },
        RedRect: {
          w: 0,
          h: 13,
          color: Colors("#ED1C24").get(),
          rect: true,
        },
        Scrubber: {
          y: 7,
          w: 21,
          h: 21,
          rect: true,
          mount: 0.5,
          visible: false,
          texture: Lightning.Tools.getRoundRect(
            23,
            23,
            10,
            4,
            Colors("#ed1c24").get(),
            true,
            Colors("#d9d9d9").get()
          ),
        },
      },
      EndTime: {
        w: 119,
        text: {
          text: "00:00:00",
          fontFace: "InterRegular",
          fontSize: 26,
        },
      },
    };
  }

  get _CurrentTime() {
    return this.tag("CurrentTime");
  }

  get _EndTime() {
    return this.tag("EndTime");
  }

  get _RedRect() {
    return this.tag("RedRect");
  }

  get _Scrubber() {
    return this.tag("Scrubber");
  }

  get _BackgroundBar() {
    return this.tag("BackgroundBar");
  }

  progress(progress) {
    this._RedRect.setSmooth("w", progress, { duration: 0.2 });
    this._Scrubber.setSmooth("x", progress, { duration: 0.2 });
  }

  _updateProgressBar() {
    const newTimeToShow =
      this._newTime != null ? this._newTime : VideoPlayer.currentTime;
    this.patch({
      CurrentTime: {
        text: formatTimeHMS(newTimeToShow),
      },
    });
    const progress =
      (newTimeToShow / VideoPlayer.duration) * this._BackgroundBar.w;
    this.progress(progress);
  }

  _handleRight() {
    if (!this._isHoldingRight) {
      this._isHoldingRight = true;

      if (this._newTime == null) {
        this._newTime = VideoPlayer.currentTime;
      }

      // Start 1ms interval (realno će biti 4–10ms zbog V8)
      this._skipInterval = setInterval(() => {
        this._newTime = this.computeSeekTime(1); // +1 sekunda, menjaš na +0.1 ako želiš
        this._updateProgressBar(); // update UI
      }, 1);
    }
  }

  _handleLeft() {
    if (!this._isHoldingLeft) {
      this._isHoldingLeft = true;

      if (this._newTime == null) {
        this._newTime = VideoPlayer.currentTime;
      }

      this._skipInterval = setInterval(() => {
        this._newTime = this.computeSeekTime(-1);
        this._updateProgressBar();
      }, 1);
    }
  }

  // Key release events
  _handleRightRelease() {
    this._stopSkipping();
  }

  _handleLeftRelease() {
    this._stopSkipping();
  }

  _stopSkipping() {
    if (this._skipInterval) {
      clearInterval(this._skipInterval);
      this._skipInterval = null;
    }

    this._isHoldingRight = false;
    this._isHoldingLeft = false;

    if (this._newTime != null) {
      VideoPlayer.seek(this._newTime);
      this._newTime = null;
      this._updateProgressBar();
    }
  }

  computeSeekTime(timeToAdd) {
    const seekTime = this._newTime + timeToAdd;
    return seekTime < 0
      ? 0
      : seekTime > VideoPlayer.duration
      ? VideoPlayer.duration
      : seekTime;
  }

  _focus() {
    this._Scrubber.visible = true;
    this.patch({
      Bar: {
        BackgroundBar: {
          texture: Lightning.Tools.getRoundRect(
            1404,
            13,
            0,
            2,
            Colors("#ED1C24").get(),
            true,
            Colors("#d9d9d9").alpha(0.1).get()
          ),
        },
      },
    });
  }

  _unfocus() {
    this._Scrubber.visible = false;
    this.patch({
      Bar: {
        BackgroundBar: {
          texture: Lightning.Tools.getRoundRect(
            1404,
            13,
            0,
            2,
            Colors("#d9d9d9").alpha(0.1).get(),
            true,
            Colors("#d9d9d9").alpha(0.1).get()
          ),
        },
      },
    });
  }
}

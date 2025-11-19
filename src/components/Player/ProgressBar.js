import { Colors, Lightning, VideoPlayer } from "@lightningjs/sdk";
import formatTimeHMS from "../../utils/formatTimeHMS";

export default class ProgressBar extends Lightning.Component {
  _newTime = null;
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

  get _FillBar() {
    return this.tag("FillBar");
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
    this._RedRect.setSmooth("w", progress);
    this._Scrubber.setSmooth("x", progress);
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
    // if (this._newTime !== 0) {
    //   this._newTime = null;
    //   this._updateProgressBar();
    // }

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

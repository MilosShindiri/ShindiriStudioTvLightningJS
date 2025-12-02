import { Colors, Lightning, VideoPlayer } from "@lightningjs/sdk";
import formatTimeHMS from "../../utils/formatTimeHMS";
import colors from "../../styles/colors";

export default class ProgressBar extends Lightning.Component {
  _newTime = null;
  _seeking = false;
  _seekDirection = 0;
  _rafId = null;

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
            Colors(colors.grayLight).alpha(0.1).get(),
            true,
            Colors(colors.grayLight).alpha(0.1).get()
          ),
        },
        RedRect: {
          w: 0,
          h: 13,
          color: Colors(colors.accentRed).get(),
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
            Colors(colors.accentRed).get(),
            true,
            Colors(colors.grayLight).get()
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

  progress(px) {
    this._RedRect.w = px;
    this._Scrubber.x = px;
  }

  // crtam progress bar sa showTime
  // Ako korisnik trenutno seek-a (_newTime postoji) → koristi _newTime
  // Ako ne → koristi trenutno vrijeme videa (VideoPlayer.currentTime)
  _updateProgressBar() {
    const shownTime =
      this._newTime != null ? this._newTime : VideoPlayer.currentTime;

    this.patch({
      CurrentTime: {
        text: formatTimeHMS(shownTime),
      },
    });

    const px = (shownTime / VideoPlayer.duration) * this._BackgroundBar.w;
    this.progress(px);
  }

  //   computeSeekTime: računa novo vrijeme, brine da ne izađe iz opsega [0, duration]
  // _updateProgressBar(): update UI (tekst, crvena traka, scrubber)
  // requestAnimationFrame: ponovo poziva _startSeekLoop() na sljedećem frame-u
  // Ovde nastaje kontinuirana petlja dok korisnik drži dugme.
  _startSeekLoop() {
    // console.warn("WSTV", this._newTime);

    if (!this._seeking) return;

    this._newTime = this.computeSeekTime(this._seekDirection);

    this._updateProgressBar();

    this._rafId = requestAnimationFrame(() => this._startSeekLoop());
  }
  //   _startSeekLoop() izračunava novo vrijeme (_newTime)
  // update-uje progress bar (_updateProgressBar())
  // i poziva se ponovo na sljedećem frame-u
  // To stvara kontinuiranu petlju:
  // frame #1 → update _newTime + UI
  // frame #2 → update _newTime + UI
  // frame #3 → update _newTime + UI
  // … sve dok _seeking = true
  // Bez ovoga, seek bi bio “jedan korak” i UI ne bi reagovao glatko.
  // U _beginSeeking(direction):
  // _seeking = true → signalizira da petlja treba raditi
  // _seekDirection se postavlja na 1 (desno) ili -1 (lijevo)
  // _newTime se inicijalizuje na trenutno vrijeme videa ako još nije postavljeno
  // Pokreće se _startSeekLoop()

  _beginSeeking(direction) {
    if (this._seeking) return; // ako već seekujemo, ne radi ništa

    this._seeking = true; // sada smo u “seeking” modu
    this._seekDirection = direction;

    if (this._newTime == null) {
      this._newTime = VideoPlayer.currentTime;
    }

    this._startSeekLoop(); // start samo JEDAN loop
  }

  //   _seeking = false → signal za prekid petlje
  // _seekDirection = 0
  // cancelAnimationFrame(_rafId) → zaustavlja petlju
  // Ako postoji _newTime → stvarno seek-a video:
  _stopSeeking() {
    if (!this._seeking) return;

    this._seeking = false;
    this._seekDirection = 0;

    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }

    if (this._newTime != null) {
      VideoPlayer.seek(this._newTime);
      this._newTime = null;
      // Update UI jednom finalnom _updateProgressBar() da bar prikazuje tačno stanje videa
    }
    this._updateProgressBar();
  }

  computeSeekTime(delta) {
    const next = this._newTime + delta;

    if (next < 0) return 0;
    if (next > VideoPlayer.duration) return VideoPlayer.duration;
    return next;
  }

  _handleRight() {
    clearTimeout(this._singlePressTimeout);

    this._singlePressTimeout = setTimeout(() => {
      this._beginSeeking(5); // dug pritisak → loop
    }, 200); // 200ms threshold za hold
  }

  _handleLeft() {
    clearTimeout(this._singlePressTimeout);
    this._singlePressTimeout = setTimeout(() => {
      this._beginSeeking(-5); // dug pritisak → loop unazad
    }, 200); // 200ms threshold za hold
  }

  _handleRightRelease() {
    clearTimeout(this._singlePressTimeout);
    if (!this._seeking) {
      VideoPlayer.seek(VideoPlayer.currentTime + 1); // kratki klik → jump 1s
      this._updateProgressBar();
    } else {
      this._stopSeeking();
    }
  }

  _handleLeftRelease() {
    clearTimeout(this._singlePressTimeout);
    if (!this._seeking) {
      VideoPlayer.seek(VideoPlayer.currentTime - 1);
      this._updateProgressBar();
    } else {
      this._stopSeeking();
    }
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
            Colors(colors.accentRed).get(),
            true,
            Colors(colors.grayLight).alpha(0.1).get()
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
            Colors(colors.grayLight).alpha(0.1).get(),
            true,
            Colors(colors.grayLight).alpha(0.1).get()
          ),
        },
      },
    });
  }
}

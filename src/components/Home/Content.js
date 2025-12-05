import { Lightning, Router } from "@lightningjs/sdk";
import HorizontalContainer from "../HorizontalContainer/HorizontalContainer";
import MovieCard from "../Home/MovieCard";
import { movieService } from "../../services/movieService";

export default class Content extends Lightning.Component {
  static _template() {
    return {
      w: 1241,
      h: 837,
      flex: {
        direction: "column",
      },
      MoviesRow: { type: HorizontalContainer, flexItem: { marginBottom: 20 } },
      SeriesRow: { type: HorizontalContainer, flexItem: { marginBottom: 0 } },
    };
  }

  set props(props) {
    this._hasReceivedProps = true;
    this._applyData(props);
    this._setState("MoviesRow");
  }

  _applyData({ movies = [], series = [] } = {}) {
    this.tag("MoviesRow").props = {
      items: (movies || [])
        .slice(0, 5)
        .map((m) => ({ type: MovieCard, movie: m })),
      railTitle: "MOVIES",
      railFontFace: "Ema",
      railFontSize: 24,
      railLetterSpacing: 2,
      disableScroll: true,
    };

    this.tag("SeriesRow").props = {
      items: (series || [])
        .slice(0, 5)
        .map((s) => ({ type: MovieCard, movie: s })),
      railTitle: "SERIES",
      railFontFace: "InterBold",
      railFontSize: 24,
      railLetterSpacing: 2,
      disableScroll: true,
    };
  }

  get MoviesRow() {
    return this.tag("MoviesRow");
  }

  get SeriesRow() {
    return this.tag("SeriesRow");
  }

  $handleHoverState(ref) {
    const currentState = this._getState();

    if (ref !== currentState) {
      if (currentState) this.tag(currentState)._unfocus();
      this._setState(ref);
    }
    this.fireAncestors("$handleHoverState", this.ref);
  }

  static _states() {
    return [
      class MoviesRow extends this {
        $enter() {
          this.MoviesRow.setSmooth("alpha", 1);
          this.SeriesRow.setSmooth("alpha", 0.6);
        }

        _getFocused() {
          return this.MoviesRow;
        }

        _handleUp() {
          return false;
        }

        _handleDown() {
          this._setState("SeriesRow");
          return true;
        }
      },

      class SeriesRow extends this {
        $enter() {
          this.MoviesRow.setSmooth("alpha", 0.6);
          this.SeriesRow.setSmooth("alpha", 1);
        }

        _getFocused() {
          return this.SeriesRow;
        }

        _handleUp() {
          this._setState("MoviesRow");
          return true;
        }
      },
    ];
  }
}

import { Lightning, Router } from "@lightningjs/sdk";
import HorizontalContainer from "../HorizontalContainer/HorizontalContainer";
import MovieCard from "../Home/MovieCard";
import { movieService } from "../../services/movieService";

export default class Content extends Lightning.Component {
  static _template() {
    return {
      // rect: true,
      // color: 0xff000000,
      // w: 1241,
      // h: 837,
      //TODO dodaj flex i gap a ne y
      MoviesRow: { x: 0, y: 0, collision: true, type: HorizontalContainer },
      SeriesRow: { x: 0, y: 425, collision: true, type: HorizontalContainer },
    };
  }

  // async _init() {
  // If page routing already provided movies/series, `set props` will handle it.
  // Otherwise, fetch fallback data so component still works standalone.
  //   if (!this._hasReceivedProps) {
  //     this._applyData({
  //       movies: movies.slice(0, 5),
  //       series: series.slice(0, 5),
  //     });
  //   }
  // }

  // Accept props injected by the router's `on` handler (fetchHomeData sets page.props)
  set props(props) {
    // mark that we received routed props so _init fallback won't fetch again
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
      x: 0,
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
      x: 0,
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
    // console.log("WSTV", ref);

    if (ref !== currentState) {
      if (currentState) this.tag(currentState)._unfocus();
      this._setState(ref);
    }
    this.fireAncestors("$handleHoverState", this.ref); //sending ref name
  }

  _handleHover() {}

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
          // Router.focusWidget("Menu");
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

import { Lightning, Router } from "@lightningjs/sdk";
import HorizontalContainer from "../HorizontalContainer/HorizontalContainer";
import MovieCard from "../Home/MovieCard";
import { movieService } from "../../services/movieService";

export default class Content extends Lightning.Component {
  static _template() {
    return {
      //TODO dodaj flex i gap a ne y
      MoviesRow: { x: 0, y: 0, type: HorizontalContainer },
      SeriesRow: { x: 0, y: 425, type: HorizontalContainer },
    };
  }

  async _init() {
    const movies = await movieService.fetchPopularMovies({ page: 1 });
    const series = await movieService.fetchPopularMovies({ page: 2 });

    this.tag("MoviesRow").props = {
      items: movies.slice(0, 5).map((m) => ({ type: MovieCard, movie: m })),
      railTitle: "MOVIES",
      railFontFace: "Ema",
      railFontSize: 24,
      railLetterSpacing: 2,
      x: 0,
      disableScroll: true,
    };

    this.tag("SeriesRow").props = {
      items: series.slice(0, 5).map((s) => ({ type: MovieCard, movie: s })),
      railTitle: "SERIES",
      railFontFace: "InterBold",
      railFontSize: 24,
      railLetterSpacing: 2,
      x: 0,
      disableScroll: true,
    };
    this._setState("MoviesState");
  }

  get MoviesRow() {
    return this.tag("MoviesRow");
  }

  get SeriesRow() {
    return this.tag("SeriesRow");
  }

  static _states() {
    return [
      class MoviesState extends this {
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
          this._setState("SeriesState");
          return true;
        }
      },

      class SeriesState extends this {
        $enter() {
          this.MoviesRow.setSmooth("alpha", 0.6);
          this.SeriesRow.setSmooth("alpha", 1);
        }

        _getFocused() {
          return this.SeriesRow;
        }

        _handleUp() {
          this._setState("MoviesState");
          return true;
        }
      },
    ];
  }
}

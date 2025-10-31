import { Lightning, Utils } from "@lightningjs/sdk";
import HorizontalContainer from "../components/HorizontalContainer/HorizontalContainer";
import VerticalContainer from "../components/VerticalContainer/VerticalContainer";
import { movieService } from "../services/movieService";
import MovieCard from "../components/MovieCard";

export default class Home extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      rect: true,
      Background: {
        // w: 1920,
        // h: 1080,
        src: Utils.asset("images/background.jpg"),
      },
      //dodaj column sa flex directionom i razmak top marginu
      MoviesRow: {
        x: 64,
        y: 125,
        type: HorizontalContainer,
      },
      SeriesRow: {
        x: 64,
        y: 673,
        type: HorizontalContainer,
      },
      TopChannels: {
        x: 1415,
        y: 125,
        type: VerticalContainer,
      },
    };
  }

  async _init() {
    const topChannels = [
      {
        title: "HBO",
        image: Utils.asset("../../static/images/channels/hbo.png"),
      },
      {
        title: "Netflix",
        image: Utils.asset("../../static/images/channels/netflix.png"),
      },
      {
        title: "Disney",
        image: Utils.asset("../../static/images/channels/disney.png"),
      },
      {
        title: "Amazon",
        image: Utils.asset("../../static/images/channels/prime.png"),
      },
      {
        title: "Hulu",
        image: Utils.asset("../../static/images/channels/hulu.png"),
      },
    ];
    this.tag("TopChannels").items = topChannels;
    // ovo gurni u neki utils
    const movies = await movieService.fetchPopularMovies({ page: 1 });
    const series = await movieService.fetchPopularMovies({ page: 2 });
    //ovo gurni u neki utils
    const movieItems = movies
      .slice(0, 5)
      .map((m) => ({ type: MovieCard, movie: m }));
    const seriesItems = series
      .slice(0, 5)
      .map((m) => ({ type: MovieCard, movie: m }));

    this.MoviesRow.props = { items: movieItems, railTitle: "Movies" };
    this.tag("SeriesRow").props = { items: seriesItems, railTitle: "Series" };

    this._setState("MoviesState");
  }
  static _states() {
    return [
      class MoviesState extends this {
        $enter() {
          this.MoviesRow.setSmooth("alpha", 1);
          this.tag("SeriesRow").setSmooth("alpha", 0.6);
          this.tag("TopChannels").setSmooth("alpha", 0.6);
        }
        _getFocused() {
          return this.MoviesRow;
        }

        _handleDown() {
          this._setState("SeriesState");
        }

        _handleRight() {
          this._setState("TopChannelsState");
        }
      },
      class SeriesState extends this {
        $enter() {
          this.MoviesRow.setSmooth("alpha", 0.6);
          this.tag("SeriesRow").setSmooth("alpha", 1);
          this.tag("TopChannels").setSmooth("alpha", 0.6);
        }
        _getFocused() {
          return this.SeriesRow;
        }

        _handleUp() {
          this._setState("MoviesState");
        }

        _handleRight() {
          this._setState("TopChannelsState");
        }
      },

      class TopChannelsState extends this {
        $enter() {
          this.tag("MoviesRow").setSmooth("alpha", 0.6);
          this.tag("SeriesRow").setSmooth("alpha", 0.6);
          this.tag("TopChannels").setSmooth("alpha", 1);
        }
        _getFocused() {
          return this.TopChannels;
        }
      },
    ];
  }

  get MoviesRow() {
    return this.tag("MoviesRow");
  }

  get SeriesRow() {
    return this.tag("SeriesRow");
  }

  get TopChannels() {
    return this.tag("TopChannels");
  }
}

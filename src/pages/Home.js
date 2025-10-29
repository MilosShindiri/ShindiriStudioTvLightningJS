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
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        src: Utils.asset("images/background.jpg"),
      },
      Sections: {
        y: 125,
        Vertical: { type: VerticalContainer, x: 1415 },
        Horizontal: {
          x: 64,
          children: {
            MoviesRow: { type: HorizontalContainer },
            SeriesRow: { type: HorizontalContainer, y: 548 },
          },
        },
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
    this.tag("Vertical").items = topChannels;

    const movies = await movieService.fetchPopularMovies({ page: 1 });
    const series = await movieService.fetchPopularMovies({ page: 2 });

    const movieItems = movies
      .slice(0, 5)
      .map((m) => ({ type: MovieCard, movie: m }));
    const seriesItems = series
      .slice(0, 5)
      .map((m) => ({ type: MovieCard, movie: m }));

    this.tag("MoviesRow").props = { items: movieItems, railTitle: "Movies" };
    this.tag("SeriesRow").props = { items: seriesItems, railTitle: "Series" };

    this._focusedRow = "MoviesRow";
  }
  _getFocused() {
    return this.tag(`Sections.Horizontal.${this._focusedRow}`);
  }
}

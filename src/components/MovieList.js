import { Lightning, Utils } from "@lightningjs/sdk";
import { movieService } from "../services/movieService";

export default class MovieList extends Lightning.Component {
  static _template() {
    return {
      Movies: {},
    };
  }
  async setMovies(params = {}) {
    const movies = await movieService.fetchPopularMovies(params);
    this.movies = movies;

    this.tag("Movies").children = movies.map((movie, id) => ({
      type: MovieCard,
      movie,
      x: id * 245,
    }));
  }
  _init() {
    this.setMovies();
  }
}

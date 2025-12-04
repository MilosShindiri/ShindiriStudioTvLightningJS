import { tmdbService } from "./tmdbService";

export class MovieService {
  constructor() {
    this.cache = new Map();
  }

  async fetchPopularMovies(params = {}) {
    const key = JSON.stringify(["popular-movies", params]);
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    let data = await tmdbService.getPopularMovies(params);

    data = data.filter((movie) => !movie.adult && !this.isExplicit(movie));

    this.cache.set(key, data);
    return data;
  }

  isExplicit(movie) {
    const explicitKeywords = [
      "sex",
      "porn",
      "erotic",
      "adult",
      "underwear",
      "perverted",
    ];
    const text = `${movie.title} ${movie.description}`.toLowerCase();
    return explicitKeywords.some((keyword) => text.includes(keyword));
  }

  async fetchMovieDetails(id) {
    const key = `movie-details-${id}`;
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const data = await tmdbService.getMovieDetails(id);
    this.cache.set(key, data);
    return data;
  }

  async fetchSimilarMovies(id) {
    const key = `similar-movies-${id}`;
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const data = await tmdbService.getSimilarMovies(id);
    this.cache.set(key, data);
    return data;
  }

  async fetchNowPlaying() {
    const key = "now-playing";
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const data = await tmdbService.getNowPlaying();
    this.cache.set(key, data);
    return data;
  }

  // Additional methods can be added here following the same pattern
}

export const movieService = new MovieService();

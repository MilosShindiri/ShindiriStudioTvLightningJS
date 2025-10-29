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
    const data = await tmdbService.getPopularMovies(params);
    this.cache.set(key, data);
    return data;
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

  // Dodaj ostale metode po potrebi...
}

export const movieService = new MovieService();

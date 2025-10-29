import { URLS_API } from "../constants/urls";
import { parseMovie, parseTMDBResponse } from "../utils/parser";
import apiClient from "./apiClient";

export const tmdbService = {
  getPopularMovies: async (params = {}) => {
    const response = await apiClient.get(URLS_API.GET_MOVIES, {
      params: {
        page: params.page ?? 1,
        with_genres: params.genre,
        primary_release_year: params.year,
        query: params.query,
        sort_by: params.sortBy,
      },
    });

    return parseTMDBResponse(response.data).results;
  },

  getSearchedMovies: async (params = {}) => {
    const response = await apiClient.get(URLS_API.GET_SEARCH, {
      params: {
        page: params.page ?? 1,
        query: params.query,
        sort_by: params.sortBy,
      },
    });

    return parseTMDBResponse(response.data).results;
  },

  getNowPlaying: async () => {
    const response = await apiClient.get(URLS_API.GET_NOW_PLAYING);
    return response.data.results.map(parseMovie);
  },

  getMovieDetails: async (id) => {
    const response = await apiClient.get(URLS_API.GET_MOVIE_DETAILS(id), {
      params: { append_to_response: "credits" },
    });

    return parseMovie(response.data);
  },

  getSimilarMovies: async (id) => {
    const response = await apiClient.get(URLS_API.GET_SIMILAR_MOVIES(id));
    return response.data.results.map(parseMovie);
  },

  getTrending: async (timeWindow = "day") => {
    const response = await apiClient.get(
      URLS_API.GET_TRENDING_MOVIES(timeWindow)
    );
    return parseTMDBResponse(response.data).results;
  },

  getTrendingMultiplePages: async (timeWindow = "day", totalPages = 5) => {
    const requests = Array.from({ length: totalPages }, (_, i) =>
      apiClient.get(URLS_API.GET_TRENDING_MOVIES(timeWindow), {
        params: { page: i + 1 },
      })
    );

    const responses = await Promise.all(requests);
    return responses.flatMap((res) => parseTMDBResponse(res.data).results);
  },

  getPopularTVShows: async () => {
    const response = await apiClient.get(URLS_API.GET_POPULAR_TV);
    return response.data.results.map(parseMovie);
  },
};

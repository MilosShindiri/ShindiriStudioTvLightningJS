import { movieService } from "../services/movieService";

export default async function fetchDetailsData(page, { movieId }) {
  try {
    const details = await movieService.fetchMovieDetails(movieId);
    const similar = await movieService.fetchSimilarMovies(movieId);

    page.props = {
      ...details,
      similar,
    };

    return { success: true };
  } catch (error) {
    page.props = {
      success: false,
      similar: [],
    };
  }
}

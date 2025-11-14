import { movieService } from "../services/movieService";

export default async function fetchDetailsData(page, { movieId }) {
  console.log("FETCH DETAILS PARAMS:", movieId);

  try {
    const details = await movieService.fetchMovieDetails(movieId);
    const similar = await movieService.fetchSimilarMovies(movieId);

    page.props = {
      ...details,
      similar,
    };

    return { success: true };
  } catch (error) {
    console.error("Error fetching movie details:", error);
    page.props = {
      success: false,
      similar: [],
    };
  }
}

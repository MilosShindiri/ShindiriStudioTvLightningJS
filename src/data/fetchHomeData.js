import { movieService } from "../services/movieService.js";
import MovieCard from "../components/Home/MovieCard.js";

export default async function fetchHomeData(page) {
  try {
    const [movies, series] = await Promise.all([
      movieService.fetchPopularMovies({ page: 1 }),
      movieService.fetchPopularMovies({ page: 2 }),
    ]);

    page.props = {
      movies: movies.slice(0, 5),
      series: series.slice(0, 5),
    };
    return { success: true };
  } catch (error) {
    page.props = { movies: [], series: [] };
  }
}

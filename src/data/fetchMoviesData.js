import { movieService } from "../services/movieService.js";

export default async function fetchMoviesData(page) {
  try {
    const movies = await movieService.fetchPopularMovies({ page: 1 });
    const formatted = movies.map((m) => ({
      title: m.title,
      description: m.description,
      image: [m.background],
      poster: m.thumbnail,
      id: m.id,
    }));

    page.props = {
      movies: formatted,
    };
  } catch (error) {
    page.props = { movies: [] };
  }
}

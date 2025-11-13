import { movieService } from "../services/movieService.js";

export default async function fetchMoviesData(page) {
  console.log("[Router] Fetching data for Movies page...");

  try {
    const movies = await movieService.fetchPopularMovies({ page: 1 });

    console.log("Movies", movies);

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
    console.error("[fetchMoviesData] Error:", error);
    page.props = { movies: [] };
  }
}

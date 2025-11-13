import { movieService } from "../services/movieService.js";
import MovieCard from "../components/Home/MovieCard.js";

export default async function fetchHomeData(page) {
  console.log("[Router] Fetching data for Home page...");

  try {
    const [movies, series] = await Promise.all([
      movieService.fetchPopularMovies({ page: 1 }),
      movieService.fetchPopularMovies({ page: 2 }),
    ]);

    page.props = {
      movies: movies.slice(0, 5),
      series: series.slice(0, 5),
    };
  } catch (error) {
    console.error("[fetchHomeData] Error:", error);
    page.props = { movies: [], series: [] };
  }
}

// import { movieService } from "../services/movieService";

// export default async function fetchHomeData() {
//   const movies = await movieService.fetchPopularMovies({ page: 1 });
//   const series = await movieService.fetchPopularMovies({ page: 2 });

//   return {
//     movies,
//     series,
//   };
// }

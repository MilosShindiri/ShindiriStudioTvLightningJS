// import { movieService } from "../services/movieService.js";
// import MovieCard from "../components/Home/MovieCard.js";

// export default async function fetchHomeData(page) {
//   console.log("[Router] Fetching data for Home page...");

//   const delay = (ms) => new Promise((res) => setTimeout(res, ms));

//   try {
//     const [movies, series] = await Promise.all([
//       movieService.fetchPopularMovies({ page: 1 }),
//       movieService.fetchPopularMovies({ page: 2 }),
//       delay(300), // loader traje minimalno 300ms
//     ]);

//     page.props = {
//       movies: movies.slice(0, 5),
//       series: series.slice(0, 5),
//     };

//     return { success: true };
//   } catch (error) {
//     console.error("[fetchHomeData] Error:", error);
//     page.props = { movies: [], series: [] };
//   }
// }

// BEZ DELAY LOADERA

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
    return { success: true };
  } catch (error) {
    console.error("[fetchHomeData] Error:", error);
    page.props = { movies: [], series: [] };
  }
}

import { movieService } from "../services/movieService.js";

export default async function fetchMoviesData(page) {
  console.log("[Router] Fetching data for Movies page...");

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
    console.error("[fetchMoviesData] Error:", error);
    page.props = { movies: [] };
  }
}

// BEZ DELAY LOADERA

// import { movieService } from "../services/movieService.js";

// export default async function fetchMoviesData(page) {
//   console.log("[Router] Fetching data for Movies page...");

//   const delay = (ms) => new Promise((res) => setTimeout(res, ms));

//   try {
//     const movies = await Promise.all([
//       movieService.fetchPopularMovies({ page: 1 }),
//       delay(300), // minimalno 300ms
//     ]);

//     console.log("Movies", movies[0]); // rezultat fetch-a je prvi element

//     const formatted = movies[0].map((m) => ({
//       title: m.title,
//       description: m.description,
//       image: [m.background],
//       poster: m.thumbnail,
//       id: m.id,
//     }));

//     page.props = {
//       movies: formatted,
//     };

//     return { success: true };
//   } catch (error) {
//     console.error("[fetchMoviesData] Error:", error);
//     page.props = { movies: [] };
//   }
// }

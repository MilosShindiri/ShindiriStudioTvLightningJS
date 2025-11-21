export const PAGE_PATHS = {
  SPLASH: "splash",
  HOME: "home",
  MOVIES: "movies",

  DETAILS_PATTERN: "details/:movieId",

  details: (id) => `details/${id}`,
  PLAYER: "player",
};

export default PAGE_PATHS;

import { Router } from "@lightningjs/sdk";

import Home from "./pages/Home.js";
import Splash from "./components/SplashScreen/Splash.js";
import Movies from "./pages/Movies.js";
import fetchHomeData from "./data/fetchHomeData.js";
import fetchMoviesData from "./data/fetchMoviesData.js";
import Details from "./pages/Details.js";
import fetchDetailsData from "./data/fetchDetailsData.js";
import Player from "./pages/Player";
import PAGE_PATHS from "./constants/pagePaths";

export default {
  root: PAGE_PATHS.SPLASH,
  routes: [
    { path: PAGE_PATHS.SPLASH, component: Splash },
    {
      path: PAGE_PATHS.HOME,
      component: Home,
      widgets: ["Menu"],
      on: fetchHomeData,
    },
    {
      path: PAGE_PATHS.MOVIES,
      component: Movies,
      widgets: ["Menu"],
      on: fetchMoviesData,
    },
    {
      path: PAGE_PATHS.DETAILS_PATTERN,
      component: Details,
      on: fetchDetailsData,
      cache: 0,
    },
    {
      path: PAGE_PATHS.PLAYER,
      component: Player,
      options: {
        reuseInstance: false,
      },
    },
    { path: "*", redirect: PAGE_PATHS.HOME },
  ],
};

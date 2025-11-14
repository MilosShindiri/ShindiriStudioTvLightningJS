import { Router } from "@lightningjs/sdk";
import Home from "./pages/Home.js";
import Splash from "./components/SplashScreen/Splash.js";
import Movies from "./pages/Movies.js";
import fetchHomeData from "./data/fetchHomeData.js";
import fetchMoviesData from "./data/fetchMoviesData.js";
import Details from "./pages/Details.js";
import fetchDetailsData from "./data/fetchDetailsData.js";

export default {
  root: "splash",
  routes: [
    { path: "splash", component: Splash },
    { path: "home", component: Home, widgets: ["Menu"], on: fetchHomeData },
    {
      path: "movies",
      component: Movies,
      widgets: ["Menu"],
      on: fetchMoviesData,
    },
    { path: "details/:movieId", component: Details, on: fetchDetailsData },
    { path: "*", redirect: "home" },
  ],
};

import { Router } from "@lightningjs/sdk";
import Home from "./pages/Home.js";
import Splash from "./components/SplashScreen/Splash.js";
import Movies from "./pages/Movies.js";
// import Player from './pages/Player.js'
// import Settings from './pages/Settings.js'
// import TopChannels from './widgets/TopChannels.js'

export default () => {
  Router.startRouter({
    root: "splash",
    routes: [
      { path: "splash", component: Splash },
      { path: "home", component: Home, widgets: ["Menu"] },
      { path: "movies", component: Movies },
      //   { path: 'player', component: Player },
      //   { path: 'settings', component: Settings },
      { path: "*", redirect: "home" },
    ],
    // widgets: [{ type: TopChannels, name: 'TopChannels' }],
  });
};

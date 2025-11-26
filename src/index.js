import { Launch } from "@lightningjs/sdk";
import App from "./App.js";
import Settings from "../settings.json";
import { getDevice } from "./utils/device.js";

// Dinamičko podešavanje stage-a i precision-a
if (Settings) {
  Settings.appSettings.stage.h = window.innerHeight;
  Settings.appSettings.stage.w = window.innerWidth;

  if (window.innerHeight === 720 && window.innerWidth === 1280) {
    // 720p
    Settings.appSettings.stage.precision = 2 / 3;
  } else if (window.innerHeight === 2160 && window.innerWidth === 3840) {
    // 4K
    Settings.appSettings.stage.precision = 2;
  } else if (window.innerHeight === 4320 && window.innerWidth === 7680) {
    // 8K
    Settings.appSettings.stage.precision = 4;
  } else {
    // FHD / fallback
    Settings.appSettings.stage.precision = 1;
  }
}

// Dinamičko mapiranje tastera po uređaju
const device = getDevice();
Settings.appSettings.keys = {};

switch (device) {
  case "tizen":
    Settings.appSettings.keys = {
      10009: "Back",
      10182: "Exit",
      427: "ChannelUp",
      428: "ChannelDown",
      10252: "MediaPlayPause",
      412: "MediaRewind",
      417: "MediaFastForward",
      415: "MediaPlay",
      19: "MediaPause",
      413: "MediaStop",
    };
    break;
  case "webos":
    Settings.appSettings.keys = {
      412: "Exit",
      461: "Back",
      33: "ChannelUp",
      34: "ChannelDown",
      415: "MediaPlay",
      19: "MediaPause",
      417: "MediaFastForward",
      412: "MediaRewind",
      413: "MediaStop",
    };
    break;
  case "hisense":
    Settings.appSettings.keys = {
      8: "Back",
      427: "ChannelUp",
      428: "ChannelDown",
      415: "MediaPlay",
      19: "MediaPause",
      417: "MediaFastForward",
      412: "MediaRewind",
      413: "MediaStop",
    };
    break;
  default:
    // ostaje prazno ako uređaj nije prepoznat
    break;
}

// Pokretanje aplikacije
const app = Launch(App, Settings.appSettings, Settings.platformSettings);

// Dodavanje canvas-a u DOM
const canvas = app.stage.getCanvas();
document.body.appendChild(canvas);

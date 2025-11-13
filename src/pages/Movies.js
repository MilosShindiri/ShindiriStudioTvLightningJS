import { Lightning, Router } from "@lightningjs/sdk";
import { IMAGE_ROUTE } from "../utils/imageUtils";
import HorizontalContainer from "../components/HorizontalContainer/HorizontalContainer";
import HorCard from "../components/horCard";
import Slideshow from "../components/SlideShow/SlideShow";

export default class Movies extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: 0xff151515,
        zIndex: -1,
      },
      Content: {
        Hero: {
          w: 1920,
          h: 697,
          HeroSlideshow: { w: 1920, h: 697, type: Slideshow, zIndex: -1 },
          Gradient: {
            w: 1920 / 4,
            h: 697,
            rect: true,
            color: 0xff151515,
          },
          Gradient1: {
            w: 1920 / 3,
            h: 697,
            x: 1920 / 4,
            rect: true,
            colorLeft: 0xff151515,
            colorRight: 0xcc151515,
          },
          Gradient2: {
            w: 1920,
            h: 697,
            x: 1920 / 3 + 1920 / 4,
            rect: true,
            colorLeft: 0xcc151515,
            colorRight: 0x00151515,
          },
          MovieInfo: {
            w: 698,
            h: 162,
            y: 258,
            x: 69,
            flex: { direction: "column" },
            Title: {
              flexItem: { marginBottom: 40 },
              text: {
                fontFace: "Inter-Bold",
                fontSize: 28,
                textColor: 0xffffffff,
              },
            },
            Info: {
              text: {
                fontFace: "Inter-Regular",
                fontSize: 22,
                textColor: 0xffffffff,
                wordWrap: true,
                wordWrapWidth: 698,
                lineHeight: 31,
              },
            },
          },
          MoviesContainer: {
            // w: 2111,
            // h: 302,
            y: 697,
            x: 45,
            type: HorizontalContainer,
            signals: {
              horizontalContainerIndexChange: "_horizontalContainerIndexChange",
            },
          },
        },
      },
    };
  }

  get MoviesContainer() {
    return this.tag("MoviesContainer");
  }

  get HeroSlideshow() {
    return this.tag("HeroSlideshow");
  }

  set props(props) {
    this._props = props;
    const movies = props.movies;
    if (!movies?.length) return;
    console.log(movies);
    const heroMovieTitle = movies[0];
    const heroImages = heroMovieTitle.image.map(
      (img) => `${IMAGE_ROUTE.IMAGE_W1280}${img}`
    );
    // console.log(heroMovieTitle);
    this.patch({
      Content: {
        Hero: {
          HeroSlideshow: { images: heroImages, transitionDuration: 5000 },
          MovieInfo: {
            Title: { text: { text: heroMovieTitle.title } },
            Info: { text: { text: heroMovieTitle.description } },
          },
          MoviesContainer: {
            props: {
              items: props.movies.map((m) => ({
                type: HorCard,
                item: { title: m.title, image: m.poster, id: m.id },
                flexItem: { marginRight: 24 },
              })),
              disableScroll: false,
              w: 1700,
              h: 302,
            },
          },
        },
      },
      // Background: { color: props.bgColor || 0xff000000 },
    });
  }

  _init() {
    this._setState("MoviesContainer");
  }

  static _states() {
    return [
      class MoviesContainer extends this {
        _getFocused() {
          return this.MoviesContainer;
        }
        _handleUp() {
          Router.focusWidget("Menu");
          return true;
        }
        $enter() {
          this.HeroSlideshow?.resume();
        }
        $exit() {
          this.HeroSlideshow?.pause();
        }
      },
    ];
  }
}

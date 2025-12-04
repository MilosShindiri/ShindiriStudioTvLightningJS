import { Lightning, Router } from "@lightningjs/sdk";
import { IMAGE_ROUTE } from "../utils/imageUtils";
import HorizontalContainer from "../components/HorizontalContainer/HorizontalContainer";
import HorCard from "../components/horCard";
import Slideshow from "../components/SlideShow/SlideShow";
import colors from "../styles/colors";

export default class Movies extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: colors.surface,
      },
      Content: {
        Hero: {
          w: 1920,
          h: 697,
          HeroSlideshow: { w: 1920, h: 697, type: Slideshow },
          Gradient: {
            w: 1920 / 4,
            h: 697,
            rect: true,
            color: colors.surface,
          },
          Gradient1: {
            w: 1920 / 3,
            h: 697,
            x: 1920 / 4,
            rect: true,
            colorLeft: colors.surface,
            colorRight: colors.surfaceSemi,
          },
          Gradient2: {
            w: 1920,
            h: 697,
            x: 1120,
            rect: true,
            colorLeft: colors.surfaceSemi,
            colorRight: colors.surfaceTransparent,
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
                fontFace: "InterBold",
                fontSize: 28,
                textColor: colors.text,
              },
            },
            Info: {
              text: {
                fontFace: "InterRegular",
                fontSize: 22,
                textColor: 0xffffffff,
                wordWrap: true,
                wordWrapWidth: 698,
                lineHeight: 31,
              },
            },
          },
          MoviesContainer: {
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
  // TODO iskoristi iz lodash
  _debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }

  set props(props) {
    this._props = props;
    const movies = props.movies;
    if (!movies?.length) return;

    const heroMovie = movies[0];
    const heroImages = heroMovie.image.map(
      (img) => `${IMAGE_ROUTE.IMAGE_W1280}${img}`
    );

    this.patch({
      Content: {
        Hero: {
          HeroSlideshow: { images: heroImages, transitionDuration: 5000 },
          MovieInfo: {
            Title: { text: { text: heroMovie.title } },
            Info: { text: { text: heroMovie.description } },
          },
          MoviesContainer: {
            props: {
              items: props.movies.map((m) => ({
                //TODO napisi bolju konvenciju
                type: HorCard,
                item: {
                  id: m.id,
                  title: m.title,
                  image: m.poster,
                  index: m.index,
                },
                flexItem: { marginRight: 24 },
              })),
              disableScroll: false,

              w: 1700,
              h: 302,
              targetIndex: this._currentIndex ?? 0,
            },
          },
        },
      },
    });
  }

  _init() {
    this._setState("MoviesContainer");
    this._debouncedIndexChange = this._debounce(
      this._updateHero.bind(this),
      300
    );
  }

  _active() {
    const history = Router.getHistory();

    if (history.length < 2) {
      this._currentIndex = 0;
    } else {
      const prev = history[history.length - 2];

      if (prev.hash === "home") {
        this._currentIndex = 0;
      } else if (prev.hash === "details" && prev.params?.index !== undefined) {
        this._currentIndex = prev.params.index;
      } else {
        this._currentIndex = this._currentIndex ?? 0;
      }
    }

    this.MoviesContainer.setIndex(this._currentIndex);
    this.MoviesContainer.scrollToIndex(this._currentIndex);

    this._setState("MoviesContainer");
  }

  _horizontalContainerIndexChange(index) {
    this._currentIndex = index;
    this._debouncedIndexChange(index);
  }

  _updateHero(index) {
    const movies = this._props?.movies;
    if (!movies || !movies[index]) return;

    const movie = movies[index];

    this._preloadAdjacentImages(index);

    const heroImages = movie.image.map(
      (img) => `${IMAGE_ROUTE.IMAGE_W1280}${img}`
    );

    this.HeroSlideshow.setImagesOnFocues(heroImages);
    this.tag("MovieInfo").patch({
      Title: { text: { text: movie.title } },
      Info: { text: { text: movie.description } },
    });
  }

  _preloadAdjacentImages(currentIndex) {
    const { movies } = this._props;

    const preloadTexture = (src) => {
      new Lightning.textures.ImageTexture({ src });
    };

    if (movies[currentIndex + 1]) {
      movies[currentIndex + 1].image.forEach((img) => {
        const src = `${IMAGE_ROUTE.IMAGE_W1280}${img}`;
        preloadTexture(src);
      });
    }

    if (movies[currentIndex - 1]) {
      movies[currentIndex - 1].image.forEach((img) => {
        const src = `${IMAGE_ROUTE.IMAGE_W1280}${img}`;
        preloadTexture(src);
      });
    }
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

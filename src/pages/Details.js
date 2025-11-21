import { Lightning, Router, Utils } from "@lightningjs/sdk";
import Button from "../components/Button";
import colors from "../styles/colors";

export default class Details extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        rect: true,
        color: colors.surface,
      },
      Content: {
        w: 1083,
        h: 700,
        y: 65,
        x: 69,
        BackButton: {
          type: Button,
        },
        MetaInfo: {
          y: 108,
          text: {
            text: "",
            fontFace: "Inter-Regular",
            fontSize: 20,
            textColor: colors.text,
            lineHeight: 28,
          },
        },
        MovieContent: {
          y: 200,
          w: 1083,
          h: 485,
          flex: { direction: "row" },
          Poster: {
            flexItem: { marginRight: 40 },
            w: 325,
            h: 485,
          },
          Details: {
            w: 698,
            h: 485,
            flex: { direction: "column" },
            flexItem: { marginTop: 30 },
            Title: {
              flexItem: { marginBottom: 20 },
              text: {
                text: "",
                fontFace: "Inter-Bold",
                fontSize: 28,
                textColor: colors.text,
              },
            },
            Paragraph: {
              flexItem: { marginBottom: 20 },
              text: {
                text: "",
                fontFace: "Inter-Regular",
                fontSize: 18,
                textColor: colors.text,
                lineHeight: 26,
                wordWrap: true,
                wordWrapWidth: 698,
                maxLines: 4,
              },
            },
            Castinfo: {
              flex: { direction: "column" },
              flexItem: { marginBottom: 60 },
              DirectorContainer: {
                flexItem: { marginBottom: 12 },
                flex: { direction: "row" },
                Label: {
                  flexItem: { marginRight: 8 },
                  text: {
                    text: "Director:",
                    fontFace: "Inter-Bold",
                    fontSize: 18,
                    textColor: colors.text,
                  },
                },
                Value: {
                  text: {
                    text: "",
                    fontFace: "Inter-Regular",
                    fontSize: 18,
                    textColor: colors.text,
                  },
                },
              },
              CastContainer: {
                flex: { direction: "row" },
                Label: {
                  flexItem: { marginRight: 8 },
                  text: {
                    text: "Cast:",
                    fontFace: "Inter-Bold",
                    fontSize: 18,
                    textColor: colors.text,
                  },
                },
                Value: {
                  text: {
                    text: "",
                    fontFace: "Inter-Regular",
                    fontSize: 18,
                    textColor: colors.text,
                    wordWrap: true,
                    wordWrapWidth: 650,
                  },
                },
              },
            },
            WatchNow: {
              type: Button,
            },
          },
        },
      },
    };
  }

  get BackButton() {
    return this.tag("Content.BackButton");
  }

  get MetaInfo() {
    return this.tag("Content.MetaInfo");
  }

  get WatchNow() {
    return this.tag("Content.MovieContent.Details.WatchNow");
  }

  set props(props) {
    console.log("Received props:", props);

    this._detailsData = props;

    if (this.tag("Content.MetaInfo")) {
      this._updateUI();
    }
  }

  _init() {
    this.BackButton.patch({
      w: 112,
      h: 64,
      props: {
        icon: Utils.asset("../../static/images/BackButtonIcon.png"),
      },
      Wrapper: {
        w: 112,
        h: 64,
        Icon: {
          w: 35,
          h: 35,
        },
      },
    });

    this.WatchNow.patch({
      w: 286,
      h: 78,
      props: {
        label: "WATCH NOW",
        icon: Utils.asset("../../static/images/WatchNow.png"),
      },
      Wrapper: {
        w: (w) => w,
        h: (h) => h,
        Icon: {
          w: 16,
          h: 16,
        },
        Label: {
          flexItem: { marginLeft: 13 },
        },
      },
    });

    if (this._detailsData) {
      this._updateUI();
    }
  }

  _updateUI() {
    const movie = this._detailsData;
    if (!movie) return;

    this.tag("Content").patch({
      MetaInfo: {
        text: {
          text: `${movie.genres.join(", ")}\n${movie.runtime} min\n${
            movie.country
          } • ${movie.releaseYear} • IMDb: ${movie.rating}`,
        },
      },

      MovieContent: {
        Poster: movie.thumbnail ? { src: movie.thumbnail } : {},
        Details: {
          Title: {
            text: { text: movie.title || "N/A" },
          },
          Paragraph: {
            text: { text: movie.description || "No description available." },
          },
          Castinfo: {
            DirectorContainer: {
              Value: {
                text: { text: movie.director || "Unknown" },
              },
            },
            CastContainer: {
              Value: {
                text: { text: movie.cast?.join(", ") || "N/A" },
              },
            },
          },
        },
      },
    });
    this._setState("WatchNow");
  }

  _handleBack() {
    const history = Router.getHistory();

    if (history.length) {
      Router.back();
    } else {
      Router.navigate("home");
    }
  }

  static _states() {
    return [
      class WatchNow extends this {
        // $enter() {
        //   this._refocus();
        // }

        _getFocused() {
          return this.WatchNow;
        }

        _handleUp() {
          this._setState("BackButton");
          return true;
        }

        _handleEnter() {
          Router.navigate("player");
        }
      },
      class BackButton extends this {
        // $enter() {
        //   this._refocus();
        // }

        _getFocused() {
          return this.BackButton;
        }

        _handleDown() {
          this._setState("WatchNow");
          return true;
        }

        _handleEnter() {
          const router = Router.getHistory().filter(
            (history) => history.hash != "splash" && history.hash != "cmp"
          );
          if (router.length) {
            Router.setHistory([...router]);
            Router.back();
          } else {
            Router.navigate("home");
          }
        }
      },
    ];
  }
}

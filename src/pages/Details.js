import { Lightning, Router, Utils } from "@lightningjs/sdk";
import Button from "../components/Button";
import colors from "../styles/colors";
import { formatMetaInfo } from "../utils/detailsInfoFormatters";

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
          collision: true,
          type: Button,
        },
        MetaInfo: {
          y: 108,
          text: {
            text: "",
            fontFace: "InterRegular",
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
                fontFace: "InterBold",
                fontSize: 28,
                textColor: colors.text,
              },
            },
            Paragraph: {
              flexItem: { marginBottom: 20 },
              text: {
                text: "",
                fontFace: "InterRegular",
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
                    fontFace: "InterBold",
                    fontSize: 18,
                    textColor: colors.text,
                  },
                },
                Value: {
                  text: {
                    text: "",
                    fontFace: "InterRegular",
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
                    fontFace: "InterBold",
                    fontSize: 18,
                    textColor: colors.text,
                  },
                },
                Value: {
                  text: {
                    text: "",
                    fontFace: "InterRegular",
                    fontSize: 18,
                    textColor: colors.text,
                    wordWrap: true,
                    wordWrapWidth: 650,
                  },
                },
              },
            },
            WatchNow: {
              collision: true,
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
    this._detailsData = props;

    if (this.tag("Content.MetaInfo")) {
      this._updateUI();
    }
  }

  _init() {
    this.tag("Content").patch({
      BackButton: {
        w: 112,
        h: 64,
        props: {
          icon: Utils.asset("images/BackButtonIcon.png"),
        },
        Wrapper: {
          w: 112,
          h: 64,
          Icon: { w: 35, h: 35 },
        },
      },

      MovieContent: {
        Details: {
          WatchNow: {
            w: 286,
            h: 78,
            props: {
              label: "WATCH NOW",
              icon: Utils.asset("images/WatchNow.png"),
            },
            Wrapper: {
              w: (w) => w,
              h: (h) => h,
              Icon: { w: 16, h: 16 },
              Label: {
                flexItem: { marginLeft: 13 },
              },
            },
          },
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
          text: formatMetaInfo(movie),
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

  _handleClick() {
    const current = this.state;
    if (current === "WatchNow") {
      Router.navigate("player");
    } else if (current === "BackButton") {
      this._handleBack();
    }
  }

  _handleBack() {
    if (Router.getHistory().length > 1) {
      Router.back();
    } else {
      Router.navigate("home");
    }
  }

  $handleHoverState(ref) {
    const currentState = this._getState();

    if (ref !== currentState) {
      if (currentState) this.tag(currentState)._unfocus();
      this._setState(ref);
    }
  }

  static _states() {
    return [
      class WatchNow extends this {
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
        _getFocused() {
          return this.BackButton;
        }

        _handleDown() {
          this._setState("WatchNow");
          return true;
        }

        _handleEnter() {
          this._handleBack();
        }
      },
    ];
  }
}

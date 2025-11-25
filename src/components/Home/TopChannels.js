import { Lightning, Utils } from "@lightningjs/sdk";
import VerticalContainer from "../VerticalContainer/VerticalContainer";
import VerticalItem from "../Home/VerticalItem";
import colors from "../../styles/colors";

export default class TopChannels extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      color: colors.black,
      w: 312,
      h: 837,
      shader: { type: Lightning.shaders.RoundedRectangle, radius: 16 },

      Padding: {
        x: 16,
        y: 24,
        w: 280, // 312 - (16 + 16)
        h: 789, // 837 - (24 + 24)
        flex: { direction: "column", alignItems: "center" },

        Title: {
          text: {
            text: "Top 5 Channels",
            fontFace: "InterRegular",
            fontSize: 24,
          },
        },

        Channels: {
          type: VerticalContainer,
          enableScroll: false,
          w: 280,
          h: 700,
        },
      },
    };
  }

  _init() {
    const topChannels = [
      {
        title: "WeDoTV",
        image: "images/channels/wedotv.png",
      },
      {
        title: "Netflix",
        image: "images/channels/netflix.png",
      },
      {
        title: "Vodafone",
        image: "images/channels/vodafone.png",
      },
      {
        title: "Yettel",
        image: "images/channels/yettel.png",
      },
      {
        title: "TvOne",
        image: "images/channels/tvone.png",
      },
    ];

    const channelCards = topChannels.map((channel) => ({
      type: VerticalItem,
      itemData: channel,
    }));

    this.tag("Channels").props = {
      items: channelCards,
    };
  }

  _getFocused() {
    return this.tag("Channels");
  }
}

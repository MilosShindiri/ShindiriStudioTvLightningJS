import { Colors, Lightning, VideoPlayer, Utils } from "@lightningjs/sdk";

export default class PlayerControllButton extends Lightning.Component {
  _props = {
    label: "",
  };
  set props(props) {
    const { w, h, src, label } = props;
    this.patch({
      w: w,
      h: h,
      rect: true,
      src: Utils.asset(src),
      color: Colors("#ffffff").alpha(0.3).get(),
    });
    this._props.label = label;
  }

  _focus() {
    // console.log('focus')
    this.patch({ color: Colors("#ed1c24").get() });
  }

  _unfocus() {
    this.patch({ color: Colors("#ffffff").alpha(0.3).get() });
  }

  _handleEnter(e) {
    const { label } = this._props;
    switch (label) {
      case "back": {
        this._handleBack(e);
        break;
      }
      case "rewind": {
        this._handleBackwards();
        break;
      }
      case "playPause": {
        this._handlePlayPause();
        break;
      }
      case "forward": {
        this._handleForward();
        break;
      }
    }
  }
  _handleBack(e) {
    e.preventDefault();
    this.fireAncestors("$exitVideo", e);
  }
  _handleForward() {}
  _handleRewind() {}
  _handlePlayPause() {
    VideoPlayer.playPause();
    const isPlaying = VideoPlayer.playing;
    this.patch({
      src: Utils.asset(
        "images/player/" + (isPlaying ? "play.png" : "pause.png")
      ),
    });
  }
  _handleBackwards() {}
}

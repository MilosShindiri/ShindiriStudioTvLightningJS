import { Colors, Lightning, VideoPlayer, Utils } from "@lightningjs/sdk";

export default class PlayerControllButton extends Lightning.Component {
  _props = {
    label: "",
  };

  set props(props) {
    const { w, h, src, label } = props;
    this._pauseTexture = Utils.asset("images/player/pause.png");
    this._playTexture = Utils.asset("images/player/play.png");
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
  _handleForward() {
    VideoPlayer.skip(5);
  }

  _handlePlayPause() {
    VideoPlayer.playPause();
    const isPlaying = VideoPlayer.playing;
    this.patch({
      src: isPlaying ? this._playTexture : this._pauseTexture,
    });
  }

  _handleBackwards() {
    VideoPlayer.skip(-5);
  }
}

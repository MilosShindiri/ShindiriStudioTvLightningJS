import Lightning from "@lightningjs/sdk/src/Lightning";

export default class Slideshow extends Lightning.Component {
  _images = [];
  _currentIndex = 0;
  _interval = null;
  _transitionDuration = 5000;

  static _template() {
    return {
      w: 1920,
      h: 697,

      Image: {
        w: 1920,
        h: 697,
        alpha: 1,
      },
    };
  }

  set images(images) {
    this._images = images || [];
    this._currentIndex = 0;

    if (this._images.length) {
      this._setImage(this._images[0]);
      this._startIfNeeded();
    }
  }

  set transitionDuration(v) {
    this._transitionDuration = v;
  }

  _setImage(src) {
    this.tag("Image").patch({
      texture: {
        type: Lightning.textures.ImageTexture,
        src,
        resizeMode: {
          type: "cover",
          w: 1920,
          h: 697,
          clipY: 0.5,
        },
      },
    });
  }

  _startIfNeeded() {
    this._stopSlideshow();
    if (this._images.length > 1) {
      this._interval = setInterval(
        () => this._transition(),
        this._transitionDuration
      );
    }
  }

  _stopSlideshow() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  setImagesOnFocus(images) {
    this._stopSlideshow();
    this._images = images || [];
    this._currentIndex = 0;

    if (this._images.length) {
      this._setImage(this._images[0]);
      this.tag("Image").setSmooth("alpha", 1, { duration: 0 });
      this._startIfNeeded();
    }
  }

  _transition() {
    if (this._images.length <= 1) return;

    const img = this.tag("Image");

    img.setSmooth("alpha", 0, { duration: 0.6 });

    setTimeout(() => {
      this._currentIndex = (this._currentIndex + 1) % this._images.length;
      this._setImage(this._images[this._currentIndex]);
      img.setSmooth("alpha", 1, { duration: 0.6 });
    }, 600);
  }

  pause() {
    this._stopSlideshow();
  }

  resume() {
    this._startIfNeeded();
  }

  _detach() {
    this._stopSlideshow();
  }
}

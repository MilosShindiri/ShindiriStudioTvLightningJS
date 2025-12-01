import { Lightning, Utils, Router } from "@lightningjs/sdk";
import HorizontalContainer from "../../components/HorizontalContainer/HorizontalContainer";
import NavElement from "./NavElement";

export default class NavbarItems extends Lightning.Component {
  static _template() {
    return {
      w: 1841,
      h: 60,
      x: 32,
      y: 32,
      flex: {
        direction: "row",
        justifyContent: "flex-start",
        alignItems: "center",
      },
      Logo: { w: 301, h: 44, src: Utils.asset("images/logo.png") },
      NavItems: {
        collision: true,
        type: HorizontalContainer,
        x: 80,
        w: 674,
        h: 49,
        flexItem: { marginTop: 10 },
      },
    };
  }

  get NavItems() {
    return this.tag("NavItems");
  }

  _getFocused() {
    return this.NavItems;
  }

  _init() {
    // Podaci za navbar
    const navData = [{ label: "HOME" }, { label: "MOVIES" }];

    const navItems = navData.map((item) => ({ type: NavElement, item }));

    this.NavItems.props = { items: navItems, h: 49, disableScroll: true };
  }

  // setter props prima route i markira selektovani element
  set props(props) {
    const { route } = props;
    if (!route) return;

    const index = this.NavItems.Items.children.findIndex(
      (item) => item._item.label.toLowerCase() === route.toLowerCase()
    );

    if (index >= 0) {
      this._setSelected(index);
    }
  }

  // $handleHoverIndex(index) {
  //   if (index === undefined || index === null) return;

  //   // Ako već postoji prethodni fokusirani element, unfocus-uj ga
  //   if (this._currentIndex !== undefined && this._currentIndex !== index) {
  //     const prevItem = this.NavItems.Items.children[this._currentIndex];
  //     if (prevItem) prevItem._unfocus();
  //   }

  //   // Fokusiraj novi element
  //   const newItem = this.NavItems.Items.children[index];
  //   if (newItem) newItem._focus();

  //   // Sačuvaj trenutno fokusirani index
  //   this._currentIndex = index;
  // }

  // _handleHover() {
  //   this.fireAncestors("$handleHoverState", this.ref); //sending ref name
  // }

  _setSelected(index) {
    // HorizontalContainer target
    this.NavItems.props = { targetIndex: index };

    // Patch-ujemo selektovane elemente
    this.NavItems.Items.children.forEach((item, i) => {
      item.selected = i === index;
    });
  }

  _handleDown() {
    Router.focusPage();
    return true;
  }
}

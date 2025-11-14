import { Lightning, Utils, Router } from "@lightningjs/sdk";
import HorizontalContainer from "../../HorizontalContainer/HorizontalContainer";
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
      Logo: { w: 301, h: 44, src: Utils.asset("images/Logo.png") },
      NavItems: {
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
    const navData = [{ label: "HOME" }, { label: "MOVIES" }];

    const navItems = navData.map((item) => ({ type: NavElement, item }));

    this.NavItems.props = { items: navItems, h: 49, disableScroll: true };
  }

  set props(props) {
    const { route } = props;
    console.log("NavBarItems Props", props);
    if (!route) return;
    console.log(this.NavItems);
    // Make sure children exist
    // console.log(this.NavItems.children[1]);
    this.NavItems.Items.children.forEach((navElement) => {
      console.log(navElement);
      if (navElement._item) {
        // normalize to lowercase
        navElement.props = { route };
      }
    });
  }

  _handleDown() {
    Router.focusPage();
    return true;
  }
}

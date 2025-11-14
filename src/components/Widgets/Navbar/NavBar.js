import { Lightning, Router } from "@lightningjs/sdk";
import NavbarItems from "./NavBarItems";

export default class Navbar extends Lightning.Component {
  static _template() {
    return {
      Items: { type: NavbarItems, x: 32, y: 32 },
    };
  }

  get Items() {
    return this.tag("Items");
  }

  set props(props) {
    const { route } = props;
    console.log(props);
    if (this.Items) {
      this.Items.props = { route };
    }
  }

  _handleDown() {
    Router.focusPage();
    return true;
  }

  _handleUp() {
    return true;
  }

  _getFocused() {
    return this.Items.NavItems;
  }
}

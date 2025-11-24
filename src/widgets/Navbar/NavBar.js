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

  // Prosleđujemo route ka NavbarItems
  set props(props) {
    const { route } = props;
    if (this.Items) {
      this.Items.props = { route };
    }
  }
  _handleBack() {
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
  _handleDown() {
    Router.focusPage();
    return true;
  }

  _handleUp() {
    return true;
  }

  _handleRight() {
    return true;
  }

  _handleLeft() {
    return true;
  }

  _getFocused() {
    return this.Items.NavItems;
  }
}

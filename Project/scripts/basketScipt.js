import {
  getCartFromStorage,
  sumBasket,
  renderBasket,
} from "/utils/basketUtils.js";
import { initializeCart } from "/scripts/cartLogic.js";
import { setupBurgerMenu } from "/utils/burgerUtils.js";

setupBurgerMenu();
initializeCart("page");

initializeCart("sidebar");

const cart = getCartFromStorage();
const totalCount = sumBasket(cart);
renderBasket(totalCount);

import {
  getCartFromStorage,
  sumBasket,
  renderBasket,
} from "/utils/basketUtils.js";
import { initializeCart } from "/scripts/cartLogic.js";

initializeCart("page");

initializeCart("sidebar");

const cart = getCartFromStorage();
const totalCount = sumBasket(cart);
renderBasket(totalCount);

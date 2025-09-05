import { getCartFromStorage, sumBasket, renderBasket } from "./basketUtils.js";
import { initializeCart } from "./cartLogic.js";

initializeCart("page");

initializeCart("sidebar");

const cart = getCartFromStorage();
const totalCount = sumBasket(cart);
renderBasket(totalCount);

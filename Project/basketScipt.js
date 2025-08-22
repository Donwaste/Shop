import { getCartFromStorage, sumBasket, renderBasket } from "./basketUtils.js";
import { initializeCart } from "./cartLogic.js";
const cart = getCartFromStorage();
const totalCount = sumBasket(cart);
renderBasket(totalCount);

initializeCart();

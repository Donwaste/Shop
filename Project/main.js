import { getProducts } from "./fetch.js";
import { getCartFromStorage, sumBasket, renderBasket } from "./basketUtils.js";
import { initializeCart } from "./cartLogic.js";

const productContainer = document.querySelector(".product-grid");

const renderProducts = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    return;
  }
  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product-item");
    productElement.dataset.id = product.id;

    const productImage = document.createElement("img");
    productImage.classList.add("product-image");
    productImage.src = product.image;
    productElement.appendChild(productImage);

    const productName = document.createElement("h1");
    productName.classList.add("name");
    productName.textContent = product.name;
    productElement.appendChild(productName);

    const productPrice = document.createElement("span");
    productPrice.classList.add("price");
    productPrice.textContent = product.price;
    productElement.appendChild(productPrice);

    productContainer.appendChild(productElement);
  });
};

if (productContainer) {
  getProducts()
    .then((list) => {
      renderProducts(list);
    })
    .catch((error) => {
      console.error("Failed to load products:", error);
    });
  productContainer.addEventListener("click", (event) => {
    const productItem = event.target.closest(".product-item");
    if (productItem) {
      const productId = productItem.dataset.id;
      window.location.href = `product.html?id=${productId}`;
    }
  });
}

const cart = getCartFromStorage();
const totalCount = sumBasket(cart);
renderBasket(totalCount);

document.addEventListener("DOMContentLoaded", () => {
  initializeCart("sidebar");
});

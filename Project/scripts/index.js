import { getProducts } from "/data/fetch.js";
import {
  getCartFromStorage,
  sumBasket,
  renderBasket,
} from "/utils/basketUtils.js";
import { initializeCart } from "/scripts/cartLogic.js";
import { setupBurgerMenu } from "/utils/burgerUtils.js";

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
  productContainer.textContent = "Loading";
  getProducts()
    .then((list) => {
      if (!Array.isArray(list) || list.length === 0) {
        productContainer.textContent = "No products found";
        return;
      }
      productContainer.innerHTML = "";
      renderProducts(list);
    })
    .catch((error) => {
      productContainer.textContent = "Failed to load products:";
      console.error("Failed to load products:", error);
    });
  productContainer.addEventListener("click", (event) => {
    const productItem = event.target.closest(".product-item");
    if (productItem) {
      const productId = productItem.dataset.id;
      window.location.href = `/pages/product.html?id=${productId}`;
    }
  });
}

const cart = getCartFromStorage();
const totalCount = sumBasket(cart);
renderBasket(totalCount);

const setupScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("animate")) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const promoText = document.querySelector(".promo-text");
  if (promoText) {
    observer.observe(promoText);
  }

  const subtitle = document.querySelector(".subtitle");
  if (subtitle) {
    observer.observe(subtitle);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initializeCart("sidebar");
  setupBurgerMenu();
  setupScrollAnimations();
});

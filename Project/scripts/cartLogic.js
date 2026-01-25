import { getProducts } from "/data/fetch.js";
import { getCartFromStorage } from "/utils/basketUtils.js";
import {
  getPriceAsNumber,
  formatCurrency,
  calculateTotal,
} from "/utils/priceUtils.js";

const preventScroll = () => {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = scrollbarWidth + "px";
  }
  document.body.style.overflow = "hidden";
};

const allowScroll = () => {
  document.body.style.paddingRight = "";
  document.body.style.overflow = "";
};

export const initializeCart = (type = "sidebar") => {
  let allProducts = [];
  const cartContainer = document.querySelector(".cart-items");
  const cartSum = document.querySelector(".cart-sum-number");
  const cartCount = document.querySelectorAll(".cart-count");
  const cartActions = document.querySelector(".cart-actions");
  const cartWrapper = document.querySelector(".cart-wrapper");
  const cartLink = document.querySelector(".cart-link");
  const cartOverlay = document.querySelector(".cart-overlay");

  let cartItemsList, subtotalElement, totalElement;
  if (type === "page") {
    cartItemsList = document.querySelector(".cart-items-list");
    subtotalElement = document.querySelector(".details-row span:last-child");
    totalElement = document.querySelector(".total-row span:last-child");
  }

  if (cartLink && cartWrapper) {
    cartLink.addEventListener("click", (event) => {
      event.preventDefault();

      const isOpen = cartWrapper.classList.contains("open");

      if (isOpen) {
        cartWrapper.classList.remove("open");
        allowScroll();
        document.body.classList.remove("cart-open");
      } else {
        cartWrapper.classList.add("open");
        preventScroll();
        document.body.classList.add("cart-open");
      }
    });

    if (cartOverlay) {
      cartOverlay.addEventListener("click", () => {
        cartWrapper.classList.remove("open");
        allowScroll();
        document.body.classList.remove("cart-open");
      });
    }

    const cartCloseBtn = document.querySelector(".cart-close-btn");
    if (cartCloseBtn) {
      cartCloseBtn.addEventListener("click", () => {
        cartWrapper.classList.remove("open");
        allowScroll();
        document.body.classList.remove("cart-open");
      });
    }
  }

  const renderBasketStorage = (products) => {
    if (products.length === 0) {
      return `<p class="cart-empty">Your cart is empty</p>`;
    }

    if (type === "page") {
      return products
        .map((product) => {
          return `<div class="cart-item" data-id="${product.id}">
    <div class="item-image-wrapper">
        <img class="item-image" src="${product.image}" alt="${product.name}"/>
    </div>
    
    <div class="item-content">
        <p class="item-title">${product.name}</p>
        
        <span class="item-price-per-unit">${formatCurrency(product.price)}</span>
        
        <div class="product-counter">
            <button class="btn decrease-btn">-</button>
            <span class="item-count">${product.count}</span>
            <button class="btn increase-btn">+</button>
        </div>
        
        <span class="item-subtotal-price">${formatCurrency(
          product.itemSum,
        )}</span>
        
        <button class="btn delete-item-btn">
            <img class="item-delete" src="/images/icons/bin.png" alt="Delete" />
        </button>
    </div>
</div>`;
        })
        .join("");
    } else {
      return products
        .map((product) => {
          return `
          <div class="cart-item" data-id="${product.id}">
            <div class="cart-image">
              <a href="/pages/product.html?id=${product.id}">
                 <img class="item-image" src="${product.image}" alt="${
                   product.name
                 }"/>
              </a>
            </div>
            <div class="items-sides">
              <div class="item-left-side">
                <span class="item-text">${product.name}</span>
                <span class="item-pice">${formatCurrency(product.price)}</span>
                <div class="product-counter">
                  <button class="btn decrease-btn">-</button>
                  <span class="item-count">${product.count}</span>
                  <button class="btn increase-btn">+</button>
                </div>
              </div>
              <div class="item-right-side">
                <img class="item-delete" src="/images/icons/bin.png" alt="Delete"/>
                <span class="item-sum">${formatCurrency(product.itemSum)}</span>
              </div>
            </div>
          </div>`;
        })
        .join("");
    }
  };

  const getProductsToRender = () => {
    const cartItems = getCartFromStorage();
    const productsToRender = [];

    cartItems.forEach((cartItem) => {
      const foundProduct = allProducts.find(
        (product) => product.id === cartItem.id,
      );
      if (foundProduct) {
        const priceNumber = getPriceAsNumber(foundProduct.price);
        productsToRender.push({
          ...foundProduct,
          ...cartItem,
          itemSum: priceNumber * cartItem.count,
        });
      }
    });
    return productsToRender;
  };

  const render = () => {
    const productsToRender = getProductsToRender();

    cartCount.forEach((counterElement) => {
      counterElement.textContent = calculateTotal(productsToRender, "count");
    });

    if (cartSum) {
      cartSum.textContent = formatCurrency(
        calculateTotal(productsToRender, "itemSum"),
      );
    }

    if (type === "page") {
      const totalSum = calculateTotal(productsToRender, "itemSum");
      if (subtotalElement) {
        subtotalElement.textContent = formatCurrency(totalSum);
      }
      if (totalElement) {
        totalElement.textContent = formatCurrency(totalSum);
      }
    }

    if (cartActions) {
      if (productsToRender.length === 0) {
        cartActions.style.display = "none";
      } else {
        cartActions.style.display = "flex";
      }
    }

    let container;
    if (type === "page") {
      container = cartItemsList;
    } else {
      container = cartContainer;
    }

    if (container) {
      container.innerHTML = renderBasketStorage(productsToRender);
    }
  };

  const itemsContainer = type === "page" ? cartItemsList : cartContainer;

  if (itemsContainer) {
    itemsContainer.addEventListener("click", (event) => {
      const cartItemElement = event.target.closest(".cart-item");
      if (!cartItemElement) return;

      const itemId = cartItemElement.dataset.id;
      const productsToRender = getProductsToRender();
      const itemInCart = productsToRender.find((p) => p.id === itemId);

      if (!itemInCart) return;

      const priceNumber = getPriceAsNumber(itemInCart.price);

      if (event.target.classList.contains("increase-btn")) {
        itemInCart.count++;
        itemInCart.itemSum = itemInCart.count * priceNumber;
      }

      if (event.target.classList.contains("decrease-btn")) {
        if (itemInCart.count > 1) {
          itemInCart.count--;
          itemInCart.itemSum = itemInCart.count * priceNumber;
        }
      }

      if (
        event.target.classList.contains("item-delete") ||
        event.target.closest(".delete-item-btn")
      ) {
        const itemIndex = productsToRender.findIndex((p) => p.id === itemId);
        productsToRender.splice(itemIndex, 1);
      }

      const newCartData = productsToRender.map((item) => ({
        id: item.id,
        count: item.count,
      }));
      localStorage.setItem("cart", JSON.stringify(newCartData));

      if (window.cartUpdateCallbacks) {
        window.cartUpdateCallbacks.forEach((callback) => {
          if (typeof callback === "function") {
            callback();
          }
        });
      }
    });
  }

  getProducts()
    .then((list) => {
      allProducts = list;
      render();
    })
    .catch((error) => console.error("Failed to load products:", error));

  if (!window.cartUpdateCallbacks) {
    window.cartUpdateCallbacks = [];
  }

  window.cartUpdateCallbacks.push(render);

  return render;
};

export const updateAllCarts = () => {
  if (window.cartUpdateCallbacks) {
    window.cartUpdateCallbacks.forEach((callback) => {
      if (typeof callback === "function") {
        callback();
      }
    });
  }
};

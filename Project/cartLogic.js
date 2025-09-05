import { products } from "./products.js";
import { getCartFromStorage } from "./basketUtils.js";

export const initializeCart = (type = "sidebar") => {
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

  if (type === "sidebar" && cartLink && cartWrapper) {
    cartLink.addEventListener("click", (event) => {
      event.preventDefault();
      cartWrapper.classList.toggle("open");
    });

    if (cartOverlay) {
      cartOverlay.addEventListener("click", () => {
        cartWrapper.classList.remove("open");
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
          return `
          <div class="cart-item" data-id="${product.id}">
            <div class="item-image-wrapper">
              <img class="item-image" src="${product.image}" alt="${
            product.name
          }"/>
            </div>
            <div class="item-details">
              <p class="item-title">${product.name}</p>
              <span class="item-price-per-unit">${product.price}</span>
            </div>
            <div class="item-controls">
              <div class="product-counter">
                <button class="btn decrease-btn">-</button>
                <span class="item-count">${product.count}</span>
                <button class="btn increase-btn">+</button>
              </div>
              <span class="item-subtotal-price">${formatCurrency(
                product.itemSum
              )}</span>
              <button class="btn delete-item-btn">
                <img class="item-delete" src="images/bin.png" alt="Delete" />
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
              <a href="product.html?id=${product.id}">
                 <img class="item-image" src="${product.image}" alt="${
            product.name
          }"/>
              </a>
            </div>
            <div class="items-sides">
              <div class="item-left-side">
                <span class="item-text">${product.name}</span>
                <span class="item-pice">${product.price}</span>
                <div class="product-counter">
                  <button class="btn decrease-btn">-</button>
                  <span class="item-count">${product.count}</span>
                  <button class="btn increase-btn">+</button>
                </div>
              </div>
              <div class="item-right-side">
                <img class="item-delete" src="images/bin.png" alt="Delete"/>
                <span class="item-sum">${formatCurrency(product.itemSum)}</span>
              </div>
            </div>
          </div>`;
        })
        .join("");
    }
  };

  const formatCurrency = (number) =>
    number
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      .replace(".", ",") + " ₴";

  const getPriceAsNumber = (priceString) => {
    const cleanedString = String(priceString)
      .replace(/[^\d,]/g, "")
      .replace(",", ".");
    return parseFloat(cleanedString);
  };

  const calculateTotal = (items, propertyKey) => {
    return items.reduce((accumulator, currentItem) => {
      const value = currentItem[propertyKey];
      return accumulator + value;
    }, 0);
  };

  const getProductsToRender = () => {
    const cartItems = getCartFromStorage();
    const productsToRender = [];

    cartItems.forEach((cartItem) => {
      const foundProduct = products.find(
        (product) => product.id === cartItem.id
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
        calculateTotal(productsToRender, "itemSum")
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

  let eventContainer;
  if (type === "page") {
    eventContainer = cartItemsList;
  } else {
    eventContainer = cartContainer;
  }
  
  if (eventContainer) {
    eventContainer.addEventListener("click", (event) => {
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

  render();

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

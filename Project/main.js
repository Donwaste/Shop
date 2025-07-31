import { products } from "./products.js";
import { getCartFromStorage, sumBasket, renderBasket } from "./basketUtils.js";

const productContainer = document.querySelector(".product-grid");

const renderProducts = (products) => {
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

productContainer.addEventListener("click", (event) => {
  const productId = event.target.closest(".product-item").dataset.id;
  window.location.href = `product.html?id=${productId}`;
});

const cart = getCartFromStorage();
const totalCount = sumBasket(cart);
renderBasket(totalCount);
renderProducts(products);

const renderBasketStorage = (products) => {
  return products
    .map((product) => {
      return `
        <div class="cart-item" data-id="${product.id}">
          <div class="cart-image">
            <img class="item-image" src="${product.image}" />
          </div>
          <div class="items-sides">
            <div class="item-left-side">
              <span class="item-text">${product.name}</span>
              <span class="item-pice">${product.price}</span>
              <div class="product-counter">
                <button class="btn decrease-btn">-</button>
                <span id="count">${product.count}</span>
                <button class="btn increase-btn">+</button>
              </div>
            </div>
            <div class="item-right-side">
              <img class="item-delete" src="images/bin.png" />
              <span class="item-sum">${product.itemSum} ₴</span>
            </div>
          </div>
        </div>`;
    })
    .join("");
};

document.addEventListener("DOMContentLoaded", () => {
  const cartLink = document.querySelector(".cart-link");
  const cartSideWidget = document.querySelector(".cart-side");

  // Корзина
  const cartContainer = document.querySelector(".cart-items");
  const cartSum = document.querySelector(".cart-sum-number");
  const cartCount = document.querySelector("#cart-count");
  const cartItems = getCartFromStorage();
  const productsToRender = [];

  const getPriceAsNumber = (priceString) => {
    const cleanedString = priceString.replace(/\D/g, "");
    return parseInt(cleanedString, 10);
  };

  const calculateTotal = (items, propertyKey) => {
    return items.reduce((accumulator, currentItem) => {
      const value = currentItem[propertyKey];
      return accumulator + value;
    }, 0);
  };

  cartItems.forEach((cartItem) => {
    const foundProduct = products.find((product) => product.id === cartItem.id);
    if (foundProduct) {
      const priceNumber = getPriceAsNumber(foundProduct.price);
      productsToRender.push({
        ...foundProduct,
        ...cartItem,
        itemSum: priceNumber * cartItem.count,
      });
    }
  });

  const render = () => {
    cartCount.textContent = calculateTotal(productsToRender, "count");
    cartSum.textContent = calculateTotal(productsToRender, "itemSum") + " ₴";
    cartContainer.innerHTML = renderBasketStorage(productsToRender);
  };

  if (cartLink && cartSideWidget) {
    cartLink.addEventListener("click", (event) => {
      event.preventDefault();
      cartSideWidget.classList.toggle("open");
    });
  }

  const cartHeader = document.querySelector(".cart-header");
  if (cartHeader) {
    cartHeader.addEventListener("click", (event) => {
      if (event.target === cartHeader) {
        cartSideWidget.classList.remove("open");
      }
    });
  }

  render();

  //
  cartContainer.addEventListener("click", (event) => {
    const cartItemElement = event.target.closest(".cart-item");
    if (!cartItemElement) return;

    const itemId = cartItemElement.dataset.id;
    const itemInCart = productsToRender.find((p) => p.id === itemId);

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

    if (event.target.classList.contains("item-delete")) {
      const itemIndex = productsToRender.findIndex((p) => p.id === itemId);
      productsToRender.splice(itemIndex, 1);
    }

    const newCartData = productsToRender.map((item) => ({
      id: item.id,
      count: item.count,
    }));
    localStorage.setItem("cart", JSON.stringify(newCartData));

    render();
  });
  //
});

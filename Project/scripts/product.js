import { getProducts } from "/data/fetch.js";
import {
  getCartFromStorage,
  sumBasket,
  renderBasket,
} from "/utils/basketUtils.js";
import { initializeCart, updateAllCarts } from "/scripts/cartLogic.js";

const change = (direction, list) => {
  const params = new URLSearchParams(location.search);
  let index = list.findIndex((a) => a.id === params.get("id"));
  if (index === -1) {
    return;
  }
  if (direction === "+" && index < list.length - 1) index++;
  if (direction === "-" && index > 0) index--;
  return `../pages/product.html?id=${list[index].id}`;
};

function renderProduct(product, list) {
  const staticMainDescription =
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae aliquam odit magni omnis nemo debitis iusto, eius id eaque officia eos perspiciatis quas, dolore consequuntur porro. Corporis earum totam repudiandae!";
  const staticReturnPolicy =
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae aliquam odit magni omnis nemo debitis iusto, eius id eaque officia eos perspiciatis quas, dolore consequuntur porro. Corporis earum totam repudiandae!";
  const staticShippingInfo =
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae aliquam odit magni omnis nemo debitis iusto, eius id eaque officia eos perspiciatis quas, dolore consequuntur porro. Corporis earum totam repudiandae!";

  return `
   <div class="product-page">
        <div class="product-navigation">
          <div class="product-navigation-left">
            <a href="index.html" style="color: black">Home /</a>
            <p style="color: dimgray">Your product</p>
          </div>
          <div class="product-navigation-right">
            <div class="navigation-buttons">
              <a href="${change(
                "-",
                list
              )}" class="nav-btn" data-direction="-" id="prev-btn">&lt; Previous</a>
              <span class="divider">|</span>
              <a href="${change(
                "+",
                list
              )}" class="nav-btn" id="next-btn">Next &gt;</a>
            </div>
          </div>
        </div>

        <div class="product-product">
          <div class="product-left">
            <img src="${product.image}" alt="${product.name}" />
            <div class="product-info">
              <p>${staticMainDescription}</p>
            </div>
          </div>

          <div class="product-right">
            <div class="product-interaction">
              <h1>${product.name}</h1>
              <p>Article: ${product.article}</p>
              <span class="product-price" style="font-size: 24px; margin-bottom: 20px; display: block">${
                product.price
              }</span>
              <p>Quantity *</p>
              <div class="product-counter-page">
                  <button class="btn" id="decrease">-</button>
                  <span id="count">1</span>
                  <button class="btn" id="increase">+</button>
              </div>
              <button class="product-buy-button">Add to cart</button>
            </div>

            <div class="product-details-accordion">
              <details class="accordion-item">
                <summary class="accordion-header">
                  <span class="accordion-title">ABOUT THE PRODUCT</span>
                  <span class="accordion-icon"></span>
                </summary>
                <div class="accordion-content">
                  <p>${product.description}</p>
                </div>
              </details>

              <details class="accordion-item">
                <summary class="accordion-header">
                  <span class="accordion-title">PRODUCT & MONEY REFUND</span>
                  <span class="accordion-icon"></span>
                </summary>
                <div class="accordion-content">
                  <p>${staticReturnPolicy}</p>
                </div>
              </details>

              <details class="accordion-item">
                <summary class="accordion-header">
                  <span class="accordion-title">DELIVERY</span>
                  <span class="accordion-icon"></span>
                </summary>
                <div class="accordion-content">
                  <p>${staticShippingInfo}</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const cart = getCartFromStorage();
  const totalCount = sumBasket(cart);
  const container = document.getElementById("product-container");
  const params = new URLSearchParams(document.location.search);
  const itemId = params.get("id");
  getProducts().then((products) => {
    const currentIndex = products.findIndex((a) => a.id === itemId);
    const currentProduct = products.find((product) => product.id === itemId);

    container.innerHTML = renderProduct(currentProduct, products);

    const decreaseBtn = document.getElementById("decrease");
    const increaseBtn = document.getElementById("increase");
    const countSpan = document.getElementById("count");

    let count = 1;

    const counterRender = () => {
      countSpan.textContent = count;
      decreaseBtn.style.color = count === 1 ? "gray" : "black";
    };

    decreaseBtn.addEventListener("click", () => {
      if (count > 1) {
        count--;
        counterRender();
      }
    });

    increaseBtn.addEventListener("click", () => {
      count++;
      countSpan.textContent = count;
      counterRender();
    });

    const updateButtons = (index) => {
      const prevButton = document.getElementById("prev-btn");
      const nextButton = document.getElementById("next-btn");
      prevButton.disabled = index === 0;
      nextButton.disabled = index === products.length - 1;
      prevButton.style.color = prevButton.disabled ? "grey" : "";
      nextButton.style.color = nextButton.disabled ? "grey" : "";
    };

    const accordions = document.querySelectorAll(
      ".product-details-accordion .accordion-item"
    );
    accordions.forEach((currentAccordion) => {
      currentAccordion.addEventListener("toggle", () => {
        if (currentAccordion.open) {
          accordions.forEach((otherAccordion) => {
            if (otherAccordion !== currentAccordion) {
              otherAccordion.open = false;
            }
          });
        }
      });
    });

    counterRender();
    updateButtons(currentIndex);

    const renderCart = initializeCart("sidebar");

    const addInBasket = document.querySelector(".product-buy-button");
    addInBasket.addEventListener("click", (e) => {
      const cart = getCartFromStorage();
      const existingItem = cart.find((item) => item.id === itemId);

      if (existingItem) {
        existingItem.count += count;
      } else {
        cart.push({ id: itemId, count });
      }
      localStorage.setItem("cart", JSON.stringify(cart));

      const updatedTotalCount = sumBasket(cart);
      renderBasket(updatedTotalCount);

      updateAllCarts();

      count = 1;
      counterRender();
    });

    renderBasket(totalCount);
  });
});

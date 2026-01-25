import { getProducts } from "/data/fetch.js";
import { initializeCart } from "/scripts/cartLogic.js";

const productContainer = document.querySelector(".product-grid");

const renderProducts = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    return;
  }
  const pathName = window.location.pathname;
  let filename = pathName.split("/").pop();
  if (filename === "new.html") {
    products = products.filter((product) => product.isNew);
  }
  if (filename === "men.html") {
    products = products.filter(
      (product) => product.gender === "male" || product.gender === "unisex",
    );

    products.sort((a, b) => {
      if (a.gender === "male" && b.gender !== "male") return -1;
      if (a.gender !== "male" && b.gender === "male") return 1;
      return 0;
    });
  }

  if (filename === "women.html") {
    products = products.filter(
      (product) => product.gender === "female" || product.gender === "unisex",
    );

    products.sort((a, b) => {
      if (a.gender === "female" && b.gender !== "female") return -1;
      if (a.gender !== "female" && b.gender === "female") return 1;
      return 0;
    });
  }
  const limitedProducts = products.slice(0, 8);

  limitedProducts.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product-item");
    productElement.dataset.id = product.id;

    const productImage = document.createElement("img");
    productImage.classList.add("product-image");
    productImage.src = product.image;
    productImage.loading = "lazy";
    productElement.appendChild(productImage);

    const productName = document.createElement("h1");
    productName.classList.add("name");
    productName.textContent = product.name;
    productElement.appendChild(productName);

    const productPrice = document.createElement("span");
    productPrice.classList.add("price");
    productPrice.textContent = formatCurrency(product.price);
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

initializeCart("sidebar");

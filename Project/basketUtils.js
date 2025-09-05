export const getCartFromStorage = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const renderBasket = (itemsCount) => {
  const basket = document.querySelectorAll(".cart-count");
  basket.forEach((element) => {
    element.textContent = itemsCount;
  });
};

export const sumBasket = (cartArray) => {
  return cartArray.reduce((total, item) => total + item.count, 0);
};

export function setupCounter(container) {
  const decreaseBtn = document.getElementById("decrease");
  const increaseBtn = document.getElementById("increase");
  const countSpan = document.getElementById("count");

  let count = parseInt(countSpan.textContent, 10);

  const render = () => {
    countSpan.textContent = count;
    decreaseBtn.disabled = count === 1;
  };

  decreaseBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      render();
    }
  });

  increaseBtn.addEventListener("click", () => {
    count++;
    render();
  });

  render();
}

export const formatCurrency = (number, currency = "₴") => {
  return (
    number
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      .replace(".", ",") + ` ${currency}`
  );
};

export const getPriceAsNumber = (priceString) => {
  const cleanedString = String(priceString)
    .replace(/[^\d,]/g, "")
    .replace(",", ".");
  return parseFloat(cleanedString);
};

export const calculateTotal = (items, propertyKey) => {
  return items.reduce((accumulator, currentItem) => {
    const value = currentItem[propertyKey];
    return accumulator + value;
  }, 0);
};

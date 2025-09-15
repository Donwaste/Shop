export const getPriceAsNumber = (priceString) => {
  const cleanedString = String(priceString)
    .replace(/[^\d,]/g, "")
    .replace(",", ".");
  return parseFloat(cleanedString);
};

export const formatCurrency = (number) =>
  number
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    .replace(".", ",") + " ₴";
export const calculateTotal = (items, propertyKey) => {
  return items.reduce((accumulator, currentItem) => {
    const value = currentItem[propertyKey];
    return accumulator + value;
  }, 0);
};

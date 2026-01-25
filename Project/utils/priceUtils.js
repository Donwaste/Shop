export const formatCurrency = (price) => {
  const formattedNumber = price.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formattedNumber} ₴`;
};

export const getPriceAsNumber = (price) => {
  if (typeof price === "number") return price;
  return parseFloat(String(price).replace(/[^\d.]/g, ""));
};

export const calculateTotal = (items, key) => {
  return items.reduce((acc, item) => acc + (item[key] || 0), 0);
};

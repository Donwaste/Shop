const API_URL = "./api.json";
let productsCache = null;
let productsPromise = null;

export async function getProducts() {
  if (productsCache) {
    return productsCache;
  }

  if (productsPromise) {
    return await productsPromise;
  }

  productsPromise = fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Request error");
      }
      return response.json();
    })
    .then((data) => {
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : [];
      productsCache = normalized;
      return productsCache;
    })
    .catch((error) => {
      productsPromise = null;
      throw error;
    });

  return await productsPromise;
}

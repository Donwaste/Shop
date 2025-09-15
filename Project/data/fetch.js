const API_URL = "/data/api.json";
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
      productsCache = normalized.map((p) => ({
        ...p,
        image:
          typeof p.image === "string" && !/^([a-z]+:)?\//i.test(p.image)
            ? `/${p.image.replace(/^\/+/, "")}`
            : p.image,
      }));
      return productsCache;
    })
    .catch((error) => {
      productsPromise = null;
      throw error;
    });

  return await productsPromise;
}

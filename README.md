# T SHOP — Vanilla JS E‑commerce (Pet Project)

A minimal, framework‑free storefront built with HTML/CSS/JavaScript. It features a product list, product details, a client‑side cart with localStorage, and a tiny data layer with caching.

## Demo goals

- Practice clean DOM rendering and event delegation
- Centralize data fetching and caching
- Keep UI logic simple and explicit (loading/empty/error states)
- Maintain a clear, portable folder structure

## Tech stack

- HTML5, CSS3
- Vanilla JavaScript (ES Modules)
- No build tools, no frameworks

## Project structure

```
Project/
  pages/            # standalone pages (HTML)
    product.html
    basket.html
  scripts/          # page and domain logic (ES modules)
    index.js        # home page logic (product grid)
    product.js      # product page logic
    cartLogic.js    # cart UI logic (sidebar/page)
    basketScipt.js  # basket page bootstrap
  utils/            # shared utilities
    priceUtils.js   # currency format + price parsing + totals
    basketUtils.js  # localStorage helpers + header counter
  data/
    api.json        # mock data
    fetch.js        # getProducts() with caching + normalization
  styles/
    index.css
    product.css
    cartStyle.css
    basket.css
  images/           # static assets
  index.html        # home page
```

## Features

- Product grid with client‑side navigation to product details
- Product page with quantity control and Prev/Next links
- Cart (sidebar and page) with add/increase/decrease/remove
- Totals and currency formatting
- LocalStorage persistence
- Robust asset paths (absolute `/images/...`) across pages

## Getting started

1. Install a simple static server (any option works):

- Node: `npx serve .` or `npx http-server -p 5500 .`
- VS Code Live Server: right‑click `index.html` → “Open with Live Server”

2. Serve the project root as the web root

- You should be able to open:
  - `http://localhost:5500/index.html`
  - `http://localhost:5500/pages/product.html?id=su001`
  - `http://localhost:5500/pages/basket.html`

Note: Absolute paths are used for assets (`/images/...`, `/styles/...`, `/scripts/...`). Serving the project root avoids 404s.

## Data layer (how products load)

- `data/fetch.js` exposes `getProducts()`
  - Caches the first successful response
  - Normalizes API response to an array
  - Ensures product images use absolute paths

Usage example:

```js
import { getProducts } from "../data/fetch.js";

getProducts()
  .then((products) => {
    if (!Array.isArray(products) || products.length === 0) return;
    // render(products)
  })
  .catch(console.error);
```

## UI states (suggested pattern)

- Before loading: show “Loading…” or a simple placeholder
- Empty response: show “No products found”
- Error: show “Failed to load products”

This pattern is applied on the home page and can be mirrored in `product.html`/`basket.html`.

## Roadmap (Next Steps)

This roadmap focuses on pragmatic improvements to make the project a more polished portfolio piece, followed by a long-term goal to demonstrate modern framework skills.

**Phase 1: Enhancing the Vanilla JS Project**

- **Responsive Layout:** Implement a mobile-first responsive design for all pages (home, product, basket). This is a critical skill to demonstrate readiness for real-world projects.
- **Product Filtering & Sorting:** Add controls to the home page to filter products (e.g., by gender) and sort them (e.g., by price). This will showcase more complex data manipulation and state management on the client side.
- **Code Quality & Performance:**
  - **Lazy Loading:** Add `loading="lazy"` to product grid images to improve initial page load performance.
  - **URL Helper:** Create a small utility function to centralize URL generation and avoid hardcoded paths like `../pages/`.

**Phase 2: Future Goal**

- **React & Node.js Rewrite:** The ultimate goal is to rebuild this application using a modern stack.
  - **Frontend:** Re-implement the UI in **React** to demonstrate component-based architecture and state management.
  - **Backend:** Create a simple **Node.js (Express)** server to replace the static `api.json`, turning this into a full-stack application.

## License

MIT — free to use and modify.

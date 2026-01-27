# T SHOP — Vanilla JS E‑commerce (Pet Project)

A minimal, framework‑free storefront built with HTML/CSS/JavaScript. It features a product catalog with category filtering, client‑side cart with localStorage persistence, and a custom data layer with caching.

## Demo goals

- Practice clean DOM rendering and event delegation
- Centralize data fetching and caching
- Implement custom state management for the Shopping Cart
- Maintain a scalable, modular project structure

## Tech stack

- HTML5, CSS3 (Flexbox & Grid, Mobile-First)
- Vanilla JavaScript (ES Modules)
- No build tools, no frameworks

## Project structure
```text
Project/
  pages/            # standalone pages (HTML)
    product.html    # single product page
    basket.html     # full cart page
    men.html        # men's catalog
    women.html      # women's catalog
    new.html        # new arrivals catalog
  scripts/          # page and domain logic (ES modules)
    index.js        # home page logic & scroll animations
    catalog.js      # category pages logic (filtering & sorting)
    product.js      # product page logic & navigation
    basket.js       # basket page bootstrap
    cartLogic.js    # shared cart UI logic (sidebar/page interactions)
  utils/            # shared utilities
    priceUtils.js   # currency format, price parsing & totals
    basketUtils.js  # localStorage helpers & header counter
    burgerUtils.js  # mobile menu toggle logic
  data/
    api.json        # mock product data
    fetch.js        # getProducts() with caching & normalization
  styles/           # CSS modules
    index.css       # home page & global styles
    product.css     # product page styles
    cartStyle.css   # cart sidebar styles
    basket.css      # full cart page styles
    catalog.css     # catalog pages styles
  images/           # organized static assets
    products/       # product images
    icons/          # UI icons
    banners/        # promotional banners
  index.html        # home page entry point
```

## Features

- **Smart Navigation:** Dynamic product grid with category-based filtering (Men/Women/New) and context-aware sorting by gender
- **Cart System:** Full CRUD operations (Add, Remove, +/- quantity), persisted via localStorage. Two views: Sidebar overlay and Full page
- **Product Details:** Individual product pages with quantity controls and Prev/Next navigation between products
- **Responsive Design:** Fully adaptive layout with custom Burger Menu for mobile devices
- **Performance:** Implemented `loading="lazy"` for images and request caching in the data layer
- **Organization:** Clean asset structure with absolute path routing (`/images/...`, `/styles/...`, `/scripts/...`)

## UI states

- **Before loading:** Display "Loading…" placeholder
- **Empty response:** Show "No products found"
- **Error:** Show "Failed to load products"

This pattern is applied across all pages to ensure consistent user experience.

## Getting started

Install a simple static server (required for ES Modules to work):

- **Node:** `npx serve .` or `npx http-server -p 5500 .`
- **VS Code Live Server:** right‑click `index.html` → "Open with Live Server"

Serve the project root as the web root. You should be able to open:

- `http://localhost:5500/index.html` — Home page with all products
- `http://localhost:5500/pages/men.html` — Men's category
- `http://localhost:5500/pages/women.html` — Women's category
- `http://localhost:5500/pages/new.html` — New arrivals
- `http://localhost:5500/pages/product.html?id=su001` — Product details
- `http://localhost:5500/pages/basket.html` — Full cart page

**Note:** Absolute paths are used for assets (`/images/...`, `/styles/...`, `/scripts/...`). Serving the project root avoids 404s.

## Data layer (how products load)

`data/fetch.js` exposes `getProducts()`

- Caches the first successful response (Singleton pattern)
- Normalizes API response to an array
- Ensures product images use absolute paths
- Implements promise deduplication to prevent duplicate requests

Usage example:
```javascript
import { getProducts } from "/data/fetch.js";

getProducts()
  .then((products) => {
    if (!Array.isArray(products) || products.length === 0) {
      // Handle empty state
      return;
    }
    // Render products
  })
  .catch(console.error);
```

## Cart state management

The cart system uses a custom event-driven architecture:

- **localStorage persistence:** Cart data saved as `[{id, count}, ...]`
- **Global callbacks:** `window.cartUpdateCallbacks` array for synchronized updates
- **Dual views:** Sidebar overlay and full page share the same logic via `initializeCart(type)`
- **Real-time sync:** All cart instances update simultaneously when data changes

## Key technical decisions

1. **Category filtering:** Implemented in `catalog.js` using `pathname` detection and `.filter()` for gender-based sorting
2. **Cart synchronization:** Used callback pattern instead of events for simpler cross-page updates
3. **Price handling:** Created `getPriceAsNumber()` utility to safely parse formatted currency strings
4. **Image optimization:** Applied `loading="lazy"` attribute for better initial page load
5. **Responsive cart:** Single component adapts layout via CSS Grid and media queries

## Future Goals

- **React & Node.js Rewrite:** The next step is to rebuild this application using a modern stack.
  - **Frontend:** Re-implement the UI in **React** to demonstrate component-based architecture and robust state management (Redux/Zustand).
  - **Backend:** Create a simple **Node.js (Express)** server to replace the static `api.json`, turning this into a full-stack application.

## License

MIT — free to use and modify.
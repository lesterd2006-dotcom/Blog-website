# Signal Journal

A responsive editorial demo about AI and emerging technology. The bundled articles are explicitly labeled AI-generated concepts, not current or verified reporting. Live headlines are fetched only when a NewsAPI key is configured on the server.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- Optional: a NewsAPI key

## Setup

```sh
npm install
Copy-Item .env.example .env
npm run dev
```

The Vite site runs at `http://localhost:5173` and proxies `/api` requests to the Express API on port `4174`. On macOS/Linux, copy the example with `cp .env.example .env`.

Add a key to `.env` to enable live headlines:

```dotenv
NEWS_API_KEY=your_newsapi_key
API_PORT=4174
```

The key is read only by the server and is never exposed in browser code. Without it, Signal shows the clearly marked sample articles. NewsAPI availability, plan limits, geography, or provider errors may prevent live results; the editorial samples remain available as fallback.

## Commands

- `npm run dev` starts the API and Vite together.
- `npm run dev:web` starts only the Vite frontend.
- `npm run dev:api` starts the Express API with watch mode.
- `npm run build` performs a TypeScript check and production build.
- `npm run preview` serves the production build locally.
- `npm run lint` runs the TypeScript project checks.

## Included features

- Home, latest, trending, category, search, article, bookmarks, about, and contact routes.
- Search and category filters, pagination, related stories, bookmark persistence, theme persistence, sharing, and newsletter/contact forms.
- Responsive layouts, reduced-motion support, route transitions, lazy-loaded story images, and document title metadata.
- Optional Express API proxy for NewsAPI. Newsletter submissions are accepted for the current server process only; no mailing provider is configured.

## Data and privacy

Sample content is editorially illustrative and should not be read as live news. Bookmarks, the color theme, and offline newsletter fallback are stored in the browser's local storage. The optional newsletter API validates and accepts an address but does not persist it or send email. Contact form submission is local-only; use the displayed email address for actual correspondence.

# PSYNAPSE Website

The PSYNAPSE psychology club website for DPS Dwarka. This is a standalone export prepared for GitHub and local development.

## Run locally

Requirements: Node.js 20.19+ (or Node.js 22+).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Build and preview

```bash
npm run typecheck
npm run build
npm run start
```

The production files are generated in `dist/`. The build also creates `dist/404.html` so the client-side Gallery and Counselling routes can be restored by static hosts.

## Deploy with GitHub Pages

The included `.github/workflows/deploy-pages.yml` builds and deploys the site automatically whenever you push to `main`.

1. Upload these files to a GitHub repository.
2. Push the repository to the `main` branch.
3. In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. The workflow will publish the site and show its URL in the workflow summary.

## Routes

- `/` — PSYNAPSE homepage
- `/gallery` — Gallery
- `/counselling` — Counselling

## Notes

- No backend, database, API keys, or environment secrets are required.
- `BASE_PATH` is optional and defaults to `/`. The GitHub Pages workflow sets it automatically for project pages.
- The site preserves the cream, black, and red visual system, interactive tests and games, reduced-motion support, mobile cursor behavior, Mind Lab navigation, and Counselling CTA.

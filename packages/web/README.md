web (packages/web)

This package contains the migrated frontend views (vanilla DOM helpers) and a small React wrapper (`App.tsx`) used for local development with Vite.

Quick start (development)

1. Install dependencies (from workspace root prefer pnpm, fallback to npm):

```bash
pnpm install
# or with npm
npm install
```

2. Start dev server:

```bash
cd packages/web
npm run dev
```

Dev server runs on a port Vite selects, typically `http://localhost:5173` or `:5174` if 5173 is in use.

Verification & tooling

- Headless screenshot (used by automation): `/tmp/admin.png`
- Browser console log from the headless run: `/tmp/admin_browser.log`
- JSDOM unit test (quick): `packages/web/test/admin.dom.test.js` — run with:

```bash
npm --prefix packages/web exec -- node test/admin.dom.test.js
```

- Build the bundle (production):

```bash
cd packages/web
npm run build
```

Troubleshooting

- If the dev server chooses a different port, check the terminal output for the `Local:` URL.
- The Puppeteer script used by the automation is at `scripts/screenshot_admin.js`. It expects the dev server to be running at `http://localhost:5174` or the `DEV_URL` env var can be set.

Notes

- The frontend uses small vanilla view modules under `packages/web/src/views/pages` and `utils/dom.js` to build DOM nodes. `App.tsx` mounts the `Home()` node into React for compatibility.
- The API base used by the views defaults to `http://localhost:3000` and can be overridden with `VITE_API_BASE`.

# packages/web

Local dev for the Lumina web demo.

Requirements:

- Node 18+
- npm (or pnpm/yarn)

Quick start:

1. Install dependencies:

```bash
cd packages/web
npm install
```

2. Copy env (optional):

```bash
cp .env.example .env
```

3. Run dev server (Vite):

```bash
npm run dev
```

Notes:

- Tailwind is enabled via `tailwind.config.cjs` and `postcss.config.cjs`. The project imports `globals.css` and `index.css` which use Tailwind directives. If you see unknown at-rules in your editor, ensure Tailwind/PostCSS are installed and your editor loads the workspace Node modules.

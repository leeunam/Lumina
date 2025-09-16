Running the Lumina project locally

Install dependencies and run backend + frontend:

1. Install API dependencies

```bash
cd packages/api
npm install
```

2. Install frontend dependencies

```bash
cd ../web
npm install
```

3. Run backend

```bash
node packages/api/src/index.js
```

4. Run frontend (in another terminal)

```bash
cd packages/web
npm run dev
```

Frontend will be available at http://localhost:5173 and backend at http://localhost:3000

Environment variables (copy from packages/web/.env.example):

- VITE_API_BASE=http://localhost:3000
- VITE_MERCHANT_ID=MERCHANT_TEST
- VITE_STELLAR_EXPLORER=https://stellar.expert/explorer/testnet/tx/

Notes:

- Tailwind is configured for `packages/web` (tailwind.config.cjs and postcss.config.cjs). Ensure dependencies are installed so directives like `@tailwind` and `@apply` are processed.
- The API can run in WEB3_MOCK mode (default) which fakes Soroban calls for fast local dev.

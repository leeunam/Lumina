# Deploy contracts locally

Prerequisites:

- `stellar` CLI installed (from cargo). Usually `~/.cargo/bin/stellar`.
- A funded account or secret key for signing transactions: set `SERVICE_SECRET_KEY` env var.
- RPC running or use Futurenet RPC URL.

Deploy financeiro:

1. Build the contrato wasm (already compiled in repo):
   cargo build -p financeiro --target wasm32v1-none --release

2. Deploy using the script:

```bash
# from repo root
SERVICE_SECRET_KEY="SC..." ./scripts/deploy_financeiro.sh
```

3. The deploy command saves an alias `financeiro` in the stellar config. You can also set `FINANCEIRO_ID=financeiro` in env to let the API use it.

Invoke functions with the `stellar` CLI:

```bash
# view fund balance (simulation)
~/.cargo/bin/stellar contract invoke --id financeiro --source-account "SC..." --rpc-url https://rpc-futurenet.stellar.org --network-passphrase "Future Network" -- get_fund_balance

# deposit
~/.cargo/bin/stellar contract invoke --id financeiro --source-account "SC..." --rpc-url https://rpc-futurenet.stellar.org --network-passphrase "Future Network" -- deposit --amount 1000
```

Notes:

- The API's `soroban.service.js` uses `SERVICE_SECRET_KEY` from env to sign CLI calls. Ensure it is set.
- For local testing, you can keep `ENV.WEB3_MOCK=1` to use mock flows.

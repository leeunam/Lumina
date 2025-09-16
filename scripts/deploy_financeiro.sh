#!/usr/bin/env bash
set -euo pipefail

WASM=contracts/financeiro/target/wasm32v1-none/release/financeiro.wasm
ALIAS=financeiro
SRC=${SERVICE_SECRET_KEY:-$1}
RPC=${RPC_URL:-https://rpc-futurenet.stellar.org}
NP=${NETWORK_PASSPHRASE:-Future Network ;}

if [ -z "$SRC" ]; then
  echo "Provide SERVICE_SECRET_KEY either as env or first arg"
  exit 1
fi

echo "Deploying $WASM as $ALIAS using source $SRC"
~/.cargo/bin/stellar contract deploy --wasm "$WASM" --source-account "$SRC" --rpc-url "$RPC" --network-passphrase "$NP" --alias "$ALIAS"

echo "Done. You can set FINANCEIRO_ID=financeiro to use the alias in the API." 

#!/usr/bin/env bash
set -euo pipefail

# --- util ---
say(){ printf "\n\033[1;32m[lumina]\033[0m %s\n" "$*"; }

ROOT="$(pwd)"
WEB="$ROOT/packages/web"

# 1) pacotes base (Ubuntu/WSL)
if command -v apt >/dev/null 2>&1; then
  say "apt update + ferramentas básicas"
  sudo apt update
  sudo apt -y install build-essential git curl ca-certificates pkg-config jq
fi

# 2) Node LTS + pnpm (via Corepack), só se faltarem
if ! command -v node >/dev/null 2>&1; then
  say "Instalando Node LTS via NVM"
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
  nvm install --lts && nvm use --lts
else
  say "Node já presente: $(node -v)"
fi

say "Habilitando Corepack + pnpm"
corepack enable
corepack prepare pnpm@latest --activate

# 3) Rust + alvo wasm + Soroban CLI
if ! command -v rustup >/dev/null 2>&1; then
  say "Instalando Rustup"
  curl https://sh.rustup.rs -sSf | sh -s -- -y
  source "$HOME/.cargo/env"
else
  source "$HOME/.cargo/env"
fi

say "Garantindo toolchain + alvo wasm32"
rustup default stable
rustup target add wasm32-unknown-unknown

if ! command -v soroban >/dev/null 2>&1; then
  say "Instalando Soroban CLI"
  cargo install --locked soroban-cli
else
  say "Soroban CLI presente: $(soroban --version || true)"
fi

# 4) pnpm workspace e deps do web
say "Configurando workspace pnpm"
cat > "$ROOT/pnpm-workspace.yaml" <<'YAML'
packages:
  - "packages/*"
YAML

say "Instalando dependências do front"
cd "$WEB"
pnpm add soroban-client @stellar/freighter-api

# .env mínimo (não sobrescreve se já existir)
[ -f .env ] || cat > .env <<'ENV'
VITE_SOROBAN_RPC_TESTNET=https://soroban-testnet.stellar.org
VITE_SOROBAN_RPC_MAINNET=https://soroban.stellar.org
# preencha depois com os IDs reais do contrato:
VITE_CONTRACT_LOYALTY_ID_TESTNET=
VITE_CONTRACT_LOYALTY_ID_MAINNET=
ENV

say "Feito! Para rodar o front:"
echo "  cd $WEB && pnpm dev"
echo "Abra http://localhost:5173 no navegador do Windows (com a extensão Freighter instalada)."

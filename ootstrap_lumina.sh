#!/usr/bin/env bash
set -euo pipefail

say(){ printf "\n\033[1;32m[lumina]\033[0m %s\n" "$*"; }
warn(){ printf "\n\033[1;33m[warn]\033[0m %s\n" "$*"; }
err(){ printf "\n\033[1;31m[err]\033[0m %s\n" "$*"; exit 1; }
need(){ command -v "$1" >/dev/null 2>&1; }

ROOT="$(pwd)"
WEB="$ROOT/packages/web"

# --- Preflight: WSL/Windows PATH guard ---
if grep -qi microsoft /proc/version 2>/dev/null; then
  if printf '%s' "$PATH" | grep -qi "/mnt/c/Program Files/nodejs"; then
    say "WSL detectado → removendo Node do Windows do PATH (evita EPERM no Corepack)…"
    export PATH=$(printf '%s' "$PATH" | tr ':' '\n' | grep -vi "/mnt/c/Program Files/nodejs" | paste -sd:)
  fi
fi

# --- Apt básicos (se houver) ---
if need apt; then
  say "apt update + ferramentas básicas"
  sudo apt update
  sudo apt -y install build-essential git curl ca-certificates pkg-config jq
fi

# --- Node LTS via NVM (se faltar) ---
if ! need node; then
  say "Instalando Node LTS via NVM"
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
  nvm install --lts
  nvm use --lts
else
  # garante NVM carregado se já existir
  [ -d "$HOME/.nvm" ] && { export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh" || true; }
  say "Node presente: $(node -v)"
fi

# --- pnpm via Corepack (com fallback) ---
say "Habilitando Corepack + pnpm"
if need corepack; then
  corepack enable || true
  corepack prepare pnpm@latest --activate || true
fi
if ! need pnpm; then
  warn "pnpm não encontrado após Corepack; instalando globalmente com npm…"
  npm i -g pnpm
fi
need pnpm || err "pnpm ainda indisponível"

say "pnpm: $(pnpm -v)"

# --- Rust + wasm + Soroban CLI ---
if ! need rustup; then
  say "Instalando Rustup"
  curl https://sh.rustup.rs -sSf | sh -s -- -y
fi
# carrega cargo no shell
[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"

say "Garantindo toolchain e alvo wasm32"
rustup default stable
rustup target add wasm32-unknown-unknown

if ! need soroban; then
  say "Instalando Soroban CLI"
  cargo install --locked soroban-cli
else
  say "Soroban CLI: $(soroban --version || true)"
fi

# --- Workspace pnpm ---
say "Configurando pnpm-workspace.yaml"
cat > "$ROOT/pnpm-workspace.yaml" <<'YAML'
packages:
  - "packages/*"
YAML

# --- Checagens de layout mínimo ---
[ -d "$WEB" ] || err "Pasta $WEB não existe. Crie packages/web antes ou ajuste o script."

# --- Dependências do front ---
say "Instalando dependências do front em packages/web"
cd "$WEB"
pnpm add soroban-client @stellar/freighter-api

# --- .env mínimo do web ---
if [ ! -f .env ]; then
  say "Criando .env mínimo do front"
  cat > .env <<'ENV'
VITE_SOROBAN_RPC_TESTNET=https://soroban-testnet.stellar.org
VITE_SOROBAN_RPC_MAINNET=https://soroban.stellar.org
# preencha abaixo após o deploy do contrato:
VITE_CONTRACT_LOYALTY_ID_TESTNET=
VITE_CONTRACT_LOYALTY_ID_MAINNET=
ENV
fi

# --- Lembrete do entrypoint (não sobrescreve seu HTML) ---
if ! grep -q '/src/app/main.js' index.html 2>/dev/null; then
  warn "Confira seu index.html → use <script type=\"module\" src=\"/src/app/main.js\"></script>"
fi

say "✅ Ambiente pronto."
echo "Para rodar o front:  cd \"$WEB\" && pnpm dev"
echo "Abra http://localhost:5173 no navegador do Windows (com a extensão Freighter instalada)."

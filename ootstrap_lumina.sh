#!/usr/bin/env bash
set -euo pipefail

say(){ printf "\n\033[1;32m[lumina]\033[0m %s\n" "$*"; }
warn(){ printf "\n\033[1;33m[warn]\033[0m %s\n" "$*"; }
err(){ printf "\n\033[1;31m[err]\033[0m %s\n" "$*"; exit 1; }
need(){ command -v "$1" >/dev/null 2>&1; }

ROOT="$(pwd)"
WEB="$ROOT/packages/web"

# --------------- SO/WSL & PATH SANITY ---------------
IS_WSL=0
if grep -qi microsoft /proc/version 2>/dev/null; then
  IS_WSL=1
fi

if [ "$IS_WSL" -eq 1 ]; then
  # Remove node/pnpm do Windows do PATH para evitar EPERM
  if printf '%s' "$PATH" | grep -qi "/mnt/c/Program Files/nodejs"; then
    say "WSL detectado → removendo Node do Windows do PATH (evita EPERM/Corepack)…"
    export PATH=$(printf '%s' "$PATH" | tr ':' '\n' | grep -vi "/mnt/c/Program Files/nodejs" | paste -sd:)
  fi
  if printf '%s' "$PATH" | grep -qi "/mnt/c/Users/.*/AppData/Roaming/npm"; then
    export PATH=$(printf '%s' "$PATH" | tr ':' '\n' | grep -vi "/mnt/c/Users/.*/AppData/Roaming/npm" | paste -sd:)
  fi
fi

# --------------- APT BÁSICOS (SE EXISTIR) ---------------
if need apt; then
  say "apt update + ferramentas básicas (idempotente)"
  sudo apt update
  sudo apt -y install build-essential git curl ca-certificates pkg-config jq
fi

# --------------- NODE + NVM (SÓ SE PRECISAR) ---------------
ensure_node_lts(){
  # Carrega NVM se já existir
  if [ -d "$HOME/.nvm" ] && [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    # shellcheck source=/dev/null
    . "$NVM_DIR/nvm.sh"
  fi

  local need_install=0
  if ! need node; then
    need_install=1
  else
    # Exige >= 18
    local MAJOR
    MAJOR="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)"
    if [ "${MAJOR:-0}" -lt 18 ]; then
      warn "Node < 18 detectado ($(node -v)); atualizando para LTS via NVM…"
      need_install=1
    fi
  fi

  if [ "$need_install" -eq 1 ]; then
    say "Instalando/Carregando NVM + Node LTS"
    if [ ! -d "$HOME/.nvm" ]; then
      curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    fi
    export NVM_DIR="$HOME/.nvm"
    # shellcheck source=/dev/null
    . "$NVM_DIR/nvm.sh"
    nvm install --lts
    nvm use --lts
  else
    say "Node presente: $(node -v)"
  fi

  # Garante corepack disponível (vem com Node recente)
  if need corepack; then
    corepack enable || true
  fi
}
ensure_node_lts

# --------------- PNPM VIA COREPACK (COM FALLBACK) ---------------
ensure_pnpm(){
  say "Verificando pnpm via Corepack"
  if need corepack; then
    # Ativa/atualiza pnpm; ignore erros se corepack já estiver ativo
    corepack enable || true
    corepack prepare pnpm@latest --activate || true
  fi

  # Evita apontar para binário do Windows em WSL
  if [ "$IS_WSL" -eq 1 ] && need pnpm; then
    if command -v pnpm | grep -qi "/mnt/c/"; then
      warn "pnpm aponta para Windows; removendo do PATH e reinstalando…"
      export PATH=$(printf '%s' "$PATH" | tr ':' '\n' | grep -vi "/mnt/c/" | paste -sd:)
      hash -r
    fi
  fi

  if ! need pnpm; then
    warn "pnpm não encontrado após Corepack; instalando globalmente com npm…"
    npm i -g pnpm
  fi

  need pnpm || err "pnpm ainda indisponível"
  say "pnpm: $(pnpm -v)"
}
ensure_pnpm

# --------------- RUSTUP/CARGO/ALVO WASM (SÓ SE PRECISAR) ---------------
ensure_rust(){
  if ! need rustup; then
    say "Instalando Rustup (não encontrado)"
    curl https://sh.rustup.rs -sSf | sh -s -- -y
  fi
  # shellcheck source=/dev/null
  [ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"

  say "Garantindo toolchain estável e alvo wasm32"
  rustup default stable >/dev/null 2>&1 || true
  rustup target add wasm32-unknown-unknown >/dev/null 2>&1 || true

  say "cargo: $(cargo --version 2>/dev/null || echo 'indisp.') | rustup: $(rustup --version 2>/dev/null || echo 'indisp.')"
}
ensure_rust

# --------------- SOROBAN CLI (SÓ SE PRECISAR) ---------------
ensure_soroban(){
  if ! need soroban; then
    say "Instalando Soroban CLI (ausente)"
    cargo install --locked soroban-cli
  else
    say "Soroban CLI presente: $(soroban --version || true)"
  fi
}
ensure_soroban

# --------------- PNPM WORKSPACE YAML (NÃO SOBRESCREVE) ---------------
say "Garantindo pnpm-workspace.yaml"
if [ ! -f "$ROOT/pnpm-workspace.yaml" ]; then
  cat > "$ROOT/pnpm-workspace.yaml" <<'YAML'
packages:
  - "packages/*"
YAML
else
  say "pnpm-workspace.yaml já existe — ok"
fi

# --------------- LAYOUT DO MONOREPO ---------------
[ -d "$WEB" ] || err "Pasta $WEB não existe. Crie packages/web antes ou ajuste o script."

# --------------- DEPENDÊNCIAS DO FRONT (SÓ SE FALTAR) ---------------
say "Verificando dependências do front em packages/web"
cd "$WEB"

if [ ! -f package.json ]; then
  err "package.json não encontrado em $WEB — inicialize seu front antes (ex.: Vite)."
fi

has_dep(){
  # Requer jq
  local name="$1"
  jq -e --arg n "$name" '
    ( .dependencies[$n] // .devDependencies[$n] // empty ) | length > 0
  ' package.json >/dev/null 2>&1
}

MISSING=()
for lib in soroban-client @stellar/freighter-api; do
  if ! has_dep "$lib"; then
    MISSING+=("$lib")
  fi
done

if [ "${#MISSING[@]}" -gt 0 ]; then
  say "Adicionando dependências ausentes: ${MISSING[*]}"
  pnpm add "${MISSING[@]}"
else
  say "Dependências já presentes — pulando pnpm add"
fi

# --------------- .ENV MÍNIMO (NÃO SOBRESCREVE) ---------------
if [ ! -f .env ]; then
  say "Criando .env mínimo do front"
  cat > .env <<'ENV'
VITE_SOROBAN_RPC_TESTNET=https://soroban-testnet.stellar.org
VITE_SOROBAN_RPC_MAINNET=https://soroban.stellar.org
# preencha abaixo após o deploy do contrato:
VITE_CONTRACT_LOYALTY_ID_TESTNET=
VITE_CONTRACT_LOYALTY_ID_MAINNET=
ENV
else
  say ".env já existe — ok"
fi

# --------------- LEMBRETE DO ENTRYPOINT (NÃO ALTERA HTML) ---------------
if [ -f index.html ] && ! grep -q '/src/app/main.js' index.html 2>/dev/null; then
  warn "Confira seu index.html → use <script type=\"module\" src=\"/src/app/main.js\"></script>"
fi

# --------------- RESUMO / DIAGNÓSTICO ---------------
say "Resumo do ambiente:"
echo "  node:     $(node -v 2>/dev/null || echo 'indisp.')"
echo "  corepack: $(corepack --version 2>/dev/null || echo 'indisp.')"
echo "  pnpm:     $(pnpm -v 2>/dev/null || echo 'indisp.')"
echo "  cargo:    $(cargo --version 2>/dev/null || echo 'indisp.')"
echo "  rustup:   $(rustup --version 2>/dev/null || echo 'indisp.')"
echo "  soroban:  $(soroban --version 2>/dev/null || echo 'indisp.')"

say "✅ Ambiente pronto."
echo "Para rodar o front:"
echo "  cd \"$WEB\" && pnpm dev"
echo "Abra http://localhost:5173 no navegador (instale a extensão Freighter)."

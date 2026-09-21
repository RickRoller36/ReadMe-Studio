#!/usr/bin/env bash
# Lanceur ReadMe Studio (Electron)
# Usage : ./lancer.sh
# Vérifie Node.js, l'installe si absent, puis lance l'app.
set -e
cd "$(dirname "$0")"
TAG="[ReadMe Studio]"

# Élévation : sudo en terminal, pkexec sinon (fenêtre graphique)
elevate() {
  if [ -t 0 ] && command -v sudo >/dev/null 2>&1; then
    sudo "$@"
  elif command -v pkexec >/dev/null 2>&1; then
    pkexec "$@"
  elif command -v sudo >/dev/null 2>&1; then
    sudo "$@"
  else
    echo "$TAG Pas d'élévation possible (ni sudo ni pkexec). Installe Node 20+ à la main : https://nodejs.org"
    exit 1
  fi
}

install_node() {
  echo "$TAG Node.js introuvable, installation automatique…"
  if command -v apt-get >/dev/null 2>&1; then
    elevate apt-get update && elevate apt-get install -y nodejs npm
  elif command -v dnf >/dev/null 2>&1; then
    elevate dnf install -y nodejs npm
  elif command -v pacman >/dev/null 2>&1; then
    elevate pacman -Sy --noconfirm nodejs npm
  else
    echo "$TAG Gestionnaire de paquets inconnu. Installe Node 20+ depuis https://nodejs.org puis relance."
    exit 1
  fi
  hash -r 2>/dev/null || true
}

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  install_node
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "$TAG Échec : Node.js toujours introuvable après installation."
  echo "$TAG Installe Node 20+ depuis https://nodejs.org puis relance."
  exit 1
fi

MAJOR="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)"
echo "$TAG Node : $(node --version) / npm : $(npm --version)"
if [ "$MAJOR" -lt 18 ]; then
  echo "$TAG Attention : Node 18+ recommandé, tu as la v$MAJOR. Si l'app ne démarre pas, installe Node 20+ depuis https://nodejs.org"
fi

if [ ! -d "node_modules/electron" ]; then
  echo "$TAG Installation des dépendances (une seule fois)…"
  npm install --no-audit --no-fund
fi

echo "$TAG Démarrage…"
if [ "$(uname)" = "Linux" ]; then
  npx electron --no-sandbox .
else
  npx electron .
fi

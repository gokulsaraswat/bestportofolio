#!/usr/bin/env bash
set -euo pipefail

OUTPUT_FILE=".project-architecture.md"
MANUAL_FILE=".project-architecture.manual.md"
GRAPH=$(mktemp); TREE=$(mktemp)
trap 'rm -f "$GRAPH" "$TREE"' EXIT

MAX_EDGES=${MAX_EDGES:-15}
EXCL='node_modules|target|dist|build|bin|out|.next|.git|.gradle|venv|.venv|vendor|__pycache__|(^|/)files(/|$)'

id() { printf '%s' "$1" | tr -c '[:alnum:]' '_' | cut -c1-48; }
edge() { printf '    %s\n' "$1" >> "$GRAPH"; }
node() { edge "$2 -->|$3| $(id "$1")[\"$1\"]"; }

if [[ "${1:-}" == "--install-hooks" ]]; then
  HOOKS=$(git rev-parse --git-path hooks 2>/dev/null) || { echo "not a git repo"; exit 1; }
  CFG=$(git config core.hooksPath || true)
  [[ -n "$CFG" ]] && HOOKS="$CFG" && echo "note: core.hooksPath=$CFG (husky/lefthook detected)"
  mkdir -p "$HOOKS"
  [[ -f "$HOOKS/pre-commit" ]] && cp "$HOOKS/pre-commit" "$HOOKS/pre-commit.bak.$(date +%s)" && echo "backed up existing pre-commit"
  cat > "$HOOKS/pre-commit" <<'HOOK'
#!/bin/sh
[ -x ./sync-architecture.sh ] || exit 0
./sync-architecture.sh >/dev/null || exit 0
git diff --quiet -- .project-architecture.md || git add .project-architecture.md
HOOK
  chmod +x "$HOOKS/pre-commit"; echo "installed $HOOKS/pre-commit"; exit 0
fi

echo "Scanning project topography..."

# ---------- Java / Spring ----------
if [[ -f pom.xml || -f build.gradle || -f build.gradle.kts ]]; then
  edge 'subgraph JavaLayer["Enterprise Service Layer (Java)"]'
  grep -rlE "@(RestController|RequestMapping)" --include='*.java' --exclude-dir={target,build} . 2>/dev/null \
    | sort -u | head -n "$MAX_EDGES" | while read -r f; do
      node "$(basename "$f" .java)" API_Gateway "Resolves Route"
    done || true
  grep -rh "@FeignClient" --include='*.java' --exclude-dir={target,build} . 2>/dev/null \
    | grep -oE 'name *= *"[^"]*"' | cut -d'"' -f2 | sort -u | head -n "$MAX_EDGES" | while read -r t; do
      edge "Service -->|SOLID-D Port| Remote_$(id "$t")[\"$t\"]"
    done || true
  edge 'end'
fi

# ---------- JS / TS ----------
if [[ -f package.json ]]; then
  edge 'subgraph FrontendLayer["Component & Router Architecture (JS/TS)"]'
  ENGINES=""
  for dep in framer-motion tailwindcss @radix-ui lucide-react next react vue svelte; do
    grep -qE "\"$dep[^\"]*\" *:" package.json && ENGINES="$ENGINES $dep" || true
  done
  edge 'App_Components["App Components"]'
  [[ -n "$ENGINES" ]] && edge "UI_Stack[\"Design System:$ENGINES\"] -.-> App_Components"
  find src app pages routes src/routes src/views -type f \( -name 'page.[tj]sx' -o -name 'route.[tj]s' -o -name 'App.[tj]sx' -o -name 'main.[tj]sx' -o -name '+page.svelte' \) 2>/dev/null \
    | grep -vE "$EXCL" | sort -u | head -n "$MAX_EDGES" | while read -r f; do
      r=$(dirname "$f" | sed -E 's|^(src/)?(app\|pages\|routes)/?||'); [[ -z "$r" || "$r" == "." ]] && r="/"
      edge "API_Gateway -->|Renders| Route_$(id "$r")[\"$r\"]"
    done || true
  grep -rEho "from ['\"](\./|\.\./|@/)[^'\"]+" src app components packages 2>/dev/null \
    | sed -E "s/from ['\"]//" | while read -r p; do
        t=$(basename "$p" | cut -d. -f1); [[ -n "$t" ]] && edge "App_Components -.->|imports| $(id "$t")[\"$t\"]"
      done | sort -u | head -n "$MAX_EDGES" >> "$GRAPH" || true
  edge 'end'
fi

# ---------- Python ----------
if [[ -f requirements.txt || -f pyproject.toml ]] || find . -name '*.py' -not -path '*/.*' -print -quit | grep -q .; then
  edge 'subgraph PyLayer["Python Backend Layer"]'
  grep -rlE "@(app|router|bp|blueprint)\.(get|post|put|patch|delete|route)|urlpatterns" \
    --include='*.py' --exclude-dir={venv,.venv,__pycache__,build} . 2>/dev/null \
    | sort -u | head -n "$MAX_EDGES" | while read -r f; do
      node "$(basename "$f" .py)" API_Gateway "Route"
    done || true
  edge 'end'
fi

# ---------- Go ----------
if [[ -f go.mod ]]; then
  edge 'subgraph GoLayer["Go Engine Layer"]'
  grep -rlE "http\.HandleFunc|\.(HandleFunc|Get|Post|Put|Delete)\(" --include='*.go' --exclude-dir=vendor . 2>/dev/null \
    | sort -u | head -n "$MAX_EDGES" | while read -r f; do
      node "$(basename "$f" .go)" API_Gateway "Route"
    done || true
  edge 'end'
fi

# ---------- Containers ----------
COMPOSE=$(ls docker-compose.yml docker-compose.yaml compose.yml compose.yaml 2>/dev/null | head -n1 || true)
if [[ -n "$COMPOSE" || -f Dockerfile ]]; then
  edge 'subgraph Infra["Container Infrastructure"]'
  if [[ -n "$COMPOSE" ]]; then
    awk '/^services:/{s=1;next} /^[^[:space:]#]/{s=0} s && /^  [A-Za-z0-9_.-]+:[[:space:]]*$/{gsub(/[: ]/,"");print}' "$COMPOSE" \
      | sort -u | head -n "$MAX_EDGES" | while read -r svc; do
        edge "Svc_$(id "$svc")[\"$svc\"]"
      done || true
  fi
  [[ -f Dockerfile ]] && edge 'Dockerfile_img["Dockerfile image"]'
  edge 'end'
fi

# ---------- Static HTML/JS (no backend/framework detected) ----------
if [[ -f index.html && ! -f package.json && ! -f pom.xml && ! -f build.gradle && ! -f go.mod ]]; then
  edge 'subgraph StaticLayer["Static Web Layer (Vanilla HTML/JS)"]'
  grep -ohE '<script[^>]*src="[^"]+"' index.html 2>/dev/null | grep -oE 'src="[^"]+"' | sed 's/src="//;s/"$//' \
    | sort -u | head -n "$MAX_EDGES" | while read -r src; do
      edge "index_html[\"index.html\"] -->|loads| $(id "$src")[\"$src\"]"
    done || true
  edge 'end'
fi

# ---------- Tree ----------
if command -v tree >/dev/null; then
  tree -d -L 3 --noreport -I 'node_modules|target|dist|build|.next|.gradle|bin|out|venv|.venv|__pycache__|files' > "$TREE"
else
  find . -maxdepth 3 -type d ! -path '*/.*' | grep -vE "$EXCL" | sort \
    | sed -e 's|[^/]*/| |g' -e 's|^\./||' > "$TREE"
fi

# ---------- Assemble ----------
{
  echo '# Codebase Blueprint & Structural Graph'
  echo
  echo '<!-- AUTO:BEGIN — regenerated by sync-architecture.sh. Do not edit. -->'
  echo '## 1. High-Level Design (HLD) Topology'
  echo '```mermaid'
  echo 'graph TD'
  grep -q 'API_Gateway' "$GRAPH" && echo '    Client["Consumer / Client"] -->|Egress| API_Gateway["Gateway / Routing Layer"]' || true
  cat "$GRAPH"
  echo '```'
  echo
  echo '## 2. Current Target Directory Tree'
  echo '```text'
  cat "$TREE"
  echo '```'
  echo '<!-- AUTO:END -->'
  echo
  echo '## 3. Low-Level Design (LLD) & SOLID Class Schemas'
  if [[ -f "$MANUAL_FILE" ]]; then cat "$MANUAL_FILE"; else
    printf -- '- **Primary Interfaces:**\n- **Cross-Service Communication:**\n- **Data Inversion Maps:**\n\n_Edit %s; it is preserved across regenerations._\n' "$MANUAL_FILE"
  fi
} > "$OUTPUT_FILE"

echo "Map generated: $OUTPUT_FILE ($(grep -c '' "$GRAPH") graph edges)"

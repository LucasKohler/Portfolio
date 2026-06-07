#!/usr/bin/env bash
# Corrige plan-broker unavailable no Grok Build (WSL).
set -euo pipefail

BROKER="/mnt/c/Users/lucas/mcp-servers/plan-broker"
PROJECT="/mnt/c/Users/lucas/My Documents/projects/Portfolio"
VENV_PYTHON="${BROKER}/.venv/bin/python"
LOG="/tmp/plan-broker-grok.log"

echo "=== Fix Grok MCP plan-broker ==="

# 1. venv + deps
if [[ ! -x "$VENV_PYTHON" ]]; then
  echo "Criando venv..."
  cd "$BROKER"
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
fi

# 2. testar import
export WORKSPACE_FOLDER="$PROJECT"
"$VENV_PYTHON" -c "from plan_broker import list_plans; print(list_plans())"

# 3. line endings nos scripts
sed -i 's/\r$//' "$BROKER"/run-broker.sh "$BROKER"/grok-mcp-debug.sh 2>/dev/null || true
chmod +x "$BROKER"/run-broker.sh "$BROKER"/grok-mcp-debug.sh 2>/dev/null || true

# 4. remover config quebrada do grok CLI (pode conflitar)
grok mcp remove plan-broker 2>/dev/null || true

# 5. adicionar com command + args separados (formato correto)
grok mcp add plan-broker \
  --command "$VENV_PYTHON" \
  --args "$BROKER/plan_broker.py" \
  --env "WORKSPACE_FOLDER=$PROJECT"

echo ""
echo "Config CLI:"
grok mcp list

echo ""
echo "Arquivos de projeto criados:"
echo "  $PROJECT/.mcp.json"
echo "  $PROJECT/.claude.json"
echo ""
echo "Próximo passo:"
echo "  1. Feche o Grok COMPLETAMENTE (quit)"
echo "  2. cd \"$PROJECT\" && grok"
echo "  3. /mcps  ou  MCP Servers → r (refresh)"
echo ""
echo "Se ainda unavailable, veja o log:"
echo "  grok mcp remove plan-broker"
echo "  grok mcp add plan-broker --command bash --args $BROKER/grok-mcp-debug.sh --env WORKSPACE_FOLDER=$PROJECT"
echo "  cat $LOG"

#!/bin/bash
# 가상 사무실 관련 프로그램을 모두 끕니다.
ROOT="$(cd "$(dirname "$0")" && pwd)"
export HOME="$ROOT/hermes-홈" HERMES_HOME="$ROOT/hermes-홈/hermes"
"$ROOT/hermes-홈/.local/bin/hermes" gateway stop 2>/dev/null
pkill -f "ollama serve" 2>/dev/null
pkill -f "tsx dev-server.ts" 2>/dev/null
echo "모두 껐습니다."

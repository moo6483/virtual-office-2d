#!/bin/bash
# 가상 사무실(2D 픽셀아트 + AI 직원) 한 번에 켜기. 모두 이 컴퓨터 안에서만 동작합니다.
#  1) Ollama(로컬 AI 모델)  2) Hermes(AI 직원 두뇌)  3) DeskRPG 2D 사무실(http://localhost:3000)
ROOT="$(cd "$(dirname "$0")" && pwd)"
export PATH="$ROOT/도구/node/bin:$PATH"

# 1) Ollama
if ! curl -s --max-time 2 http://127.0.0.1:11434/api/version >/dev/null; then
  ( cd "$ROOT/도구/ollama" && OLLAMA_HOST=127.0.0.1:11434 OLLAMA_MODELS="$ROOT/도구/ollama/models" nohup ./ollama serve > "$ROOT/도구/ollama-서버.log" 2>&1 & )
  sleep 4
fi

# 2) Hermes 게이트웨이 (설치 때 만든 가짜 홈 안에서만 동작)
if ! curl -s --max-time 2 -o /dev/null http://127.0.0.1:8642/health; then
  ( export HOME="$ROOT/hermes-홈" HERMES_HOME="$ROOT/hermes-홈/hermes"; nohup "$ROOT/hermes-홈/.local/bin/hermes" gateway > "$ROOT/hermes-게이트웨이.log" 2>&1 & )
  sleep 8
fi

# 3) 사무실
cd "$ROOT/deskrpg-2d" || exit 1
(sleep 8; open "http://localhost:3000") &
npm run dev

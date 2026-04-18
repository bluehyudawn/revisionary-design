#!/usr/bin/env bash
# Resume the Claude Code session for this Revisionary project.
# Usage: bash resume_claude.sh          # continue the most recent session
#        bash resume_claude.sh --pick   # show a picker of recent sessions
set -euo pipefail

PROJECT_DIR="/Users/alex/Library/Mobile Documents/com~apple~CloudDocs/Desktop/🍎Desktop/👾Revisionary👾"
cd "$PROJECT_DIR"

if [[ "${1:-}" == "--pick" ]]; then
  exec claude --resume
else
  exec claude --continue
fi

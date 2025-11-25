#!/usr/bin/env bash
set -euo pipefail

# Resolve repo root as the directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

QUESTIONS_DIR="./questions"
OUTPUT_DIR="${QUESTIONS_DIR}/machine-readable"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Check that the parser exists
if [[ ! -f "${SCRIPT_DIR}/markdown_parser.py" ]]; then
  echo "Error: markdown_parser.py not found in ${SCRIPT_DIR}" >&2
  exit 1
fi

# Run the parser on the whole questions directory
echo "Converting all markdown files in ${QUESTIONS_DIR} to JSON in ${OUTPUT_DIR}..."
python3 markdown_parser.py "$QUESTIONS_DIR" -o "$OUTPUT_DIR"

echo "Done."

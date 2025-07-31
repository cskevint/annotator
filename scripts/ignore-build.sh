#!/bin/bash

# Get the list of changed files
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD)

# Define files/patterns that should NOT trigger a build
IGNORE_PATTERNS=(
  "README.md"
  ".github/"
  "docs/"
  ".gitignore"
  "LICENSE"
  "*.md"
  ".vscode/"
  "scripts/"
)

# Check if any changed files are NOT in the ignore list
SHOULD_BUILD=false

for file in $CHANGED_FILES; do
  SHOULD_IGNORE=false
  
  for pattern in "${IGNORE_PATTERNS[@]}"; do
    if [[ $file == $pattern* ]] || [[ $file == *$pattern ]]; then
      SHOULD_IGNORE=true
      break
    fi
  done
  
  if [ "$SHOULD_IGNORE" = false ]; then
    SHOULD_BUILD=true
    break
  fi
done

if [ "$SHOULD_BUILD" = true ]; then
  echo "🚀 Building because source code changed"
  exit 1  # Exit 1 means "proceed with build"
else
  echo "⏭️  Skipping build - only documentation/config files changed"
  exit 0  # Exit 0 means "skip build"
fi

#!/bin/bash

PROMPTS_DIR="$HOME/.urai-prompts"
RELEASE_FILE="./RELEASE-PLAYBOOK.md"
REPO_OWNER="YourGitHubUsername"
REPO_NAME="YourRepoName"
WORKFLOW_FILE="urai-oneclick.yml"

if [[ ! -d "$PROMPTS_DIR" ]]; then
    echo "❌ Prompt directory not found: $PROMPTS_DIR"
    exit 1
fi

if [[ ! -f "$RELEASE_FILE" ]]; then
    echo "❌ Release checklist file not found: $RELEASE_FILE"
    exit 1
fi

echo "Select Launch Mode:"
echo "1) Full Launch Validation"
echo "2) Quick Launch"
echo "3) One‑Click Go‑Live"
echo "4) Day‑1 Monitoring Only"
read -p "Enter choice (1-4): " choice

case $choice in
    1) PROMPT_FILE="$PROMPTS_DIR/full.txt" ;;
    2) PROMPT_FILE="$PROMPTS_DIR/quick.txt" ;;
    3) PROMPT_FILE="$PROMPTS_DIR/oneclick.txt" ;;
    4) PROMPT_FILE="$PROMPTS_DIR/day1.txt" ;;
    *) echo "❌ Invalid choice"; exit 1 ;;
esac

# Detect OS and paste prompt

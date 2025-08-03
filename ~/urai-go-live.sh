#!/bin/bash

# ==== CONFIG ====
REPO_OWNER="YourGitHubUsername"
REPO_NAME="YourRepoName"
WORKFLOW_FILE="urai-oneclick.yml"
ENV_FILE="./.env.local"
REQUIRED_SECRETS=(
  FIREBASE_TOKEN
  FIREBASE_API_KEY
  FIREBASE_PROJECT_ID
  NEXT_PUBLIC_API_URL
  OPENAI_API_KEY
  REPLICATE_API_KEY
  GEMINI_API_KEY
  GOOGLE_API_KEY
  STRIPE_API_KEY
  VERCEL_TEAM_ID
  VERCEL_PROJECT_NAME
)
OPTIONAL_SECRETS=(
  AI_GATEWAY_API_KEY
  WEBHOOK_SIGNING_KEY
  VENICE_API_KEY
)

# ==== CHECK TOKEN ====
if [[ -z "$GITHUB_TOKEN" ]]; then
    echo "❌ ERROR: Please export your GitHub token first:"
    echo "export GITHUB_TOKEN='ghp_xxxYourTokenxxx'"
    exit 1
fi

# ==== LOAD ENV VALUES ====
if [[ -f "$ENV_FILE" ]]; then
    echo "📄 Loading keys from $ENV_FILE..."
    set -a
    source "$ENV_FILE"
    set +a
else
    echo "⚠ No $ENV_FILE found — will prompt for missing values."
fi

# ==== FUNCTION: SET SECRET ====
set_secret() {
    local name="$1"
    local value="$2"
    if [[ -z "$value" ]]; then
        read -p "Enter value for $name: " value
    fi
    echo "🔑 Setting $name..."
    gh secret set "$name" -b"$value" -R "$REPO_OWNER/$REPO_NAME"
}

# ==== CHECK & SET REQUIRED SECRETS ====
echo "🔍 Checking required secrets..."
for secret in "${REQUIRED_SECRETS[@]}"; do
    if gh secret list -R "$REPO_OWNER/$REPO_NAME" | grep -q "^$secret"; then
        echo "✅ $secret already set."
    else
        echo "❌ $secret missing."
        value=$(printenv "$secret")
        set_secret "$secret" "$value"
    fi
done

# ==== OPTIONAL SECRETS ====
for secret in "${OPTIONAL_SECRETS[@]}"; do
    if gh secret list -R "$REPO_OWNER/$REPO_NAME" | grep -q "^$secret"; then
        echo "ℹ️  $secret already set (optional)."
    else
        value=$(printenv "$secret")
        if [[ -n "$value" ]]; then
            set_secret "$secret" "$value"
        fi
    fi
done

# ==== TRIGGER WORKFLOW ====
echo "🚀 Triggering One‑Click Go‑Live workflow..."
RUN_ID=$(curl -s -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/workflows/$WORKFLOW_FILE/dispatches" \
    -d '{"ref":"main"}' && \
    sleep 10 && \
    curl -s \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs?branch=main&event=workflow_dispatch" \
    | grep -m 1 '"id":' | sed 's/[^0-9]//g')

if [[ -z "$RUN_ID" ]]; then
    echo "❌ Could not get workflow run ID."
    exit 1
fi

echo "📡 Monitoring run ID: $RUN_ID"

# ==== MONITOR WORKFLOW ====
while true; do
    STATUS=$(curl -s \
        -H "Authorization: Bearer $GITHUB_TOKEN" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs/$RUN_ID" \
        | grep '"status":' | head -n 1 | cut -d '"' -f4)

    CONCLUSION=$(curl -s \
        -H "Authorization: Bearer $GITHUB_TOKEN" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs/$RUN_ID" \
        | grep '"conclusion":' | head -n 1 | cut -d '"' -f4)

    if [[ "$STATUS" == "completed" ]]; then
        if [[ "$CONCLUSION" == "success" ]]; then
            echo "✅ Deploy Successful!"
        else
            echo "❌ Deploy Failed! Fetching last 50 log lines..."
            curl -s \
                -H "Authorization: Bearer $GITHUB_TOKEN" \
                "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/actions/runs/$RUN_ID/logs" \
                | tail -n 50
        fi
        break
    else
        echo "⏳ Workflow still running... checking again in 30s."
        sleep 30
    fi
done

# UrAi QA Pack

This pack includes:
- UrAi_QA_Runbook.csv — import to Google Sheets and track Pass/Fail
- env.local.template — copy to `.env.local` and fill values
- QA_Mode_Script.sh — run locally for quick checks

## Usage
1. Copy files into your repo root.
2. Create `.env.local` from `env.local.template` and fill Firebase values.
3. Run QA script:
   chmod +x QA_Mode_Script.sh
   ./QA_Mode_Script.sh
4. Import CSV into Google Sheets for QA tracking.

Notes:
- FCM test requires `serviceAccount.json` + `FCM_TOKEN`.
- Lighthouse requires `npm i -g lighthouse`.
- App Check must be enforced in Firebase Console.

# Strike Plan Automation

Automates syncing of your Master Strike Plan (`assets/cockpit.csv`) with GitHub issues, assignments, notifications, checklists, and asset/documentation linking.

## Features

- Hourly and manual auto-sync between Cockpit CSV and GitHub issues
- Owner assignment, status (open/close), and blocker notification
- Asset & documentation links auto-injected into issue body
- Checklist syncing (CSV column → GitHub issue task list)
- Advanced notifications for blockers, asset verification, QA status
- Modular Python scripts for easy expansion (Slack/email/webhook, sub-task creation, CI/QA, etc.)

## Setup

1. Place your CSV at `assets/cockpit.csv`, or update the script paths.
2. Add GitHub usernames to CSV for auto-assignment.
3. Push these files to your repo.
4. The workflow runs hourly or can be triggered manually in the Actions tab.

## Customization

- Extend Python scripts for Slack/email/webhook notifications.
- Add more columns to CSV and handle them in scripts.
- Adjust workflow schedule or add more triggers as needed.

---

**Need help with integrations or further expansion?**  
Just ask for Slack/email/webhook extras or custom features!
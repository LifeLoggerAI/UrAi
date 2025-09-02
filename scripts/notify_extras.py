import csv
import os
from github import Github

REPO_NAME = "LifeLoggerAI/UrAi"
COCKPIT_PATH = "assets/cockpit.csv"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def notify_extras():
    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(REPO_NAME)

    with open(COCKPIT_PATH) as f:
        reader = csv.DictReader(f)
        for row in reader:
            module = row.get("Module")
            blocker = row.get("Blocker")
            asset_status = row.get("Asset Verified")
            qa_status = row.get("QA")
            issue_title = f"{module} Module"

            issues = repo.get_issues(state="open")
            for issue in issues:
                if issue.title == issue_title:
                    # Blocker notification
                    if blocker and blocker.lower() not in ["none", ""]:
                        issue.create_comment(f"🚨 Blocker reported in Cockpit CSV: {blocker}")
                    # Asset verification notification
                    if asset_status and asset_status.lower() in ["no", "pending"]:
                        issue.create_comment("⚠️ Asset verification incomplete or pending.")
                    elif asset_status and asset_status.lower() == "yes":
                        issue.create_comment("✅ Asset verified.")
                    # QA notification
                    if qa_status and qa_status.lower() in ["fail", "failed"]:
                        issue.create_comment("❌ QA failed.")
                    elif qa_status and qa_status.lower() in ["pass", "passed", "ok"]:
                        issue.create_comment("✔️ QA passed.")

if __name__ == "__main__":
    notify_extras()
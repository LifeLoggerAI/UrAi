import csv
import os
from github import Github

REPO_NAME = "LifeLoggerAI/UrAi"
COCKPIT_PATH = "assets/cockpit.csv"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def format_checklist(checklist_str):
    if not checklist_str:
        return ""
    items = [item.strip() for item in checklist_str.split(';') if item.strip()]
    return "\n".join([f"- [ ] {item}" for item in items])

def sync_issues_from_cockpit():
    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(REPO_NAME)

    with open(COCKPIT_PATH) as f:
        reader = csv.DictReader(f)
        for row in reader:
            module = row.get("Module")
            owner = row.get("Owner")
            status = row.get("Done")
            docs = row.get("Docs")
            assets = row.get("Assets")
            checklist = row.get("Checklist")
            issue_title = f"{module} Module"

            # Find issue by title
            issues = repo.get_issues(state="open")
            for issue in issues:
                if issue.title == issue_title:
                    body = issue.body or ""
                    # Asset & doc linking
                    extras = []
                    if docs:
                        extras.append(f"**Documentation:** {docs}")
                    if assets:
                        extras.append(f"**Assets:** {assets}")
                    if checklist:
                        extras.append("**Checklist:**\n" + format_checklist(checklist))
                    if extras:
                        body_lines = body.split("\n")
                        # Remove previous extras if present
                        body_lines = [line for line in body_lines if not line.startswith("**Documentation:**") and not line.startswith("**Assets:**") and not line.startswith("**Checklist:**")]
                        body = "\n".join(body_lines + ["\n---\n"] + extras)
                        issue.edit(body=body)

                    # Assign owner
                    if owner and owner not in [a.login for a in issue.assignees]:
                        try:
                            issue.add_to_assignees(owner)
                        except Exception as e:
                            print(f"Failed to assign {owner}: {e}")
                    # Update status
                    if status and status.lower() == "yes":
                        issue.edit(state="closed")
                    elif status and status.lower() == "no":
                        issue.edit(state="open")

if __name__ == "__main__":
    sync_issues_from_cockpit()
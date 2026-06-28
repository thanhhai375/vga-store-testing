# Jira CI Automation Fields

GitHub Actions se tao hoac cap nhat sub-task Jira khi CI fail. Workflow set duoc cac field sau:

- Parent task: lay tu ma `KCPM-xx` trong branch, commit message hoac PR.
- Issue Type: `Sub-task` mac dinh, co the doi bang secret `JIRA_FAILURE_ISSUE_TYPE`.
- Priority: `High` mac dinh, co the doi bang secret `JIRA_DEFAULT_PRIORITY`.
- Labels: `ci-fail`, `github-actions`, `automation-test`, `blackbox`, `auth`, `newman`.
- Assignee: tu dong gan theo email commit neu Jira tim duoc user.
- Summary, Description, Comment log loi CI.

Nhung field nen cau hinh bang Jira Automation:

- Sprint.
- Epic.
- Components.
- Story points.
- Fix version.

Ly do: cac field nay thuong la custom field rieng cua tung Jira site, vi du `customfield_10020`, nen workflow khong nen doan cung.

## Jira Automation Rule De Xuat

Tao rule trong Jira project `KCPM`:

1. Trigger: `Issue created`.
2. Condition: `Labels contains ci-fail`.
3. Actions:
   - Set Priority = `High`.
   - Copy Sprint from Parent.
   - Copy Epic from Parent neu project co dung Epic.
   - Assign issue = Parent assignee neu chua co assignee.
   - Add labels: `automation-test`, `blackbox`, `auth`.

## GitHub Secrets Can Co

Bat buoc:

```text
JIRA_BASE_URL
JIRA_EMAIL
JIRA_API_TOKEN
JIRA_PROJECT_KEY
```

Tuy chon:

```text
JIRA_FAILURE_ISSUE_TYPE
JIRA_DEFAULT_PRIORITY
```

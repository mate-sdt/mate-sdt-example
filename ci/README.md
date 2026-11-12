# 🧉 CI/CD Automation (GitHub Actions)

This directory contains the reference CI/CD workflow template for the M.A.T.E. Quality Gate:

* [mate-qa.yml](./mate-qa.yml): Runs specification validation (`npx mate-sdt validate`), codebase health audit (`npx mate-sdt audit`), installs Playwright, executes the `@smoke` and `@api` suites, and uploads forensic test artifacts.

### To Activate in GitHub Actions
Copy `mate-qa.yml` into `.github/workflows/`:
```bash
mkdir -p .github/workflows
cp ci/mate-qa.yml .github/workflows/mate-qa.yml
git add .github/workflows/mate-qa.yml
git commit -m "ci: enable M.A.T.E. GitHub Actions workflow"
git push origin main
```
*(Note: Requires a GitHub Personal Access Token or SSH key with the `workflow` scope).*

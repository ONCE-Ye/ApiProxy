---
name: update-github-pages-site
description: Use when updating this ApiProxy website through GitHub and GitHub Pages, especially after changing agent/provider data, README, static assets, or deployment configuration. Remembers the live site URL and the repository-specific validation, commit, push, and Pages deployment workflow.
---

# Update GitHub Pages Site

Use this skill for this repository when the user asks to update the public website, add or revise agent/provider entries, publish changes, or check whether GitHub Pages has deployed the latest commit.

## Project Facts

- Repository: `ONCE-Ye/ApiProxy`
- Remote: `git@github.com:ONCE-Ye/ApiProxy.git`
- Live website: `https://ONCE-Ye.github.io/ApiProxy/`
- GitHub Pages base path: `/ApiProxy`
- Pages workflow: `.github/workflows/pages.yml`
- Public directory data:
  - Agents: `data/agents.ts`
  - Multi-agent API providers and relays: `data/providers.ts`
- Provider data rule: only include public multi-agent API providers that support at least two agent/model APIs. Keep pure relay providers marked with `isPureRelay: true`.

## Standard Update Workflow

1. Inspect current state:
   - `git status --short`
   - Read the relevant data file and tests before editing.
   - Preserve existing user-added entries unless the user explicitly asks to remove or merge them.

2. Verify sources before changing data:
   - For current links or third-party directories, browse or `curl` the official/public source.
   - Check each candidate website or docs URL with HTTP status where possible.
   - Prefer `consoleUrl` for website/dashboard buttons.
   - Use `docsUrl` only for real documentation; do not duplicate a dashboard URL into `docsUrl`.
   - Update `lastVerified` to the actual verification date.

3. Edit data and tests:
   - Add or update records in `data/providers.ts` or `data/agents.ts`.
   - Update focused tests in `lib/providers.test.ts`, `lib/agents.test.ts`, or related component tests.
   - Keep notes concise and explicit about source limitations.

4. Validate locally:
   - `npm test`
   - `npm run lint`
   - Stop any running dev server before production builds.
   - `npm run build`
   - `npm run build:pages`

5. Review the diff:
   - `git diff --check`
   - `git diff --stat`
   - Confirm only expected files changed.

6. Publish through GitHub:
   - `git add <changed-files>`
   - `git commit -m "<short imperative summary>"`
   - `git push origin main`

7. Check deployment:
   - Query the latest workflow run:
     `curl https://api.github.com/repos/ONCE-Ye/ApiProxy/actions/runs`
   - For a specific run:
     `curl https://api.github.com/repos/ONCE-Ye/ApiProxy/actions/runs/<run-id>`
   - If the workflow is still `in_progress`, inspect jobs:
     `curl https://api.github.com/repos/ONCE-Ye/ApiProxy/actions/runs/<run-id>/jobs`
   - Build success with queued deploy usually means GitHub Pages is waiting on its deploy job.

8. Verify the public site after deployment:
   - `curl -I https://ONCE-Ye.github.io/ApiProxy/`
   - Optionally check a changed detail route, for example:
     `curl -I https://ONCE-Ye.github.io/ApiProxy/providers/<slug>/`

## Notes

- Do not commit local screenshots such as `001.png`, `002.png`, or `003.png` unless the user asks.
- `.annotations/` is intentionally ignored and should stay uncommitted.
- If a candidate link only points to an intermediate referral page and the final target cannot be resolved or accessed, do not add it as verified.
- If GitHub Pages is live but stale, wait for the latest workflow's deploy job to complete before declaring the public site updated.

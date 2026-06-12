# Repository Guidelines

## Project Structure & Module Organization
This repository is a small Next.js 14 app for browsing verified agent access channels. Route files live in `app/`, including the index page, dynamic detail pages at `app/agents/[slug]/page.tsx` and `app/providers/[slug]/page.tsx`, JSON endpoints at `app/api/agents/route.ts` and `app/api/providers/route.ts`, and the local annotation endpoint at `app/api/annotations/route.ts`. Reusable UI lives in `components/`. Static data definitions live in `data/`, and filtering or lookup helpers live in `lib/`. Public assets belong in `public/`, with the current sprite sheet at `public/agent-icons/agent-icon-set.png`.

## Build, Test, and Development Commands
Use the scripts already defined in `package.json`:

- `npm run dev` starts the local Next.js dev server.
- `npm run build` builds the production bundle and catches route/runtime issues.
- `npm run lint` runs the Next.js ESLint config.
- `npm test` runs the Vitest suite once.

Run these from the repository root.

During interactive UI work, the shared dev URL is usually started with:

- `npm run dev -- -H 0.0.0.0 -p 3004`

Do not run `npm run build` while the dev server is still running. The `.next` development cache and production build output can conflict, causing missing chunks or temporary API 404s. Stop the dev server before production builds; if the browser UI or `/api/annotations` breaks after a build, remove `.next` and restart the dev server.

## Coding Style & Naming Conventions
The codebase uses TypeScript, React function components, and Tailwind utility classes. Follow the existing style: double quotes, semicolons omitted only where the file already omits them, and 2-space indentation in JSON, 2-space to 4-space equivalent formatting in TS/TSX as enforced by the current files. Use `PascalCase` for React components, `camelCase` for helpers, and kebab-free slugs such as `codex` or `deepseek` for `AgentProfile.slug`. Keep display copy and verified channel metadata in `data/agents.ts`.

## Testing Guidelines
Vitest is the test runner, with Testing Library for UI coverage. Keep component tests beside the component, for example `components/agent-directory.test.tsx`, and helper tests in `lib/*.test.ts`. Add or update tests when changing filtering, route data, or rendered channel states. Run `npm test` before submitting changes. For route or static-generation changes, stop the dev server first, then run `npm run build` as the final integration check.

## Commit & Pull Request Guidelines
Git history is not available in this workspace snapshot, so follow a conservative convention: short imperative commit subjects such as `Add agent filter coverage` or `Update Codex metadata`. Keep commits focused. PRs should include a clear summary, note any data-source verification changes, link related issues when present, and attach screenshots for UI changes affecting the directory or detail pages.

## Security & Data Notes
Do not mix official login URLs with API endpoints. When editing `data/agents.ts`, preserve the separation between `officialLogin`, `officialApi`, and `thirdPartyApis`, and update `lastVerified` when metadata is re-checked.

For `data/providers.ts`, keep the multi-agent API directory separate from official agent records. Providers must support at least two agent APIs to appear in the public multi-agent API directory. `isPureRelay` remains part of the data model for sorting and logic: pure relay providers are shown after non-relay providers, and the UI only renders the visible `中转站` badge for pure relays. Use `consoleUrl` as the source for the `网站地址` button and `docsUrl` only for real documentation; never duplicate a website/dashboard URL into `docsUrl` just to render a docs button.

Local browser annotations are stored in `.annotations/page-notes.json`. The `.annotations/` directory is intentionally ignored by git and should not be committed.

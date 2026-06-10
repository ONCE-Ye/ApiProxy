# Repository Guidelines

## Project Structure & Module Organization
This repository is a small Next.js 14 app for browsing verified agent access channels. Route files live in `app/`, including the index page, the dynamic detail page at `app/agents/[slug]/page.tsx`, and the JSON endpoint at `app/api/agents/route.ts`. Reusable UI lives in `components/`. Static data definitions live in `data/`, and filtering or lookup helpers live in `lib/`. Public assets belong in `public/`, with the current sprite sheet at `public/agent-icons/agent-icon-set.png`.

## Build, Test, and Development Commands
Use the scripts already defined in `package.json`:

- `npm run dev` starts the local Next.js dev server.
- `npm run build` builds the production bundle and catches route/runtime issues.
- `npm run lint` runs the Next.js ESLint config.
- `npm test` runs the Vitest suite once.

Run these from the repository root.

## Coding Style & Naming Conventions
The codebase uses TypeScript, React function components, and Tailwind utility classes. Follow the existing style: double quotes, semicolons omitted only where the file already omits them, and 2-space indentation in JSON, 2-space to 4-space equivalent formatting in TS/TSX as enforced by the current files. Use `PascalCase` for React components, `camelCase` for helpers, and kebab-free slugs such as `codex` or `deepseek` for `AgentProfile.slug`. Keep display copy and verified channel metadata in `data/agents.ts`.

## Testing Guidelines
Vitest is the test runner, with Testing Library for UI coverage. Keep component tests beside the component, for example `components/agent-directory.test.tsx`, and helper tests in `lib/*.test.ts`. Add or update tests when changing filtering, route data, or rendered channel states. Run `npm test` before submitting changes; run `npm run build` as a final integration check for route changes.

## Commit & Pull Request Guidelines
Git history is not available in this workspace snapshot, so follow a conservative convention: short imperative commit subjects such as `Add agent filter coverage` or `Update Codex metadata`. Keep commits focused. PRs should include a clear summary, note any data-source verification changes, link related issues when present, and attach screenshots for UI changes affecting the directory or detail pages.

## Security & Data Notes
Do not mix official login URLs with API endpoints. When editing `data/agents.ts`, preserve the separation between `officialLogin`, `officialApi`, and `thirdPartyApis`, and update `lastVerified` when metadata is re-checked.

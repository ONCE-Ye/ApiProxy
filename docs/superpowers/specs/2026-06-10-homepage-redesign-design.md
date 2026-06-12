# Homepage Redesign Design

> Status update: this design has been implemented and then evolved. The current product language is `智能体` / `多智能体 API`, not `第三方供应商`. The app also includes a browser annotation workflow backed by `app/api/annotations/route.ts` and local `.annotations/page-notes.json`.

## Goal

Refine the homepage into a high-efficiency directory with light console polish. The page should help users quickly search, filter, compare, and open either official agent information or multi-agent API provider information without reading through oversized cards or marketing-style sections.

## Chosen Direction

- Primary direction: directory-first homepage
- Secondary influence: light product-console feel
- Density: medium
- Preserve dual views: `智能体` and `多智能体 API`

## Information Architecture

### Header Work Area

Replace the current hero-style top section with a compact work area that contains:

- site name and one-line explanation
- segmented view switch
- search input
- filter controls
- summary metrics

The first viewport must immediately expose search and browsing controls.

### Main Results Area

Keep a two-column layout on desktop:

- main column for result cards
- right column for supporting utility panels

On smaller screens, collapse to a single column with controls stacked before results.

## Visual Language

- shallow background contrast
- low border radius
- thin borders
- restrained shadows
- denser spacing than the current design

The page should feel closer to a professional API directory than a landing page. Console influence should appear in grouped containers, control styling, and metric presentation, not in heavy dark sidebars or dashboard chrome.

## Card Design

### Agent Cards

Agent cards should prioritize:

1. agent name and vendor
2. short summary
3. official availability signals
4. direct actions

Each card should clearly separate:

- 官方登录
- 官方 API

Multi-agent API provider information must stay out of agent cards.

### Provider Cards

Provider cards should prioritize:

1. provider name and region
2. short summary
3. supported agent APIs
4. website and documentation links

Supported agent APIs should be shown as compact badges for fast scanning. Pure relay providers keep the internal `isPureRelay` logic and render the visible `中转站` badge; non-relay providers do not render a visible badge.

## Supporting Panels

The right column should remain useful rather than descriptive-only. It should include compact utility modules such as:

- directory rules
- coverage summary
- quick comparison table

These panels support decision-making but must not visually dominate the results list.

## Interaction Rules

- Search and filters share one control band.
- Switching between `智能体` and `多智能体 API` keeps the interaction model consistent.
- Empty results must show a clear no-match state.
- Tags, badges, and buttons must wrap cleanly without stretching cards.
- Mobile layout must preserve control order and card readability.
- Card action buttons (`登录`, `官方 API`, `网站地址`, `文档`) should align to the lower-left action area.
- The search/filter panel and stats panel should align in height.

## Scope

### In Scope

- homepage directory layout
- homepage component styling and spacing
- improved card structure for both views
- utility sidebar refinement
- browser annotation mode and local annotation API
- visual consistency touch-ups on detail pages if needed

### Out of Scope

- data model changes
- route changes
- remote backend behavior
- full detail-page information architecture rewrite

## Verification

Before completion:

- run unit tests
- run lint
- run production build only after stopping the dev server
- verify homepage layout in browser at desktop and mobile widths

## Constraints and Notes

- Keep the current data split between official agents and multi-agent API providers.
- Do not reintroduce provider information into official agent records.
- Local annotations live under `.annotations/` and are ignored by git.
- Avoid running `npm run build` while `npm run dev` is active; clear `.next` and restart dev if chunks or annotation API routes break.

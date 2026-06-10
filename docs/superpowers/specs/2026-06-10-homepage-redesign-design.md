# Homepage Redesign Design

## Goal

Refine the homepage into a high-efficiency directory with light console polish. The page should help users quickly search, filter, compare, and open either official agent information or third-party provider information without reading through oversized cards or marketing-style sections.

## Chosen Direction

- Primary direction: directory-first homepage
- Secondary influence: light product-console feel
- Density: medium
- Preserve dual views: `智能体` and `第三方供应商`

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

Third-party provider information must stay out of agent cards.

### Provider Cards

Provider cards should prioritize:

1. provider name and region
2. short summary
3. supported agents
4. docs and console links

Supported agents should be shown as compact badges for fast scanning.

## Supporting Panels

The right column should remain useful rather than descriptive-only. It should include compact utility modules such as:

- directory rules
- coverage summary
- quick comparison table

These panels support decision-making but must not visually dominate the results list.

## Interaction Rules

- Search and filters share one control band.
- Switching between `智能体` and `第三方供应商` keeps the interaction model consistent.
- Empty results must show a clear no-match state.
- Tags, badges, and buttons must wrap cleanly without stretching cards.
- Mobile layout must preserve control order and card readability.

## Scope

### In Scope

- homepage directory layout
- homepage component styling and spacing
- improved card structure for both views
- utility sidebar refinement
- visual consistency touch-ups on detail pages if needed

### Out of Scope

- data model changes
- route changes
- new backend behavior
- full detail-page information architecture rewrite

## Verification

Before completion:

- run unit tests
- run production build
- verify homepage layout in browser at desktop and mobile widths

## Constraints and Notes

- Keep the current data split between official agents and third-party providers.
- Do not reintroduce provider information into official agent records.
- The repository currently has no `.git` directory, so this spec cannot be committed in the current workspace state.

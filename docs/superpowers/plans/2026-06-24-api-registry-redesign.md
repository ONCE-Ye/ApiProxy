# API Registry Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the API registry workflow and visual design while keeping the app focused on verified official channels and multi-agent API providers.

**Architecture:** Keep the existing Next.js app structure and the single `AgentDirectory` client component. Update behavior tests first, then reshape the component markup/classes and align agent/provider detail pages with the same visual language.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Testing Library, Vitest.

---

### Task 1: Directory Behavior Tests

**Files:**
- Modify: `components/agent-directory.test.tsx`
- Modify: `components/agent-directory.tsx`

- [ ] Add failing tests for official login/API filters, search reset on view switch, clickable title detail links, visible search summary with clear action, and `aria-pressed` on annotation mode.
- [ ] Run `npm test -- components/agent-directory.test.tsx` and confirm the new expectations fail before implementation.
- [ ] Implement the missing behavior in `AgentDirectory`.
- [ ] Re-run `npm test -- components/agent-directory.test.tsx` and confirm the suite passes.

### Task 2: Directory Visual Redesign

**Files:**
- Modify: `components/agent-directory.tsx`
- Modify: `components/agent-directory.test.tsx`
- Modify: `app/globals.css`

- [ ] Update tests that intentionally assert high-level shell/search/card classes to match the new workbench design.
- [ ] Rework the directory shell into a compact verified-registry workbench with restrained colors, stronger information hierarchy, clearer filter controls, and lower-priority annotation controls.
- [ ] Ensure cards remain stable in desktop and mobile layouts and do not hide primary actions.
- [ ] Run `npm test -- components/agent-directory.test.tsx`.

### Task 3: Detail Page Visual Alignment

**Files:**
- Modify: `app/agents/[slug]/page.tsx`
- Modify: `app/providers/[slug]/page.tsx`

- [ ] Align both detail pages with the redesigned directory palette, border style, and compact panel treatment.
- [ ] Keep official links and provider documentation semantics unchanged.
- [ ] Run `npm test`.

### Task 4: Verification

**Files:**
- No source changes expected.

- [ ] Run `npm run lint`.
- [ ] Run `npm run build` after ensuring the dev server is stopped.
- [ ] Start the dev server and run a local browser screenshot check for desktop and mobile views.
- [ ] Stop the dev server.

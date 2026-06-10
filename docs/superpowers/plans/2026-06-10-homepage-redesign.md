# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage directory UI into a denser, cleaner directory-first experience with light console polish while preserving the current data model and routes.

**Architecture:** Keep the existing route structure and `AgentDirectory` as the main composition point, but tighten the homepage layout, card hierarchy, and sidebar utilities inside the current component boundary. Use test-first changes to lock in the new visible structure and interaction cues before refactoring styles and detail-page consistency.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, Testing Library

---

## File Map

- Modify: `components/agent-directory.tsx` — homepage directory layout, cards, utility panels, empty state
- Modify: `components/agent-directory.test.tsx` — homepage UI behavior and content assertions
- Modify: `app/agents/[slug]/page.tsx` — align detail-page visual tone if needed
- Modify: `app/providers/[slug]/page.tsx` — align detail-page visual tone if needed
- Modify: `app/globals.css` — shared visual refinements only if component-local utilities are insufficient

### Task 1: Lock the homepage structure with failing tests

**Files:**
- Modify: `components/agent-directory.test.tsx`
- Test: `components/agent-directory.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("renders a compact directory workspace with utility sidebar content", () => {
  render(<AgentDirectory agents={agents} providers={providers} />);

  expect(screen.getByRole("heading", { name: "API 供应导航" })).toBeInTheDocument();
  expect(screen.getByText("官方入口与第三方 API 供应关系分开整理")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "智能体" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "第三方供应商" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "目录规则" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "快速对比" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/agent-directory.test.tsx`
Expected: FAIL because the heading structure and utility panel wording no longer match the old implementation.

- [ ] **Step 3: Write minimal implementation**

Update `components/agent-directory.tsx` so the top section remains present but is restructured as a compact workspace header with preserved labels:

```tsx
<section className="border-b border-slate-200 bg-slate-50">
  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-teal-700">官方入口与第三方 API 供应关系分开整理</p>
          <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">API 供应导航</h1>
        </div>
        {/* segmented switch + controls */}
      </div>
      <div className="grid grid-cols-3 gap-3 rounded-lg border border-slate-200 bg-white p-3">
        {/* stats */}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/agent-directory.test.tsx`
Expected: PASS for the new header/sidebar structure assertions.

### Task 2: Add tests for denser agent and provider cards

**Files:**
- Modify: `components/agent-directory.test.tsx`
- Test: `components/agent-directory.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("keeps official and provider information separated in their respective cards", async () => {
  render(<AgentDirectory agents={agents} providers={providers} />);

  expect(screen.getByText("官方登录")).toBeInTheDocument();
  expect(screen.getByText("官方 API")).toBeInTheDocument();
  expect(screen.queryByText("支持智能体")).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "第三方供应商" }));

  expect(screen.getByText("支持智能体")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "文档" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/agent-directory.test.tsx`
Expected: FAIL because the current card copy uses older channel labels and provider support presentation.

- [ ] **Step 3: Write minimal implementation**

Adjust `ChannelSummary` usage and provider support block labels in `components/agent-directory.tsx`:

```tsx
<ChannelSummary
  icon={<LogIn className="h-4 w-4" />}
  title="官方登录"
  value={agent.officialLogin?.name}
  fallback="暂无官方登录入口"
/>
<ChannelSummary
  icon={<KeyRound className="h-4 w-4" />}
  title="官方 API"
  value={agent.officialApi?.name}
  fallback="暂无已核验官方 API"
/>
```

```tsx
<div className="rounded-md border border-slate-200 bg-slate-50 p-3">
  <div className="text-xs font-semibold text-slate-500">支持智能体</div>
  <div className="mt-2 flex flex-wrap gap-2">{/* badges */}</div>
</div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/agent-directory.test.tsx`
Expected: PASS with clear separation between official agent data and provider coverage data.

### Task 3: Implement the homepage layout and spacing refactor

**Files:**
- Modify: `components/agent-directory.tsx`
- Modify: `app/globals.css` (only if necessary)
- Test: `components/agent-directory.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("shows an explicit empty state when filters return no results", async () => {
  render(<AgentDirectory agents={agents} providers={providers} />);

  await userEvent.type(screen.getByRole("textbox", { name: "搜索 Agent" }), "no-match-value");

  expect(screen.getByText("没有找到匹配结果")).toBeInTheDocument();
  expect(screen.getByText("可以尝试更换关键词或切换筛选条件。")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/agent-directory.test.tsx`
Expected: FAIL because no dedicated empty state is rendered today.

- [ ] **Step 3: Write minimal implementation**

Add a shared empty state branch in `components/agent-directory.tsx` for both views:

```tsx
function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
```

Use it with:

```tsx
<EmptyState title="没有找到匹配结果" description="可以尝试更换关键词或切换筛选条件。" />
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/agent-directory.test.tsx`
Expected: PASS with the empty state appearing only when result counts are zero.

- [ ] **Step 5: Refactor the component layout while keeping tests green**

Restructure the main homepage blocks in `components/agent-directory.tsx`:

```tsx
<main className="min-h-screen bg-slate-100 text-ink">
  {/* compact workspace header */}
  {/* main split layout */}
</main>
```

Apply these concrete shifts:

- reduce oversized paddings and section gaps
- replace large card heights with content-driven layouts
- tighten metrics, control band, and sidebar panels
- keep desktop split layout and clean mobile stacking

Run: `npm test -- components/agent-directory.test.tsx`
Expected: PASS

### Task 4: Align detail pages to the new homepage tone

**Files:**
- Modify: `app/agents/[slug]/page.tsx`
- Modify: `app/providers/[slug]/page.tsx`
- Test: `npm run build`

- [ ] **Step 1: Inspect current detail-page wrappers and choose minimal changes**

Look for any large hero blocks, oversized spacing, or styling that now clashes with the homepage. Keep route structure and data rendering unchanged.

- [ ] **Step 2: Apply minimal visual consistency updates**

Use smaller heading scales, tighter panel spacing, and the same low-contrast surfaces as the homepage. Example target shape:

```tsx
<main className="min-h-screen bg-slate-100">
  <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    {/* existing detail content with tighter wrappers */}
  </div>
</main>
```

- [ ] **Step 3: Run production build to verify route output**

Run: `npm run build`
Expected: PASS

### Task 5: Final verification

**Files:**
- Modify: none
- Test: `components/agent-directory.test.tsx`, full test suite, production build

- [ ] **Step 1: Run targeted component tests**

Run: `npm test -- components/agent-directory.test.tsx`
Expected: PASS

- [ ] **Step 2: Run full test suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`
Expected: local dev server starts and the homepage reflects the new compact directory layout at desktop and mobile widths.

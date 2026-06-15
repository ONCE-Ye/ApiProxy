"use client";

import Link from "next/link";
import { ArrowUpRight, Bot, Building2, Check, KeyRound, Layers3, LogIn, Mail, MessageSquarePlus, Save, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { channelFilterLabels, type AgentChannelFilter, type AgentProfile } from "@/data/agents";
import { providerFilterLabels, type ProviderProfile, type ProviderRegionFilter } from "@/data/providers";
import { agentStats, filterAgents } from "@/lib/agents";
import { filterProviders, providerStats } from "@/lib/providers";

type AgentDirectoryProps = {
  agents: AgentProfile[];
  providers: ProviderProfile[];
};

type DirectoryView = "agents" | "providers";

type AnnotationDraft = {
  page: string;
  x: number;
  y: number;
  target: string;
  text: string;
};

const agentFilters: AgentChannelFilter[] = ["all", "china", "global"];
const providerFilters: ProviderRegionFilter[] = ["all", "china", "global"];
const contactEmail = "y_j-z@foxmail.com";
const contactMessage = "如有收录建议、链接失效或接入信息需要补充，可以通过邮箱联系我。";

export function AgentDirectory({ agents, providers }: AgentDirectoryProps) {
  const [view, setView] = useState<DirectoryView>("agents");
  const [query, setQuery] = useState("");
  const [agentFilter, setAgentFilter] = useState<AgentChannelFilter>("all");
  const [providerFilter, setProviderFilter] = useState<ProviderRegionFilter>("all");
  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotationDraft, setAnnotationDraft] = useState<AnnotationDraft | null>(null);
  const [annotationComment, setAnnotationComment] = useState("");
  const [annotationCount, setAnnotationCount] = useState(0);
  const [annotationStatus, setAnnotationStatus] = useState("");

  const visibleAgents = useMemo(() => filterAgents({ query, channel: agentFilter }), [query, agentFilter]);
  const visibleProviders = useMemo(() => filterProviders({ query, region: providerFilter }), [query, providerFilter]);

  const isAgentView = view === "agents";
  const searchLabel = isAgentView ? "搜索 Agent" : "搜索多智能体 API";
  const searchPlaceholder = isAgentView ? "搜索智能体、厂商或标签" : "搜索平台、支持的智能体 API 或标签";

  useEffect(() => {
    fetch("/api/annotations")
      .then((response) => (response.ok ? response.json() : { annotations: [] }))
      .then((data) => setAnnotationCount(Array.isArray(data.annotations) ? data.annotations.length : 0))
      .catch(() => setAnnotationCount(0));
  }, []);

  function handleAnnotationClick(event: React.MouseEvent<HTMLElement>) {
    if (!annotationMode) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest("[data-annotation-ui]")) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const text = target.textContent?.replace(/\s+/g, " ").trim().slice(0, 80) ?? "";
    setAnnotationDraft({
      page: window.location.pathname,
      x: Math.round(event.clientX),
      y: Math.round(event.clientY),
      target: describeAnnotationTarget(target),
      text
    });
    setAnnotationComment("");
    setAnnotationStatus("");
  }

  async function saveAnnotation() {
    if (!annotationDraft || !annotationComment.trim()) {
      return;
    }

    setAnnotationStatus("保存中");
    let response: Response;

    try {
      response = await fetch("/api/annotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...annotationDraft, comment: annotationComment.trim() })
      });
    } catch {
      setAnnotationStatus("保存失败：批注接口不可用");
      return;
    }

    if (!response.ok) {
      setAnnotationStatus("保存失败：" + response.status);
      return;
    }

    const data = await response.json().catch(() => ({ annotations: [] }));
    setAnnotationCount(Array.isArray(data.annotations) ? data.annotations.length : annotationCount + 1);
    setAnnotationDraft(null);
    setAnnotationComment("");
    setAnnotationStatus("已保存");
  }

  return (
    <main data-testid="registry-shell" className={"min-h-screen bg-[#eef2f6] text-ink " + (annotationMode ? "cursor-crosshair" : "")} onClickCapture={handleAnnotationClick}>
      <section className="border-b border-[#d8dee8] bg-[#f8fafc]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f766e]">API REGISTRY</p>
              <p className="text-sm font-semibold text-[#0f766e]">官方入口与多智能体 API 供应关系分开整理</p>
              <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">API 供应导航</h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                把官方智能体入口和多智能体 API 平台拆开管理，便于快速确认官方渠道、支持范围和实际接入入口。
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center" data-annotation-ui>
              <button
                type="button"
                onClick={() => {
                  setAnnotationMode((current) => !current);
                  setAnnotationDraft(null);
                }}
                className={
                  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium shadow-sm transition " +
                  (annotationMode ? "border-[#0f766e] bg-[#ecfdf5] text-[#0f766e]" : "border-[#d8dee8] bg-white/90 text-slate-700 hover:border-[#0f766e] hover:text-[#0f766e]")
                }
              >
                <MessageSquarePlus className="h-4 w-4" />
                批注模式
              </button>
              <div className="inline-flex w-full rounded-lg border border-[#d8dee8] bg-white/90 p-1 shadow-[0_1px_2px_rgba(17,24,39,0.05)] sm:w-auto">
                <ViewTab active={isAgentView} onClick={() => setView("agents")} icon={<Bot className="h-4 w-4" />} label="智能体" />
                <ViewTab active={!isAgentView} onClick={() => setView("providers")} icon={<Building2 className="h-4 w-4" />} label="多智能体 API" />
              </div>
            </div>
          </div>

          <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div data-testid="directory-search-panel" className="h-full rounded-lg border border-[#d8dee8] bg-white/95 p-3 shadow-[0_1px_2px_rgba(17,24,39,0.05)] sm:p-4">
              <div className="space-y-3">
                <label className="relative block max-w-xl">
                  <span className="sr-only">{searchLabel}</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    aria-label={searchLabel}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-11 w-full rounded-md border border-[#d8dee8] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                  />
                </label>

                <div className="flex items-center gap-2 overflow-x-auto rounded-md border border-[#d8dee8] bg-[#f5f7fa] p-1.5">
                  <SlidersHorizontal className="ml-2 h-4 w-4 flex-none text-slate-400" />
                  {isAgentView
                    ? agentFilters.map((option) => (
                        <FilterButton key={option} active={agentFilter === option} onClick={() => setAgentFilter(option)}>
                          {channelFilterLabels[option]}
                        </FilterButton>
                      ))
                    : providerFilters.map((option) => (
                        <FilterButton key={option} active={providerFilter === option} onClick={() => setProviderFilter(option)}>
                          {providerFilterLabels[option]}
                        </FilterButton>
                      ))}
                </div>
              </div>
            </div>

            <div data-testid="directory-stats-panel" className="grid h-full grid-cols-3 gap-3 rounded-lg border border-[#d8dee8] bg-white/95 p-3 text-center shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
              {isAgentView ? (
                <>
                  <Stat label="智能体" value={agentStats.total} />
                  <Stat label="官方登录" value={agentStats.withOfficialLogin} />
                  <Stat label="官方 API" value={agentStats.withOfficialApi} />
                </>
              ) : (
                <>
                  <Stat label="多智能体 API" value={providerStats.total} />
                  <Stat label="国际" value={providerStats.global} />
                  <Stat label="国内" value={providerStats.china} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {isAgentView ? (
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
          <div className="grid gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">官方智能体</h2>
                <p className="mt-1 text-sm text-slate-600">当前显示 {visibleAgents.length} 个智能体，只保留官方入口信息。</p>
              </div>
            </div>

            {visibleAgents.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                {visibleAgents.map((agent) => (
                  <article key={agent.slug} data-testid={"agent-card-" + agent.slug} className={"flex min-h-[340px] flex-col overflow-hidden rounded-lg border border-[#d8dee8] border-l-4 bg-white/95 p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)] " + getAgentAccentClass(agent.region)}>
                    <div data-testid={"agent-header-" + agent.slug} className="flex min-h-[72px] items-center gap-4">
                      <AgentIcon agent={agent} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-700">{agent.region === "china" ? "国内智能体" : "国际智能体"}</p>
                        <div className="mt-1 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-slate-950">{agent.name}</h3>
                            <p className="mt-1 text-sm text-slate-500">{agent.vendor}</p>
                          </div>
                          <Link
                            href={"/agents/" + agent.slug}
                            className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-md border border-[#d8dee8] text-slate-600 transition hover:border-[#1d4ed8] hover:text-[#1d4ed8]"
                            aria-label={"查看 " + agent.name + " 详情"}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    <p data-testid={"agent-summary-" + agent.slug} className="mt-4 min-h-[72px] line-clamp-3 text-sm leading-6 text-slate-600">{agent.summary}</p>

                    <div data-testid={"agent-channels-" + agent.slug} className="mt-4 grid min-h-[96px] gap-2 sm:grid-cols-2">
                      <ChannelSummary icon={<LogIn className="h-4 w-4" />} title="官方登录" value={agent.officialLogin?.name} fallback="暂无官方登录入口" />
                      <ChannelSummary icon={<KeyRound className="h-4 w-4" />} title="官方 API" value={agent.officialApi?.name} fallback="暂无已核验官方 API" />
                    </div>

                    <div data-testid={"agent-links-" + agent.slug} className="mt-auto flex flex-wrap gap-2 pt-4">
                      {agent.officialLogin ? <ExternalLink href={agent.officialLogin.url ?? "#"}>登录</ExternalLink> : null}
                      {agent.officialApi ? <ExternalLink href={agent.officialApi.docsUrl ?? "#"}>官方 API</ExternalLink> : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="没有找到匹配结果" description="可以尝试更换关键词或切换筛选条件。" />
            )}
          </div>

          <aside className="space-y-4">
            <InfoPanel icon={<Layers3 className="h-4 w-4 text-teal-700" />} title="目录规则">
              智能体卡片只保留官方登录与官方 API。多智能体 API 平台已经单独拆出，不再混在智能体条目里重复出现。
            </InfoPanel>
            <InfoPanel icon={<Check className="h-4 w-4 text-teal-700" />} title="快速对比">
              <div className="mt-4 overflow-hidden rounded-md border border-[#d8dee8]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f5f7fa] font-mono text-xs font-semibold text-slate-500">
                    <tr>
                      <th className="px-3 py-2">智能体</th>
                      <th className="px-3 py-2">官方获取方式</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {visibleAgents.map((agent) => (
                      <tr key={agent.slug}>
                        <td className="px-3 py-3 font-medium text-slate-900">{agent.name}</td>
                        <td className="px-3 py-3 text-slate-600">{[agent.officialLogin ? "登录" : null, agent.officialApi ? "官方 API" : null].filter(Boolean).join(" / ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoPanel>
            <ContactPanel />
          </aside>
        </section>
      ) : (
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
          <div className="grid gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">多智能体 API</h2>
              <p className="mt-1 text-sm text-slate-600">当前显示 {visibleProviders.length} 个平台，只包含支持 2 个及以上智能体 API 的平台。</p>
            </div>

            {visibleProviders.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                {visibleProviders.map((provider) => (
                  <article
                    key={provider.slug}
                    data-testid={"provider-card-" + provider.slug}
                    className={"flex min-h-[390px] flex-col overflow-hidden rounded-lg border border-[#d8dee8] border-l-4 bg-white/95 p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)] " + getProviderAccentClass(provider)}
                  >
                    <div className="flex min-h-20 items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-700">{provider.region === "china" ? "国内多智能体 API" : "国际多智能体 API"}</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-950">{provider.name}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <p className="text-sm text-slate-500">{provider.vendor}</p>
                          <RelayBadge isPureRelay={provider.isPureRelay} />
                        </div>
                      </div>
                      <Link
                        href={"/providers/" + provider.slug}
                        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-teal-600 hover:text-teal-700"
                        aria-label={"查看 " + provider.name + " 详情"}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <p data-testid={"provider-summary-" + provider.slug} className="mt-4 text-sm leading-6 text-slate-600">{provider.summary}</p>

                    <div data-testid={"provider-support-" + provider.slug} className="mt-4 rounded-md border border-[#d8dee8] bg-[#f5f7fa] p-3">
                      <div className="text-xs font-semibold text-slate-500">支持智能体 API</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {getProviderSupportLabels(provider, agents).map((label) => (
                          <SupportBadge key={label} label={label} />
                        ))}
                      </div>
                    </div>

                    <ProviderNotes provider={provider} className="mt-4 text-sm leading-6 text-slate-600" />

                    <div data-testid={"provider-links-" + provider.slug} className="mt-auto flex flex-wrap gap-2 pt-4">
                      {provider.consoleUrl ? <ExternalLink href={provider.consoleUrl}>网站地址</ExternalLink> : null}
                      {provider.docsUrl ? <ExternalLink href={provider.docsUrl}>文档</ExternalLink> : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="没有找到匹配结果" description="可以尝试更换关键词或切换筛选条件。" />
            )}
          </div>

          <aside className="space-y-4">
            <InfoPanel icon={<Building2 className="h-4 w-4 text-teal-700" />} title="多智能体 API 说明">
              多智能体 API 页面只收录支持 2 个及以上智能体 API 的平台，并显式标注是否为中转站。
            </InfoPanel>
            <InfoPanel icon={<Check className="h-4 w-4 text-teal-700" />} title="覆盖范围">
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                    <tr>
                      <th className="px-3 py-2">平台</th>
                      <th className="px-3 py-2">支持智能体 API</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {visibleProviders.map((provider) => (
                      <tr key={provider.slug}>
                        <td className="px-3 py-3 font-medium text-slate-900">{provider.name}</td>
                        <td className="px-3 py-3 text-slate-600">
                          {getProviderSupportLabels(provider, agents).join(" / ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoPanel>
            <ContactPanel />
          </aside>
        </section>
      )}

      <AnnotationWorkspace
        draft={annotationDraft}
        comment={annotationComment}
        count={annotationCount}
        mode={annotationMode}
        status={annotationStatus}
        onCommentChange={setAnnotationComment}
        onClose={() => setAnnotationDraft(null)}
        onSave={saveAnnotation}
      />
    </main>
  );
}

function describeAnnotationTarget(element: HTMLElement) {
  const label = element.getAttribute("aria-label") || element.getAttribute("placeholder") || element.textContent?.replace(/\s+/g, " ").trim().slice(0, 40);
  const role = element.getAttribute("role");
  return [element.tagName.toLowerCase(), role ? "role=" + role : null, label ? "text=" + label : null].filter(Boolean).join(" | ");
}

function getProviderSupportLabels(provider: ProviderProfile, agentProfiles: AgentProfile[]) {
  if (provider.supportedApiLabels?.length) {
    return provider.supportedApiLabels;
  }

  return provider.supportedAgentSlugs
    .map((slug) => agentProfiles.find((item) => item.slug === slug)?.name)
    .filter((name): name is string => Boolean(name));
}

function getAgentAccentClass(region: AgentProfile["region"]) {
  return region === "china" ? "border-l-[#0f766e]" : "border-l-[#1d4ed8]";
}

function getProviderAccentClass(provider: ProviderProfile) {
  if (provider.isPureRelay) {
    return "border-l-[#b45309]";
  }

  return provider.region === "china" ? "border-l-[#0f766e]" : "border-l-[#1d4ed8]";
}

function ProviderNotes({ provider, className }: { provider: ProviderProfile; className?: string }) {
  if (!provider.notesHighlight || !provider.notes.includes(provider.notesHighlight)) {
    return <p className={className}>{provider.notes}</p>;
  }

  const [before, after] = provider.notes.split(provider.notesHighlight);

  return (
    <p className={className}>
      {before}
      <strong className="font-semibold text-slate-900">{provider.notesHighlight}</strong>
      {after}
    </p>
  );
}

function AnnotationWorkspace({
  draft,
  comment,
  count,
  mode,
  status,
  onCommentChange,
  onClose,
  onSave
}: {
  draft: AnnotationDraft | null;
  comment: string;
  count: number;
  mode: boolean;
  status: string;
  onCommentChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  if (!mode && !draft && !status) {
    return null;
  }

  return (
    <div data-annotation-ui className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm space-y-3 sm:bottom-6 sm:right-6">
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">页面批注</p>
            <p className="mt-1 text-xs text-slate-500">{mode ? "点击页面任意区域后写修改意见" : "打开批注模式后开始标注"}</p>
          </div>
          <div className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{count}</div>
        </div>
        {status ? <p className="mt-2 text-xs font-medium text-teal-700">{status}</p> : null}
      </div>

      {draft ? (
        <div className="rounded-xl border border-teal-200 bg-white p-3 shadow-xl">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-teal-700">已选区域</p>
              <p className="mt-1 text-sm font-medium text-slate-950">{draft.target}</p>
              {draft.text ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{draft.text}</p> : null}
            </div>
            <button type="button" onClick={onClose} className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label="关闭批注">
              <X className="h-4 w-4" />
            </button>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-slate-700">修改意见</span>
            <textarea
              value={comment}
              onChange={(event) => onCommentChange(event.target.value)}
              rows={4}
              autoFocus
              placeholder="直接写这里需要怎么改"
              className="mt-1 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <button
            type="button"
            onClick={onSave}
            disabled={!comment.trim()}
            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Save className="h-4 w-4" />
            保存到项目批注
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ViewTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition sm:min-w-[140px] " +
        (active ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50")
      }
    >
      {icon}
      {label}
    </button>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "h-8 flex-none rounded-md px-3 text-sm font-medium transition " +
        (active ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-white")
      }
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-[#d8dee8] bg-[#f5f7fa] px-2 py-3">
      <div className="text-2xl font-semibold text-slate-950">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}

function AgentIcon({ agent }: { agent: AgentProfile }) {
  return (
    <div data-testid={"agent-icon-" + agent.slug} className="h-16 w-16 flex-none overflow-hidden rounded-md border border-[#d8dee8] bg-white">
      <div
        aria-hidden="true"
        className="h-full w-full bg-[url('/agent-icons/agent-icon-set.png')] bg-[length:400%_200%]"
        style={{ backgroundPosition: agent.imagePosition }}
      />
    </div>
  );
}

function ChannelSummary({ icon, title, value, fallback }: { icon: React.ReactNode; title: string; value?: string; fallback: string }) {
  return (
    <div className="flex min-h-[96px] flex-col justify-between rounded-md border border-[#d8dee8] bg-[#f5f7fa] p-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        {icon}
        <span>{title}</span>
      </div>
      <p className={"mt-1 text-sm leading-5 " + (value ? "font-medium text-slate-900" : "text-slate-500")}>{value ?? fallback}</p>
    </div>
  );
}

function RelayBadge({ isPureRelay }: { isPureRelay: boolean }) {
  if (!isPureRelay) {
    return null;
  }

  return (
    <span className="inline-flex h-7 items-center rounded-md border border-[#f0c36a] bg-[#fff7e6] px-2.5 text-xs font-semibold text-[#b45309]">
      中转站
    </span>
  );
}

function SupportBadge({ label }: { label: string }) {
  return <span className="inline-flex h-7 items-center rounded-md border border-[#d8dee8] bg-white px-2.5 text-sm text-slate-700">{label}</span>;
}

function InfoPanel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#d8dee8] bg-white/95 p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      </div>
      <div className="mt-3 text-sm leading-6 text-slate-600">{children}</div>
    </div>
  );
}

function ContactPanel() {
  return (
    <InfoPanel icon={<Mail className="h-4 w-4 text-teal-700" />} title="联系维护">
      <p>{contactMessage}</p>
      <a href={"mailto:" + contactEmail} className="mt-3 inline-flex h-9 items-center rounded-md border border-[#d8dee8] bg-white px-3 font-medium text-slate-700 transition hover:border-[#1d4ed8] hover:text-[#1d4ed8]">
        {contactEmail}
      </a>
    </InfoPanel>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#aeb8c6] bg-white/90 px-6 py-10 text-center shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 items-center gap-1 rounded-md border border-[#d8dee8] bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-[#1d4ed8] hover:text-[#1d4ed8]"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </a>
  );
}

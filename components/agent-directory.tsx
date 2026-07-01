"use client";

import Link from "next/link";
import { ArrowUpRight, Bot, Building2, Check, KeyRound, Layers3, LogIn, Mail, MessageSquarePlus, Network, RadioTower, Save, Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { channelFilterLabels, type AgentChannelFilter, type AgentProfile } from "@/data/agents";
import { providerFilterLabels, type ProviderProfile, type ProviderRegionFilter } from "@/data/providers";
import { agentStats, filterAgents } from "@/lib/agents";
import { filterProviders, providerStats } from "@/lib/providers";
import { withBasePath } from "@/lib/site-paths";

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

const agentFilters: AgentChannelFilter[] = ["all", "official-login", "official-api", "china", "global"];
const providerFilters: ProviderRegionFilter[] = ["all", "china", "global"];
const contactEmail = "yehao827810@gmail.com";
const contactMessage = "如有收录建议、链接失效或接入信息需要补充，可以通过邮箱联系我。";

function isAnnotationParameterEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  const value = params.get("annotations") ?? params.get("annotate") ?? "";
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function AgentDirectory({ agents, providers }: AgentDirectoryProps) {
  const [view, setView] = useState<DirectoryView>("agents");
  const [query, setQuery] = useState("");
  const [agentFilter, setAgentFilter] = useState<AgentChannelFilter>("all");
  const [providerFilter, setProviderFilter] = useState<ProviderRegionFilter>("all");
  const [annotationsEnabled] = useState(isAnnotationParameterEnabled);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotationDraft, setAnnotationDraft] = useState<AnnotationDraft | null>(null);
  const [annotationComment, setAnnotationComment] = useState("");
  const [annotationCount, setAnnotationCount] = useState(0);
  const [annotationStatus, setAnnotationStatus] = useState("");

  const visibleAgents = useMemo(() => filterAgents({ query, channel: agentFilter }), [query, agentFilter]);
  const visibleProviders = useMemo(() => filterProviders({ query, region: providerFilter }), [query, providerFilter]);

  const isAgentView = view === "agents";
  const activeQuery = query.trim();
  const searchLabel = isAgentView ? "搜索 Agent" : "搜索多智能体 API";
  const searchPlaceholder = isAgentView ? "搜索智能体、厂商或标签" : "搜索 API 平台、工作门户、支持的智能体或标签";

  function switchView(nextView: DirectoryView) {
    setView(nextView);
    setQuery("");
  }

  useEffect(() => {
    if (!annotationsEnabled) {
      return;
    }

    fetch("/api/annotations")
      .then((response) => (response.ok ? response.json() : { annotations: [] }))
      .then((data) => setAnnotationCount(Array.isArray(data.annotations) ? data.annotations.length : 0))
      .catch(() => setAnnotationCount(0));
  }, [annotationsEnabled]);

  function handleAnnotationClick(event: React.MouseEvent<HTMLElement>) {
    if (!annotationsEnabled || !annotationMode) {
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
    <main data-testid="registry-shell" className={"min-h-screen bg-[#08111f] text-[#dce7f3] " + (annotationsEnabled && annotationMode ? "cursor-crosshair" : "")} onClickCapture={handleAnnotationClick}>
      <section className="relative overflow-hidden border-b border-[#1d3345] bg-[#07101d]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-75"
          style={{ backgroundImage: "linear-gradient(90deg, #07101d 0%, rgba(7,16,29,0.92) 34%, rgba(7,16,29,0.36) 70%, rgba(7,16,29,0.78) 100%), url('" + withBasePath("/visuals/api-registry-hero.png") + "')" }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(100,230,195,0.18),transparent_28%),radial-gradient(circle_at_86%_16%,rgba(78,162,255,0.22),transparent_30%),linear-gradient(180deg,transparent,rgba(8,17,31,0.92))]" />
        <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[#64e6c3]/30 bg-[#071826]/75 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64e6c3] shadow-[0_0_30px_rgba(100,230,195,0.12)]">
                <RadioTower className="h-3.5 w-3.5" />
                SIGNAL REGISTRY
              </p>
              <p className="text-sm font-semibold text-[#64e6c3]">智能体入口、API 平台和工作门户分层核验</p>
              <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-[#f3f7fb] sm:text-5xl">AI 接入导航</h1>
              <p className="max-w-3xl text-sm leading-6 text-[#b6c7d9] sm:text-base">
                汇总官方智能体入口、多模型 API 平台、中转站和工作门户，保留用途、支持范围、访问入口和最近核验时间。
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-[#c7d6e6]">
                <span className="inline-flex h-8 items-center gap-2 rounded-md border border-[#29445d]/80 bg-[#08111f]/70 px-3 backdrop-blur">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#64e6c3]" />
                  Verified channels
                </span>
                <span className="inline-flex h-8 items-center gap-2 rounded-md border border-[#29445d]/80 bg-[#08111f]/70 px-3 backdrop-blur">
                  <Network className="h-3.5 w-3.5 text-[#4ea2ff]" />
                  Agent API map
                </span>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center" data-annotation-ui>
              {annotationsEnabled ? (
                <button
                  type="button"
                  onClick={() => {
                    setAnnotationMode((current) => !current);
                    setAnnotationDraft(null);
                    setAnnotationStatus("");
                  }}
                  aria-pressed={annotationMode}
                  className={
                    "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition " +
                    (annotationMode ? "border-[#64e6c3] bg-[#112c35] text-[#dffdf4]" : "border-[#29445d] bg-transparent text-[#9fb3c8] hover:border-[#64e6c3] hover:text-[#dffdf4]")
                  }
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  批注模式
                </button>
              ) : null}
              <div className="inline-flex w-full rounded-md border border-[#34516a] bg-[#071826]/80 p-1 shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur sm:w-auto">
                <ViewTab active={isAgentView} onClick={() => switchView("agents")} icon={<Bot className="h-4 w-4" />} label="智能体" />
                <ViewTab active={!isAgentView} onClick={() => switchView("providers")} icon={<Building2 className="h-4 w-4" />} label="多智能体 API" />
              </div>
            </div>
          </div>

          <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div data-testid="directory-search-panel" className="h-full rounded-md border border-[#29445d]/80 bg-[#091522]/82 p-3 shadow-[0_22px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-4">
              <div className="space-y-3">
                <label className="relative block max-w-2xl">
                  <span className="sr-only">{searchLabel}</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f879f]" />
                  <input
                    aria-label={searchLabel}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-12 w-full rounded-md border border-[#34516a] bg-[#06101b]/90 pl-10 pr-3 text-sm text-[#e6eef8] outline-none transition placeholder:text-[#7890aa] focus:border-[#64e6c3] focus:ring-2 focus:ring-[#64e6c3]/20"
                  />
                </label>

                <div className="flex items-center gap-2 overflow-x-auto rounded-md border border-[#21384e] bg-[#06101b]/80 p-1.5">
                  <SlidersHorizontal className="ml-2 h-4 w-4 flex-none text-[#6f879f]" />
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
                {activeQuery ? (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-[#9fb3c8]">
                    <span className="rounded-md bg-[#112c35] px-2.5 py-1 font-medium text-[#64e6c3]">正在搜索：{activeQuery}</span>
                    <button type="button" onClick={() => setQuery("")} className="rounded-md border border-[#29445d] px-2.5 py-1 font-medium text-[#9fb3c8] transition hover:border-[#64e6c3] hover:text-[#dffdf4]">
                      清除搜索
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <div data-testid="directory-stats-panel" className="grid h-full grid-cols-3 gap-3 rounded-md border border-[#29445d]/80 bg-[#091522]/82 p-3 text-center shadow-[0_22px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              {isAgentView ? (
                <>
                  <Stat label="智能体" value={agentStats.total} />
                  <Stat label="官方登录" value={agentStats.withOfficialLogin} />
                  <Stat label="官方 API" value={agentStats.withOfficialApi} />
                </>
              ) : (
                <>
                  <Stat label="API/门户" value={providerStats.total} />
                  <Stat label="工作门户" value={providerStats.agentPortals} />
                  <Stat label="国内" value={providerStats.china} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {isAgentView ? (
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
          <div className="grid gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#f3f7fb] sm:text-xl">官方智能体</h2>
                <p className="mt-1 text-sm text-[#9fb3c8]">当前显示 {visibleAgents.length} 个智能体，只保留官方入口信息。</p>
              </div>
            </div>

            {visibleAgents.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                {visibleAgents.map((agent) => (
                  <article key={agent.slug} data-testid={"agent-card-" + agent.slug} className={"group flex min-h-[320px] flex-col overflow-hidden rounded-md border border-[#1d3345] border-l-4 bg-[linear-gradient(145deg,rgba(16,31,49,0.96),rgba(9,21,34,0.96))] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.22)] ring-1 ring-white/[0.03] transition duration-200 hover:-translate-y-0.5 hover:border-[#64e6c3]/60 hover:shadow-[0_24px_70px_rgba(0,0,0,0.32)] " + getAgentAccentClass(agent.region)}>
                    <div data-testid={"agent-header-" + agent.slug} className="flex min-h-[72px] items-center gap-4">
                      <AgentIcon agent={agent} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2d6a5f]">{agent.region === "china" ? "国内智能体" : "国际智能体"}</p>
                        <div className="mt-1 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-[#f3f7fb]">
                              <Link href={"/agents/" + agent.slug} className="transition hover:text-[#2f5d8c] focus:outline-none focus:ring-2 focus:ring-[#2d6a5f]/20">
                                {agent.name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-[#7f95ad]">{agent.vendor}</p>
                          </div>
                          <Link
                            href={"/agents/" + agent.slug}
                            className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-md border border-[#1d3345] bg-[#08111f]/60 text-[#9fb3c8] transition group-hover:border-[#64e6c3]/70 group-hover:text-[#dffdf4] hover:border-[#64e6c3] hover:text-[#dffdf4]"
                            aria-label={"查看 " + agent.name + " 详情"}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    <p data-testid={"agent-summary-" + agent.slug} className="mt-4 min-h-[72px] line-clamp-3 text-sm leading-6 text-[#9fb3c8]">{agent.summary}</p>

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
            <InfoPanel icon={<Layers3 className="h-4 w-4 text-[#2d6a5f]" />} title="目录规则">
              智能体卡片只保留官方登录与官方 API。多智能体 API 平台已经单独拆出，不再混在智能体条目里重复出现。
            </InfoPanel>
            <InfoPanel icon={<Check className="h-4 w-4 text-[#2d6a5f]" />} title="快速对比">
              <div className="mt-4 overflow-hidden rounded-md border border-[#1d3345]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0a1422] font-mono text-xs font-semibold text-[#7f95ad]">
                    <tr>
                      <th className="px-3 py-2">智能体</th>
                      <th className="px-3 py-2">官方获取方式</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1d3345]">
                    {visibleAgents.map((agent) => (
                      <tr key={agent.slug}>
                        <td className="px-3 py-3 font-medium text-[#f3f7fb]">{agent.name}</td>
                        <td className="px-3 py-3 text-[#9fb3c8]">{[agent.officialLogin ? "登录" : null, agent.officialApi ? "官方 API" : null].filter(Boolean).join(" / ")}</td>
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
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
          <div className="grid gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#f3f7fb] sm:text-xl">多智能体 API 与工作门户</h2>
              <p className="mt-1 text-sm text-[#9fb3c8]">当前显示 {visibleProviders.length} 个门户，只包含已核验的 API 平台和工作门户。</p>
            </div>

            {visibleProviders.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                {visibleProviders.map((provider) => (
                  <article
                    key={provider.slug}
                    data-testid={"provider-card-" + provider.slug}
                    className={"group flex min-h-[360px] flex-col overflow-hidden rounded-md border border-[#1d3345] border-l-4 bg-[linear-gradient(145deg,rgba(16,31,49,0.96),rgba(9,21,34,0.96))] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.22)] ring-1 ring-white/[0.03] transition duration-200 hover:-translate-y-0.5 hover:border-[#64e6c3]/60 hover:shadow-[0_24px_70px_rgba(0,0,0,0.32)] " + getProviderAccentClass(provider)}
                  >
                    <div className="flex min-h-20 items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64e6c3]">{getProviderKindLabel(provider)} · {provider.region === "china" ? "国内" : "国际"}</p>
                        <h3 className="mt-1 text-lg font-semibold text-[#f3f7fb]">
                          <Link href={"/providers/" + provider.slug} className="transition hover:text-[#2f5d8c] focus:outline-none focus:ring-2 focus:ring-[#2d6a5f]/20">
                            {provider.name}
                          </Link>
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <p className="text-sm text-[#7f95ad]">{provider.vendor}</p>
                          <ProviderKindBadge provider={provider} />
                          <RelayBadge isPureRelay={provider.isPureRelay} />
                        </div>
                      </div>
                      <Link
                        href={"/providers/" + provider.slug}
                        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-md border border-[#1d3345] bg-[#08111f]/60 text-[#9fb3c8] transition group-hover:border-[#64e6c3]/70 group-hover:text-[#dffdf4] hover:border-[#64e6c3] hover:text-[#dffdf4]"
                        aria-label={"查看 " + provider.name + " 详情"}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <p data-testid={"provider-summary-" + provider.slug} className="mt-4 text-sm leading-6 text-[#9fb3c8]">{provider.summary}</p>

                    <div data-testid={"provider-support-" + provider.slug} className="mt-4 rounded-md border border-[#1d3345] bg-[#0a1422] p-3">
                      <div className="text-xs font-semibold text-[#7f95ad]">{provider.kind === "agent-portal" ? "支持智能体工作流" : "支持智能体 API"}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {getProviderSupportLabels(provider, agents).map((label) => (
                          <SupportBadge key={label} label={label} />
                        ))}
                      </div>
                    </div>

                    <ProviderNotes provider={provider} className="mt-4 text-sm leading-6 text-[#9fb3c8]" />

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
            <InfoPanel icon={<Building2 className="h-4 w-4 text-[#2d6a5f]" />} title="多智能体 API 说明">
              该页面分开记录两类入口：可调用多家模型或智能体 API 的平台，以及能调度多个 coding agent / MCP 工作流的工作门户。
            </InfoPanel>
            <InfoPanel icon={<Check className="h-4 w-4 text-[#2d6a5f]" />} title="覆盖范围">
              <div className="mt-4 overflow-hidden rounded-md border border-[#1d3345]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0a1422] text-xs font-semibold text-[#7f95ad]">
                    <tr>
                      <th className="px-3 py-2">平台</th>
                      <th className="px-3 py-2">支持范围</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1d3345]">
                    {visibleProviders.map((provider) => (
                      <tr key={provider.slug}>
                        <td className="px-3 py-3 font-medium text-[#f3f7fb]">{provider.name}</td>
                        <td className="px-3 py-3 text-[#9fb3c8]">
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

      {annotationsEnabled ? (
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
      ) : null}
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
  return region === "china" ? "border-l-[#64e6c3]" : "border-l-[#4ea2ff]";
}

function getProviderAccentClass(provider: ProviderProfile) {
  if (provider.isPureRelay) {
    return "border-l-[#f0b35a]";
  }

  if (provider.kind === "agent-portal") {
    return "border-l-[#8bb8ff]";
  }

  return provider.region === "china" ? "border-l-[#64e6c3]" : "border-l-[#4ea2ff]";
}

function ProviderNotes({ provider, className }: { provider: ProviderProfile; className?: string }) {
  if (!provider.notesHighlight || !provider.notes.includes(provider.notesHighlight)) {
    return <p className={className}>{provider.notes}</p>;
  }

  const [before, after] = provider.notes.split(provider.notesHighlight);

  return (
    <p className={className}>
      {before}
      <strong className="font-semibold text-[#f3f7fb]">{provider.notesHighlight}</strong>
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
      <div className="rounded-xl border border-[#1d3345] bg-[#0d1929] p-3 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#f3f7fb]">页面批注</p>
            <p className="mt-1 text-xs text-[#7f95ad]">{mode ? "点击页面任意区域后写修改意见" : "打开批注模式后开始标注"}</p>
          </div>
          <div className="rounded-md bg-[#0a1422] px-2 py-1 text-xs font-medium text-[#9fb3c8]">{count}</div>
        </div>
        {status ? <p className="mt-2 text-xs font-medium text-[#2d6a5f]">{status}</p> : null}
      </div>

      {draft ? (
        <div className="rounded-xl border border-teal-200 bg-[#0d1929] p-3 shadow-xl">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#2d6a5f]">已选区域</p>
              <p className="mt-1 text-sm font-medium text-[#f3f7fb]">{draft.target}</p>
              {draft.text ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#7f95ad]">{draft.text}</p> : null}
            </div>
            <button type="button" onClick={onClose} className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-md text-[#7f95ad] transition hover:bg-[#12243a] hover:text-[#f3f7fb]" aria-label="关闭批注">
              <X className="h-4 w-4" />
            </button>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-[#c7d6e6]">修改意见</span>
            <textarea
              value={comment}
              onChange={(event) => onCommentChange(event.target.value)}
              rows={4}
              autoFocus
              placeholder="直接写这里需要怎么改"
              className="mt-1 w-full resize-none rounded-md border border-[#29445d] bg-[#0d1929] px-3 py-2 text-sm outline-none transition focus:border-[#64e6c3] focus:ring-2 focus:ring-[#64e6c3]/15"
            />
          </label>

          <button
            type="button"
            onClick={onSave}
            disabled={!comment.trim()}
            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#64e6c3] px-3 text-sm font-semibold text-[#05131d] transition hover:bg-[#8df3d7] disabled:cursor-not-allowed disabled:bg-[#29445d] disabled:text-[#7f95ad]"
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
      aria-pressed={active}
      className={
        "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition sm:min-w-[140px] " +
        (active ? "bg-[#64e6c3] text-[#05131d] shadow-[0_10px_24px_rgba(100,230,195,0.22)]" : "text-[#b6c7d9] hover:bg-[#12243a]")
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
      aria-pressed={active}
      className={
        "h-8 flex-none rounded-md px-3 text-sm font-medium transition " +
        (active ? "bg-[#64e6c3] text-[#05131d] shadow-[0_10px_24px_rgba(100,230,195,0.2)]" : "text-[#b6c7d9] hover:bg-[#12243a]")
      }
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-[#21384e] bg-[#06101b]/76 px-2 py-3 ring-1 ring-white/[0.03]">
      <div className="text-2xl font-semibold text-[#f3f7fb]">{value}</div>
      <div className="mt-1 text-xs text-[#9fb3c8]">{label}</div>
    </div>
  );
}

function AgentIcon({ agent }: { agent: AgentProfile }) {
  return (
    <div data-testid={"agent-icon-" + agent.slug} className="h-16 w-16 flex-none overflow-hidden rounded-md border border-[#29445d] bg-[#0d1929] shadow-[0_12px_28px_rgba(0,0,0,0.28)]">
      <div
        aria-hidden="true"
        className="h-full w-full bg-[length:400%_200%]"
        style={{ backgroundImage: "url('" + withBasePath("/agent-icons/agent-icon-set.png") + "')", backgroundPosition: agent.imagePosition }}
      />
    </div>
  );
}

function ChannelSummary({ icon, title, value, fallback }: { icon: React.ReactNode; title: string; value?: string; fallback: string }) {
  return (
    <div className="flex min-h-[96px] flex-col justify-between rounded-md border border-[#21384e] bg-[#06101b]/70 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#7f95ad]">
        {icon}
        <span>{title}</span>
      </div>
      <p className={"mt-1 text-sm leading-5 " + (value ? "font-medium text-[#f3f7fb]" : "text-[#7f95ad]")}>{value ?? fallback}</p>
    </div>
  );
}


function getProviderKindLabel(provider: ProviderProfile) {
  return provider.kind === "agent-portal" ? "工作门户" : "API 平台";
}

function ProviderKindBadge({ provider }: { provider: ProviderProfile }) {
  const isPortal = provider.kind === "agent-portal";

  return (
    <span className={"inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold " + (isPortal ? "border-[#8bb8ff]/60 bg-[#10223d] text-[#cfe0ff]" : "border-[#64e6c3]/50 bg-[#102a30] text-[#dffdf4]")}>
      {isPortal ? "工作门户" : "API 平台"}
    </span>
  );
}

function RelayBadge({ isPureRelay }: { isPureRelay: boolean }) {
  if (!isPureRelay) {
    return null;
  }

  return (
    <span className="inline-flex h-7 items-center rounded-md border border-[#f0b35a]/60 bg-[#2a2114] px-2.5 text-xs font-semibold text-[#ffd089]">
      中转站
    </span>
  );
}

function SupportBadge({ label }: { label: string }) {
  return <span className="inline-flex h-7 items-center rounded-md border border-[#21384e] bg-[#06101b]/70 px-2.5 text-sm text-[#c7d6e6]">{label}</span>;
}

function InfoPanel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-[#1d3345] bg-[linear-gradient(145deg,rgba(15,28,44,0.96),rgba(8,17,31,0.96))] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.2)] ring-1 ring-white/[0.03]">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-base font-semibold text-[#f3f7fb]">{title}</h3>
      </div>
      <div className="mt-3 text-sm leading-6 text-[#9fb3c8]">{children}</div>
    </div>
  );
}

function ContactPanel() {
  return (
    <InfoPanel icon={<Mail className="h-4 w-4 text-[#2d6a5f]" />} title="联系维护">
      <p>{contactMessage}</p>
      <a href={"mailto:" + contactEmail} className="mt-3 inline-flex h-9 items-center rounded-md border border-[#29445d] bg-[#08111f]/70 px-3 font-medium text-[#c7d6e6] transition hover:border-[#64e6c3] hover:text-[#dffdf4]">
        {contactEmail}
      </a>
    </InfoPanel>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#29445d] bg-[#0d1929]/90 px-6 py-10 text-center shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
      <h3 className="text-base font-semibold text-[#f3f7fb]">{title}</h3>
      <p className="mt-2 text-sm text-[#9fb3c8]">{description}</p>
    </div>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 items-center gap-1 rounded-md border border-[#29445d] bg-[#08111f]/70 px-3 text-sm font-medium text-[#c7d6e6] transition hover:border-[#64e6c3] hover:bg-[#10243a] hover:text-[#dffdf4]"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </a>
  );
}

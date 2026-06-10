"use client";

import Link from "next/link";
import { ArrowUpRight, Bot, Building2, Check, KeyRound, Layers3, LogIn, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { channelFilterLabels, type AgentChannelFilter, type AgentProfile } from "@/data/agents";
import { providerFilterLabels, type ProviderProfile, type ProviderRegionFilter } from "@/data/providers";
import { agentStats, filterAgents } from "@/lib/agents";
import { filterProviders, providerStats } from "@/lib/providers";

type AgentDirectoryProps = {
  agents: AgentProfile[];
  providers: ProviderProfile[];
};

type DirectoryView = "agents" | "providers";

const agentFilters: AgentChannelFilter[] = ["all", "official-login", "official-api", "china", "global"];
const providerFilters: ProviderRegionFilter[] = ["all", "china", "global"];

export function AgentDirectory({ agents, providers }: AgentDirectoryProps) {
  const [view, setView] = useState<DirectoryView>("agents");
  const [query, setQuery] = useState("");
  const [agentFilter, setAgentFilter] = useState<AgentChannelFilter>("all");
  const [providerFilter, setProviderFilter] = useState<ProviderRegionFilter>("all");

  const visibleAgents = useMemo(() => filterAgents({ query, channel: agentFilter }), [query, agentFilter]);
  const visibleProviders = useMemo(() => filterProviders({ query, region: providerFilter }), [query, providerFilter]);

  const isAgentView = view === "agents";
  const searchLabel = isAgentView ? "搜索 Agent" : "搜索供应商";
  const searchPlaceholder = isAgentView ? "搜索智能体、厂商或标签" : "搜索供应商、支持的智能体或标签";

  return (
    <main className="min-h-screen bg-slate-100 text-ink">
      <section className="border-b border-slate-200 bg-slate-50/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-teal-700">官方入口与第三方 API 供应关系分开整理</p>
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">API 供应导航</h1>
                    <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                      把官方智能体入口和第三方 API 供应商拆开管理，便于快速确认官方渠道、支持范围和实际接入入口。
                    </p>
                  </div>
                  <div className="inline-flex w-full rounded-lg border border-slate-200 bg-white p-1 shadow-sm sm:w-auto">
                    <ViewTab active={isAgentView} onClick={() => setView("agents")} icon={<Bot className="h-4 w-4" />} label="智能体" />
                    <ViewTab active={!isAgentView} onClick={() => setView("providers")} icon={<Building2 className="h-4 w-4" />} label="第三方供应商" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(280px,420px)_1fr]">
                  <label className="relative block">
                    <span className="sr-only">{searchLabel}</span>
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      aria-label={searchLabel}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={searchPlaceholder}
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />
                  </label>

                  <div className="flex items-center gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-1.5">
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
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
              {isAgentView ? (
                <>
                  <Stat label="智能体" value={agentStats.total} />
                  <Stat label="官方登录" value={agentStats.withOfficialLogin} />
                  <Stat label="官方 API" value={agentStats.withOfficialApi} />
                </>
              ) : (
                <>
                  <Stat label="供应商" value={providerStats.total} />
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
                  <article key={agent.slug} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
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
                            className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-teal-600 hover:text-teal-700"
                            aria-label={"查看 " + agent.name + " 详情"}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">{agent.summary}</p>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <ChannelSummary icon={<LogIn className="h-4 w-4" />} title="官方登录" value={agent.officialLogin?.name} fallback="暂无官方登录入口" />
                      <ChannelSummary icon={<KeyRound className="h-4 w-4" />} title="官方 API" value={agent.officialApi?.name} fallback="暂无已核验官方 API" />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
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
              智能体卡片只保留官方登录与官方 API。第三方平台已经单独拆到供应商目录，不再混在智能体条目里重复出现。
            </InfoPanel>
            <InfoPanel icon={<Check className="h-4 w-4 text-teal-700" />} title="快速对比">
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
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
          </aside>
        </section>
      ) : (
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
          <div className="grid gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">第三方 API 供应商</h2>
              <p className="mt-1 text-sm text-slate-600">当前显示 {visibleProviders.length} 个供应商，按平台维度整理支持范围与接入入口。</p>
            </div>

            {visibleProviders.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
                {visibleProviders.map((provider) => (
                  <article key={provider.slug} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-700">{provider.region === "china" ? "国内供应商" : "国际供应商"}</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-950">{provider.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{provider.vendor}</p>
                      </div>
                      <Link
                        href={"/providers/" + provider.slug}
                        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-teal-600 hover:text-teal-700"
                        aria-label={"查看 " + provider.name + " 详情"}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">{provider.summary}</p>

                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="text-xs font-semibold text-slate-500">支持智能体</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {provider.supportedAgentSlugs.map((slug) => {
                          const agent = agents.find((item) => item.slug === slug);
                          return agent ? <SupportBadge key={slug} label={agent.name} /> : null;
                        })}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">{provider.notes}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <ExternalLink href={provider.docsUrl}>文档</ExternalLink>
                      {provider.consoleUrl ? <ExternalLink href={provider.consoleUrl}>控制台</ExternalLink> : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="没有找到匹配结果" description="可以尝试更换关键词或切换筛选条件。" />
            )}
          </div>

          <aside className="space-y-4">
            <InfoPanel icon={<Building2 className="h-4 w-4 text-teal-700" />} title="供应商说明">
              供应商页面按平台维度组织，重点展示平台简介、支持的智能体范围，以及实际可用的文档和控制台入口。
            </InfoPanel>
            <InfoPanel icon={<Check className="h-4 w-4 text-teal-700" />} title="覆盖范围">
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                    <tr>
                      <th className="px-3 py-2">供应商</th>
                      <th className="px-3 py-2">支持智能体</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {visibleProviders.map((provider) => (
                      <tr key={provider.slug}>
                        <td className="px-3 py-3 font-medium text-slate-900">{provider.name}</td>
                        <td className="px-3 py-3 text-slate-600">
                          {provider.supportedAgentSlugs
                            .map((slug) => agents.find((item) => item.slug === slug)?.name)
                            .filter(Boolean)
                            .join(" / ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoPanel>
          </aside>
        </section>
      )}
    </main>
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-3">
      <div className="text-2xl font-semibold text-slate-950">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}

function AgentIcon({ agent }: { agent: AgentProfile }) {
  return (
    <div className="h-14 w-14 flex-none overflow-hidden rounded-lg border border-slate-200 bg-white">
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        {icon}
        <span>{title}</span>
      </div>
      <p className={"mt-1 text-sm leading-5 " + (value ? "font-medium text-slate-900" : "text-slate-500")}>{value ?? fallback}</p>
    </div>
  );
}

function SupportBadge({ label }: { label: string }) {
  return <span className="inline-flex h-7 items-center rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-700">{label}</span>;
}

function InfoPanel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      </div>
      <div className="mt-3 text-sm leading-6 text-slate-600">{children}</div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
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
      className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-teal-600 hover:text-teal-700"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </a>
  );
}

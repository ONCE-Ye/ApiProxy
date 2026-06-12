import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, KeyRound, LogIn } from "lucide-react";
import { agents, type AgentChannel, type AgentProfile } from "@/data/agents";
import { getAgentBySlug } from "@/lib/agents";

type AgentPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return agents.map((agent) => ({ slug: agent.slug }));
}

export function generateMetadata({ params }: AgentPageProps) {
  const agent = getAgentBySlug(params.slug);

  if (!agent) {
    return { title: "未找到智能体" };
  }

  return {
    title: agent.name + " - 官方智能体目录",
    description: agent.summary
  };
}

export default function AgentPage({ params }: AgentPageProps) {
  const agent = getAgentBySlug(params.slug);

  if (!agent) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 text-ink">
      <section className="border-b border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-700">
            <ArrowLeft className="h-4 w-4" />
            返回目录
          </Link>
          <div className="mt-6 flex gap-4">
            <AgentIcon agent={agent} />
            <div>
              <p className="text-sm font-semibold text-teal-700">{agent.region === "china" ? "国内智能体" : "国际智能体"}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">{agent.name}</h1>
              <p className="mt-1 text-base font-medium text-slate-500">{agent.vendor}</p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{agent.summary}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <OfficialChannelPanel
            icon={<LogIn className="h-4 w-4" />}
            title="官方账号登录"
            channel={agent.officialLogin}
            primaryLabel="打开登录入口"
            empty="暂无已核验官方登录入口"
          />
          <OfficialChannelPanel
            icon={<KeyRound className="h-4 w-4" />}
            title="官方 API"
            channel={agent.officialApi}
            primaryLabel="查看官方 API"
            empty="暂无已核验官方 API"
          />
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">说明</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            当前页面只保留该智能体的官方登录与官方 API 信息。多智能体 API 平台已从智能体条目中拆出，请回到首页查看单独的多智能体 API 目录。
          </p>
          <p className="mt-3 text-xs text-slate-500">最后核验：{agent.lastVerified}</p>
        </section>
      </section>
    </main>
  );
}

function AgentIcon({ agent }: { agent: AgentProfile }) {
  return (
    <div className="h-20 w-20 flex-none overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div
        aria-hidden="true"
        className="h-full w-full bg-[url('/agent-icons/agent-icon-set.png')] bg-[length:400%_200%]"
        style={{ backgroundPosition: agent.imagePosition }}
      />
    </div>
  );
}

function OfficialChannelPanel({ icon, title, channel, primaryLabel, empty }: { icon: React.ReactNode; title: string; channel?: AgentChannel; primaryLabel: string; empty: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-teal-700">
        {icon}
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      </div>
      {channel ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-900">{channel.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{channel.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {channel.url ? <ExternalLink href={channel.url}>{primaryLabel}</ExternalLink> : null}
            {channel.docsUrl ? <ExternalLink href={channel.docsUrl}>文档</ExternalLink> : null}
            {channel.consoleUrl ? <ExternalLink href={channel.consoleUrl}>控制台 / Key</ExternalLink> : null}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">{empty}</p>
      )}
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-fit items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:border-teal-600 hover:text-teal-700"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </a>
  );
}

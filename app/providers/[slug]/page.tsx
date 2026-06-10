import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Building2, Cable, Server } from "lucide-react";
import { agents, type AgentProfile } from "@/data/agents";
import { providers } from "@/data/providers";
import { getProviderBySlug } from "@/lib/providers";

type ProviderPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return providers.map((provider) => ({ slug: provider.slug }));
}

export function generateMetadata({ params }: ProviderPageProps) {
  const provider = getProviderBySlug(params.slug);

  if (!provider) {
    return { title: "未找到供应商" };
  }

  return {
    title: provider.name + " - 第三方 API 供应商",
    description: provider.summary
  };
}

export default function ProviderPage({ params }: ProviderPageProps) {
  const provider = getProviderBySlug(params.slug);

  if (!provider) {
    notFound();
  }

  const supportedAgents = provider.supportedAgentSlugs
    .map((slug) => agents.find((agent) => agent.slug === slug))
    .filter((agent): agent is AgentProfile => Boolean(agent));

  return (
    <main className="min-h-screen bg-slate-100 text-ink">
      <section className="border-b border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-700">
            <ArrowLeft className="h-4 w-4" />
            返回目录
          </Link>
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-teal-700">{provider.region === "china" ? "国内供应商" : "国际供应商"}</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">{provider.name}</h1>
              <p className="mt-1 text-base font-medium text-slate-500">{provider.vendor}</p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{provider.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ExternalLink href={provider.docsUrl}>文档</ExternalLink>
              {provider.consoleUrl ? <ExternalLink href={provider.consoleUrl}>控制台</ExternalLink> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <InfoCard icon={<Server className="h-4 w-4" />} title="平台定位">
            {provider.notes}
          </InfoCard>
          <InfoCard icon={<Cable className="h-4 w-4" />} title="支持智能体">
            {String(supportedAgents.length)} 个已检索智能体
          </InfoCard>
          <InfoCard icon={<Building2 className="h-4 w-4" />} title="核验时间">
            {provider.lastVerified}
          </InfoCard>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">支持的智能体</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {supportedAgents.map((agent) => (
              <Link
                key={agent.slug}
                href={"/agents/" + agent.slug}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-teal-600"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-950">{agent.name}</div>
                  <div className="mt-1 text-sm text-slate-600">{agent.vendor}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-teal-700">
        {icon}
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{children}</p>
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

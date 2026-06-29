import { agents } from "@/data/agents";
import { providers, type ProviderProfile, type ProviderRegionFilter } from "@/data/providers";

export type ProviderFilter = {
  query?: string;
  region?: ProviderRegionFilter;
};

export function isMultiAgentApiProvider(provider: ProviderProfile) {
  return provider.kind === "agent-portal" || provider.supportedAgentSlugs.length >= 2;
}

export const multiAgentApiProviders = providers
  .filter(isMultiAgentApiProvider)
  .sort((a, b) => Number(a.isPureRelay) - Number(b.isPureRelay));

export function filterProviders({ query = "", region = "all" }: ProviderFilter = {}) {
  const normalizedQuery = query.trim().toLowerCase();

  return multiAgentApiProviders.filter((provider) => {
    const matchesRegion = region === "all" || provider.region === region;

    if (!matchesRegion) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const supportedAgentNames = provider.supportedAgentSlugs
      .map((slug) => agents.find((agent) => agent.slug === slug)?.name)
      .filter(Boolean);

    const searchableText = [
      provider.name,
      provider.vendor,
      provider.region,
      provider.summary,
      provider.notes,
      provider.kind === "agent-portal" ? "工作门户 agent portal workflow hub" : "API 平台 multi-agent api platform",
      provider.isPureRelay ? "中转站 纯中转站 relay aggregator" : "非纯中转站 自有智能体 平台",
      ...provider.tags,
      ...(provider.supportedApiLabels ?? []),
      ...supportedAgentNames
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function getProviderBySlug(slug: string) {
  return multiAgentApiProviders.find((provider) => provider.slug === slug);
}

export const providerStats = {
  total: multiAgentApiProviders.length,
  global: multiAgentApiProviders.filter((provider) => provider.region === "global").length,
  china: multiAgentApiProviders.filter((provider) => provider.region === "china").length,
  apiPlatforms: multiAgentApiProviders.filter((provider) => (provider.kind ?? "api-platform") === "api-platform").length,
  agentPortals: multiAgentApiProviders.filter((provider) => provider.kind === "agent-portal").length
};

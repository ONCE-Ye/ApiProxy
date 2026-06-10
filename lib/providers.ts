import { agents } from "@/data/agents";
import { providers, type ProviderRegionFilter } from "@/data/providers";

export type ProviderFilter = {
  query?: string;
  region?: ProviderRegionFilter;
};

export function filterProviders({ query = "", region = "all" }: ProviderFilter = {}) {
  const normalizedQuery = query.trim().toLowerCase();

  return providers.filter((provider) => {
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
      ...provider.tags,
      ...supportedAgentNames
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function getProviderBySlug(slug: string) {
  return providers.find((provider) => provider.slug === slug);
}

export const providerStats = {
  total: providers.length,
  global: providers.filter((provider) => provider.region === "global").length,
  china: providers.filter((provider) => provider.region === "china").length
};

import { agents, type AgentChannelFilter } from "@/data/agents";

export type AgentFilter = {
  query?: string;
  channel?: AgentChannelFilter;
};

export function filterAgents({ query = "", channel = "all" }: AgentFilter = {}) {
  const normalizedQuery = query.trim().toLowerCase();

  return agents.filter((agent) => {
    const matchesChannel =
      channel === "all" ||
      (channel === "official-login" && Boolean(agent.officialLogin)) ||
      (channel === "official-api" && Boolean(agent.officialApi)) ||
      channel === agent.region;

    if (!matchesChannel) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      agent.name,
      agent.vendor,
      agent.region,
      agent.summary,
      agent.officialLogin?.name,
      agent.officialLogin?.summary,
      agent.officialApi?.name,
      agent.officialApi?.summary,
      ...agent.tags
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function getAgentBySlug(slug: string) {
  return agents.find((agent) => agent.slug === slug);
}

export const agentStats = {
  total: agents.length,
  withOfficialLogin: agents.filter((agent) => Boolean(agent.officialLogin)).length,
  withOfficialApi: agents.filter((agent) => Boolean(agent.officialApi)).length
};

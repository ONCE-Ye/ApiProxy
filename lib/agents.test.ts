import { describe, expect, it } from "vitest";
import { agents } from "@/data/agents";
import { agentStats, filterAgents, getAgentBySlug } from "./agents";

describe("agent directory data", () => {
  it("contains the first batch of mainstream agent products", () => {
    expect(agents.length).toBeGreaterThanOrEqual(8);
    expect(agents.map((agent) => agent.slug)).toEqual(
      expect.arrayContaining([
        "codex",
        "claude",
        "gemini",
        "grok",
        "tongyi",
        "kimi",
        "doubao",
        "deepseek",
        "jules",
        "manus",
        "github-copilot-agent",
        "replit-agent",
        "devin"
      ])
    );
  });

  it("includes current 2025-2026 agent products with official links without duplicating parent products", () => {
    for (const slug of ["jules", "manus", "github-copilot-agent", "replit-agent", "devin"]) {
      const agent = getAgentBySlug(slug);
      expect(agent?.summary).toBeTruthy();
      expect(agent?.officialLogin?.url || agent?.officialApi?.docsUrl).toMatch(/^https:\/\//);
      expect(agent?.lastVerified).toBe("2026-06-29");
    }

    expect(getAgentBySlug("chatgpt-agent")).toBeUndefined();
    expect(getAgentBySlug("claude-code")).toBeUndefined();
    expect(getAgentBySlug("codex")?.tags).toContain("chatgpt-agent");
    expect(getAgentBySlug("claude")?.tags).toContain("claude-code");
  });

  it("models Codex as an official OpenAI coding agent without third-party provider data embedded in the agent profile", () => {
    const codex = getAgentBySlug("codex");

    expect(codex?.name).toBe("Codex");
    expect(codex?.officialLogin?.url?.startsWith("https://")).toBe(true);
    expect(codex?.officialApi?.docsUrl?.startsWith("https://")).toBe(true);
    expect(codex).not.toHaveProperty("thirdPartyApis");
    expect(getAgentBySlug("chatgpt")).toBeUndefined();
    expect(getAgentBySlug("chatgpt-agent")).toBeUndefined();
  });

  it("keeps manually curated Grok while preserving its official xAI links", () => {
    expect(getAgentBySlug("grok")?.officialLogin?.url).toBe("https://x.ai/grok");
    expect(getAgentBySlug("grok")?.officialApi?.docsUrl).toBe("https://docs.x.ai/docs");
  });

  it("keeps agent profiles focused on official channels only", () => {
    for (const agent of agents) {
      expect(agent.officialLogin?.url || agent.officialApi?.docsUrl).toBeTruthy();
      expect(agent.lastVerified).toMatch(/^2026-06-\d{2}$/);
      expect(agent).not.toHaveProperty("thirdPartyApis");

      if (agent.officialLogin) {
        expect(agent.officialLogin.url?.startsWith("https://")).toBe(true);
      }

      if (agent.officialApi) {
        expect(agent.officialApi.docsUrl?.startsWith("https://")).toBe(true);
        if (agent.officialApi.consoleUrl) {
          expect(agent.officialApi.consoleUrl.startsWith("https://")).toBe(true);
        }
      }
    }
  });
});

describe("agent filtering", () => {
  it("finds agents by name, vendor, and tag", () => {
    expect(filterAgents({ query: "Codex" }).map((agent) => agent.slug)).toContain("codex");
    expect(filterAgents({ query: "Claude" }).map((agent) => agent.slug)).toContain("claude");
    expect(filterAgents({ query: "通义" }).map((agent) => agent.slug)).toContain("tongyi");
    expect(filterAgents({ query: "DeepSeek" }).map((agent) => agent.slug)).toContain("deepseek");
    expect(filterAgents({ query: "Jules" }).map((agent) => agent.slug)).toContain("jules");
    expect(filterAgents({ query: "ChatGPT Agent" }).map((agent) => agent.slug)).toContain("codex");
    expect(filterAgents({ query: "Claude Code" }).map((agent) => agent.slug)).toContain("claude");
    expect(filterAgents({ query: "cloud coding" }).map((agent) => agent.slug)).toEqual(expect.arrayContaining(["claude", "jules", "github-copilot-agent"]));
  });

  it("does not mix third-party provider search terms into agent results", () => {
    expect(filterAgents({ query: "OpenRouter" })).toEqual([]);
    expect(filterAgents({ query: "硅基流动" })).toEqual([]);
  });

  it("returns directory-level statistics", () => {
    expect(agentStats.total).toBe(agents.length);
    expect(agentStats.withOfficialLogin).toBeGreaterThan(0);
    expect(agentStats.withOfficialApi).toBeGreaterThan(0);
  });

  it("looks up an agent by slug", () => {
    expect(getAgentBySlug("codex")?.name).toBe("Codex");
    expect(getAgentBySlug("missing")).toBeUndefined();
  });
});

import { describe, expect, it } from "vitest";
import { providers } from "@/data/providers";
import { filterProviders, getProviderBySlug, providerStats } from "./providers";

describe("provider directory data", () => {
  it("contains the verified multi-agent API providers and relay labels", () => {
    expect(providers.map((provider) => provider.slug)).toEqual(
      expect.arrayContaining(["asxs", "aihubmix", "302ai", "bailian", "beecode", "gmn", "codexcn", "wintoken", "packycode", "xyc-ai", "luminai", "ykh-ai", "linkai", "ikuncode", "poixe", "chintao", "siliconflow", "openrouter", "requesty", "github-agent-hq"])
    );
    expect(providers.map((provider) => provider.slug)).not.toContain("beeapi");
  });

  it("records provider docs, supported agents, and verification dates", () => {
    for (const provider of providers) {
      expect(provider.name).toBeTruthy();
      expect(provider.summary).toBeTruthy();
      expect(provider.docsUrl?.startsWith("https://") || provider.consoleUrl?.startsWith("https://")).toBe(true);
      expect(provider.supportedAgentSlugs.length).toBeGreaterThan(0);
      expect(typeof provider.isPureRelay).toBe("boolean");
      expect(provider.kind ?? "api-platform").toMatch(/^(api-platform|agent-portal)$/);
      expect(provider.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("provider filtering", () => {
  it("finds providers by name, summary, and supported agent", () => {
    expect(filterProviders({ query: "OpenRouter" }).map((provider) => provider.slug)).toEqual(["openrouter"]);
    expect(filterProviders({ query: "Claude" }).map((provider) => provider.slug)).toEqual(expect.arrayContaining(["openrouter", "requesty"]));
    expect(filterProviders({ query: "硅基流动" }).map((provider) => provider.slug)).toEqual(["siliconflow"]);
    expect(filterProviders({ query: "Kimi" }).map((provider) => provider.slug)).toEqual(expect.arrayContaining(["siliconflow"]));
    expect(filterProviders({ query: "DeepSeek" }).map((provider) => provider.slug)).toEqual(expect.arrayContaining(["bailian", "siliconflow", "openrouter", "requesty"]));
    expect(filterProviders({ query: "BeeCode" }).map((provider) => provider.slug)).toEqual(["beecode"]);
    expect(filterProviders({ query: "BeeAPI" })).toEqual([]);
    expect(filterProviders({ query: "GMN" }).map((provider) => provider.slug)).toEqual(["gmn"]);
    expect(filterProviders({ query: "codexcn.com" }).map((provider) => provider.slug)).toEqual(["codexcn"]);
    expect(filterProviders({ query: "PackyCode" }).map((provider) => provider.slug)).toEqual(["packycode"]);
    expect(filterProviders({ query: "relayAPI" }).map((provider) => provider.slug)).toEqual(expect.arrayContaining(["wintoken", "luminai"]));
    expect(filterProviders({ query: "万相" }).map((provider) => provider.slug)).toEqual(["bailian"]);
    expect(filterProviders({ query: "MiniMax" }).map((provider) => provider.slug)).toEqual(expect.arrayContaining(["bailian", "siliconflow"]));
    expect(filterProviders().map((provider) => provider.slug)).not.toContain("ark");
    expect(filterProviders().every((provider) => provider.supportedAgentSlugs.length >= 2)).toBe(true);
    expect(filterProviders({ query: "relay aggregator" }).map((provider) => provider.slug)).toEqual(expect.arrayContaining(["asxs", "aihubmix", "302ai", "openrouter", "requesty"]));
    expect(filterProviders({ query: "工作门户" }).map((provider) => provider.slug)).toContain("github-agent-hq");
    expect(filterProviders({ query: "Claude Code" }).map((provider) => provider.slug)).toContain("github-agent-hq");
  });

  it("filters providers by region", () => {
    expect(filterProviders({ region: "global" }).every((provider) => provider.region === "global")).toBe(true);
    expect(filterProviders({ region: "china" }).every((provider) => provider.region === "china")).toBe(true);
  });

  it("orders non-relay providers before relay providers", () => {
    const filtered = filterProviders();
    const firstRelayIndex = filtered.findIndex((provider) => provider.isPureRelay);
    const lastNonRelayIndex = filtered.findLastIndex((provider) => !provider.isPureRelay);

    expect(firstRelayIndex).toBeGreaterThan(-1);
    expect(lastNonRelayIndex).toBeGreaterThan(-1);
    expect(lastNonRelayIndex).toBeLessThan(firstRelayIndex);
  });

  it("returns provider statistics and slug lookups", () => {
    expect(providerStats.total).toBe(providers.filter((provider) => provider.supportedAgentSlugs.length >= 2).length);
    expect(providerStats.global).toBeGreaterThan(0);
    expect(providerStats.china).toBeGreaterThan(0);
    expect(providerStats.agentPortals).toBeGreaterThan(0);
    expect(getProviderBySlug("github-agent-hq")?.kind).toBe("agent-portal");
    expect(getProviderBySlug("github-agent-hq")?.consoleUrl).toBe("https://github.com/features/copilot");
    expect(getProviderBySlug("asxs")?.isPureRelay).toBe(true);
    expect(getProviderBySlug("asxs")?.supportedApiLabels).toBeUndefined();
    expect(getProviderBySlug("asxs")?.docsUrl).toBeUndefined();
    expect(getProviderBySlug("asxs")?.consoleUrl).toBe("https://api.asxs.top/");
    expect(getProviderBySlug("bailian")?.isPureRelay).toBe(false);
    expect(getProviderBySlug("bailian")?.supportedApiLabels).toEqual(expect.arrayContaining(["Token Plan", "万相", "MiniMax"]));
    expect(getProviderBySlug("siliconflow")?.docsUrl).toBe("https://docs.siliconflow.cn/cn/api-reference/chat-completions/chat-completions");
    expect(getProviderBySlug("siliconflow")?.consoleUrl).toBe("https://siliconflow.cn/");
    expect(getProviderBySlug("openrouter")?.isPureRelay).toBe(true);
    expect(getProviderBySlug("openrouter")?.docsUrl).toBe("https://openrouter.ai/docs/quickstart");
    expect(getProviderBySlug("requesty")?.docsUrl).toBe("https://docs.requesty.ai/");
    expect(getProviderBySlug("requesty")?.consoleUrl).toBe("https://app.requesty.ai/");
    expect(getProviderBySlug("beecode")?.consoleUrl).toBe("https://beecode.cc/dashboard");
    expect(getProviderBySlug("beeapi")).toBeUndefined();
    expect(getProviderBySlug("gmn")?.consoleUrl).toBe("https://gmn.chuangzuoli.com/dashboard");
    expect(getProviderBySlug("codexcn")?.consoleUrl).toBe("https://codexcn.com/");
    expect(getProviderBySlug("wintoken")?.consoleUrl).toBe("https://wintoken.dev/sign-up");
    expect(getProviderBySlug("packycode")?.supportedApiLabels).toEqual(expect.arrayContaining(["Claude Code", "Gemini"]));
    expect(getProviderBySlug("poixe")?.supportedAgentSlugs).toEqual(expect.arrayContaining(["grok", "doubao"]));
    expect(getProviderBySlug("chintao")?.lastVerified).toBe("2026-06-30");
    expect(getProviderBySlug("missing")).toBeUndefined();
  });
});

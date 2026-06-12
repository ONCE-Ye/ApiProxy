import { describe, expect, it } from "vitest";
import { providers } from "@/data/providers";
import { filterProviders, getProviderBySlug, providerStats } from "./providers";

describe("provider directory data", () => {
  it("contains the verified multi-agent API providers and relay labels", () => {
    expect(providers.map((provider) => provider.slug)).toEqual(
      expect.arrayContaining(["asxs", "aihubmix", "302ai", "bailian", "beecode", "gmn", "codexcn"])
    );
    expect(providers.map((provider) => provider.slug)).not.toContain("openrouter");
    expect(providers.map((provider) => provider.slug)).not.toContain("siliconflow");
    expect(providers.map((provider) => provider.slug)).not.toContain("beeapi");
  });

  it("records provider docs, supported agents, and verification dates", () => {
    for (const provider of providers) {
      expect(provider.name).toBeTruthy();
      expect(provider.summary).toBeTruthy();
      expect(provider.docsUrl?.startsWith("https://") || provider.consoleUrl?.startsWith("https://")).toBe(true);
      expect(provider.supportedAgentSlugs.length).toBeGreaterThan(0);
      expect(typeof provider.isPureRelay).toBe("boolean");
      expect(provider.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("provider filtering", () => {
  it("finds providers by name, summary, and supported agent", () => {
    expect(filterProviders({ query: "OpenRouter" })).toEqual([]);
    expect(filterProviders({ query: "Claude" }).map((provider) => provider.slug)).toEqual(expect.arrayContaining(["aihubmix", "302ai"]));
    expect(filterProviders({ query: "硅基流动" })).toEqual([]);
    expect(filterProviders({ query: "Kimi" }).map((provider) => provider.slug)).toEqual(expect.arrayContaining(["aihubmix", "302ai"]));
    expect(filterProviders({ query: "DeepSeek" }).map((provider) => provider.slug)).toEqual(expect.arrayContaining(["asxs", "aihubmix", "302ai", "bailian"]));
    expect(filterProviders({ query: "BeeCode" }).map((provider) => provider.slug)).toEqual(["beecode"]);
    expect(filterProviders({ query: "BeeAPI" })).toEqual([]);
    expect(filterProviders({ query: "GMN" }).map((provider) => provider.slug)).toEqual(["gmn"]);
    expect(filterProviders({ query: "codexcn.com" }).map((provider) => provider.slug)).toEqual(["codexcn"]);
    expect(filterProviders({ query: "万相" }).map((provider) => provider.slug)).toEqual(["bailian"]);
    expect(filterProviders({ query: "MiniMax" }).map((provider) => provider.slug)).toEqual(["bailian"]);
    expect(filterProviders().map((provider) => provider.slug)).not.toContain("ark");
    expect(filterProviders().map((provider) => provider.slug)).not.toContain("openrouter");
    expect(filterProviders().map((provider) => provider.slug)).not.toContain("siliconflow");
    expect(filterProviders().every((provider) => provider.supportedAgentSlugs.length >= 2)).toBe(true);
    expect(filterProviders({ query: "relay aggregator" }).map((provider) => provider.slug)).toEqual(expect.arrayContaining(["asxs", "aihubmix", "302ai"]));
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
    expect(getProviderBySlug("asxs")?.isPureRelay).toBe(true);
    expect(getProviderBySlug("asxs")?.supportedApiLabels).toBeUndefined();
    expect(getProviderBySlug("asxs")?.docsUrl).toBeUndefined();
    expect(getProviderBySlug("asxs")?.consoleUrl).toBe("https://api.asxs.top/");
    expect(getProviderBySlug("bailian")?.supportedApiLabels).toEqual(expect.arrayContaining(["Token Plan", "万相", "MiniMax"]));
    expect(getProviderBySlug("beecode")?.docsUrl).toBeUndefined();
    expect(getProviderBySlug("beecode")?.consoleUrl).toBe("https://beecode.cc/dashboard");
    expect(getProviderBySlug("beeapi")).toBeUndefined();
    expect(getProviderBySlug("gmn")?.docsUrl).toBeUndefined();
    expect(getProviderBySlug("gmn")?.consoleUrl).toBe("https://gmn.chuangzuoli.com/dashboard");
    expect(getProviderBySlug("codexcn")?.docsUrl).toBeUndefined();
    expect(getProviderBySlug("codexcn")?.consoleUrl).toBe("https://codexcn.com/");
    expect(getProviderBySlug("openrouter")).toBeUndefined();
    expect(getProviderBySlug("missing")).toBeUndefined();
  });
});

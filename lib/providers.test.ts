import { describe, expect, it } from "vitest";
import { providers } from "@/data/providers";
import { filterProviders, getProviderBySlug, providerStats } from "./providers";

describe("provider directory data", () => {
  it("contains the verified third-party API providers", () => {
    expect(providers.map((provider) => provider.slug)).toEqual(
      expect.arrayContaining(["openrouter", "bailian", "siliconflow", "ark"])
    );
  });

  it("records provider docs, supported agents, and verification dates", () => {
    for (const provider of providers) {
      expect(provider.name).toBeTruthy();
      expect(provider.summary).toBeTruthy();
      expect(provider.docsUrl.startsWith("https://")).toBe(true);
      expect(provider.supportedAgentSlugs.length).toBeGreaterThan(0);
      expect(provider.lastVerified).toBe("2026-06-09");
    }
  });
});

describe("provider filtering", () => {
  it("finds providers by name, summary, and supported agent", () => {
    expect(filterProviders({ query: "OpenRouter" }).map((provider) => provider.slug)).toContain("openrouter");
    expect(filterProviders({ query: "Claude" }).map((provider) => provider.slug)).toContain("openrouter");
    expect(filterProviders({ query: "DeepSeek" }).map((provider) => provider.slug)).toContain("siliconflow");
  });

  it("filters providers by region", () => {
    expect(filterProviders({ region: "global" }).every((provider) => provider.region === "global")).toBe(true);
    expect(filterProviders({ region: "china" }).every((provider) => provider.region === "china")).toBe(true);
  });

  it("returns provider statistics and slug lookups", () => {
    expect(providerStats.total).toBe(providers.length);
    expect(providerStats.global).toBeGreaterThan(0);
    expect(providerStats.china).toBeGreaterThan(0);
    expect(getProviderBySlug("openrouter")?.name).toBe("OpenRouter");
    expect(getProviderBySlug("missing")).toBeUndefined();
  });
});

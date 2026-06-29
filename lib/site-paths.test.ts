import { describe, expect, it } from "vitest";
import { withBasePath } from "./site-paths";

describe("site paths", () => {
  it("keeps root-relative paths unchanged without a base path", () => {
    expect(withBasePath("/agent-icons/agent-icon-set.png", "")).toBe("/agent-icons/agent-icon-set.png");
  });

  it("prefixes root-relative assets for GitHub Pages project sites", () => {
    expect(withBasePath("/agent-icons/agent-icon-set.png", "/ApiProxy")).toBe("/ApiProxy/agent-icons/agent-icon-set.png");
  });

  it("does not rewrite external URLs", () => {
    expect(withBasePath("https://example.com/docs", "/ApiProxy")).toBe("https://example.com/docs");
  });
});

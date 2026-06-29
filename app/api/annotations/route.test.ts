import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { mkdir, writeFile } from "fs/promises";

vi.mock("fs/promises", () => {
  const mkdir = vi.fn();
  const readFile = vi.fn().mockRejectedValue(new Error("missing"));
  const writeFile = vi.fn();

  return {
    default: { mkdir, readFile, writeFile },
    mkdir,
    readFile,
    writeFile
  };
});

describe("annotations API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.ENABLE_ANNOTATIONS;
  });

  it("rejects annotation writes unless explicitly enabled", async () => {
    const response = await POST(
      new Request("http://localhost/api/annotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: "需要调整间距" })
      })
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "annotations are disabled" });
    expect(mkdir).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
  });

  it("allows annotation writes when ENABLE_ANNOTATIONS is true", async () => {
    process.env.ENABLE_ANNOTATIONS = "true";

    const response = await POST(
      new Request("http://localhost/api/annotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: "需要调整间距", page: "/" })
      })
    );

    expect(response.status).toBe(200);
    expect(mkdir).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalled();
  });
});

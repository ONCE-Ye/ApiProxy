import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { AgentDirectory } from "./agent-directory";
import { agents } from "@/data/agents";
import { providers } from "@/data/providers";

describe("AgentDirectory", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders the directory and filters agent search results", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    expect(screen.getByRole("heading", { name: /API 供应导航/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /官方智能体/i })).toBeInTheDocument();
    expect(screen.getAllByText("Codex").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Claude").length).toBeGreaterThan(0);

    await userEvent.type(screen.getByLabelText("搜索 Agent"), "硅基流动");

    expect(screen.queryByText("DeepSeek")).not.toBeInTheDocument();
    expect(screen.queryByText("Gemini")).not.toBeInTheDocument();
  });

  it("renders a compact directory workspace with utility sidebar content", () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    expect(screen.getByTestId("registry-shell")).toHaveClass("bg-[#08111f]");
    expect(screen.getByRole("heading", { name: "API 供应导航" })).toBeInTheDocument();
    expect(screen.getByText("SIGNAL REGISTRY")).toBeInTheDocument();
    expect(screen.getByText("智能体入口、API 平台和工作门户分层核验")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "智能体" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "多智能体 API" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "有官方登录" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "有官方 API" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "目录规则" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "快速对比" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "联系维护" })).toBeInTheDocument();
    expect(screen.getByText("如有收录建议、链接失效或接入信息需要补充，可以通过邮箱联系我。")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "y_j-z@foxmail.com" })).toHaveAttribute("href", "mailto:y_j-z@foxmail.com");
    expect(screen.getByTestId("directory-search-panel")).toHaveClass("h-full");
    expect(screen.getByTestId("directory-stats-panel")).toHaveClass("h-full");
    expect(screen.getByTestId("agent-card-codex")).toHaveClass("min-h-[320px]");
    expect(screen.getByTestId("agent-header-codex")).toHaveClass("min-h-[72px]");
    expect(screen.getByTestId("agent-icon-codex")).toHaveClass("h-16", "w-16");
    expect(screen.getByTestId("agent-summary-codex")).toHaveClass("min-h-[72px]", "line-clamp-3");
    expect(screen.getByTestId("agent-channels-codex")).toHaveClass("min-h-[96px]");
    expect(screen.getByTestId("agent-links-codex")).toHaveClass("mt-auto", "pt-4");
    expect(screen.getByTestId("agent-card-codex")).toHaveClass("border-l-4", "border-l-[#4ea2ff]");
  });

  it("filters agents by verified official channel availability", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.click(screen.getByRole("button", { name: "有官方 API" }));

    expect(screen.getByText(/当前显示 \d+ 个智能体，只保留官方入口信息。/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "有官方 API" })).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(screen.getByRole("button", { name: "有官方登录" }));

    expect(screen.getByText(/当前显示 \d+ 个智能体，只保留官方入口信息。/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "有官方登录" })).toHaveAttribute("aria-pressed", "true");
  });

  it("shows and clears active search context", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.type(screen.getByLabelText("搜索 Agent"), "Codex");

    expect(screen.getByText("正在搜索：Codex")).toBeInTheDocument();
    expect(screen.getByText("当前显示 1 个智能体，只保留官方入口信息。")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "清除搜索" }));

    expect(screen.queryByText("正在搜索：Codex")).not.toBeInTheDocument();
    expect(screen.getByLabelText("搜索 Agent")).toHaveValue("");
  });

  it("resets stale search terms when switching directory views", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.type(screen.getByLabelText("搜索 Agent"), "Codex");
    await userEvent.click(screen.getByRole("button", { name: "多智能体 API" }));

    expect(screen.getByLabelText("搜索多智能体 API")).toHaveValue("");
    expect(screen.getByText(/当前显示 \d+ 个门户，只包含已核验的 API 平台和工作门户。/)).toBeInTheDocument();
  });

  it("uses title links as the primary detail entry", () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    expect(screen.getByRole("link", { name: "Codex" })).toHaveAttribute("href", "/agents/codex");
    expect(screen.getByRole("link", { name: "DeepSeek" })).toHaveAttribute("href", "/agents/deepseek");
  });

  it("hides annotation controls unless annotation mode is enabled by URL parameter", () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    expect(screen.queryByText("页面批注")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /批注模式/i })).not.toBeInTheDocument();
  });

  it("shows annotation controls from URL parameter before manual mode toggle", async () => {
    window.history.pushState({}, "", "/?annotations=1");

    render(<AgentDirectory agents={agents} providers={providers} />);

    expect(screen.queryByText("页面批注")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /批注模式/i })).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(screen.getByRole("button", { name: /批注模式/i }));

    expect(screen.getByText("页面批注")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /批注模式/i })).toHaveAttribute("aria-pressed", "true");
  });

  it("does not mix third-party provider names into agent search results", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.type(screen.getByLabelText("搜索 Agent"), "OpenRouter");

    expect(screen.queryByText("Claude")).not.toBeInTheDocument();
    expect(screen.queryByText("Gemini")).not.toBeInTheDocument();
  });

  it("switches to the multi-agent API directory", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.click(screen.getByRole("button", { name: "多智能体 API" }));

    expect(screen.getByRole("heading", { name: "多智能体 API 与工作门户" })).toBeInTheDocument();
    expect(screen.getAllByText("OpenRouter").length).toBeGreaterThan(0);
    expect(screen.getAllByText("硅基流动").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Requesty").length).toBeGreaterThan(0);
    expect(screen.getAllByText("阿里云百炼").length).toBeGreaterThan(0);
    expect(screen.getAllByText("ASXS API").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AIHubMix").length).toBeGreaterThan(0);
    expect(screen.getAllByText("302.AI").length).toBeGreaterThan(0);
    expect(screen.getAllByText("BeeCode AI").length).toBeGreaterThan(0);
    expect(screen.queryByText("BeeAPI")).not.toBeInTheDocument();
    expect(screen.getAllByText("GMN").length).toBeGreaterThan(0);
    expect(screen.getAllByText("CodeX CN").length).toBeGreaterThan(0);
    expect(screen.getAllByText("GitHub Agent HQ").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "GitHub Agent HQ" }).closest("article")).toHaveTextContent("工作门户");
    expect(screen.getByTestId("provider-card-openrouter")).toHaveClass("min-h-[360px]");
    expect(screen.getByTestId("provider-card-openrouter")).toHaveClass("border-l-4", "border-l-[#f0b35a]");
    expect(screen.getByTestId("provider-summary-openrouter")).not.toHaveClass("min-h-24");
    expect(screen.getByTestId("provider-support-openrouter")).not.toHaveClass("min-h-[116px]");
    expect(screen.getByTestId("provider-links-openrouter")).toHaveClass("mt-auto");
    const bailianCard = screen.getByRole("heading", { name: "阿里云百炼" }).closest("article");
    expect(bailianCard).toHaveTextContent("Token Plan");
    expect(bailianCard).toHaveTextContent("千问");
    expect(bailianCard).toHaveTextContent("万相");
    expect(bailianCard).toHaveTextContent("月之暗面");
    expect(bailianCard).toHaveTextContent("智谱AI");
    expect(bailianCard).toHaveTextContent("MiniMax");
    expect(screen.getByRole("heading", { name: "OpenRouter" }).closest("article")).not.toHaveTextContent("Token Plan");
    expect(screen.getAllByText(/支持智能体 API|支持智能体工作流/i).length).toBeGreaterThan(0);
  });

  it("only renders provider console links when they are distinct verified entries", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.click(screen.getByRole("button", { name: "多智能体 API" }));

    expect(screen.getByTestId("provider-links-openrouter")).toHaveTextContent("网站地址");
    expect(screen.getByTestId("provider-links-openrouter")).toHaveTextContent("文档");
    expect(screen.getByTestId("provider-links-requesty")).toHaveTextContent("网站地址");
    expect(screen.getByTestId("provider-links-requesty")).toHaveTextContent("文档");
    expect(screen.getByTestId("provider-links-siliconflow")).toHaveTextContent("网站地址");
    expect(screen.getByTestId("provider-links-siliconflow")).toHaveTextContent("文档");
    expect(screen.getByTestId("provider-links-bailian")).toHaveTextContent("网站地址");
    expect(screen.getByTestId("provider-links-bailian")).toHaveTextContent("文档");
    expect(screen.getByTestId("provider-links-bailian").textContent?.indexOf("网站地址")).toBeLessThan(
      screen.getByTestId("provider-links-bailian").textContent?.indexOf("文档") ?? -1
    );
  });

  it("keeps official and provider information separated in their respective cards", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    expect(screen.getAllByText("官方登录").length).toBeGreaterThan(0);
    expect(screen.getAllByText("官方 API").length).toBeGreaterThan(0);
    expect(screen.queryByText("支持智能体 API")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "多智能体 API" }));

    expect(screen.getAllByText("支持智能体 API").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "文档" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("中转站").length).toBeGreaterThan(0);
    expect(screen.queryByText("非纯中转站")).not.toBeInTheDocument();
    expect(screen.queryByText("火山方舟")).not.toBeInTheDocument();
  });

  it("orders non-relay providers before relay providers in the multi-agent API directory", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.click(screen.getByRole("button", { name: "多智能体 API" }));

    const cards = screen.getAllByTestId(/^provider-card-/).map((card) => card.getAttribute("data-testid"));
    expect(cards.indexOf("provider-card-bailian")).toBeLessThan(cards.indexOf("provider-card-asxs"));
    expect(cards.indexOf("provider-card-siliconflow")).toBeLessThan(cards.indexOf("provider-card-openrouter"));
  });

  it("shows an explicit empty state when filters return no results", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.type(screen.getByRole("textbox", { name: "搜索 Agent" }), "no-match-value");

    expect(screen.getByText("没有找到匹配结果")).toBeInTheDocument();
    expect(screen.getByText("可以尝试更换关键词或切换筛选条件。")).toBeInTheDocument();
  });

});

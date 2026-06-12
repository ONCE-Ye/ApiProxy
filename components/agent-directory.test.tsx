import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AgentDirectory } from "./agent-directory";
import { agents } from "@/data/agents";
import { providers } from "@/data/providers";

describe("AgentDirectory", () => {
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

    expect(screen.getByRole("heading", { name: "API 供应导航" })).toBeInTheDocument();
    expect(screen.getByText("官方入口与多智能体 API 供应关系分开整理")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "智能体" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "多智能体 API" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "有官方登录" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "有官方 API" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "目录规则" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "快速对比" })).toBeInTheDocument();
    expect(screen.getByTestId("directory-search-panel")).toHaveClass("h-full");
    expect(screen.getByTestId("directory-stats-panel")).toHaveClass("h-full");
    expect(screen.getByTestId("agent-icon-codex")).toHaveClass("h-16", "w-16");
    expect(screen.getByTestId("agent-summary-codex")).not.toHaveClass("min-h-12");
    expect(screen.getByTestId("agent-links-codex")).toHaveClass("mt-auto", "pt-4");
  });

  it("keeps annotation workspace hidden until annotation mode is enabled", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    expect(screen.queryByText("页面批注")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /批注模式/i }));

    expect(screen.getByText("页面批注")).toBeInTheDocument();
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

    expect(screen.getByRole("heading", { name: "多智能体 API" })).toBeInTheDocument();
    expect(screen.queryByText("OpenRouter")).not.toBeInTheDocument();
    expect(screen.queryByText("硅基流动")).not.toBeInTheDocument();
    expect(screen.getAllByText("ASXS API").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AIHubMix").length).toBeGreaterThan(0);
    expect(screen.getAllByText("302.AI").length).toBeGreaterThan(0);
    expect(screen.getAllByText("阿里云百炼").length).toBeGreaterThan(0);
    expect(screen.getAllByText("BeeCode AI").length).toBeGreaterThan(0);
    expect(screen.queryByText("BeeAPI")).not.toBeInTheDocument();
    expect(screen.getAllByText("GMN").length).toBeGreaterThan(0);
    expect(screen.getAllByText("CodeX CN").length).toBeGreaterThan(0);
    expect(screen.getByTestId("provider-card-asxs")).toHaveClass("min-h-[390px]");
    expect(screen.getByTestId("provider-summary-asxs")).not.toHaveClass("min-h-24");
    expect(screen.getByTestId("provider-support-asxs")).not.toHaveClass("min-h-[116px]");
    expect(screen.getByTestId("provider-links-asxs")).toHaveClass("mt-auto");
    const aiHubMixCard = screen.getByRole("heading", { name: "AIHubMix" }).closest("article");
    expect(aiHubMixCard?.querySelector("strong")).toHaveTextContent("平台充值，可调用不同模型厂商，平台自动扣费");
    const bailianCard = screen.getByRole("heading", { name: "阿里云百炼" }).closest("article");
    expect(bailianCard).toHaveTextContent("Token Plan");
    expect(bailianCard).toHaveTextContent("千问");
    expect(bailianCard).toHaveTextContent("万相");
    expect(bailianCard).toHaveTextContent("月之暗面");
    expect(bailianCard).toHaveTextContent("智谱AI");
    expect(bailianCard).toHaveTextContent("MiniMax");
    expect(screen.getByRole("heading", { name: "ASXS API" }).closest("article")).not.toHaveTextContent("Token Plan");
    expect(screen.getAllByText(/支持智能体 API/i).length).toBeGreaterThan(0);
  });

  it("only renders provider console links when they are distinct verified entries", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.click(screen.getByRole("button", { name: "多智能体 API" }));

    expect(screen.getByTestId("provider-links-asxs")).toHaveTextContent("网站地址");
    expect(screen.getByTestId("provider-links-asxs")).not.toHaveTextContent("文档");
    expect(screen.getByTestId("provider-links-beecode")).toHaveTextContent("网站地址");
    expect(screen.getByTestId("provider-links-beecode")).not.toHaveTextContent("文档");
    expect(screen.getByTestId("provider-links-gmn")).toHaveTextContent("网站地址");
    expect(screen.getByTestId("provider-links-gmn")).not.toHaveTextContent("文档");
    expect(screen.getByTestId("provider-links-codexcn")).toHaveTextContent("网站地址");
    expect(screen.getByTestId("provider-links-codexcn")).not.toHaveTextContent("文档");
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
    expect(cards.indexOf("provider-card-bailian")).toBeLessThan(cards.indexOf("provider-card-aihubmix"));
  });

  it("shows an explicit empty state when filters return no results", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.type(screen.getByRole("textbox", { name: "搜索 Agent" }), "no-match-value");

    expect(screen.getByText("没有找到匹配结果")).toBeInTheDocument();
    expect(screen.getByText("可以尝试更换关键词或切换筛选条件。")).toBeInTheDocument();
  });

});

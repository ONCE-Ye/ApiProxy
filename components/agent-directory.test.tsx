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
    expect(screen.getByText("官方入口与第三方 API 供应关系分开整理")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "智能体" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "第三方供应商" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "目录规则" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "快速对比" })).toBeInTheDocument();
  });

  it("does not mix third-party provider names into agent search results", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.type(screen.getByLabelText("搜索 Agent"), "OpenRouter");

    expect(screen.queryByText("Claude")).not.toBeInTheDocument();
    expect(screen.queryByText("Gemini")).not.toBeInTheDocument();
  });

  it("switches to the third-party provider directory", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.click(screen.getByRole("button", { name: "第三方供应商" }));

    expect(screen.getByRole("heading", { name: /第三方 API 供应商/i })).toBeInTheDocument();
    expect(screen.getAllByText("OpenRouter").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/支持智能体/i).length).toBeGreaterThan(0);
  });
  it("keeps official and provider information separated in their respective cards", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    expect(screen.getAllByText("官方登录").length).toBeGreaterThan(0);
    expect(screen.getAllByText("官方 API").length).toBeGreaterThan(0);
    expect(screen.queryByText("支持智能体")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "第三方供应商" }));

    expect(screen.getAllByText("支持智能体").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "文档" }).length).toBeGreaterThan(0);
  });

  it("shows an explicit empty state when filters return no results", async () => {
    render(<AgentDirectory agents={agents} providers={providers} />);

    await userEvent.type(screen.getByRole("textbox", { name: "搜索 Agent" }), "no-match-value");

    expect(screen.getByText("没有找到匹配结果")).toBeInTheDocument();
    expect(screen.getByText("可以尝试更换关键词或切换筛选条件。")).toBeInTheDocument();
  });

});

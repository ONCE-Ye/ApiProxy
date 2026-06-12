import type { AgentRegion } from "@/data/agents";

export type ProviderProfile = {
  slug: string;
  name: string;
  vendor: string;
  region: AgentRegion;
  summary: string;
  docsUrl?: string;
  consoleUrl?: string;
  supportedAgentSlugs: string[];
  supportedApiLabels?: string[];
  isPureRelay: boolean;
  notes: string;
  notesHighlight?: string;
  tags: string[];
  lastVerified: string;
};

export type ProviderRegionFilter = "all" | "china" | "global";

export const providerFilterLabels: Record<ProviderRegionFilter, string> = {
  all: "全部多智能体 API",
  china: "国内多智能体 API",
  global: "国际多智能体 API"
};

export const providers: ProviderProfile[] = [
  {
    slug: "asxs",
    name: "ASXS API",
    vendor: "ASXS",
    region: "china",
    summary: "多智能体 API 中转站，面向需要统一密钥和统一入口调用多个海外及国内智能体 API 的开发者。",
    consoleUrl: "https://api.asxs.top/",
    supportedAgentSlugs: ["claude", "codex"],
    isPureRelay: true,
    notes: "该平台按中转站口径收录：自身不作为官方智能体厂商，重点提供多家智能体 API 的转发与统一管理入口。",
    tags: ["asxs", "中转站", "api relay", "千问", "deepseek", "月之暗面"],
    lastVerified: "2026-06-12"
  },
  {
    slug: "aihubmix",
    name: "AIHubMix",
    vendor: "AIHubMix",
    region: "global",
    summary: "合规模型聚合与多智能体 API 中转平台，通过统一接口接入 OpenAI、Anthropic、Gemini、通义等模型能力。",
    docsUrl: "https://docs.aihubmix.com/cn",
    consoleUrl: "https://aihubmix.com/",
    supportedAgentSlugs: ["codex", "claude", "gemini", "grok", "tongyi", "kimi", "deepseek"],
    isPureRelay: true,
    notes: "官方文档描述其提供统一接口、多接口兼容和一站式模型能力（平台充值，可调用不同模型厂商，平台自动扣费）；当前按纯中转站供应商收录。",
    notesHighlight: "平台充值，可调用不同模型厂商，平台自动扣费",
    tags: ["aihubmix", "中转站", "relay", "aggregator", "openai-compatible", "anthropic", "gemini", "qwen", "kimi"],
    lastVerified: "2026-06-12"
  },
  {
    slug: "302ai",
    name: "302.AI",
    vendor: "302.AI",
    region: "global",
    summary: "企业级 AI 资源与 API Store，提供多家 LLM、图像、视频和工具 API 的按量调用入口。",
    docsUrl: "https://302ai-en.apifox.cn/",
    consoleUrl: "https://302.ai/",
    supportedAgentSlugs: ["codex", "claude", "gemini", "grok", "tongyi", "kimi", "doubao", "deepseek"],
    isPureRelay: true,
    notes: "平台按 API Store 和统一 API 文档组织多家模型与智能体能力，当前按纯中转站供应商收录。",
    tags: ["302ai", "302.ai", "中转站", "api store", "relay", "aggregator", "claude-code", "gemini", "deepseek", "doubao"],
    lastVerified: "2026-06-12"
  },
  {
    slug: "bailian",
    name: "阿里云百炼",
    vendor: "阿里云",
    region: "china",
    summary: "云厂商多智能体 API 平台，既提供 Qwen 官方调用入口，也按平台支持情况提供 DeepSeek 等第三方模型。",
    docsUrl: "https://help.aliyun.com/zh/model-studio/",
    consoleUrl: "https://bailian.console.aliyun.com/",
    supportedAgentSlugs: ["tongyi", "deepseek"],
    supportedApiLabels: ["Token Plan", "千问", "万相", "DeepSeek", "月之暗面", "智谱AI", "MiniMax"],
    isPureRelay: false,
    notes: "购买内容为 Token Plan，支持千问、万相、DeepSeek、月之暗面、智谱AI、MiniMax 等多个 API，具体可用性以百炼控制台为准。",
    tags: ["百炼", "aliyun", "qwen", "token plan", "万相", "deepseek", "月之暗面", "智谱ai", "minimax", "china"],
    lastVerified: "2026-06-09"
  },
  {
    slug: "beecode",
    name: "BeeCode AI",
    vendor: "BeeCode",
    region: "china",
    summary: "AI API Gateway 类型的多智能体 API 供应平台，面向需要统一入口调用 Codex、Claude 等智能体能力的开发者。",
    consoleUrl: "https://beecode.cc/dashboard",
    supportedAgentSlugs: ["codex", "claude"],
    supportedApiLabels: ["Codex", "Claude"],
    isPureRelay: true,
    notes: "公开入口标题为 AI API Gateway；当前按用户提供的智能体 API 供应商名单收录，具体可用 API 以控制台展示为准。",
    tags: ["beecode", "beecode ai", "ai api gateway", "中转站", "codex", "claude"],
    lastVerified: "2026-06-12"
  },
  {
    slug: "gmn",
    name: "GMN",
    vendor: "创作力",
    region: "china",
    summary: "AI API Gateway 类型的多智能体 API 供应平台，提供统一控制台入口。",
    consoleUrl: "https://gmn.chuangzuoli.com/dashboard",
    supportedAgentSlugs: ["codex", "claude"],
    supportedApiLabels: ["Codex", "Claude"],
    isPureRelay: true,
    notes: "公开入口标题为 AI API Gateway；当前按用户提供的智能体 API 供应商名单收录，具体可用 API 以控制台展示为准。",
    tags: ["gmn", "创作力", "chuangzuoli", "ai api gateway", "中转站", "codex", "claude"],
    lastVerified: "2026-06-12"
  },
  {
    slug: "codexcn",
    name: "CodeX CN",
    vendor: "CodeX CN",
    region: "china",
    summary: "用户提供的智能体 API 供应候选平台，当前公开页主要展示 ChatGPT Plus 与 Team 自助开通服务。",
    consoleUrl: "https://codexcn.com/",
    supportedAgentSlugs: ["codex", "claude"],
    supportedApiLabels: ["Codex", "Claude"],
    isPureRelay: true,
    notes: "公开页主要展示订阅与团队席位服务，未在公开页明确展示 API Gateway 文档；暂按用户提供名单收录，API 支持范围需要后续复核。",
    tags: ["codexcn", "codex cn", "codexcn.com", "智能体 api", "候选供应商", "codex", "claude"],
    lastVerified: "2026-06-12"
  }
];

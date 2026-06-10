import type { AgentRegion } from "@/data/agents";

export type ProviderProfile = {
  slug: string;
  name: string;
  vendor: string;
  region: AgentRegion;
  summary: string;
  docsUrl: string;
  consoleUrl?: string;
  supportedAgentSlugs: string[];
  notes: string;
  tags: string[];
  lastVerified: string;
};

export type ProviderRegionFilter = "all" | "china" | "global";

export const providerFilterLabels: Record<ProviderRegionFilter, string> = {
  all: "全部供应商",
  china: "国内供应商",
  global: "国际供应商"
};

export const providers: ProviderProfile[] = [
  {
    slug: "openrouter",
    name: "OpenRouter",
    vendor: "OpenRouter",
    region: "global",
    summary: "统一模型 API 平台，适合用一套接口接入多家海外模型与智能体能力。",
    docsUrl: "https://openrouter.ai/docs",
    consoleUrl: "https://openrouter.ai/settings/keys",
    supportedAgentSlugs: ["claude", "gemini", "grok"],
    notes: "提供的是第三方模型 API 渠道，不等同于各智能体官方账号登录。",
    tags: ["openrouter", "aggregator", "global", "multi-model"],
    lastVerified: "2026-06-09"
  },
  {
    slug: "bailian",
    name: "阿里云百炼",
    vendor: "阿里云",
    region: "china",
    summary: "云厂商模型平台，既提供 Qwen 官方调用入口，也按平台支持情况提供 DeepSeek 等第三方模型。",
    docsUrl: "https://help.aliyun.com/zh/model-studio/",
    consoleUrl: "https://bailian.console.aliyun.com/",
    supportedAgentSlugs: ["tongyi", "deepseek"],
    notes: "同时覆盖官方云 API 与第三方模型分发场景，具体模型可用性以控制台为准。",
    tags: ["百炼", "aliyun", "qwen", "deepseek", "china"],
    lastVerified: "2026-06-09"
  },
  {
    slug: "siliconflow",
    name: "硅基流动",
    vendor: "SiliconFlow",
    region: "china",
    summary: "国内第三方模型 API 平台，适合统一 key 管理、模型切换，以及接入多家国产模型能力。",
    docsUrl: "https://docs.siliconflow.cn/cn/api-reference/chat-completions/chat-completions",
    consoleUrl: "https://cloud.siliconflow.cn/",
    supportedAgentSlugs: ["tongyi", "kimi", "deepseek"],
    notes: "各模型的可用性、计费和区域能力以平台当前模型列表为准。",
    tags: ["硅基流动", "china", "aggregator", "deepseek", "qwen", "moonshot"],
    lastVerified: "2026-06-09"
  },
  {
    slug: "ark",
    name: "火山方舟",
    vendor: "火山引擎",
    region: "china",
    summary: "字节跳动旗下模型平台，提供豆包相关模型 API、模型体验和应用开发能力。",
    docsUrl: "https://www.volcengine.com/docs/82379",
    consoleUrl: "https://console.volcengine.com/ark",
    supportedAgentSlugs: ["doubao"],
    notes: "当前目录中以豆包为主，后续支持范围以火山方舟模型广场为准。",
    tags: ["火山方舟", "volcengine", "doubao", "china"],
    lastVerified: "2026-06-09"
  }
];

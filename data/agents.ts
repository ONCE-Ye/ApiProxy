export type AgentRegion = "global" | "china";

export type AgentChannel = {
  name: string;
  summary: string;
  url?: string;
  docsUrl?: string;
  consoleUrl?: string;
};

export type AgentProfile = {
  slug: string;
  name: string;
  vendor: string;
  region: AgentRegion;
  summary: string;
  officialLogin?: AgentChannel;
  officialApi?: AgentChannel;
  tags: string[];
  imagePosition: string;
  lastVerified: string;
};

export type AgentChannelFilter = "all" | "official-login" | "official-api" | "china" | "global";

export const channelFilterLabels: Record<AgentChannelFilter, string> = {
  all: "全部智能体",
  "official-login": "有官方登录",
  "official-api": "有官方 API",
  china: "国内智能体",
  global: "国际智能体"
};

export const agents: AgentProfile[] = [
  {
    slug: "codex",
    name: "Codex",
    vendor: "OpenAI",
    region: "global",
    summary: "OpenAI 面向软件工程的编码 Agent，可在云端执行代码任务；开发者可通过 OpenAI API 使用代码生成相关模型能力。",
    officialLogin: {
      name: "Codex 官方入口",
      summary: "适合在 Codex 官方入口中委派代码任务、查看运行日志、测试结果和代码变更。",
      url: "https://chatgpt.com/codex"
    },
    officialApi: {
      name: "OpenAI API",
      summary: "通过 OpenAI API 使用代码生成模型与 Responses API 构建开发者工具。",
      docsUrl: "https://developers.openai.com/api/docs/models/gpt-5.1-codex",
      consoleUrl: "https://platform.openai.com/api-keys"
    },
    tags: ["codex", "openai", "coding-agent", "code", "responses", "codex-mini"],
    imagePosition: "0% 0%",
    lastVerified: "2026-06-09"
  },
  {
    slug: "claude",
    name: "Claude",
    vendor: "Anthropic",
    region: "global",
    summary: "Anthropic 的 Claude 适合长文档、复杂推理和工具调用场景。",
    officialLogin: {
      name: "Claude 官方账号",
      summary: "适合直接使用 Claude 网页端、团队空间和文档分析能力。",
      url: "https://claude.ai/"
    },
    officialApi: {
      name: "Anthropic API",
      summary: "提供 Messages API、Tool use、MCP connector 和 Computer use 等能力。",
      docsUrl: "https://docs.anthropic.com/en/docs/agents-and-tools/overview",
      consoleUrl: "https://console.anthropic.com/settings/keys"
    },
    tags: ["claude", "anthropic", "mcp", "tool-use", "long-context"],
    imagePosition: "33.333% 0%",
    lastVerified: "2026-06-09"
  },
  {
    slug: "gemini",
    name: "Gemini",
    vendor: "Google",
    region: "global",
    summary: "Google 的多模态 Agent 产品和 API，适合搜索增强、多媒体理解和实时交互。",
    officialLogin: {
      name: "Gemini 官方账号",
      summary: "适合直接使用 Gemini 网页端和 Google 生态内的 AI 能力。",
      url: "https://gemini.google.com/"
    },
    officialApi: {
      name: "Gemini API",
      summary: "提供函数调用、代码执行、Google Search grounding 和多模态能力。",
      docsUrl: "https://ai.google.dev/gemini-api/docs",
      consoleUrl: "https://aistudio.google.com/app/apikey"
    },
    tags: ["gemini", "google", "multimodal", "function-calling", "search"],
    imagePosition: "66.666% 0%",
    lastVerified: "2026-06-09"
  },
  {
    slug: "grok",
    name: "Grok",
    vendor: "xAI",
    region: "global",
    summary: "xAI 的 Grok 面向实时信息、对话和模型 API 应用。",
    officialLogin: {
      name: "Grok 官方账号",
      summary: "适合直接使用 Grok 产品入口和 xAI 账号体系。",
      url: "https://grok.com/"
    },
    officialApi: {
      name: "xAI API",
      summary: "提供 Grok 模型、函数调用、结构化输出和 OpenAI 兼容接口。",
      docsUrl: "https://docs.x.ai/docs",
      consoleUrl: "https://console.x.ai/team/default/api-keys"
    },
    tags: ["grok", "xai", "realtime", "function-calling", "openai-compatible"],
    imagePosition: "100% 0%",
    lastVerified: "2026-06-09"
  },
  {
    slug: "tongyi",
    name: "通义千问",
    vendor: "阿里云 / 通义",
    region: "china",
    summary: "阿里通义系列面向中文对话、办公和开发者模型调用，官方 API 主要通过百炼平台提供。",
    officialLogin: {
      name: "通义官方账号",
      summary: "适合直接使用通义网页端和相关应用入口。",
      url: "https://tongyi.aliyun.com/"
    },
    officialApi: {
      name: "阿里云百炼 API",
      summary: "通过模型服务灵积/百炼调用 Qwen 系列，并支持 OpenAI 兼容接口。",
      docsUrl: "https://help.aliyun.com/zh/model-studio/use-qwen-by-calling-api",
      consoleUrl: "https://bailian.console.aliyun.com/"
    },
    tags: ["通义", "qwen", "阿里云", "百炼", "openai-compatible"],
    imagePosition: "0% 100%",
    lastVerified: "2026-06-09"
  },
  {
    slug: "kimi",
    name: "Kimi",
    vendor: "Moonshot AI / 月之暗面",
    region: "china",
    summary: "Kimi 面向长文本阅读、资料整理和中文对话，开发者可使用 Moonshot API。",
    officialLogin: {
      name: "Kimi 官方账号",
      summary: "适合直接使用 Kimi 网页端和长文档处理能力。",
      url: "https://kimi.moonshot.cn/"
    },
    officialApi: {
      name: "Moonshot AI API",
      summary: "提供 Kimi 相关模型 API，适合长上下文对话和文档应用。",
      docsUrl: "https://platform.moonshot.cn/docs",
      consoleUrl: "https://platform.moonshot.cn/console/api-keys"
    },
    tags: ["kimi", "moonshot", "long-context", "中文", "documents"],
    imagePosition: "33.333% 100%",
    lastVerified: "2026-06-09"
  },
  {
    slug: "doubao",
    name: "豆包",
    vendor: "字节跳动 / 火山引擎",
    region: "china",
    summary: "豆包是字节跳动的 AI 产品，开发者通常通过火山方舟调用豆包模型。",
    officialLogin: {
      name: "豆包官方账号",
      summary: "适合直接使用豆包网页端和应用端能力。",
      url: "https://www.doubao.com/"
    },
    officialApi: {
      name: "火山方舟 API",
      summary: "通过火山方舟调用豆包大模型，并接入模型推理和应用开发能力。",
      docsUrl: "https://www.volcengine.com/docs/82379",
      consoleUrl: "https://console.volcengine.com/ark"
    },
    tags: ["豆包", "doubao", "火山方舟", "字节", "中文"],
    imagePosition: "66.666% 100%",
    lastVerified: "2026-06-09"
  },
  {
    slug: "deepseek",
    name: "DeepSeek",
    vendor: "DeepSeek",
    region: "china",
    summary: "DeepSeek 面向推理、代码和通用对话，既有官方产品入口，也有官方 API。",
    officialLogin: {
      name: "DeepSeek 官方账号",
      summary: "适合直接使用 DeepSeek 网页端对话产品。",
      url: "https://chat.deepseek.com/"
    },
    officialApi: {
      name: "DeepSeek API",
      summary: "提供 OpenAI 兼容 API 接口，适合推理、代码和对话应用。",
      docsUrl: "https://api-docs.deepseek.com/",
      consoleUrl: "https://platform.deepseek.com/api_keys"
    },
    tags: ["deepseek", "reasoning", "code"],
    imagePosition: "100% 100%",
    lastVerified: "2026-06-09"
  }
];

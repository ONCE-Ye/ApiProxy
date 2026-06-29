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
    summary: "OpenAI 面向软件工程和通用任务执行的 Agent 入口，覆盖 Codex 编码任务、ChatGPT Agent 的网页操作/研究/连接器任务，以及通过 OpenAI API 构建开发者工具。",
    officialLogin: {
      name: "Codex 官方入口",
      summary: "适合在 Codex 官方入口中委派代码任务；ChatGPT Agent 通用任务仍归入 OpenAI 官方入口，不单独拆成重复智能体条目。",
      url: "https://chatgpt.com/codex"
    },
    officialApi: {
      name: "OpenAI API",
      summary: "通过 OpenAI API、Responses API 和 Agent 相关能力构建开发者工具、编码工作流和通用任务型 Agent。",
      docsUrl: "https://developers.openai.com/api/docs",
      consoleUrl: "https://platform.openai.com/api-keys"
    },
    tags: ["codex", "openai", "chatgpt-agent", "agent-mode", "coding-agent", "code", "responses", "browser", "terminal", "connectors", "codex-mini"],
    imagePosition: "0% 0%",
    lastVerified: "2026-06-29"
  },
  {
    slug: "claude",
    name: "Claude",
    vendor: "Anthropic",
    region: "global",
    summary: "Anthropic 的 Claude 覆盖长文档、复杂推理、工具调用和 Claude Code 软件工程 Agent；Claude Code 作为 Claude 官方能力合并展示，不单独重复建档。",
    officialLogin: {
      name: "Claude 官方账号",
      summary: "适合直接使用 Claude 网页端、团队空间、文档分析，以及 Claude Code Web/IDE/终端相关入口。",
      url: "https://claude.ai/"
    },
    officialApi: {
      name: "Anthropic API",
      summary: "提供 Messages API、Tool use、MCP connector、Computer use 和 Claude Code/Agent SDK 相关能力。",
      docsUrl: "https://docs.anthropic.com/en/docs/claude-code/overview",
      consoleUrl: "https://console.anthropic.com/settings/keys"
    },
    tags: ["claude", "claude-code", "anthropic", "mcp", "tool-use", "long-context", "coding-agent", "cloud coding", "agent-sdk"],
    imagePosition: "33.333% 0%",
    lastVerified: "2026-06-29"
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
    lastVerified: "2026-06-25"
  },
  {
    slug: "grok",
    name: "Grok",
    vendor: "xAI",
    region: "global",
    summary: "xAI 的 Grok 面向实时信息、对话和模型 API 应用。",
    officialLogin: {
      name: "Grok 官方账号",
      summary: "适合直接使用 Grok 产品入口和 xAI 账号体系；当前环境对 xAI 域名自动请求不稳定，保留为人工收录入口。",
      url: "https://x.ai/grok"
    },
    officialApi: {
      name: "xAI API",
      summary: "提供 Grok 模型、函数调用、结构化输出和 OpenAI 兼容接口；当前环境未能稳定完成自动访问复核。",
      docsUrl: "https://docs.x.ai/docs",
      consoleUrl: "https://console.x.ai/team/default/api-keys"
    },
    tags: ["grok", "xai", "realtime", "function-calling", "openai-compatible"],
    imagePosition: "100% 0%",
    lastVerified: "2026-06-15"
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
    lastVerified: "2026-06-25"
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
    lastVerified: "2026-06-25"
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
      docsUrl: "https://www.volcengine.com/docs/82379"
    },
    tags: ["豆包", "doubao", "火山方舟", "字节", "中文"],
    imagePosition: "66.666% 100%",
    lastVerified: "2026-06-25"
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
    lastVerified: "2026-06-25"
  },
  {
    slug: "jules",
    name: "Jules",
    vendor: "Google",
    region: "global",
    summary: "Google 的异步编码 Agent，可接入 GitHub 仓库，在云端规划、修改代码、展示 diff 并创建 PR。",
    officialLogin: {
      name: "Jules 官方入口",
      summary: "适合把版本升级、测试修复、bug 修复和功能开发等任务委派给云端编码 Agent。",
      url: "https://jules.google.com/"
    },
    officialApi: {
      name: "Jules 产品页",
      summary: "官方产品页说明 Jules 的 GitHub 仓库接入、Cloud VM 执行、diff 审阅和 PR 发布流程。",
      docsUrl: "https://jules.google/"
    },
    tags: ["jules", "google", "gemini", "coding-agent", "cloud coding", "github", "pull-request", "2025"],
    imagePosition: "66.666% 0%",
    lastVerified: "2026-06-29"
  },
  {
    slug: "manus",
    name: "Manus",
    vendor: "Manus / Meta",
    region: "global",
    summary: "通用任务执行 Agent，覆盖幻灯片、网站、桌面应用、设计、浏览器操作和企业 API 等多种工作流。",
    officialLogin: {
      name: "Manus 官方入口",
      summary: "适合直接使用 Manus 的网页端、设计、幻灯片、浏览器操作和团队协作能力。",
      url: "https://manus.im/"
    },
    officialApi: {
      name: "Manus API",
      summary: "官方站点提供 API 入口，适合企业或开发者接入 Manus 能力；具体能力以官方开放平台为准。",
      docsUrl: "https://open.manus.ai/"
    },
    tags: ["manus", "general-agent", "browser-operator", "slides", "website", "api", "2025"],
    imagePosition: "100% 0%",
    lastVerified: "2026-06-29"
  },
  {
    slug: "github-copilot-agent",
    name: "GitHub Copilot coding agent",
    vendor: "GitHub",
    region: "global",
    summary: "GitHub Copilot 的云端编码 Agent，可从 issue 或开发工作流触发任务，修改代码并提交分支或 draft PR。",
    officialLogin: {
      name: "GitHub Copilot 官方入口",
      summary: "适合在 GitHub、VS Code 和 Copilot 工作流里使用云端编码 Agent。",
      url: "https://github.com/features/copilot"
    },
    officialApi: {
      name: "GitHub Copilot cloud agent 文档",
      summary: "官方文档说明 Copilot cloud agent、Agent 管理、自定义 Agent、MCP 与自动化能力。",
      docsUrl: "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent"
    },
    tags: ["github", "copilot", "coding-agent", "cloud coding", "pull-request", "issue", "2025"],
    imagePosition: "0% 100%",
    lastVerified: "2026-06-29"
  },
  {
    slug: "replit-agent",
    name: "Replit Agent",
    vendor: "Replit",
    region: "global",
    summary: "Replit 的应用生成 Agent，可用自然语言规划、创建、测试并发布 Web 应用、设计稿、数据看板等项目。",
    officialLogin: {
      name: "Replit Agent 官方入口",
      summary: "适合从自然语言开始创建应用，并在 Replit 工作区中继续调试和发布。",
      url: "https://replit.com/agent"
    },
    officialApi: {
      name: "Replit Agent 文档",
      summary: "官方文档说明 Agent 的项目创建、Plan mode、Agent modes、测试和多产物输出。",
      docsUrl: "https://docs.replit.com/replitai/agent"
    },
    tags: ["replit", "replit-agent", "app-builder", "web-app", "design", "cloud coding", "2025"],
    imagePosition: "33.333% 100%",
    lastVerified: "2026-06-29"
  },
  {
    slug: "devin",
    name: "Devin",
    vendor: "Cognition",
    region: "global",
    summary: "Cognition 的软件工程 Agent，可在现有代码库和团队工具中规划、编写、测试并交付生产代码。",
    officialLogin: {
      name: "Devin 官方入口",
      summary: "适合企业软件工程团队委派开发、测试、维护和交付类任务。",
      url: "https://devin.ai/"
    },
    officialApi: {
      name: "Cognition 官方说明",
      summary: "Cognition 官网说明 Devin 可在代码库和团队工具中规划、编写、测试并发布代码。",
      docsUrl: "https://cognition.ai/"
    },
    tags: ["devin", "cognition", "software-engineer", "coding-agent", "cloud coding", "2025", "2026"],
    imagePosition: "66.666% 100%",
    lastVerified: "2026-06-29"
  }
];

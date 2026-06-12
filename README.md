# API 供应导航

一个基于 Next.js 14 的目录站点，用来分开展示智能体官方入口与多智能体 API 平台信息，便于快速核对可登录渠道、官方 API 和多智能体 API 接入平台。

## 当前范围

- `智能体`：只展示官方登录入口、官方 API、基础说明
- `多智能体 API`：单独展示支持 2 个及以上智能体 API 的平台、支持范围、中转站标签、网站地址与文档入口
- 搜索与筛选：按名称、标签、区域快速过滤
- 详情页：分别提供智能体详情页和多智能体 API 平台详情页

## 本地开发

```bash
npm install
npm run dev
```

默认开发地址：

- `http://localhost:3000`

常用命令：

```bash
npm run build   # 生产构建
npm run lint    # 代码检查
npm test        # Vitest 测试
```

## 项目结构

```text
app/                 Next.js 路由与 API
components/          页面组件
data/                智能体与多智能体 API 平台静态数据
lib/                 过滤、统计等纯函数
public/agent-icons/  站点静态图标资源
docs/                设计与实现记录
```

关键文件：

- `data/agents.ts`：智能体官方信息
- `data/providers.ts`：多智能体 API 平台信息
- `components/agent-directory.tsx`：首页主目录界面

## 数据维护规则

1. 不要把多智能体 API 平台重新混入智能体官方卡片。
2. 智能体数据里优先维护 `officialLogin` 和 `officialApi`。
3. 多智能体 API 平台数据里维护 `supportedAgentSlugs`、`isPureRelay`、可选的 `docsUrl`、可选的 `consoleUrl` 和说明文本；没有独立文档地址时不要用控制台地址冒充文档。
4. 重新核验过信息后更新 `lastVerified`。

## 测试

项目使用 `Vitest` 和 `Testing Library`。涉及筛选逻辑、数据结构或目录展示变更时，需同步更新测试：

- `components/*.test.tsx`
- `lib/*.test.ts`

提交前至少运行：

```bash
npm test
npm run build
```

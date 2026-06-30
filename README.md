# AI 接入导航

一个基于 Next.js 14 的目录站点，用来汇总官方智能体入口、多模型 API 平台、中转站和工作门户，便于快速核对用途、支持范围、访问入口和最近核验时间。

## 当前范围

- `智能体`：只展示官方登录入口、官方 API、基础说明
- `多智能体 API`：单独展示支持 2 个及以上智能体 API 的平台、支持范围、中转站标签、网站地址与文档入口
- `页面批注`：默认关闭；访问带 `?annotations=1` 参数的页面后，可手动开启批注模式并保存到本地 `.annotations/page-notes.json`
- 搜索与筛选：按名称、标签、区域快速过滤
- 详情页：分别提供智能体详情页和多智能体 API 平台详情页

## 本地开发

```bash
npm install
npm run dev
```

默认开发地址：

- `http://localhost:3000`

本项目协作调试时常用端口：

```bash
npm run dev -- -H 0.0.0.0 -p 3004
```

对应浏览器地址：

- `http://localhost:3004`

确认服务是否已启动：

```bash
curl -I http://localhost:3004
```

返回 `HTTP/1.1 200 OK` 即可在浏览器打开。如果浏览器打不开，先确认终端里的 `npm run dev -- -H 0.0.0.0 -p 3004` 仍在运行；如果服务已退出，重新执行上面的 3004 端口启动命令。

常用命令：

```bash
npm run build   # 生产构建
npm run lint    # 代码检查
npm test        # Vitest 测试
```

注意：不要在 `npm run dev` 正在运行时直接执行 `npm run build`。Next.js 的 `.next` 开发缓存和生产构建产物可能互相覆盖，导致页面 chunk 404、页面 500 或 API 路由临时 404。需要构建时，先停止 dev server。

如果 `http://localhost:3004` 返回 500，或页面报类似 `Cannot find module './xxx.js'` 的 chunk 缺失错误，按下面步骤重启：

```bash
# 1. 停止正在运行的 dev server：在运行 npm run dev 的终端按 Ctrl+C

# 2. 清理 Next.js 缓存
rm -rf .next

# 3. 重新启动
npm run dev -- -H 0.0.0.0 -p 3004
```

重新启动后再打开：

- `http://localhost:3004`

## 公网部署

### 免费方案：GitHub Pages

当前仓库已配置 GitHub Pages 静态部署工作流：`.github/workflows/pages.yml`。推送到 `main` 分支后，GitHub Actions 会执行静态导出并发布到 GitHub Pages。

首次启用步骤：

1. 打开 GitHub 仓库 `ONCE-Ye/ApiProxy`。
2. 进入 `Settings` -> `Pages`。
3. 在 `Build and deployment` 中将 `Source` 设置为 `GitHub Actions`。
4. 推送 `main` 分支，或在 `Actions` 中手动运行 `Deploy GitHub Pages`。
5. 部署完成后访问 `https://ONCE-Ye.github.io/ApiProxy/`。

本地验证 GitHub Pages 静态构建：

```bash
npm run build:pages
```

该命令会设置 `GITHUB_PAGES=true`，让 Next.js 使用 `/ApiProxy` 作为 `basePath`，并将静态文件导出到 `out/`。`out/` 是构建产物，不需要提交。

注意：GitHub Pages 是静态托管，适合当前目录浏览、搜索、筛选和详情页访问，但不支持公网环境中的 `POST /api/annotations` 批注写入。页面批注仍建议只在本地或后续接入数据库后使用。

### 可选方案：Vercel

也可以使用 Vercel 部署当前 Next.js 应用：

1. 登录 `https://vercel.com`，选择 `Add New Project`。
2. 导入 GitHub 仓库 `ONCE-Ye/ApiProxy`。
3. Framework 选择 `Next.js`，Build command 使用默认的 `npm run build`。
4. 点击 `Deploy`，部署完成后会得到一个 `*.vercel.app` 公网地址。
5. 后续推送到 `main` 分支后，Vercel 会自动重新构建和发布。

公网环境默认不要开启页面批注写入。`app/api/annotations/route.ts` 只有在环境变量 `ENABLE_ANNOTATIONS=true` 时才允许 `POST /api/annotations` 写入本地批注文件；未设置时会返回 `403`。Vercel 等 serverless 平台也不适合依赖本地文件做长期持久化。

如需在受控环境临时开启批注写入：

```bash
ENABLE_ANNOTATIONS=true npm run dev -- -H 0.0.0.0 -p 3004
```

公网如果需要长期批注能力，应先接入数据库和访问控制，再开启写入。

## 项目结构

```text
app/                 Next.js 路由与 API
app/api/annotations/ 页面批注读写 API
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
- `app/api/annotations/route.ts`：本地页面批注 API

## 数据维护规则

1. 不要把多智能体 API 平台重新混入智能体官方卡片。
2. 智能体数据里优先维护 `officialLogin` 和 `officialApi`。
3. 多智能体 API 平台数据里维护 `supportedAgentSlugs`、`isPureRelay`、可选的 `docsUrl`、可选的 `consoleUrl` 和说明文本；没有独立文档地址时不要用控制台地址冒充文档。
4. `isPureRelay` 仍用于判断和排序：中转站供应商排在非纯中转站后面；界面只显示“中转站”标签，不显示“非纯中转站”标签。
5. 供应商入口按钮文案使用“网站地址”和“文档”；有网站地址时放在文档前面。
6. 重新核验过信息后更新 `lastVerified`。

## 批注工作流

1. 默认页面不显示批注入口。需要批注时，打开带参数的地址，例如 `http://localhost:3004/?annotations=1`。
2. 点击右上角 `批注模式`，手动进入批注状态。
3. 本地需要保存批注时，先用 `ENABLE_ANNOTATIONS=true npm run dev -- -H 0.0.0.0 -p 3004` 启动服务。
4. 点击需要修改的区域，直接填写修改意见。
5. 点击 `保存到项目批注`，批注会写入 `.annotations/page-notes.json`。
6. `.annotations/` 已加入 `.gitignore`，批注只作为本地协作输入，不提交到仓库。

如果保存失败，先确认 `app/api/annotations/route.ts` 是否被 dev server 正确识别。常见修复方式是停止 dev server、删除 `.next`、重新执行 `npm run dev -- -H 0.0.0.0 -p 3004`。

## 测试

项目使用 `Vitest` 和 `Testing Library`。涉及筛选逻辑、数据结构或目录展示变更时，需同步更新测试：

- `components/*.test.tsx`
- `lib/*.test.ts`

提交前至少运行：

```bash
npm test
npm run lint
```

涉及路由、静态生成或生产构建风险时，再在停止 dev server 后运行：

```bash
npm run build
```

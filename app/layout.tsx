import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI 接入导航",
    template: "%s | AI 接入导航"
  },
  description: "汇总官方智能体入口、多模型 API 平台、中转站和工作门户，便于核对访问入口、支持范围和最近核验时间。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

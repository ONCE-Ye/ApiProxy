import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "API 供应导航",
    template: "%s | API 供应导航"
  },
  description: "分开展示官方智能体入口与多智能体 API 平台信息，便于核对官方渠道和供应关系。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

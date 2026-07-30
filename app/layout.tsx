// app/layout.tsx
// 应用程序的根布局组件 - 所有页面的外层容器
// Root layout component - Outer container for all pages

// 导入 Next.js 的 Metadata 类型（用于页面元数据）
// Import Next.js Metadata type (for page metadata)
import type { Metadata } from "next"

// 导入 Google 字体 Inter
// Import Google Font Inter
import { Inter } from "next/font/google"

// 导入全局样式文件
// Import global styles
import "./globals.css"  // 这个警告可以忽略，不影响运行 / This warning can be ignored, doesn't affect runtime

// 导入工具函数 cn（用于合并 CSS 类名）
// Import utility function cn (for merging CSS class names)
import { cn } from "@/lib/utils"

// 导入全局 Providers（SessionProvider + QueryClientProvider）
// Import global Providers (SessionProvider + QueryClientProvider)
import { Providers } from "./providers"

// ------------------------------------------------------------
// 配置 Inter 字体（只使用拉丁字母子集）
// Configure Inter font (use only Latin subset)
// ------------------------------------------------------------
const inter = Inter({ subsets: ["latin"] })

// ------------------------------------------------------------
// 导出页面元数据（会被 Next.js 用于 <head> 标签）
// Export page metadata (used by Next.js for <head> tag)
// ------------------------------------------------------------
export const metadata: Metadata = {
  // 浏览器标签页标题 / Browser tab title
  title: "GitInsight - Developer Intelligence Platform",
  
  // 页面描述（用于 SEO 和社交媒体分享）
  // Page description (for SEO and social media sharing)
  description: "Track your GitHub activity, analyze your productivity, and gain AI-powered insights.",
}

// ------------------------------------------------------------
// 根布局组件 - 所有页面的最外层
// Root layout component - Outermost layer of all pages
// ------------------------------------------------------------
export default function RootLayout({
  children,  // 子组件（即当前访问的页面内容）/ Child components (the current page content)
}: {
  children: React.ReactNode
}) {
  return (
    // html 标签 - 整个应用的根元素
    // html tag - Root element of the entire application
    // suppressHydrationWarning: 忽略 hydration 警告（通常由第三方插件引起）
    // suppressHydrationWarning: Ignore hydration warnings (usually caused by third-party plugins)
    <html lang="en" suppressHydrationWarning>
      
      {/* body 标签 - 页面主体 */}
      {/* body tag - Page body */}
      {/* 
        className 组合：
        - inter.className: Inter 字体样式 / Inter font styles
        - min-h-screen: 最小高度为整个视口 / Minimum height is full viewport
        - bg-background: 背景色（来自 CSS 变量）/ Background color (from CSS variable)
        - antialiased: 字体抗锯齿 / Font anti-aliasing
      */}
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        
        {/* 
          Providers 包裹所有子组件，提供：
          - SessionProvider: GitHub 登录状态 / GitHub authentication state
          - QueryClientProvider: 数据缓存和请求管理 / Data caching and request management
        */}
        <Providers>
          {children}  {/* 当前页面的内容 / Current page content */}
        </Providers>
        
      </body>
    </html>
  )
}
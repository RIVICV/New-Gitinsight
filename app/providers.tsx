// app/providers.tsx
// 全局 Providers 组件 - 为整个应用提供上下文和状态管理
// Global Providers component - Provides context and state management for the entire application

// ============================================================
// 客户端组件标识 - 此组件必须在客户端运行
// Client component identifier - This component must run on the client side
// ============================================================
"use client"

// ============================================================
// 导入依赖
// Import dependencies
// ============================================================

// NextAuth 的 SessionProvider - 提供全局认证状态
// NextAuth SessionProvider - Provides global authentication state
import { SessionProvider } from "next-auth/react"

// TanStack Query 的客户端和 Provider - 提供数据缓存和请求管理
// TanStack Query client and Provider - Provides data caching and request management
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// React 钩子 - useState 管理状态，useEffect 处理副作用
// React hooks - useState for state management, useEffect for side effects
import { useState, useEffect } from "react"

// 主题状态管理 Store - 管理暗色/亮色主题
// Theme state management Store - Manages dark/light theme
import { useThemeStore } from "@/lib/theme-store"

// ============================================================
// 主题初始化组件
// Theme Initializer Component
// ============================================================

/**
 * ThemeInitializer 组件
 * 负责在应用启动时应用用户选择的主题
 * 监听主题变化并同步到 DOM
 * 
 * ThemeInitializer Component
 * Applies the user's selected theme when the application starts
 * Listens for theme changes and syncs them to the DOM
 */
function ThemeInitializer() {
  // ============================================================
  // 从主题 Store 获取当前主题模式
  // Get current theme mode from theme Store
  // ============================================================
  const { mode } = useThemeStore()
  
  // ============================================================
  // 副作用：应用主题到 DOM
  // Side effect: Apply theme to DOM
  // ============================================================
  useEffect(() => {
    // 获取 HTML 根元素（<html> 标签）
    // Get the HTML root element (<html> tag)
    const root = document.documentElement
    
    // ============================================================
    // 根据主题模式切换暗色/亮色
    // Switch dark/light based on theme mode
    // ============================================================
    if (mode === 'system') {
      // 跟随系统主题
      // Follow system theme
      // 检测系统是否处于暗色模式
      // Detect if system is in dark mode
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      // 添加或移除 'dark' class 到 <html> 标签
      // Add or remove 'dark' class on the <html> tag
      root.classList.toggle('dark', isDark)
    } else {
      // 使用用户手动选择的主题
      // Use user's manually selected theme
      // mode === 'dark' 时添加 dark class，否则移除
      // Add dark class when mode === 'dark', otherwise remove
      root.classList.toggle('dark', mode === 'dark')
    }
  }, [mode]) // 当 mode 变化时重新执行 / Re-run when mode changes
  
  // 此组件不渲染任何 UI
  // This component doesn't render any UI
  return null
}

// ============================================================
// 全局 Providers 组件
// Global Providers Component
// ============================================================

/**
 * Providers 组件
 * 包裹整个应用，提供：
 * 1. SessionProvider — GitHub 认证状态
 * 2. QueryClientProvider — 数据缓存和请求管理
 * 3. ThemeInitializer — 主题初始化
 * 
 * Providers Component
 * Wraps the entire application, provides:
 * 1. SessionProvider — GitHub authentication state
 * 2. QueryClientProvider — Data caching and request management
 * 3. ThemeInitializer — Theme initialization
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // ============================================================
  // 创建 QueryClient 实例（只创建一次，避免重新渲染时重建）
  // Create QueryClient instance (only once, avoid recreation on re-render)
  // ============================================================
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // ============================================================
        // 数据过期时间：30 秒
        // Data stale time: 30 seconds
        // 30 秒内数据被视为"新鲜"，不会重新请求
        // Data is considered "fresh" for 30 seconds, no re-fetch
        // ============================================================
        staleTime: 30 * 1000,
        
        // ============================================================
        // 窗口重新获得焦点时自动重新获取数据
        // Auto re-fetch data when window regains focus
        // 用户切换回页面时自动更新数据
        // Auto-update data when user switches back to the page
        // ============================================================
        refetchOnWindowFocus: true,
        
        // ============================================================
        // 组件重新挂载时重新获取数据
        // Re-fetch data when component re-mounts
        // ============================================================
        refetchOnMount: true,
      },
    },
  }))

  // ============================================================
  // 渲染 Provider 层级结构
  // Render Provider hierarchy
  // ============================================================
  return (
    // ============================================================
    // SessionProvider — 提供 GitHub 登录状态
    // SessionProvider — Provides GitHub login state
    // 所有子组件都可以使用 useSession() 获取用户信息
    // All child components can use useSession() to get user info
    // ============================================================
    <SessionProvider>
      {/* ============================================================
          QueryClientProvider — 提供数据缓存和请求管理
          QueryClientProvider — Provides data caching and request management
          所有子组件都可以使用 useQuery() 和 useMutation()
          All child components can use useQuery() and useMutation()
          ============================================================ */}
      <QueryClientProvider client={queryClient}>
        {/* ============================================================
            ThemeInitializer — 初始化主题（在应用启动时运行）
            ThemeInitializer — Initializes theme (runs on app startup)
            不渲染任何 UI，只负责应用主题样式
            Doesn't render any UI, only applies theme styles
            ============================================================ */}
        <ThemeInitializer />
        
        {/* ============================================================
            子组件（即当前访问的页面内容）
            Child components (the current page content)
            所有页面都在这里被渲染
            All pages are rendered here
            ============================================================ */}
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}
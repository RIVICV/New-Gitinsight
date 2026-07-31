// app/providers.tsx
"use client"

import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useThemeStore } from "@/lib/theme-store"

function ThemeInitializer() {
  const { mode } = useThemeStore()
  
  useEffect(() => {
    // 初始化时应用主题
    const root = document.documentElement
    if (mode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', isDark)
    } else {
      root.classList.toggle('dark', mode === 'dark')
    }
  }, [mode])
  
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
      },
    },
  }))

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeInitializer />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}
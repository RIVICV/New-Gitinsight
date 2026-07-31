// lib/theme-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeStore {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  resolvedTheme: 'light' | 'dark'
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'system',
      setMode: (mode) => {
        set({ mode })
        // 立即应用主题
        applyTheme(mode)
      },
      get resolvedTheme() {
        const { mode } = get()
        if (mode === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return mode
      },
    }),
    {
      name: 'theme-storage', // 存储在 localStorage 中的 key
    }
  )
)

// 应用主题到 DOM
function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  
  if (mode === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', isDark)
  } else {
    root.classList.toggle('dark', mode === 'dark')
  }
}

// 监听系统主题变化
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    const { mode } = useThemeStore.getState()
    if (mode === 'system') {
      applyTheme('system')
    }
  })
}
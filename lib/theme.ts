// lib/theme.ts
import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

export const useTheme = create<ThemeStore>((set, get) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  get resolvedTheme() {
    const { theme } = get()
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  },
}))
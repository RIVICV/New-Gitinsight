// components/dashboard/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { 
  LayoutDashboard, 
  FolderGit2, 
  GitPullRequest, 
  AlertCircle, 
  BarChart3, 
  Sparkles, 
  Settings, 
  LogOut 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 自定义 GitHub SVG 图标
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const menuItems = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/repositories", label: "Repositories", icon: FolderGit2 },
  { href: "/dashboard/pull-requests", label: "Pull Requests", icon: GitPullRequest },
  { href: "/dashboard/issues", label: "Issues", icon: AlertCircle },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/ai", label: "AI Insights", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      {/* Logo 区域 */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <GithubIcon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-lg font-bold tracking-tight">GitInsight</span>
        <span className="ml-auto text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
          AI
        </span>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-0.5"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-transform duration-200",
                isActive ? "text-primary-foreground" : "group-hover:scale-110"
              )} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* 用户信息 */}
      <div className="p-4 border-t bg-muted/30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 px-2 hover:bg-muted/50 transition-colors"
            >
              <Avatar className="w-8 h-8 ring-2 ring-primary/10">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm min-w-0">
                <span className="font-medium truncate max-w-[100px]">{session?.user?.name}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {session?.user?.email}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="gap-2 text-red-500 focus:text-red-500">
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
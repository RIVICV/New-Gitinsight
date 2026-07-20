// components/ui/icons.tsx
import { 
  Github,  // 如果还是报错，改成 GitHub
  LayoutDashboard, 
  FolderGit2,
  GitPullRequest, 
  AlertCircle,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
  Star,
  Users,
  GitBranch,
  Zap
} from "lucide-react"

// 重新导出，统一命名
export const Icons = {
  github: Github,
  dashboard: LayoutDashboard,
  repo: FolderGit2,
  pr: GitPullRequest,
  issue: AlertCircle,
  analytics: BarChart3,
  ai: Sparkles,
  settings: Settings,
  logout: LogOut,
  star: Star,
  users: Users,
  branch: GitBranch,
  zap: Zap,
}
// components/ui/icons.tsx
import { 
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
import { GithubIcon } from "./github-icon"

export const Icons = {
  github: GithubIcon,  // 使用自定义 SVG
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
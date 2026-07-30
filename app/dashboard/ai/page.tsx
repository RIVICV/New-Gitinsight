// app/dashboard/ai/page.tsx
// AI 洞察页面 - 提供 AI 驱动的 GitHub 活动分析和建议
// AI Insights page - Provides AI-powered analysis and recommendations for GitHub activity

// 客户端组件标识（Next.js 要求）
// Client component identifier (required by Next.js)
"use client"

// 导入 NextAuth 的 session 钩子
// Import NextAuth session hook
import { useSession } from "next-auth/react"

// 导入 TanStack Query 的数据获取钩子
// Import TanStack Query data fetching hook
import { useQuery } from "@tanstack/react-query"

// 导入 React 状态管理钩子
// Import React state management hook
import { useState } from "react"

// 导入 Markdown 渲染器
// Import Markdown renderer
import ReactMarkdown from 'react-markdown'

// 导入 GitHub 风格的 Markdown 插件（支持表格、删除线等）
// Import GitHub-flavored Markdown plugin (supports tables, strikethrough, etc.)
import remarkGfm from 'remark-gfm'

// 导入 HTML 解析插件（允许在 Markdown 中嵌入 HTML）
// Import HTML parse plugin (allows HTML in Markdown)
import rehypeRaw from 'rehype-raw'

// 导入 Lucide 图标
// Import Lucide icons
import { 
  Sparkles,        // 魔法棒图标 - 表示 AI 功能 / Magic wand - represents AI features
  Loader2,         // 加载动画图标 / Loading spinner icon
  FileText,        // 文件图标 - 表示 README 生成 / File icon - represents README generation
  BookOpen,        // 书本图标 - 表示发布说明 / Book icon - represents release notes
  User,            // 用户图标 - 表示简历 / User icon - represents resume
  TrendingUp,      // 上升趋势图标 - 表示分析 / Trending up icon - represents analysis
  Code2,           // 代码图标 - 表示仓库 / Code icon - represents repositories
  Star,            // 星星图标 - 表示 Star 数 / Star icon - represents star count
  Award,           // 奖杯图标 - 表示生产力得分 / Award icon - represents productivity score
  Target           // 靶心图标 - 表示一致性得分 / Target icon - represents consistency score
} from "lucide-react"

// 导入 UI 组件
// Import UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// 导入 AI 服务和上下文构建器
// Import AI service and context builder
import AIService from "@/services/ai.service"
import AIContextBuilder from "@/services/ai-context-builder"

// ============================================================
// 数据获取函数
// Data fetch function
// ============================================================

// 从 API 获取 AI 分析所需的数据
// Fetch AI analysis data from API
async function fetchAIData(accessToken: string) {
  // 调用 analytics API，携带用户的 access_token
  // Call analytics API with user's access_token
  const res = await fetch("/api/github/analytics", {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  // 如果响应失败，抛出错误
  // Throw error if response fails
  if (!res.ok) throw new Error("Failed to fetch")
  // 解析并返回 JSON 数据
  // Parse and return JSON data
  return res.json()
}

// ============================================================
// 页面主组件
// Page main component
// ============================================================

export default function AIPage() {
  // 获取用户 session（包含 access_token）
  // Get user session (contains access_token)
  const { data: session } = useSession()
  
  // 状态管理
  // State management
  const [loading, setLoading] = useState(false)           // 是否正在生成 AI 响应 / Is AI response being generated
  const [result, setResult] = useState<string | null>(null)  // AI 响应内容 / AI response content
  const [activeFeature, setActiveFeature] = useState<string | null>(null)  // 当前激活的功能 / Currently active feature

  // 使用 TanStack Query 获取分析数据
  // Use TanStack Query to fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["ai-analytics"],                           // 缓存键 / Cache key
    queryFn: () => fetchAIData(session?.accessToken!),    // 数据获取函数 / Data fetch function
    enabled: !!session?.accessToken,                      // 只有有 token 时才执行 / Only execute when token exists
  })

  // ============================================================
  // AI 功能处理函数
  // AI feature handler functions
  // ============================================================

  // 生成 AI 洞察
  // Generate AI insights
  const generateInsights = async () => {
    // 如果没有数据，直接返回
    // Return if no data
    if (!analyticsData) return
    
    // 设置加载状态
    // Set loading state
    setLoading(true)
    setActiveFeature("analyze")  // 标记当前功能 / Mark current feature
    setResult(null)              // 清空旧结果 / Clear old result

    try {
      // 解构获取数据
      // Destructure data
      const { user, repos, events, metrics } = analyticsData
      
      // 使用上下文构建器创建开发者上下文
      // Use context builder to create developer context
      const context = AIContextBuilder.buildContext(user, repos, events, metrics)
      
      // 调用 AI 服务生成洞察
      // Call AI service to generate insights
      const response = await AIService.generateInsight(context)
      
      // 设置结果
      // Set result
      setResult(response)
    } catch (error) {
      // 错误处理
      // Error handling
      setResult("Error generating insights. Please try again.")
    } finally {
      // 无论成功还是失败，都结束加载状态
      // End loading state regardless of success or failure
      setLoading(false)
    }
  }

  // 生成简历摘要
  // Generate resume summary
  const generateResume = async () => {
    if (!analyticsData) return
    setLoading(true)
    setActiveFeature("resume")
    setResult(null)

    try {
      const { user, repos, events, metrics } = analyticsData
      const context = AIContextBuilder.buildContext(user, repos, events, metrics)
      const response = await AIService.generateResumeSummary(context)
      setResult(response)
    } catch (error) {
      setResult("Error generating resume summary. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // 生成 README
  // Generate README
  const generateReadme = async () => {
    if (!analyticsData) return
    setLoading(true)
    setActiveFeature("readme")
    setResult(null)

    try {
      const { repos, metrics } = analyticsData
      
      // 取第一个仓库（如果没有则使用默认值）
      // Use first repository (or default if none)
      const repo = repos[0] || { 
        name: "my-project", 
        description: "A modern software project" 
      }
      
      // 提取语言名称列表
      // Extract language names
      const languages = metrics.technologyProfile.languages.map((l: any) => l.name)
      
      // 调用 AI 服务生成 README
      // Call AI service to generate README
      const response = await AIService.generateRepositoryReadme(
        repo.name,
        repo.description,
        languages
      )
      setResult(response)
    } catch (error) {
      setResult("Error generating README. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // 生成发布说明
  // Generate release notes
  const generateReleaseNotes = async () => {
    if (!analyticsData) return
    setLoading(true)
    setActiveFeature("release")
    setResult(null)

    try {
      const { events } = analyticsData
      
      // 从事件中提取最近的提交
      // Extract recent commits from events
      const recentCommits = events
        .filter((e: any) => e.type === 'PushEvent')      // 只取推送事件 / Only push events
        .slice(0, 10)                                    // 取前 10 个 / Take top 10
        .map((e: any) => ({
          message: e.payload?.commits?.[0]?.message || 'Update',  // 提交信息 / Commit message
          date: new Date(e.created_at).toLocaleDateString()       // 提交日期 / Commit date
        }))

      // 构建 Markdown 格式的发布说明
      // Build Markdown-formatted release notes
      const response = `## 📦 Release Notes v1.0.0

### 📅 Release Date
${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

### 🆕 New Features
${recentCommits.length > 0 
  ? recentCommits.map((c: any) => `- ${c.message}`).join('\n')
  : '- Initial project release\n- GitHub integration\n- AI-powered insights\n- Analytics dashboard'}

### 🔧 Improvements
- Optimized performance
- Enhanced user experience
- Improved error handling

### 🐛 Bug Fixes
- Fixed authentication flow
- Resolved data loading issues

### 📊 Contributors
- @${analyticsData.user?.login || 'yourusername'}`
      
      setResult(response)
    } catch (error) {
      setResult("Error generating release notes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // 加载状态
  // Loading state
  // ============================================================
  
  // 如果正在加载初始数据，显示加载动画
  // Show loading spinner if initial data is loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    )
  }

  // ============================================================
  // 无数据状态
  // No data state
  // ============================================================
  
  // 如果没有数据，显示提示
  // Show prompt if no data
  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">No data available. Please connect your GitHub account.</p>
        </div>
      </div>
    )
  }

  // ============================================================
  // 数据解构
  // Data destructuring
  // ============================================================
  
  // 从数据中提取需要的字段
  // Extract needed fields from data
  const { metrics, totalRepos, totalStars } = analyticsData
  const languages = metrics?.technologyProfile?.languages || []
  const topLanguages = languages.slice(0, 3).map((l: any) => l.name).join(', ')

  // ============================================================
  // 主渲染
  // Main render
  // ============================================================
  
  return (
    <div className="space-y-6">
      {/* ----- 页面头部 / Page Header ----- */}
      <div>
        <h1 className="text-3xl font-bold">AI Insights</h1>
        <p className="text-muted-foreground">
          Get AI-powered analysis and recommendations for your GitHub activity
        </p>
      </div>

      {/* ----- 开发者概览卡片 / Developer Overview Cards ----- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 仓库数卡片 / Repositories Card */}
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Code2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Repositories</p>
              <p className="text-xl font-bold">{totalRepos || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Star 总数卡片 / Total Stars Card */}
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Stars</p>
              <p className="text-xl font-bold">{totalStars || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* 生产力得分卡片 / Productivity Score Card */}
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Productivity</p>
              <p className="text-xl font-bold">{metrics?.productivityScore || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* 一致性得分卡片 / Consistency Score Card */}
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consistency</p>
              <p className="text-xl font-bold">{metrics?.consistencyScore || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ----- 技术栈概览 / Technology Stack Overview ----- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 语言标签列表 / Language tag list */}
          <div className="flex flex-wrap gap-2">
            {languages.length > 0 ? (
              languages.map((lang: any, i: number) => (
                <Badge key={i} variant="secondary" className="px-3 py-1">
                  {lang.name} ({lang.percentage}%)
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No language data available</p>
            )}
          </div>
          {/* 主要技术栈 / Primary stack */}
          {topLanguages && (
            <p className="mt-3 text-sm text-muted-foreground">
              Primary stack: <span className="font-medium text-foreground">{topLanguages}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* ----- 功能按钮 / Feature Buttons ----- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 分析个人资料按钮 / Analyze Profile Button */}
        <Button
          variant={activeFeature === "analyze" ? "default" : "outline"}
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={generateInsights}
          disabled={loading}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm">Analyze Profile</span>
          <span className="text-xs text-muted-foreground font-normal">Get AI insights</span>
        </Button>

        {/* 生成简历摘要按钮 / Resume Summary Button */}
        <Button
          variant={activeFeature === "resume" ? "default" : "outline"}
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={generateResume}
          disabled={loading}
        >
          <User className="w-5 h-5" />
          <span className="text-sm">Resume Summary</span>
          <span className="text-xs text-muted-foreground font-normal">Generate professional summary</span>
        </Button>

        {/* 生成 README 按钮 / Generate README Button */}
        <Button
          variant={activeFeature === "readme" ? "default" : "outline"}
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={generateReadme}
          disabled={loading}
        >
          <FileText className="w-5 h-5" />
          <span className="text-sm">Generate README</span>
          <span className="text-xs text-muted-foreground font-normal">For your repository</span>
        </Button>

        {/* 生成发布说明按钮 / Generate Release Notes Button */}
        <Button
          variant={activeFeature === "release" ? "default" : "outline"}
          className="h-auto py-4 flex flex-col items-center gap-2"
          onClick={generateReleaseNotes}
          disabled={loading}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-sm">Release Notes</span>
          <span className="text-xs text-muted-foreground font-normal">From recent commits</span>
        </Button>
      </div>

      {/* ----- AI 生成中的加载状态 / AI Generation Loading State ----- */}
      {loading && (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-muted-foreground">Generating AI response...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ----- AI 响应结果展示 / AI Response Result ----- */}
      {/* 使用 ReactMarkdown 渲染 Markdown 内容 */}
      {/* Use ReactMarkdown to render Markdown content */}
      {result && !loading && (
        <Card>
          {/* 卡片头部 / Card Header */}
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              AI Response
            </CardTitle>
            <Badge variant="outline">AI Generated</Badge>
          </CardHeader>
          
          {/* 卡片内容 / Card Content */}
          <CardContent>
            {/* Markdown 渲染容器 / Markdown render container */}
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-code:text-sm prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}      // GitHub 风格 Markdown / GitHub-flavored Markdown
                rehypePlugins={[rehypeRaw]}      // 允许 HTML / Allow HTML
                components={{
                  // 自定义代码块样式 / Custom code block styling
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    )
                  },
                  // 自定义无序列表 / Custom unordered list
                  ul({ children }) {
                    return <ul className="list-disc pl-5 space-y-1">{children}</ul>
                  },
                  // 自定义有序列表 / Custom ordered list
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 space-y-1">{children}</ol>
                  },
                  // 自定义二级标题 / Custom level-2 heading
                  h2({ children }) {
                    return <h2 className="text-lg font-semibold mt-6 mb-3 border-b pb-2">{children}</h2>
                  },
                  // 自定义三级标题 / Custom level-3 heading
                  h3({ children }) {
                    return <h3 className="text-base font-semibold mt-4 mb-2">{children}</h3>
                  },
                  // 自定义链接 / Custom link
                  a({ href, children }) {
                    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>
                  },
                  // 自定义表格 / Custom table
                  table({ children }) {
                    return <table className="w-full border-collapse text-sm my-4">{children}</table>
                  },
                  // 自定义表头 / Custom table header
                  th({ children }) {
                    return <th className="border border-border px-3 py-2 text-left font-semibold bg-muted/50">{children}</th>
                  },
                  // 自定义表格单元格 / Custom table cell
                  td({ children }) {
                    return <td className="border border-border px-3 py-2">{children}</td>
                  },
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ----- 空状态引导 / Empty State ----- */}
      {/* 当没有结果且未加载时显示 / Show when no result and not loading */}
      {!result && !loading && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">Ready for AI Analysis</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Click any button above to generate AI-powered insights based on your GitHub activity.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
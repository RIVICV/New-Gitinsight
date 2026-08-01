// app/dashboard/ai/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { 
  Sparkles, 
  Loader2, 
  FileText, 
  BookOpen, 
  User, 
  TrendingUp,
  Code2,
  Star,
  Award,
  Target,
  GitBranch,
  Zap,
  Clock,
  CheckCircle2,
  BarChart3
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AIService } from "@/services/ai.service"
import AIContextBuilder from "@/services/ai-context-builder"
import ReadmeGenerator from "@/services/readme-generator.service"
import { cn } from "@/lib/utils"

async function fetchAIData(accessToken: string) {
  const res = await fetch("/api/github/analytics", {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export default function AIPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<any>(null)

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["ai-analytics"],
    queryFn: () => fetchAIData(session?.accessToken!),
    enabled: !!session?.accessToken,
  })

  // 数据加载完成后默认选中第一个仓库
  useEffect(() => {
    if (analyticsData?.repos && analyticsData.repos.length > 0 && !selectedRepo) {
      setSelectedRepo(analyticsData.repos[0])
    }
  }, [analyticsData])

  // ============================================================
  // 功能函数
  // ============================================================
  
  const generateInsights = async () => {
    if (!analyticsData) return
    setLoading(true)
    setActiveFeature("analyze")
    setResult(null)
    try {
      const { user, repos, events, metrics } = analyticsData
      const context = AIContextBuilder.buildContext(user, repos, events, metrics)
      const response = await AIService.generateInsight(context)
      setResult(response)
    } catch (error) {
      setResult("Error generating insights. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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

  const generateReadme = async () => {
    if (!analyticsData) return
    const repo = selectedRepo || analyticsData.repos[0]
    if (!repo) {
      setResult("No repositories found. Please create a repository first.")
      return
    }
    setLoading(true)
    setActiveFeature("readme")
    setResult(null)
    try {
      const { metrics } = analyticsData
      const languages = metrics.technologyProfile.languages.map((l: any) => l.name)
      const repoInfo = {
        name: repo.name,
        description: repo.description || "A modern software project",
        languages: languages,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        issues: repo.open_issues_count || 0,
        createdAt: new Date(repo.created_at).toLocaleDateString(),
        updatedAt: new Date(repo.updated_at).toLocaleDateString(),
        url: repo.html_url,
        owner: repo.owner?.login || analyticsData.user?.login || "yourusername",
        topics: repo.topics || [],
        defaultBranch: repo.default_branch || "main",
      }
      const response = ReadmeGenerator.generate(repoInfo)
      setResult(response)
    } catch (error) {
      setResult("Error generating README. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const generateReleaseNotes = async () => {
    if (!analyticsData) return
    setLoading(true)
    setActiveFeature("release")
    setResult(null)
    try {
      const { events, user } = analyticsData
      const pushEvents = events.filter((e: any) => e.type === 'PushEvent')
      const recentCommits = pushEvents.slice(0, 20).map((e: any) => ({
        message: e.payload?.commits?.[0]?.message || 'Update',
        sha: e.payload?.commits?.[0]?.sha?.slice(0, 7) || 'abc1234',
        date: new Date(e.created_at).toISOString().split('T')[0],
        repoName: e.repo?.name || 'unknown',
      }))

      if (recentCommits.length === 0) {
        setResult(`## 📦 Release Notes\n\n### 📅 No commits found\n\nYou haven't made any commits yet. Start coding to generate release notes!`)
        setLoading(false)
        return
      }

      const features = recentCommits.filter((c: any) => 
        c.message.toLowerCase().includes('feat') || c.message.toLowerCase().includes('add')
      )
      const fixes = recentCommits.filter((c: any) => 
        c.message.toLowerCase().includes('fix') || c.message.toLowerCase().includes('bug')
      )

      const response = `## 📦 Release Notes\n\n### 🏷️ Version v1.0.0\n**Release Date**: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n### 📋 Release Summary\nTotal commits: ${recentCommits.length}\n\n### 🆕 New Features\n${features.length > 0 ? features.map((c: any) => `- ${c.message}`).join('\n') : '- No new features'}\n\n### 🐛 Bug Fixes\n${fixes.length > 0 ? fixes.map((c: any) => `- ${c.message}`).join('\n') : '- No bug fixes'}\n\n### 📊 Contributors\n- @${user?.login || 'contributor'}`
      setResult(response)
    } catch (error) {
      setResult("Error generating release notes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRepoSelect = (repo: any) => {
    setSelectedRepo(repo)
  }

  // ============================================================
  // 加载状态
  // ============================================================
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 animate-spin border-t-primary" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
            <GitBranch className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground">No data available. Please connect your GitHub account.</p>
        </div>
      </div>
    )
  }

  const { metrics, totalRepos, totalStars } = analyticsData
  const languages = metrics?.technologyProfile?.languages || []
  const topLanguages = languages.slice(0, 3).map((l: any) => l.name).join(', ')
  const repos = analyticsData.repos || []
  const displayRepo = selectedRepo || repos[0]

  return (
    <div className="space-y-6">
      {/* ===== 头部 ===== */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground mt-1">
            Get AI-powered analysis and recommendations for your GitHub activity
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-xs">
          <Sparkles className="w-3 h-3 text-yellow-500" />
          AI Powered
        </Badge>
      </div>

      {/* ===== 统计卡片 - 美化版 ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <Code2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Repositories</p>
              <p className="text-xl font-bold tracking-tight">{totalRepos || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Stars</p>
              <p className="text-xl font-bold tracking-tight">{totalStars || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10">
              <Award className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Productivity</p>
              <p className="text-xl font-bold tracking-tight">{metrics?.productivityScore || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Consistency</p>
              <p className="text-xl font-bold tracking-tight">{metrics?.consistencyScore || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== 技术栈概览 ===== */}
      <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {languages.length > 0 ? (
              languages.map((lang: any, i: number) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-muted/50 hover:bg-muted transition-colors"
                >
                  {lang.name} <span className="ml-1 text-muted-foreground/60">({lang.percentage}%)</span>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No language data available</p>
            )}
          </div>
          {topLanguages && (
            <p className="mt-3 text-xs text-muted-foreground/70">
              Primary stack: <span className="font-medium text-foreground">{topLanguages}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* ===== 功能按钮 - 美化版 ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant={activeFeature === "analyze" ? "default" : "outline"}
          className={cn(
            "h-auto py-4 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300",
            activeFeature === "analyze" 
              ? "shadow-md shadow-primary/20" 
              : "hover:shadow-md hover:shadow-primary/10 hover:border-primary/30 hover:bg-muted/50"
          )}
          onClick={generateInsights}
          disabled={loading}
        >
          <TrendingUp className={cn(
            "w-5 h-5 transition-transform duration-300",
            activeFeature === "analyze" ? "text-primary-foreground" : "text-primary",
            "group-hover:scale-110"
          )} />
          <span className="text-sm font-medium">Analyze Profile</span>
          <span className="text-xs text-muted-foreground/70 font-normal">Get AI insights</span>
        </Button>

        <Button
          variant={activeFeature === "resume" ? "default" : "outline"}
          className={cn(
            "h-auto py-4 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300",
            activeFeature === "resume" 
              ? "shadow-md shadow-primary/20" 
              : "hover:shadow-md hover:shadow-primary/10 hover:border-primary/30 hover:bg-muted/50"
          )}
          onClick={generateResume}
          disabled={loading}
        >
          <User className={cn(
            "w-5 h-5 transition-transform duration-300",
            activeFeature === "resume" ? "text-primary-foreground" : "text-primary",
            "group-hover:scale-110"
          )} />
          <span className="text-sm font-medium">Resume Summary</span>
          <span className="text-xs text-muted-foreground/70 font-normal">Professional summary</span>
        </Button>

        <div className="flex gap-1">
          <Button
            variant={activeFeature === "readme" ? "default" : "outline"}
            className={cn(
              "h-auto py-4 flex-1 flex flex-col items-center justify-center gap-1 rounded-l-xl transition-all duration-300",
              activeFeature === "readme" 
                ? "shadow-md shadow-primary/20" 
                : "hover:shadow-md hover:shadow-primary/10 hover:border-primary/30 hover:bg-muted/50"
            )}
            onClick={generateReadme}
            disabled={loading || repos.length === 0}
          >
            <FileText className={cn(
              "w-5 h-5 transition-transform duration-300",
              activeFeature === "readme" ? "text-primary-foreground" : "text-primary",
              "group-hover:scale-110"
            )} />
            <span className="text-sm font-medium">Generate README</span>
            <span className="text-xs text-muted-foreground/70 font-normal truncate max-w-[80px]">
              {displayRepo ? displayRepo.name : 'Select repo'}
            </span>
          </Button>
          
          {repos.length > 0 && (
            <select
              value={selectedRepo?.id || repos[0]?.id || ''}
              onChange={(e) => {
                const repo = repos.find((r: any) => r.id === Number(e.target.value))
                if (repo) handleRepoSelect(repo)
              }}
              className="h-auto py-4 px-2 border-y border-r rounded-r-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[80px] cursor-pointer hover:bg-muted/30 transition-colors"
              disabled={loading}
            >
              {repos.slice(0, 20).map((repo: any) => (
                <option key={repo.id} value={repo.id}>
                  {repo.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <Button
          variant={activeFeature === "release" ? "default" : "outline"}
          className={cn(
            "h-auto py-4 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300",
            activeFeature === "release" 
              ? "shadow-md shadow-primary/20" 
              : "hover:shadow-md hover:shadow-primary/10 hover:border-primary/30 hover:bg-muted/50"
          )}
          onClick={generateReleaseNotes}
          disabled={loading}
        >
          <BookOpen className={cn(
            "w-5 h-5 transition-transform duration-300",
            activeFeature === "release" ? "text-primary-foreground" : "text-primary",
            "group-hover:scale-110"
          )} />
          <span className="text-sm font-medium">Release Notes</span>
          <span className="text-xs text-muted-foreground/70 font-normal">From recent commits</span>
        </Button>
      </div>

      {/* ===== 加载状态 ===== */}
      {loading && (
        <Card className="border shadow-sm">
          <CardContent className="p-8 flex items-center justify-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-primary/20 animate-spin border-t-primary" />
            <span className="text-sm text-muted-foreground">Generating AI response...</span>
          </CardContent>
        </Card>
      )}

      {/* ===== 结果展示 - 美化版 ===== */}
      {result && !loading && (
        <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              AI Response
            </CardTitle>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5">AI Generated</Badge>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-code:text-sm prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <code className={className} {...props}>{children}</code>
                    ) : (
                      <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    )
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 space-y-1">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 space-y-1">{children}</ol>
                  },
                  h2({ children }) {
                    return <h2 className="text-lg font-semibold mt-6 mb-3 border-b pb-2">{children}</h2>
                  },
                  h3({ children }) {
                    return <h3 className="text-base font-semibold mt-4 mb-2">{children}</h3>
                  },
                  a({ href, children }) {
                    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>
                  },
                  table({ children }) {
                    return <table className="w-full border-collapse text-sm my-4">{children}</table>
                  },
                  th({ children }) {
                    return <th className="border border-border px-3 py-2 text-left font-semibold bg-muted/50">{children}</th>
                  },
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

      {/* ===== 空状态引导 ===== */}
      {!result && !loading && (
        <Card className="border-dashed border-2 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary/30" />
            </div>
            <h3 className="text-lg font-medium">Ready for AI Analysis</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
              Click any button above to generate AI-powered insights based on your GitHub activity.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
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
  Target
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AIService } from "@/services/ai.service"
import AIContextBuilder from "@/services/ai-context-builder"
import { ReadmeGenerator } from "@/services/readme-generator.service"

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

  // ============================================================
  // 当数据加载完成后，默认选中第一个仓库
  // ============================================================
  useEffect(() => {
    if (analyticsData?.repos && analyticsData.repos.length > 0 && !selectedRepo) {
      console.log("📦 默认选中第一个仓库:", analyticsData.repos[0].name)
      setSelectedRepo(analyticsData.repos[0])
    }
  }, [analyticsData])

  // ============================================================
  // 生成 AI 洞察
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

  // ============================================================
  // 生成简历摘要
  // ============================================================
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

  // ============================================================
  // 生成 README - 使用当前选中的仓库
  // ============================================================

// 替换 generateReadme 函数
const generateReadme = async () => {
  console.log("🚀 generateReadme 被调用")
  console.log("📦 当前选中的仓库:", selectedRepo)
  
  if (!analyticsData) {
    console.log("❌ analyticsData 为空")
    return
  }
  
  // ✅ 使用当前选中的仓库
  const repo = selectedRepo || analyticsData.repos[0]
  console.log("📦 最终使用的仓库:", repo?.name)
  
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
    
    // ✅ 使用当前选中的仓库真实数据
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
    
    console.log("📝 生成的 README 信息:", repoInfo)

    // ✅ 使用 ReadmeGenerator 生成 README（不依赖 AI）
    const response = ReadmeGenerator.generate(repoInfo)
    console.log("✅ README 生成成功，长度:", response.length)
    setResult(response)
  } catch (error) {
    console.error("❌ README generation error:", error)
    setResult("Error generating README. Please try again.")
  } finally {
    setLoading(false)
  }
}

  // ============================================================
  // 生成发布说明
  // ============================================================

const generateReleaseNotes = async () => {
  if (!analyticsData) return
  setLoading(true)
  setActiveFeature("release")
  setResult(null)

  try {
    const { events, repos, user } = analyticsData
    
    // ============================================================
    // 1. 提取提交信息
    // ============================================================
    const pushEvents = events.filter((e: any) => e.type === 'PushEvent')
    const totalCommits = pushEvents.length
    
    // 获取最近 20 条提交（增加数量）
    const recentCommits = pushEvents
      .slice(0, 20)
      .map((e: any) => ({
        message: e.payload?.commits?.[0]?.message || 'Update',
        sha: e.payload?.commits?.[0]?.sha?.slice(0, 7) || 'abc1234',
        date: new Date(e.created_at).toISOString().split('T')[0],
        repoName: e.repo?.name || 'unknown',
        author: user?.login || 'developer',
        url: `https://github.com/${user?.login}/${e.repo?.name?.split('/')[1] || ''}/commit/${e.payload?.commits?.[0]?.sha || ''}`
      }))
      .filter((c: any) => c.message.length > 0)

    // ============================================================
    // 2. 分类提交
    // ============================================================
    const features: string[] = []
    const fixes: string[] = []
    const chores: string[] = []
    const docs: string[] = []
    const tests: string[] = []
    const others: string[] = []

    recentCommits.forEach((c: any) => {
      const msg = c.message.toLowerCase()
      if (msg.startsWith('feat') || msg.includes('add') || msg.includes('new')) {
        features.push(`- ${c.message} (${c.repoName})`)
      } else if (msg.startsWith('fix') || msg.includes('bug') || msg.includes('resolve') || msg.includes('repair')) {
        fixes.push(`- ${c.message} (${c.repoName})`)
      } else if (msg.startsWith('docs') || msg.includes('doc') || msg.includes('readme')) {
        docs.push(`- ${c.message} (${c.repoName})`)
      } else if (msg.startsWith('test') || msg.includes('test')) {
        tests.push(`- ${c.message} (${c.repoName})`)
      } else if (msg.startsWith('chore') || msg.includes('update') || msg.includes('upgrade') || msg.includes('bump')) {
        chores.push(`- ${c.message} (${c.repoName})`)
      } else {
        others.push(`- ${c.message} (${c.repoName})`)
      }
    })

    // ============================================================
    // 3. 生成版本号（基于提交数量）
    // ============================================================
    const version = `v1.${Math.floor(totalCommits / 10)}.${totalCommits % 10}`
    const releaseDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    // ============================================================
    // 4. 生成发布说明摘要
    // ============================================================
    const totalChanges = features.length + fixes.length + docs.length + tests.length + chores.length + others.length
    const summary = totalChanges > 0 
      ? `This release includes ${totalChanges} changes across ${recentCommits.length} commits, with contributions from @${user?.login || 'contributors'}.`
      : 'No significant changes recorded in this release period.'

    // ============================================================
    // 5. 生成贡献者列表
    // ============================================================
    const contributors = [`@${user?.login || 'developer'}`]

    // ============================================================
    // 6. 构建最终的 Release Notes
    // ============================================================
    const response = `## 📦 Release Notes

### 🏷️ Version ${version}
**Release Date**: ${releaseDate}

---

### 📋 Release Summary

${summary}

| Metric | Value |
|--------|-------|
| **Total Commits** | ${recentCommits.length} |
| **Features Added** | ${features.length} |
| **Bug Fixes** | ${fixes.length} |
| **Documentation** | ${docs.length} |
| **Tests** | ${tests.length} |
| **Maintenance** | ${chores.length} |
| **Repositories Affected** | ${new Set(recentCommits.map((c: any) => c.repoName)).size} |
| **Contributors** | ${contributors.length} |

---

### 🆕 New Features

${features.length > 0 
  ? features.join('\n')
  : '- No new features in this release'}

---

### 🐛 Bug Fixes

${fixes.length > 0 
  ? fixes.join('\n')
  : '- No bug fixes in this release'}

---

### 📚 Documentation

${docs.length > 0 
  ? docs.join('\n')
  : '- No documentation updates in this release'}

---

### 🧪 Testing

${tests.length > 0 
  ? tests.join('\n')
  : '- No test updates in this release'}

---

### 🔧 Maintenance & Chores

${chores.length > 0 
  ? chores.join('\n')
  : '- No maintenance updates in this release'}

---

### 📊 Contributors

${contributors.map((c: string) => `- **${c}**`).join('\n')}

---

### 📝 Recent Commits

${recentCommits.slice(0, 10).map((c: any) => 
  `- \`${c.sha}\` ${c.message} — ${c.repoName}`
).join('\n')}

${recentCommits.length > 10 ? `\n*... and ${recentCommits.length - 10} more commits*` : ''}

---

### 📈 Next Steps

- [ ] Review and test all changes
- [ ] Update documentation if needed
- [ ] Plan for next release

---

### 📄 License

This release is distributed under the MIT License.

---

<div align="center">

*Generated by GitInsight AI — Professional Engineering Intelligence Platform*

</div>`

    setResult(response)
  } catch (error) {
    console.error("❌ Release notes error:", error)
    setResult("Error generating release notes. Please try again.")
  } finally {
    setLoading(false)
  }
}

  // ============================================================
  // 选择仓库 - 添加日志
  // ============================================================
  const handleRepoSelect = (repo: any) => {
    console.log("🔄 切换仓库:", repo.name)
    setSelectedRepo(repo)
  }

  // ============================================================
  // 加载状态
  // ============================================================
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

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
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
      <div>
        <h1 className="text-3xl font-bold">AI Insights</h1>
        <p className="text-muted-foreground">
          Get AI-powered analysis and recommendations for your GitHub activity
        </p>
      </div>

      {/* ===== 开发者概览卡片 ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* ===== 技术栈概览 ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
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
          {topLanguages && (
            <p className="mt-3 text-sm text-muted-foreground">
              Primary stack: <span className="font-medium text-foreground">{topLanguages}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* ===== 功能按钮 ===== */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Analyze Profile */}
  <Button
    variant={activeFeature === "analyze" ? "default" : "outline"}
    className="h-auto py-4 flex flex-col items-center justify-center gap-2"
    onClick={generateInsights}
    disabled={loading}
  >
    <TrendingUp className="w-5 h-5" />
    <span className="text-sm font-medium">Analyze Profile</span>
    <span className="text-xs text-muted-foreground font-normal">Get AI insights</span>
  </Button>

  {/* Resume Summary */}
  <Button
    variant={activeFeature === "resume" ? "default" : "outline"}
    className="h-auto py-4 flex flex-col items-center justify-center gap-2"
    onClick={generateResume}
    disabled={loading}
  >
    <User className="w-5 h-5" />
    <span className="text-sm font-medium">Resume Summary</span>
    <span className="text-xs text-muted-foreground font-normal">Professional summary</span>
  </Button>

  {/* Generate README */}
  <div className="flex gap-2">
    <Button
      variant={activeFeature === "readme" ? "default" : "outline"}
      className="h-auto py-4 flex-1 flex flex-col items-center justify-center gap-2 rounded-r-none"
      onClick={generateReadme}
      disabled={loading || repos.length === 0}
    >
      <FileText className="w-5 h-5" />
      <span className="text-sm font-medium">Generate README</span>
      <span className="text-xs text-muted-foreground font-normal truncate max-w-[100px]">
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
        className="h-auto py-4 px-3 border rounded-r-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[100px]"
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

  {/* Release Notes */}
  <Button
    variant={activeFeature === "release" ? "default" : "outline"}
    className="h-auto py-4 flex flex-col items-center justify-center gap-2"
    onClick={generateReleaseNotes}
    disabled={loading}
  >
    <BookOpen className="w-5 h-5" />
    <span className="text-sm font-medium">Release Notes</span>
    <span className="text-xs text-muted-foreground font-normal">From recent commits</span>
  </Button>
</div>
      {/* ===== 加载状态 ===== */}
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

      {/* ===== 结果展示 ===== */}
      {result && !loading && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              AI Response
            </CardTitle>
            <Badge variant="outline">AI Generated</Badge>
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
                      <code className={className} {...props}>
                        {children}
                      </code>
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
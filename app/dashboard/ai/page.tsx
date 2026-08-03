// app/dashboard/ai/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { 
  Sparkles, 
  Loader2, 
  FileText, 
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
import AIContextBuilder from "@/services/ai-context-builder"

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

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["ai-analytics"],
    queryFn: () => fetchAIData(session?.accessToken!),
    enabled: !!session?.accessToken,
  })

  // ✅ 通过 API 路由调用 AI 服务
  const callAIAction = async (action: string, payload: any) => {
    console.log("🔍 [PAGE] 调用 AI API:", action, payload)
    
    const response = await fetch("/api/ai/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    })

    console.log("🔍 [PAGE] API 响应状态:", response.status)
    
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "AI 调用失败")
    return data.result
  }

  const generateInsights = async () => {
    if (!analyticsData) return
    setLoading(true)
    setActiveFeature("analyze")
    setResult(null)

    try {
      const { user, repos, events, metrics } = analyticsData
      const context = AIContextBuilder.buildContext(user, repos, events, metrics)
      
      const result = await callAIAction("analyze", { context })
      setResult(result)
    } catch (error: any) {
      console.error("AI Error:", error)
      setResult(`## ❌ AI 调用失败\n\n**错误信息**: ${error.message || "未知错误"}\n\n请稍后重试。`)
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
      
      const result = await callAIAction("resume", { context })
      setResult(result)
    } catch (error: any) {
      console.error("AI Error:", error)
      setResult(`## ❌ AI 调用失败\n\n**错误信息**: ${error.message || "未知错误"}`)
    } finally {
      setLoading(false)
    }
  }

  const generateReadme = async () => {
    if (!analyticsData) return
    setLoading(true)
    setActiveFeature("readme")
    setResult(null)

    try {
      const { repos, metrics } = analyticsData
      const repo = repos[0] || { name: "my-project", description: "A modern software project" }
      const languages = metrics.technologyProfile.languages.map((l: any) => l.name)
      
      const result = await callAIAction("readme", {
        repoName: repo.name,
        description: repo.description,
        languages,
      })
      setResult(result)
    } catch (error: any) {
      console.error("AI Error:", error)
      setResult(`## ❌ AI 调用失败\n\n**错误信息**: ${error.message || "未知错误"}`)
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div>
        <h1 className="text-3xl font-bold">AI Insights</h1>
        <p className="text-muted-foreground">
          Get AI-powered analysis and recommendations for your GitHub activity
        </p>
      </div>

      {/* 开发者概览卡片 */}
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

      {/* 技术栈概览 */}
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

      {/* 功能按钮 - 3 个 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>

      {/* 加载状态 */}
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

      {/* 结果展示 */}
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

      {/* 空状态引导 */}
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
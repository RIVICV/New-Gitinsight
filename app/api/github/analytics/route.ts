// app/api/github/analytics/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Octokit } from "@octokit/rest"
// ✅ 使用默认导入
import AnalyticsService from "@/services/analytics.service"

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const octokit = new Octokit({ auth: token })
    
    const userData = await octokit.users.getAuthenticated()
    const reposData = await octokit.repos.listForAuthenticatedUser({ per_page: 100 })
    const eventsData = await octokit.activity.listEventsForAuthenticatedUser({
      username: userData.data.login,
      per_page: 100,
    })

    const repos = reposData.data.map((repo: any) => ({
      ...repo,
      total_pulls: 0,
    }))

    const metrics = AnalyticsService.getEngineeringMetrics(
      userData.data,
      repos,
      eventsData.data as any[]
    )

    // 语言分布
    const languages = await Promise.all(
      reposData.data.map(async (repo: any) => {
        try {
          const langs = await octokit.repos.listLanguages({
            owner: repo.owner.login,
            repo: repo.name,
          })
          return langs.data
        } catch {
          return {}
        }
      })
    )

    const langMap: Record<string, number> = {}
    languages.forEach((lang: any) => {
      Object.entries(lang).forEach(([name, bytes]) => {
        if (typeof bytes === 'number') {
          langMap[name] = (langMap[name] || 0) + bytes
        }
      })
    })

    const totalBytes = Object.values(langMap).reduce((a: number, b: number) => a + b, 0)
    const languageDistribution = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, bytes]) => ({
        name,
        value: bytes,
        percentage: Math.round((bytes / totalBytes) * 100),
      }))

    return NextResponse.json({
      user: userData.data,
      repos: reposData.data,
      events: eventsData.data,
      metrics,
      languageDistribution,
      totalRepos: reposData.data.length,
      totalStars: reposData.data.reduce((acc: number, r: any) => acc + r.stargazers_count, 0),
      totalForks: reposData.data.reduce((acc: number, r: any) => acc + r.forks_count, 0),
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: "Failed to generate analytics" },
      { status: 500 }
    )
  }
}
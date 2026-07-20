// app/api/github/analytics/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Octokit } from "@octokit/rest"

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const octokit = new Octokit({ auth: token })
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({ per_page: 100 })
    
    // 语言统计
    const langMap: Record<string, number> = {}
    for (const repo of repos) {
      try {
        const langs = await octokit.repos.listLanguages({
          owner: repo.owner.login,
          repo: repo.name,
        })
        for (const [lang, bytes] of Object.entries(langs.data)) {
          langMap[lang] = (langMap[lang] || 0) + bytes
        }
      } catch {}
    }
    
    const totalBytes = Object.values(langMap).reduce((a, b) => a + b, 0)
    const languages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({
        name,
        value,
        percent: value / totalBytes,
      }))

    // 模拟数据
    const weeklyCommits = [
      { day: "Mon", commits: 12 },
      { day: "Tue", commits: 19 },
      { day: "Wed", commits: 15 },
      { day: "Thu", commits: 22 },
      { day: "Fri", commits: 8 },
      { day: "Sat", commits: 5 },
      { day: "Sun", commits: 3 },
    ]

    const repoGrowth = [
      { date: "Jan", count: 2 },
      { date: "Feb", count: 4 },
      { date: "Mar", count: 5 },
      { date: "Apr", count: 7 },
      { date: "May", count: 8 },
      { date: "Jun", count: 10 },
    ]

    return NextResponse.json({ languages, weeklyCommits, repoGrowth })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from "next/server"
import { Octokit } from "@octokit/rest"

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const octokit = new Octokit({ auth: token })
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({ per_page: 100 })
    
    const allPulls = []
    for (const repo of repos) {
      try {
        const pulls = await octokit.pulls.list({
          owner: repo.owner.login,
          repo: repo.name,
          state: "all",
          per_page: 30,
        })
        pulls.data.forEach((pr: any) => (pr.repo = repo))
        allPulls.push(...pulls.data)
      } catch {}
    }
    
    allPulls.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    return NextResponse.json(allPulls.slice(0, 50))
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
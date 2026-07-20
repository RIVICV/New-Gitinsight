import { NextRequest, NextResponse } from "next/server"
import { Octokit } from "@octokit/rest"

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const octokit = new Octokit({ auth: token })
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({ per_page: 100 })
    
    const allIssues = []
    for (const repo of repos) {
      try {
        const issues = await octokit.issues.listForRepo({
          owner: repo.owner.login,
          repo: repo.name,
          state: "all",
          per_page: 30,
        })
        issues.data.forEach((issue: any) => (issue.repo = repo))
        allIssues.push(...issues.data)
      } catch {}
    }
    
    allIssues.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    return NextResponse.json(allIssues.slice(0, 50))
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
// app/api/github/pulls/route.ts
// 处理 GitHub Pull Requests 的 API 路由
// API route for handling GitHub Pull Requests

// 导入 Next.js 的请求和响应处理类
// Import Next.js request and response handling classes
import { NextRequest, NextResponse } from "next/server"

// 导入 Octokit - GitHub 官方 REST API 客户端
// Import Octokit - GitHub's official REST API client
import { Octokit } from "@octokit/rest"

// 导出 GET 函数，处理前端的 GET 请求
// Export GET function to handle GET requests from the frontend
export async function GET(request: NextRequest) {
  // 从请求头中提取 Bearer token（移除 "Bearer " 前缀）
  // Extract Bearer token from request headers (remove "Bearer " prefix)
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  
  // 如果没有 token，返回 401 未授权错误
  // If no token, return 401 Unauthorized error
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    // 创建 Octokit 实例，传入用户的 access_token
    // Create Octokit instance with user's access_token
    const octokit = new Octokit({ auth: token })
    
    // 获取当前用户的所有仓库（最多 100 个）
    // Get all repositories for the authenticated user (max 100)
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({ per_page: 100 })
    
    // 创建一个空数组，用于存放所有 Pull Requests
    // Create an empty array to store all Pull Requests
    const allPulls = []
    
    // 遍历每个仓库，获取其中的 Pull Requests
    // Loop through each repository to fetch its Pull Requests
    for (const repo of repos) {
      try {
        // 获取当前仓库的所有 Pull Requests（最多 30 个）
        // Get all Pull Requests for the current repository (max 30)
        const pulls = await octokit.pulls.list({
          owner: repo.owner.login,  // 仓库所有者 / Repository owner
          repo: repo.name,          // 仓库名称 / Repository name
          state: "all",             // 所有状态：open, closed, all / All states: open, closed, all
          per_page: 30,             // 每页最多 30 个 / Max 30 per page
        })
        
        // 为每个 PR 添加 repo 属性，记录它属于哪个仓库
        // Add repo property to each PR, tracking which repository it belongs to
        pulls.data.forEach((pr: any) => (pr.repo = repo))
        
        // 将当前仓库的所有 PR 添加到总数组中
        // Add all PRs from current repo to the total array
        allPulls.push(...pulls.data)
      } catch {
        // 如果某个仓库的 PR 获取失败，静默跳过（不影响其他仓库）
        // If fetching PRs for a repo fails, silently skip (doesn't affect other repos)
      }
    }
    
    // 按创建时间降序排序（最新的排在前面）
    // Sort by creation time descending (newest first)
    allPulls.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    // 只返回最新的 50 个 PR，避免数据量过大
    // Only return the latest 50 PRs to avoid excessive data size
    return NextResponse.json(allPulls.slice(0, 50))
    
  } catch (error) {
    // 如果整体流程失败，返回 500 服务器错误
    // If the overall process fails, return 500 Internal Server Error
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
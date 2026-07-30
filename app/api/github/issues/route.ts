// app/api/github/issues/route.ts
// 处理 GitHub Issues 的 API 路由
// API route for handling GitHub Issues

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
    
    // 创建一个空数组，用于存放所有 Issues
    // Create an empty array to store all Issues
    const allIssues = []
    
    // 遍历每个仓库，获取其中的 Issues
    // Loop through each repository to fetch its Issues
    for (const repo of repos) {
      try {
        // 获取当前仓库的所有 Issues（最多 30 个）
        // Get all Issues for the current repository (max 30)
        const issues = await octokit.issues.listForRepo({
          owner: repo.owner.login,  // 仓库所有者 / Repository owner
          repo: repo.name,          // 仓库名称 / Repository name
          state: "all",             // 所有状态：open, closed, all / All states: open, closed, all
          per_page: 30,             // 每页最多 30 个 / Max 30 per page
        })
        
        // 为每个 Issue 添加 repo 属性，记录它属于哪个仓库
        // Add repo property to each Issue, tracking which repository it belongs to
        issues.data.forEach((issue: any) => (issue.repo = repo))
        
        // 将当前仓库的所有 Issue 添加到总数组中
        // Add all Issues from current repo to the total array
        allIssues.push(...issues.data)
      } catch {
        // 如果某个仓库的 Issue 获取失败，静默跳过（不影响其他仓库）
        // If fetching Issues for a repo fails, silently skip (doesn't affect other repos)
      }
    }
    
    // 按创建时间降序排序（最新的排在前面）
    // Sort by creation time descending (newest first)
    allIssues.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    // 只返回最新的 50 个 Issue，避免数据量过大
    // Only return the latest 50 Issues to avoid excessive data size
    return NextResponse.json(allIssues.slice(0, 50))
    
  } catch (error) {
    // 如果整体流程失败，返回 500 服务器错误
    // If the overall process fails, return 500 Internal Server Error
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
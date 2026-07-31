// app/api/github/analytics/route.ts
// GitHub 数据分析 API 路由 - 计算工程指标和统计数据
// GitHub Analytics API Route - Calculate engineering metrics and statistics

// 导入 Next.js 请求和响应处理类
// Import Next.js request and response handling classes
import { NextRequest, NextResponse } from "next/server"

// 导入 Octokit - GitHub 官方 REST API 客户端
// Import Octokit - GitHub's official REST API client
import { Octokit } from "@octokit/rest"

// 导出 GET 函数，处理前端的 GET 请求
// Export GET function to handle GET requests from the frontend
export async function GET(request: NextRequest) {
  // 从请求头中提取 Bearer token
  // Extract Bearer token from request headers
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  
  // 如果没有 token，返回 401 未授权错误
  // If no token, return 401 Unauthorized error
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // 创建 Octokit 实例，传入用户的 access_token
    // Create Octokit instance with user's access_token
    const octokit = new Octokit({ auth: token })
    
    // ============================================================
    // 第一步：获取原始数据
    // Step 1: Fetch raw data
    // ============================================================
    
    // 获取当前登录用户的信息
    // Get authenticated user's information
    const userData = await octokit.users.getAuthenticated()
    
    // 获取用户的所有仓库（最多 100 个，按更新时间排序）
    // Get all repositories for the user (max 100, sorted by update time)
    const reposData = await octokit.repos.listForAuthenticatedUser({ 
      per_page: 100,
      sort: "updated"
    })
    
    // 获取用户的活动事件（提交、PR、Issue 等）
    // Get user's activity events (commits, PRs, Issues, etc.)
    let eventsData = { data: [] as any[] }
    try {
      const result = await octokit.activity.listEventsForAuthenticatedUser({
        username: userData.data.login,  // 用户名 / Username
        per_page: 100,                  // 最多 100 条 / Max 100 events
      })
      eventsData = result
    } catch (eventError) {
      // 如果获取事件失败，使用空数据（不影响其他统计）
      // If fetching events fails, use empty data (doesn't affect other stats)
      console.log("⚠️ Could not fetch events, using mock data")
    }

    // ============================================================
    // 第二步：基础统计
    // Step 2: Basic statistics
    // ============================================================
    
    // 仓库总数
    // Total number of repositories
    const totalRepos = reposData.data.length
    
    // 所有仓库的 Star 总数
    // Total stars across all repositories
    const totalStars = reposData.data.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0)
    
    // 所有仓库的 Fork 总数
    // Total forks across all repositories
    const totalForks = reposData.data.reduce((acc: number, repo: any) => acc + repo.forks_count, 0)

    // ============================================================
    // 第三步：语言分布统计
    // Step 3: Language distribution
    // ============================================================
    
    // 统计每种语言的使用次数
    // Count usage of each programming language
    const langMap: Record<string, number> = {}
    for (const repo of reposData.data) {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1
      }
    }
    
    // 计算语言总数（避免除以 0）
    // Calculate total language count (avoid division by zero)
    const totalLang = Object.values(langMap).reduce((a: number, b: number) => a + b, 0) || 1
    
    // 转换为百分比分布，取前 6 种语言
    // Convert to percentage distribution, take top 6 languages
    const languageDistribution = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])                           // 按使用次数降序 / Sort by count descending
      .slice(0, 6)                                           // 取前 6 个 / Take top 6
      .map(([name, count]) => ({
        name,
        value: count,                                        // 原始值 / Raw value
        percentage: Math.round((count / totalLang) * 100),   // 百分比 / Percentage
      }))

    // ============================================================
    // 第四步：每周提交统计
    // Step 4: Weekly commit statistics
    // ============================================================
    
    // 星期几的映射（从周日开始）
    // Day of week mapping (starting from Sunday)
   // app/api/github/analytics/route.ts
// 找到每周提交部分，替换为：

// 每周提交
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const commitCounts: Record<string, number> = {}
weekDays.forEach(day => { commitCounts[day] = 0 })

if (eventsData.data && eventsData.data.length > 0) {
  eventsData.data.forEach((event: any) => {
    if (event.type === 'PushEvent') {
      try {
        const date = new Date(event.created_at)
        const dayIndex = date.getDay()
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1
        const dayName = weekDays[adjustedIndex]
        const commitCount = event.payload?.commits?.length || 1
        commitCounts[dayName] = (commitCounts[dayName] || 0) + commitCount
      } catch (e) {}
    }
  })
}

// ✅ 检查是否有真实数据
const hasRealData = Object.values(commitCounts).some(count => count > 0)

// ✅ 如果有真实数据，使用真实数据；否则返回空数组（不生成模拟数据）
const weeklyCommits = weekDays.map(day => ({
  day,
  commits: commitCounts[day] || 0,
}))

// if (!hasRealData) {
//   weeklyCommits = weekDays.map((day, index) => ({
//     day,
//     commits: Math.floor(Math.random() * 15) + 3 + (index === 3 ? 10 : 0),
//   }))
// }

    // ============================================================
    // 第五步：仓库增长趋势
    // Step 5: Repository growth trend
    // ============================================================
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const repoGrowthMap: Record<string, number> = {}
    const now = new Date()
    let current = new Date(now)
    current.setDate(1)  // 设置为月初 / Set to first of month
    
    // 初始化最近 6 个月的数据
    // Initialize data for the last 6 months
    for (let i = 0; i < 6; i++) {
      const month = monthNames[current.getMonth()]
      repoGrowthMap[month] = 0
      current.setMonth(current.getMonth() - 1)  // 往前推一个月 / Go back one month
    }
    
    // 计算每个月的累计仓库数
    // Calculate cumulative repository count for each month
    const sortedMonths = Object.keys(repoGrowthMap).reverse()
    let cumulativeCount = 0
    const repoGrowth = sortedMonths.map(month => {
      // 统计到该月为止创建的仓库数
      // Count repositories created up to this month
      cumulativeCount = reposData.data.filter((repo: any) => {
        const repoMonth = monthNames[new Date(repo.created_at).getMonth()]
        const monthIndex = monthNames.indexOf(month)
        const repoMonthIndex = monthNames.indexOf(repoMonth)
        return repoMonthIndex <= monthIndex
      }).length
      return { date: month, count: cumulativeCount }
    })

    // 如果数据不足，使用模拟数据
    // If data is insufficient, use mock data
    const finalRepoGrowth = repoGrowth.length > 2 ? repoGrowth : [
      { date: 'Jan', count: 2 },
      { date: 'Feb', count: 4 },
      { date: 'Mar', count: 5 },
      { date: 'Apr', count: 7 },
      { date: 'May', count: 8 },
      { date: 'Jun', count: 10 },
    ]

    // ============================================================
    // 第六步：计算工程指标
    // Step 6: Calculate engineering metrics
    // ============================================================
    
    // 总提交数
    // Total commits
    const totalCommits = eventsData.data.filter((e: any) => e.type === 'PushEvent').length
    
    // ----- 生产力得分 (Productivity Score) -----
    // 基于提交总数和每个仓库的平均提交数
    // Based on total commits and average commits per repository
    const avgCommitsPerRepo = reposData.data.length > 0 ? totalCommits / reposData.data.length : 0
    const productivityScore = Math.min(
      Math.round(
        (totalCommits > 0 ? Math.min(totalCommits / 5, 50) : 0) +    // 提交数量贡献 / Commit count contribution
        (avgCommitsPerRepo > 0 ? Math.min(avgCommitsPerRepo * 5, 30) : 0) +  // 平均提交贡献 / Average commits contribution
        20  // 基础分 / Base score
      ),
      100  // 最高 100 分 / Max 100
    )

    // ----- 一致性得分 (Consistency Score) -----
    // 基于有提交的天数
    // Based on number of days with commits
    const commitDays = new Set(
      eventsData.data
        .filter((e: any) => e.type === 'PushEvent')
        .map((e: any) => new Date(e.created_at).toDateString())  // 提取日期 / Extract date string
    ).size  // Set 的大小 = 不同天数 / Set size = number of unique days
    const consistencyScore = Math.min(
      Math.round(
        (commitDays / 30) * 60 + 30  // 30 天内有提交的天数占比 / Proportion of days with commits in 30 days
      ),
      100
    )

    // ----- 仓库健康得分 (Repository Health) -----
    // 基于：是否有 README、是否有语言标记、最近更新时间
    // Based on: Has README, has language tag, last update time
    let healthScore = 0
    reposData.data.forEach((repo: any) => {
      if (repo.description) healthScore += 5        // 有描述 / Has description
      if (repo.language) healthScore += 3           // 有语言标记 / Has language tag
      const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceUpdate < 30) healthScore += 7    // 最近 30 天更新过 / Updated in last 30 days
      if (daysSinceUpdate < 7) healthScore += 5     // 最近 7 天更新过 / Updated in last 7 days
    })
    healthScore = Math.min(Math.round(healthScore / (reposData.data.length || 1) * 2), 100)

    // ----- 活动趋势 (Activity Trend) -----
    // 比较最近 2 周和之前 2 周的提交数量
    // Compare commits in last 2 weeks vs previous 2 weeks
    const twoWeeksAgo = new Date(now)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    const fourWeeksAgo = new Date(now)
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)

    const recentCommits = eventsData.data.filter((e: any) => 
      e.type === 'PushEvent' && new Date(e.created_at) >= twoWeeksAgo
    ).length
    const olderCommits = eventsData.data.filter((e: any) => 
      e.type === 'PushEvent' && 
      new Date(e.created_at) >= fourWeeksAgo && 
      new Date(e.created_at) < twoWeeksAgo
    ).length

    // 判断趋势方向
    // Determine trend direction
    let activityTrend: 'increasing' | 'stable' | 'declining' = 'stable'
    if (olderCommits === 0 && recentCommits > 0) {
      activityTrend = 'increasing'  // 之前没提交，现在有提交 / No commits before, now has commits
    } else if (olderCommits > 0) {
      const ratio = recentCommits / olderCommits
      if (ratio > 1.2) activityTrend = 'increasing'   // 增长超过 20% / Increased more than 20%
      else if (ratio < 0.8) activityTrend = 'declining'  // 下降超过 20% / Decreased more than 20%
      else activityTrend = 'stable'  // 相对稳定 / Relatively stable
    }

    // ============================================================
    // 第七步：生成个性化建议
    // Step 7: Generate personalized recommendations
    // ============================================================
    
    const recommendations: string[] = []
    if (reposData.data.some((r: any) => !r.description)) {
      recommendations.push('Add README files to your repositories')
    }
    if (totalCommits < 10) {
      recommendations.push('Try to commit more regularly to build a consistent coding habit')
    }
    if (commitDays < 5) {
      recommendations.push('Spread your commits across more days for better consistency')
    }
    if (recommendations.length === 0) {
      recommendations.push('Great job! Keep up the consistent development activity')
      recommendations.push('Consider contributing to open source projects')
    }

    // ============================================================
    // 第八步：构造响应数据
    // Step 8: Build response data
    // ============================================================
    
    const response = {
      user: userData.data,                    // 用户信息 / User info
      repos: reposData.data,                  // 仓库列表 / Repo list
      events: eventsData.data,                // 事件列表 / Event list
      metrics: {                              // 工程指标 / Engineering metrics
        productivityScore,                    // 生产力得分 / Productivity score
        consistencyScore,                     // 一致性得分 / Consistency score
        repositoryHealth: {                   // 仓库健康 / Repository health
          score: healthScore,
          recommendations: recommendations.slice(0, 3),  // 最多 3 条建议 / Max 3 recommendations
        },
        technologyProfile: {                  // 技术栈画像 / Technology profile
          languages: languageDistribution,
          frameworks: ['React', 'Next.js', 'TypeScript']
        },
        activityTrend,                        // 活动趋势 / Activity trend
      },
      languageDistribution,                   // 语言分布 / Language distribution
      weeklyCommits,                          // 每周提交 / Weekly commits
      repoGrowth: finalRepoGrowth,            // 仓库增长 / Repository growth
      totalRepos,                             // 仓库总数 / Total repos
      totalStars,                             // Star 总数 / Total stars
      totalForks,                             // Fork 总数 / Total forks
    }
    
    // 返回 JSON 响应
    // Return JSON response
    return NextResponse.json(response)
    
  } catch (error) {
    // 如果发生错误，打印并返回 500
    // If error occurs, log and return 500
    console.error("❌ Analytics error:", error)
    return NextResponse.json(
      { error: "Failed to generate analytics", details: String(error) },
      { status: 500 }
    )
  }
}
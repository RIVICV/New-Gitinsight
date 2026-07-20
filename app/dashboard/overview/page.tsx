// app/dashboard/overview/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Octokit } from "@octokit/rest"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/dashboard/skeleton"

async function getDashboardData(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken })

  try {
    // 先获取用户信息
    const userData = await octokit.users.getAuthenticated()
    
    // 获取仓库列表
    const reposData = await octokit.repos.listForAuthenticatedUser({ 
      per_page: 100,
      sort: "updated",
    })

    // ✅ 修复：使用 listEventsForAuthenticatedUser
    const eventsData = await octokit.activity.listEventsForAuthenticatedUser({
      username: userData.data.login,
      per_page: 50,
    })

    // ✅ 修复：添加类型注解
    const reposWithPRs = await Promise.all(
      reposData.data.map(async (repo: any) => {
        try {
          const pulls = await octokit.pulls.list({
            owner: repo.owner.login,
            repo: repo.name,
            state: "all",
            per_page: 1,
          })
          return {
            ...repo,
            total_pulls: pulls.data.length,
          }
        } catch {
          return {
            ...repo,
            total_pulls: 0,
          }
        }
      })
    )

    return {
      user: userData.data,
      repos: reposWithPRs,
      events: eventsData.data,
    }
  } catch (error) {
    console.error("Error fetching GitHub data:", error)
    throw error
  }
}

export default async function OverviewPage() {
  const session = await auth()
  
  if (!session?.accessToken) {
    redirect("/")
  }

  const data = await getDashboardData(session.accessToken)

  // ✅ 修复：添加类型注解
  const totalStars = data.repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0)
  const totalForks = data.repos.reduce((acc: number, repo: any) => acc + repo.forks_count, 0)
  const totalPRs = data.repos.reduce((acc: number, repo: any) => acc + (repo.total_pulls || 0), 0)

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {data.user.name || data.user.login}!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your GitHub activity.
          </p>
        </div>

        <StatsCards
          repos={data.repos.length}
          stars={totalStars}
          followers={data.user.followers}
          prs={totalPRs}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <ActivityChart events={data.events} />
          </div>
          <div className="col-span-3">
            <RecentActivity events={data.events.slice(0, 5)} />
          </div>
        </div>
      </div>
    </Suspense>
  )
}
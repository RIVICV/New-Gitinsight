// app/dashboard/analytics/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { GitCommit } from "lucide-react"

const COLORS = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444", "#8b5cf6", "#ec4899"]

// ✅ 添加时间戳参数，强制刷新
async function fetchAnalytics(accessToken: string) {
  const timestamp = Date.now()
  const res = await fetch(`/api/github/analytics?_t=${timestamp}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()

  const { data: analytics, isLoading, error, refetch } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => {
      if (!session?.accessToken) {
        throw new Error("No access token")
      }
      return fetchAnalytics(session.accessToken)
    },
    enabled: !!session?.accessToken && status === "authenticated",
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  })

  const handleRefresh = () => {
    refetch()
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
              <CardContent><Skeleton className="h-64 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <div className="text-center">
          <p className="text-red-500 font-medium">Failed to load analytics</p>
          <p className="text-sm text-muted-foreground mt-2">{(error as Error).message}</p>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    )
  }

  const languageData = analytics.languageDistribution || []
  const weeklyData = analytics.weeklyCommits || []
  const repoGrowthData = analytics.repoGrowth || []

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Visualize your GitHub activity and contributions
          </p>
        </div>
        <Button onClick={handleRefresh} size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalRepos || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Stars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStars || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Productivity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{analytics.metrics?.productivityScore || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* 语言分布 */}
      <Card>
        <CardHeader>
          <CardTitle>Language Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {languageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={(entry: any) => `${entry.name}: ${entry.percentage || 0}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {languageData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No language data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 每周提交 */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Commit Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            {weeklyData.length > 0 && weeklyData.some((d: any) => d.commits > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="commits" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <GitCommit className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">No commit activity found</p>
                <p className="text-xs">Start coding to see your commit activity here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>


      {/* 仓库增长 */}
      <Card>
        <CardHeader>
          <CardTitle>Repository Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            {repoGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={repoGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No growth data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 工程指标 */}
      <Card>
        <CardHeader>
          <CardTitle>Engineering Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Productivity Score</p>
              <p className="text-2xl font-bold text-primary">{analytics.metrics?.productivityScore || 0}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Consistency Score</p>
              <p className="text-2xl font-bold text-green-500">{analytics.metrics?.consistencyScore || 0}</p>
            </div>
          </div>
          {analytics.metrics?.repositoryHealth?.recommendations && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Recommendations</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {analytics.metrics.repositoryHealth.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
// app/dashboard/analytics/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
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

const COLORS = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444", "#8b5cf6", "#ec4899"]

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetch("/api/github/analytics", {
        headers: { "Authorization": `Bearer ${session.accessToken}` }
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        })
        .then(data => {
          console.log("📊 Analytics Data:", data)
          setData(data)
          setLoading(false)
        })
        .catch(err => {
          console.error("❌ Error:", err)
          setError(err.message)
          setLoading(false)
        })
    } else if (status === "unauthenticated") {
      setLoading(false)
    }
  }, [status, session])

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  const languageData = data.languageDistribution || []
  const weeklyData = data.weeklyCommits || []
  const repoGrowthData = data.repoGrowth || []

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Visualize your GitHub activity and contributions
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRepos || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Stars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStars || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Productivity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.metrics?.productivityScore || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* 语言分布饼图 */}
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

      {/* ✅ 每周提交柱状图 - 显示数据 */}
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
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No commit activity data available. Start coding! 🚀
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ✅ 仓库增长折线图 */}
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

      {/* ✅ 工程指标 */}
      <Card>
        <CardHeader>
          <CardTitle>Engineering Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Productivity Score</p>
              <p className="text-2xl font-bold text-primary">{data.metrics?.productivityScore || 0}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Consistency Score</p>
              <p className="text-2xl font-bold text-green-500">{data.metrics?.consistencyScore || 0}</p>
            </div>
          </div>
          {data.metrics?.repositoryHealth?.recommendations && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Recommendations</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {data.metrics.repositoryHealth.recommendations.map((rec: string, i: number) => (
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
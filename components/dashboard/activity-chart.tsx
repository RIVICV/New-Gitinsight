// components/dashboard/activity-chart.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, eachDayOfInterval, subDays, startOfDay } from "date-fns"

interface ActivityChartProps {
  events: any[]  // 使用 any 暂时解决类型问题
}

export function ActivityChart({ events }: ActivityChartProps) {
  const today = startOfDay(new Date())
  const sevenDaysAgo = subDays(today, 6)

  const days = eachDayOfInterval({
    start: sevenDaysAgo,
    end: today,
  })

  const data = days.map((day) => {
    const count = events.filter((event) => {
      const eventDate = startOfDay(new Date(event.created_at))
      return eventDate.getTime() === day.getTime() && 
             (event.type === "PushEvent" || event.type === "PullRequestEvent")
    }).length

    return {
      date: format(day, "MMM dd"),
      commits: count,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="commits"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorCommits)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
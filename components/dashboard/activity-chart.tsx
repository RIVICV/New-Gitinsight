// components/dashboard/activity-chart.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, eachDayOfInterval, subDays, startOfDay } from "date-fns"
import { Activity } from "lucide-react"

interface ActivityChartProps {
  events: any[]
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

  const maxCommits = Math.max(...data.map(d => d.commits), 1)

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Activity Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
              <XAxis 
                dataKey="date" 
                className="text-xs" 
                tick={{ fill: 'currentColor', opacity: 0.6 }}
                axisLine={{ stroke: 'currentColor', opacity: 0.1 }}
                tickLine={false}
              />
              <YAxis 
                className="text-xs" 
                tick={{ fill: 'currentColor', opacity: 0.6 }}
                axisLine={false}
                tickLine={false}
                domain={[0, maxCommits + 1]}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="commits"
                stroke="#6366f1"
                strokeWidth={2.5}
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
// components/dashboard/recent-activity.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { timeAgo } from "@/lib/utils"
import { GitCommit, GitPullRequest, Star, AlertCircle } from "lucide-react"

interface RecentActivityProps {
  events: any[]  // 使用 any 暂时解决类型问题
}

export function RecentActivity({ events }: RecentActivityProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <GitCommit className="w-4 h-4 text-blue-500" />
      case "PullRequestEvent":
        return <GitPullRequest className="w-4 h-4 text-purple-500" />
      case "WatchEvent":
        return <Star className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getEventLabel = (event: any) => {
    switch (event.type) {
      case "PushEvent":
        return `Pushed to ${event.repo.name}`
      case "PullRequestEvent":
        const action = event.payload?.action || "updated"
        return `${action.charAt(0).toUpperCase() + action.slice(1)} PR in ${event.repo.name}`
      case "WatchEvent":
        return `Starred ${event.repo.name}`
      default:
        return `${event.type} on ${event.repo.name}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-start gap-3">
                <div className="mt-1">{getEventIcon(event.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{getEventLabel(event)}</p>
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(event.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
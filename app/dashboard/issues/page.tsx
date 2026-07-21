// app/dashboard/issues/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { AlertCircle, CheckCircle, Clock, ExternalLink, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

async function fetchIssues(accessToken: string) {
  const res = await fetch("/api/github/issues", {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export default function IssuesPage() {
  const { data: session } = useSession()
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all")

  const { data: issues, isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: () => fetchIssues(session?.accessToken!),
    enabled: !!session?.accessToken,
  })

  const filteredIssues = issues?.filter((issue: any) => {
    if (filter === "all") return true
    return issue.state === filter
  }) || []

  const getStatusIcon = (issue: any) => {
    if (issue.state === "closed") return <CheckCircle className="w-4 h-4 text-green-500" />
    return <AlertCircle className="w-4 h-4 text-yellow-500" />
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-16" />)}
        </div>
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Issues</h1>
        <p className="text-muted-foreground">
          {filteredIssues.length} issues found
        </p>
      </div>

      {/* 筛选按钮 */}
      <div className="flex gap-2">
        {["all", "open", "closed"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f as any)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Issue 列表 */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No issues found</p>
          </div>
        ) : (
          filteredIssues.map((issue: any) => (
            <Card key={issue.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(issue)}
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary hover:underline flex items-center gap-1"
                      >
                        #{issue.number} {issue.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{issue.user.login}</span>
                      <span>·</span>
                      <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{issue.repo?.name || "Unknown repo"}</span>
                    </div>
                    {issue.labels && issue.labels.length > 0 && (
                      <div className="flex gap-1.5 mt-1">
                        {issue.labels.slice(0, 3).map((label: any) => (
                          <Badge
                            key={label.id}
                            style={{ backgroundColor: `#${label.color}` }}
                            className="text-white text-xs"
                          >
                            {label.name}
                          </Badge>
                        ))}
                        {issue.labels.length > 3 && (
                          <Badge variant="outline">+{issue.labels.length - 3}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <Badge variant={issue.state === "open" ? "default" : "secondary"}>
                    {issue.state}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
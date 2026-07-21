// app/dashboard/pull-requests/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { GitPullRequest, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

async function fetchPRs(accessToken: string) {
  const res = await fetch("/api/github/pulls", {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export default function PullRequestsPage() {
  const { data: session } = useSession()
  const [filter, setFilter] = useState<"all" | "open" | "closed" | "merged">("all")

  const { data: pulls, isLoading } = useQuery({
    queryKey: ["pulls"],
    queryFn: () => fetchPRs(session?.accessToken!),
    enabled: !!session?.accessToken,
  })

  const filteredPulls = pulls?.filter((pr: any) => {
    if (filter === "all") return true
    if (filter === "open") return pr.state === "open"
    if (filter === "closed") return pr.state === "closed" && !pr.merged_at
    if (filter === "merged") return pr.merged_at
    return true
  }) || []

  const getStatusIcon = (pr: any) => {
    if (pr.merged_at) return <CheckCircle className="w-4 h-4 text-purple-500" />
    if (pr.state === "closed") return <XCircle className="w-4 h-4 text-red-500" />
    return <Clock className="w-4 h-4 text-yellow-500" />
  }

  const getStatusBadge = (pr: any) => {
    if (pr.merged_at) return <Badge className="bg-purple-500">Merged</Badge>
    if (pr.state === "closed") return <Badge variant="destructive">Closed</Badge>
    return <Badge className="bg-green-500">Open</Badge>
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-16" />)}
        </div>
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pull Requests</h1>
        <p className="text-muted-foreground">
          {filteredPulls.length} pull requests
        </p>
      </div>

      {/* 筛选按钮 */}
      <div className="flex gap-2 flex-wrap">
        {["all", "open", "merged", "closed"].map((f) => (
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

      {/* PR 列表 */}
      <div className="space-y-3">
        {filteredPulls.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <GitPullRequest className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No pull requests found</p>
          </div>
        ) : (
          filteredPulls.map((pr: any) => (
            <Card key={pr.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(pr)}
                      <a
                        href={pr.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary hover:underline flex items-center gap-1"
                      >
                        #{pr.number} {pr.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{pr.user.login}</span>
                      <span>·</span>
                      <span>{new Date(pr.created_at).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{pr.repo?.name || "Unknown repo"}</span>
                    </div>
                  </div>
                  {getStatusBadge(pr)}
                </div>
                {pr.body && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {pr.body}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
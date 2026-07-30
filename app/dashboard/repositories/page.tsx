// app/dashboard/repositories/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { 
  Search, 
  Star, 
  GitFork, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// ✅ 导入 GitHubRepo 类型
import { GitHubRepo } from "@/types/github"

// ✅ 为 fetchRepos 添加类型
// app/dashboard/repositories/page.tsx

async function fetchRepos(accessToken: string): Promise<GitHubRepo[]> {
  // ✅ 添加时间戳参数 _t，让每次请求的 URL 都不同
  const timestamp = Date.now()
  const response = await fetch(`/api/github/repos?_t=${timestamp}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) throw new Error("Failed to fetch repositories")
  return response.json()
}

export default function RepositoriesPage() {
  const { data: session } = useSession()
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data: repos, isLoading, refetch } = useQuery({
    queryKey: ["repos"],
    queryFn: () => fetchRepos(session?.accessToken!),
    enabled: !!session?.accessToken,
    staleTime: 0,
    gcTime: 0,
  })

  // ✅ 为 filter 添加类型
  const filteredRepos = repos?.filter((repo: GitHubRepo) =>
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    (repo.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
  ) || []

  const totalPages = Math.ceil(filteredRepos.length / pageSize)
  const paginatedRepos = filteredRepos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      Python: "#3572A5",
      Go: "#00ADD8",
      Rust: "#dea584",
      Java: "#b07219",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Shell: "#89e051",
      Vue: "#2c3e50",
    }
    return language ? colors[language] || "#858585" : "#858585"
  }

  const handleRefresh = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Repositories</h1>
          <p className="text-muted-foreground">
            {filteredRepos.length} repositories found
          </p>
        </div>
        <Button onClick={handleRefresh} size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {paginatedRepos.map((repo: GitHubRepo) => (
          <Card key={repo.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-medium hover:text-primary hover:underline"
                  >
                    {repo.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {repo.description && (
                    <p className="text-sm text-muted-foreground">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" />
                      {repo.forks_count}
                    </span>
                    <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {repo.open_issues_count > 0 && (
                  <Badge variant="destructive">
                    {repo.open_issues_count} issues
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
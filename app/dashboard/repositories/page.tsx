// app/dashboard/repositories/page.tsx
"use client"

import { useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Search, Star, GitFork, ExternalLink } from "lucide-react"
import { GitHubRepo } from "@/types/github"
import { formatDate, getLanguageColor } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

async function fetchRepos(accessToken: string): Promise<GitHubRepo[]> {
  const response = await fetch("/api/github/repos", {
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
  const [languageFilter, setLanguageFilter] = useState<string>("all")

  const { data: repos, isLoading } = useQuery({
    queryKey: ["repos"],
    queryFn: () => fetchRepos(session?.accessToken!),
    enabled: !!session?.accessToken,
  })

  // 获取所有语言
  const languages = useMemo(() => {
    if (!repos) return []
    const langs = new Set(repos.map(repo => repo.language).filter(Boolean))
    return ["all", ...Array.from(langs) as string[]]
  }, [repos])

  // 过滤仓库
  const filteredRepos = useMemo(() => {
    if (!repos) return []
    return repos.filter((repo) => {
      const matchesSearch = repo.name.toLowerCase().includes(search.toLowerCase()) ||
                           (repo.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
      const matchesLanguage = languageFilter === "all" || repo.language === languageFilter
      return matchesSearch && matchesLanguage
    })
  }, [repos, search, languageFilter])

  if (isLoading) {
    return <RepositoriesSkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Repositories</h1>
        <p className="text-muted-foreground">
          Manage and explore your GitHub repositories
        </p>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {languages.map((lang) => (
            <Badge
              key={lang}
              variant={languageFilter === lang ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setLanguageFilter(lang)}
            >
              {lang === "all" ? "All" : lang}
            </Badge>
          ))}
        </div>
      </div>

      {/* 结果统计 */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredRepos.length} of {repos?.length || 0} repositories
      </p>

      {/* 表格 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repository</TableHead>
                <TableHead>Language</TableHead>
                <TableHead className="text-right">Stars</TableHead>
                <TableHead className="text-right">Forks</TableHead>
                <TableHead className="text-right">Issues</TableHead>
                <TableHead className="text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRepos.map((repo) => (
                <TableRow key={repo.id}>
                  <TableCell>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      <span className="font-medium">{repo.name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {repo.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {repo.language && (
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        />
                        <span>{repo.language}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {repo.stargazers_count}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <GitFork className="w-4 h-4 text-muted-foreground" />
                      {repo.forks_count}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={repo.open_issues_count > 0 ? "destructive" : "secondary"}>
                      {repo.open_issues_count}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDate(repo.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
              {filteredRepos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No repositories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function RepositoriesSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-10 flex-1" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
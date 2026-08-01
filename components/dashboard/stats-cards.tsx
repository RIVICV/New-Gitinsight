// components/dashboard/stats-cards.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderGit2, Star, Users, GitPullRequest } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  repos: number
  stars: number
  followers: number
  prs: number
}

const colorMap = {
  repos: { bg: "from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10", icon: "text-blue-500", iconBg: "bg-blue-500/10" },
  stars: { bg: "from-amber-50/50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10", icon: "text-amber-500", iconBg: "bg-amber-500/10" },
  followers: { bg: "from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10", icon: "text-emerald-500", iconBg: "bg-emerald-500/10" },
  prs: { bg: "from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10", icon: "text-purple-500", iconBg: "bg-purple-500/10" },
}

export function StatsCards({ repos, stars, followers, prs }: StatsCardsProps) {
  const stats = [
    { 
      title: "Repositories", 
      value: repos, 
      icon: FolderGit2, 
      key: "repos" as const,
      subtitle: "Total repositories"
    },
    { 
      title: "Stars", 
      value: stars, 
      icon: Star, 
      key: "stars" as const,
      subtitle: "Stars received"
    },
    { 
      title: "Followers", 
      value: followers, 
      icon: Users, 
      key: "followers" as const,
      subtitle: "GitHub followers"
    },
    { 
      title: "Pull Requests", 
      value: prs, 
      icon: GitPullRequest, 
      key: "prs" as const,
      subtitle: "Total PRs"
    },
  ]

  return (
    <>
      {stats.map((stat, index) => {
        const colors = colorMap[stat.key]
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
          >
            <Card className={cn(
              "border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-br",
              colors.bg
            )}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("p-2.5 rounded-xl", colors.iconBg)}>
                  <stat.icon className={cn("w-5 h-5", colors.icon)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold tracking-tight">{stat.value.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground/50 mt-0.5">{stat.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </>
  )
}
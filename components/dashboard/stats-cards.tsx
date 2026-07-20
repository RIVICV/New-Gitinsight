// components/dashboard/stats-cards.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  repos: number
  stars: number
  followers: number
  prs: number
}

export function StatsCards({ repos, stars, followers, prs }: StatsCardsProps) {
  const stats = [
    {
      title: "Repositories",
      value: repos,
      icon: Icons.repo,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Stars",
      value: stars,
      icon: Icons.star,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Followers",
      value: followers,
      icon: Icons.users,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Pull Requests",
      value: prs,
      icon: Icons.pr,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  )
}
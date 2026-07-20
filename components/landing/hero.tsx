// components/landing/hero.tsx
"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Github, Sparkles, BarChart3, GitBranch, Users, Zap } from "lucide-react"  // ✅ 修复：改成 Github（小写 h）
import { motion } from "framer-motion"

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.gray.950))] opacity-20" />
      
      <div className="container px-4 py-24 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-4 h-4" />
            AI-Powered Developer Platform
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Developer
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Intelligence Platform
            </span>
          </h1>

          <p className="max-w-2xl mt-6 text-lg text-muted-foreground sm:text-xl">
            Track your GitHub activity, analyze your productivity,
            and gain AI-powered insights to become a better developer.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center gap-4 mt-10 sm:flex-row"
          >
            <Button
              size="lg"
              className="gap-2 text-base h-12 px-8 bg-primary hover:bg-primary/90"
              onClick={() => signIn("github", { callbackUrl: "/dashboard/overview" })}
            >
              <Github className="w-5 h-5" />
              Sign in with GitHub
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base h-12 px-8"
            >
              View Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-2 gap-4 mt-16 sm:grid-cols-4"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <feature.icon className="w-4 h-4 text-primary" />
                <span>{feature.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

const features = [
  { icon: BarChart3, label: "Analytics" },
  { icon: GitBranch, label: "Repository Management" },
  { icon: Users, label: "Team Insights" },
  { icon: Zap, label: "AI-Powered" },
]
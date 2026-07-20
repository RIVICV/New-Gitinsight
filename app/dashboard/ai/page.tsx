// app/dashboard/ai/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Sparkles, Loader2, FileText, GitPullRequest, BookOpen, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// 移除 Textarea 导入，因为这里不需要

export default function AIPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const features = [
    {
      id: "analyze",
      icon: Sparkles,
      label: "Analyze Profile",
      description: "Get AI-powered insights about your coding habits",
      prompt: "Analyze my GitHub profile and provide insights about my coding patterns"
    },
    {
      id: "readme",
      icon: FileText,
      label: "Generate README",
      description: "AI-generate a README for your repository",
      prompt: "Generate a professional README for my GitHub repository"
    },
    {
      id: "summary",
      icon: User,
      label: "Developer Summary",
      description: "Generate a summary of your developer profile",
      prompt: "Generate a professional developer summary based on my GitHub activity"
    },
    {
      id: "releasenotes",
      icon: BookOpen,
      label: "Release Notes",
      description: "Generate release notes from commits",
      prompt: "Generate release notes based on my recent commits"
    },
  ]

  const handleFeatureClick = async (feature: any) => {
    setActiveFeature(feature.id)
    setLoading(true)
    setResult("")

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const responses: Record<string, string> = {
        analyze: `### 📊 AI Analysis Results

**Top Languages:** TypeScript, Python, JavaScript
**Strengths:** Frontend development, API design
**Improvement Areas:** Test coverage, documentation

You've been most active in the last 30 days with 45 commits across 12 repositories. Your peak coding hours are between 10:00 AM and 4:00 PM.

**Recommendations:**
- Increase test coverage in your projects
- Consider contributing to open source
- Document your API endpoints`,
        readme: `# Project Name

## Description
This is an AI-generated README for your project.

## Features
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS

## License
MIT`,
        summary: `### 👨‍💻 Developer Summary

**Senior Frontend Engineer** with 5+ years of experience

**Core Competencies:**
- React / Next.js ecosystem
- TypeScript / JavaScript
- API Design & Integration
- UI/UX Development

**Recent Achievements:**
- 45+ commits in the last 30 days
- 12 active repositories
- Leading frontend architecture decisions

**Open to:** Full-stack development roles, technical leadership positions`,
        releasenotes: `### 📝 Release Notes v1.2.0

**New Features:**
- Added dark mode support
- Implemented search functionality
- Improved performance metrics

**Bug Fixes:**
- Fixed authentication flow
- Resolved layout issues on mobile

**Improvements:**
- Updated dependencies
- Optimized bundle size`,
      }

      setResult(responses[feature.id] || "AI analysis complete!")
    } catch (error) {
      setResult("Error generating AI response. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Insights</h1>
        <p className="text-muted-foreground">
          Get AI-powered analysis and recommendations for your GitHub activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon
          const isActive = activeFeature === feature.id
          return (
            <Card
              key={feature.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                isActive ? "border-primary border-2" : ""
              }`}
              onClick={() => handleFeatureClick(feature)}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">{feature.label}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  {isActive && loading && (
                    <Badge className="mt-1">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      Analyzing...
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              AI Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap font-sans">{result}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
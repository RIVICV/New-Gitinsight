// app/dashboard/ai/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Sparkles, Loader2, FileText, BookOpen, User, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AIService from "@/services/ai.service"
import AIContextBuilder from "@/services/ai-context-builder"

async function fetchAIData(accessToken: string) {
  const res = await fetch("/api/github/analytics", {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export default function AIPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const { data: analyticsData } = useQuery({
    queryKey: ["ai-analytics"],
    queryFn: () => fetchAIData(session?.accessToken!),
    enabled: !!session?.accessToken,
  })

  const features = [
    {
      id: "analyze",
      icon: TrendingUp,
      label: "Analyze Profile",
      description: "Get AI-powered insights about your coding habits",
    },
    {
      id: "readme",
      icon: FileText,
      label: "Generate README",
      description: "AI-generate a README for your repository",
    },
    {
      id: "summary",
      icon: User,
      label: "Developer Summary",
      description: "Generate a summary of your developer profile",
    },
    {
      id: "releasenotes",
      icon: BookOpen,
      label: "Release Notes",
      description: "Generate release notes from commits",
    },
  ]

  const handleFeatureClick = async (featureId: string) => {
    setActiveFeature(featureId)
    setLoading(true)
    setResult("")

    try {
      if (!analyticsData) {
        setResult("Please wait for data to load...")
        return
      }

      const { user, repos, events, metrics } = analyticsData

      const context = AIContextBuilder.buildContext(user, repos, events, metrics)

      let response = ""
      switch (featureId) {
        case "analyze":
          response = await AIService.generateInsight(context)
          break
        case "summary":
          response = await AIService.generateResumeSummary(context)
          break
        case "readme":
          const firstRepo = repos[0] || { name: "my-project", description: "A modern software project" }
          const languages = metrics.technologyProfile.languages.map((l: any) => l.name)
          response = await AIService.generateRepositoryReadme(
            firstRepo.name,
            firstRepo.description,
            languages
          )
          break
        case "releasenotes":
          response = "## Release Notes v1.0.0\n\n### Features\n- Initial release\n- GitHub integration\n- AI-powered insights\n\n### Improvements\n- Optimized performance\n- Enhanced user experience"
          break
        default:
          response = "Feature not implemented yet."
      }

      setResult(response)
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
              onClick={() => handleFeatureClick(feature.id)}
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
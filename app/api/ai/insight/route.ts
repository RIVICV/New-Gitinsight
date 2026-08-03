// app/api/ai/insight/route.ts
import { NextRequest, NextResponse } from "next/server"
import { DeveloperContext } from "@/services/ai-context-builder"
import AIService from "@/services/ai.service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { context, action } = body

    console.log("🔍 [API] 收到 AI 请求:", action)

    let result: string
    switch (action) {
      case "analyze":
        result = await AIService.generateInsight(context as DeveloperContext)
        break
      case "resume":
        result = await AIService.generateResumeSummary(context as DeveloperContext)
        break
      case "readme":
        const { repoName, description, languages } = body
        result = await AIService.generateRepositoryReadme(repoName, description, languages)
        break
      case "release":
        const { commits } = body
        result = await AIService.generateReleaseNotes(commits)
        break
      default:
        return NextResponse.json({ error: "未知操作" }, { status: 400 })
    }

    return NextResponse.json({ result })
  } catch (error: any) {
    console.error("❌ [API] AI 调用失败:", error)
    return NextResponse.json(
      { error: error.message || "AI 调用失败" },
      { status: 500 }
    )
  }
}
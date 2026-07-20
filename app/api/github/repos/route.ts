// app/api/github/repos/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Octokit } from "@octokit/rest"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const octokit = new Octokit({ auth: token })
    const { data } = await octokit.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: "updated",
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching repos:", error)
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    )
  }
}
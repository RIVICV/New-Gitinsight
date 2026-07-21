// services/analytics.service.ts
import { GitHubRepo, GitHubEvent, GitHubUser } from '@/types/github'

export interface EngineeringMetrics {
  productivityScore: number
  consistencyScore: number
  repositoryHealth: {
    score: number
    recommendations: string[]
  }
  technologyProfile: {
    languages: { name: string; percentage: number }[]
    frameworks: string[]
  }
  activityTrend: 'increasing' | 'stable' | 'declining'
}

export class AnalyticsService {
  static calculateProductivityScore(events: GitHubEvent[]): number {
    if (events.length === 0) return 0
    const commitCount = events.filter(e => e.type === 'PushEvent').length
    const prCount = events.filter(e => e.type === 'PullRequestEvent').length
    const score = (commitCount * 0.6 + prCount * 0.4) / events.length * 100
    return Math.min(Math.round(score), 100)
  }

  static calculateConsistencyScore(events: GitHubEvent[]): number {
    if (events.length === 0) return 0
    const days = new Set(events.map(e => 
      new Date(e.created_at).toDateString()
    )).size
    return Math.min(Math.round((days / events.length) * 100), 100)
  }

  static analyzeRepositoryHealth(repo: any): {
    score: number
    recommendations: string[]
  } {
    let score = 80
    const recommendations: string[] = []

    if (!repo.description) {
      score -= 10
      recommendations.push('Add a README to help others understand your project')
    }

    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceUpdate > 30) {
      score -= 10
      recommendations.push('Consider updating your repository')
    }

    if (repo.open_issues_count > 10) {
      score -= 5
      recommendations.push('You have open issues that need attention')
    }

    return { score: Math.max(score, 0), recommendations }
  }

  static getTechnologyProfile(repos: any[]): {
    languages: { name: string; percentage: number }[]
    frameworks: string[]
  } {
    const langMap: Record<string, number> = {}
    let total = 0

    repos.forEach((repo: any) => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1
        total++
      }
    })

    const languages = Object.entries(langMap)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)

    const frameworks: string[] = []
    if (langMap['TypeScript'] || langMap['JavaScript']) {
      frameworks.push('React/Next.js')
    }
    if (langMap['Python']) {
      frameworks.push('Django/Flask')
    }
    if (langMap['Go']) {
      frameworks.push('Go')
    }

    return { languages, frameworks }
  }

  static getActivityTrend(events: GitHubEvent[]): 'increasing' | 'stable' | 'declining' {
    if (events.length === 0) return 'stable'
    
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const sixtyDaysAgo = new Date(now)
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const recent = events.filter(e => new Date(e.created_at) >= thirtyDaysAgo).length
    const previous = events.filter(e => 
      new Date(e.created_at) >= sixtyDaysAgo && new Date(e.created_at) < thirtyDaysAgo
    ).length

    if (previous === 0) return recent > 0 ? 'increasing' : 'stable'
    const ratio = recent / previous
    if (ratio > 1.2) return 'increasing'
    if (ratio < 0.8) return 'declining'
    return 'stable'
  }

  static getEngineeringMetrics(
    user: GitHubUser,
    repos: any[],
    events: GitHubEvent[]
  ): EngineeringMetrics {
    const healthScores = repos.map(repo => this.analyzeRepositoryHealth(repo).score)
    const avgHealth = healthScores.length > 0 
      ? healthScores.reduce((a, b) => a + b, 0) / healthScores.length 
      : 0

    return {
      productivityScore: this.calculateProductivityScore(events),
      consistencyScore: this.calculateConsistencyScore(events),
      repositoryHealth: {
        score: Math.round(avgHealth),
        recommendations: repos.flatMap(repo => 
          this.analyzeRepositoryHealth(repo).recommendations
        ).slice(0, 5),
      },
      technologyProfile: this.getTechnologyProfile(repos),
      activityTrend: this.getActivityTrend(events),
    }
  }
}

// ✅ 关键：默认导出
export default AnalyticsService
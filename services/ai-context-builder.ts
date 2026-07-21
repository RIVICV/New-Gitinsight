// services/ai-context-builder.ts
import { GitHubUser, GitHubEvent } from '@/types/github'
// ✅ 使用类型导入，不导入具体实现
import type { EngineeringMetrics } from './analytics.service'

export interface DeveloperContext {
  profile: {
    username: string
    name: string
    bio: string
    followers: number
    repos: number
  }
  technology: {
    primaryLanguages: string[]
    frameworks: string[]
    experienceSignals: string[]
  }
  engineering: {
    productivityScore: number
    consistencyScore: number
    activityTrend: string
    topRepositories: string[]
  }
  improvementAreas: string[]
}

export class AIContextBuilder {
  static buildContext(
    user: GitHubUser,
    repos: any[],
    events: GitHubEvent[],
    metrics: EngineeringMetrics
  ): DeveloperContext {
    return {
      profile: {
        username: user.login,
        name: user.name || user.login,
        bio: user.bio || 'Software Developer',
        followers: user.followers,
        repos: user.public_repos,
      },
      technology: {
        primaryLanguages: metrics.technologyProfile.languages
          .slice(0, 3)
          .map((l: any) => l.name),
        frameworks: metrics.technologyProfile.frameworks,
        experienceSignals: this.getExperienceSignals(repos),
      },
      engineering: {
        productivityScore: metrics.productivityScore,
        consistencyScore: metrics.consistencyScore,
        activityTrend: metrics.activityTrend,
        topRepositories: repos
          .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
          .slice(0, 5)
          .map((r: any) => r.name),
      },
      improvementAreas: metrics.repositoryHealth.recommendations,
    }
  }

  private static getExperienceSignals(repos: any[]): string[] {
    const signals: string[] = []
    const hasProjectStructure = repos.some((r: any) => 
      r.description && r.description.length > 50
    )
    const hasMultipleLanguages = repos.some((r: any) => r.language)

    if (hasProjectStructure) signals.push('Documentation awareness')
    if (hasMultipleLanguages) signals.push('Multi-language experience')
    if (repos.length > 10) signals.push('Active project maintenance')
    if (repos.some((r: any) => r.stargazers_count > 10)) signals.push('Community engagement')
    
    return signals
  }
}

// ✅ 默认导出
export default AIContextBuilder
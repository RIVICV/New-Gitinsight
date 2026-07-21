// services/ai-prompt-builder.ts
import { DeveloperContext } from './ai-context-builder'

export class AIPromptBuilder {
  static buildDeveloperAnalysisPrompt(context: DeveloperContext): string {
    return `
You are a senior software engineering mentor analyzing a developer's GitHub profile.

Developer Profile:
- Name: ${context.profile.name}
- Username: ${context.profile.username}
- Bio: ${context.profile.bio}
- Followers: ${context.profile.followers}
- Repositories: ${context.profile.repos}

Technology Stack:
- Primary Languages: ${context.technology.primaryLanguages.join(', ')}
- Frameworks: ${context.technology.frameworks.join(', ') || 'Not specified'}
- Experience Signals: ${context.technology.experienceSignals.join(', ') || 'Building experience'}

Engineering Performance:
- Productivity Score: ${context.engineering.productivityScore}/100
- Consistency Score: ${context.engineering.consistencyScore}/100
- Activity Trend: ${context.engineering.activityTrend}
- Top Repositories: ${context.engineering.topRepositories.join(', ')}

Identified Improvement Areas:
${context.improvementAreas.map(area => `- ${area}`).join('\n')}

Based on this data, provide:
1. A concise professional summary of this developer's engineering profile
2. Three specific, actionable recommendations for technical growth
3. A prediction of their engineering trajectory in the next 6 months

Keep the response professional, encouraging, and grounded in the provided data.
`
  }

  static buildResumeSummaryPrompt(context: DeveloperContext): string {
    return `
Based on the following developer profile, generate a professional resume summary:

Profile:
- Name: ${context.profile.name}
- Bio: ${context.profile.bio}
- Primary Languages: ${context.technology.primaryLanguages.join(', ')}
- Frameworks: ${context.technology.frameworks.join(', ')}
- Top Projects: ${context.engineering.topRepositories.join(', ')}
- Experience Signals: ${context.technology.experienceSignals.join(', ')}

Generate a 2-3 sentence professional summary suitable for a software engineer's resume.
`
  }

  static buildRepositoryReadmePrompt(repoName: string, description: string, technologies: string[]): string {
    return `
Generate a professional README for a GitHub repository:

Repository: ${repoName}
Description: ${description || 'No description provided'}
Technologies: ${technologies.join(', ')}

Create a comprehensive README that includes:
- Project title and description
- Key features
- Installation instructions
- Tech stack
- Contributing guidelines
- License

Make it professional, clear, and well-structured.
`
  }
}
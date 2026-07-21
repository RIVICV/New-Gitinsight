// services/ai.service.ts
// ✅ 使用类型导入
import type { DeveloperContext } from './ai-context-builder'

export class AIService {
  static async generateInsight(context: DeveloperContext): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500))

    const primaryLang = context.technology.primaryLanguages[0] || 'multiple languages'
    const trend = context.engineering.activityTrend

    return `## Engineering Profile Summary

${context.profile.name} is a dedicated software developer with expertise in ${primaryLang}. You maintain ${context.profile.repos} repositories with a productivity score of ${context.engineering.productivityScore}/100.

## Strengths

- **Technology Stack**: ${context.technology.primaryLanguages.join(', ')}
- **Consistency**: ${context.engineering.consistencyScore > 70 ? 'Shows reliable coding habits' : 'Building consistent development patterns'}
- **Activity**: ${trend}

## Recommendations

${context.improvementAreas.length > 0 
  ? context.improvementAreas.map((area, i) => `${i + 1}. ${area}`).join('\n')
  : '1. Continue building your portfolio with diverse projects\n2. Consider contributing to open source'}

## Engineering Trajectory

Based on your current activity, you are ${trend === 'increasing' ? 'on an upward trajectory' : 'maintaining steady growth'}.`
  }

  static async generateResumeSummary(context: DeveloperContext): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const primaryLang = context.technology.primaryLanguages[0] || 'software development'
    const techStack = context.technology.primaryLanguages.join(', ')

    return `${context.profile.name} is a ${primaryLang} developer with ${context.profile.repos} repositories and a strong focus on ${techStack}. Active contributor with a demonstrated ability to maintain consistent development practices.`
  }

  static async generateRepositoryReadme(repoName: string, description: string, languages: string[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1200))

    return `# ${repoName}

${description || 'A modern software project'}

## Features

- Built with ${languages.join(', ')}
- Modern architecture and best practices

## Installation

\`\`\`bash
git clone https://github.com/yourusername/${repoName}.git
cd ${repoName}
npm install
npm run dev
\`\`\`

## Tech Stack

${languages.map(lang => `- ${lang}`).join('\n')}

## License

MIT`
  }
}

// ✅ 默认导出
export default AIService
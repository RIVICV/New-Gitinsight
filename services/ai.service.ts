// services/ai.service.ts
import type { DeveloperContext } from './ai-context-builder'

export class AIService {
  static async generateInsight(context: DeveloperContext): Promise<string> {
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 2000))

    const primaryLang = context.technology.primaryLanguages[0] || 'multiple languages'
    const secondaryLang = context.technology.primaryLanguages[1] || 'various technologies'
    const trend = context.engineering.activityTrend
    const score = context.engineering.productivityScore
    const consistency = context.engineering.consistencyScore

    // 根据实际数据生成不同的建议
    const improvementTips = []
    if (score < 50) {
      improvementTips.push('📈 Focus on making regular, small commits to build momentum')
    } else if (score < 70) {
      improvementTips.push('📊 Your productivity is solid - consider tackling a challenging project')
    } else {
      improvementTips.push('🚀 You\'re highly productive! Consider contributing to open source')
    }

    if (consistency < 50) {
      improvementTips.push('📅 Try to code at least 3-4 days a week for better consistency')
    } else if (consistency < 70) {
      improvementTips.push('✅ Good consistency - try to maintain this rhythm')
    } else {
      improvementTips.push('⭐ Excellent consistency! You\'re building great habits')
    }

    if (context.technology.primaryLanguages.length < 2) {
      improvementTips.push('💡 Consider learning a new language to expand your skill set')
    }

    return `## 📊 Engineering Profile Analysis

### 👤 Developer Overview
**${context.profile.name}** is a ${primaryLang} developer with ${context.profile.repos} repositories and ${context.profile.followers} followers. Your primary focus is on ${context.technology.primaryLanguages.join(', ')}.

### 📈 Performance Metrics
- **Productivity Score**: ${score}/100 - ${score >= 70 ? '🔥 Strong performance' : score >= 50 ? '📈 Developing steadily' : '🌱 Building foundation'}
- **Consistency Score**: ${consistency}/100 - ${consistency >= 70 ? '⭐ Excellent consistency' : consistency >= 50 ? '🔄 Moderate consistency' : '📅 Needs more regularity'}
- **Activity Trend**: ${trend === 'increasing' ? '📈 Upward trajectory' : trend === 'stable' ? '➡️ Stable' : '📉 Needs attention'}

### 🛠️ Technology Profile
**Primary Languages**: ${context.technology.primaryLanguages.join(', ')}
**Frameworks**: ${context.technology.frameworks.join(', ') || 'Building your stack'}
**Experience Signals**: ${context.technology.experienceSignals.join(', ') || 'Early career developer'}

### 💡 Improvement Recommendations
${improvementTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

### 🎯 Engineering Trajectory
Based on your current activity, you are ${trend === 'increasing' ? 'on a strong upward trajectory. Keep up the momentum!' : trend === 'stable' ? 'maintaining steady growth. Consider taking on more challenging projects.' : 'at a point where renewed focus could accelerate progress.'}

### 🏆 Key Strengths
- ${context.technology.primaryLanguages.length > 1 ? 'Multi-language proficiency' : 'Focused expertise in ' + primaryLang}
- ${context.engineering.topRepositories.length > 3 ? 'Multiple active projects' : 'Building your project portfolio'}
- ${context.engineering.consistencyScore > 60 ? 'Good development consistency' : 'Room for consistent practice'}`
  }

  static async generateResumeSummary(context: DeveloperContext): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500))

    const primaryLang = context.technology.primaryLanguages[0] || 'software development'
    const techStack = context.technology.primaryLanguages.join(', ')
    const projects = context.engineering.topRepositories.slice(0, 3)

    return `## 📝 Professional Resume Summary

**${context.profile.name}**
${context.profile.bio || 'Software Developer'}

### 👨‍💻 Professional Summary
${context.profile.name} is a ${primaryLang} developer with ${context.profile.repos} repositories and a strong focus on ${techStack}. Demonstrates ${context.engineering.consistencyScore > 70 ? 'consistent' : 'developing'} development habits with a productivity score of ${context.engineering.productivityScore}/100.

### 💻 Technical Skills
- **Languages**: ${context.technology.primaryLanguages.join(', ')}
- **Frameworks**: ${context.technology.frameworks.join(', ') || 'Modern web technologies'}
- **Experience**: ${context.technology.experienceSignals.join(', ')}

### 📂 Notable Projects
${projects.map((p: string) => `- **${p}**: Active development project`).join('\n')}

### 🎯 Career Objective
${primaryLang} developer seeking opportunities to build ${context.technology.primaryLanguages.length > 1 ? 'full-stack' : 'specialized'} applications. Passionate about ${context.technology.experienceSignals.join(' and ') || 'software development'}.

### 🏅 Achievements
- ${context.profile.followers} GitHub followers
- ${context.profile.repos} repositories maintained
- ${context.engineering.productivityScore}% productivity score
- ${context.engineering.consistencyScore}% consistency score`
  }

  static async generateRepositoryReadme(repoName: string, description: string, languages: string[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500))

    return `# ${repoName}

${description || 'A modern software project built with modern technologies'}

## 📖 Description

${repoName} is a well-structured software project designed to solve real-world problems. Built with ${languages.join(', ')}, this repository demonstrates clean code practices and modern development patterns.

## ✨ Features

- 🚀 Built with ${languages.join(', ')}
- 📁 Clean and maintainable codebase
- 🔧 Modern development practices
- 📊 Well-documented code
- 🧪 Testable architecture

## 🛠️ Installation

### Prerequisites
- Node.js 18+ or ${languages[0] || 'modern'} runtime
- npm / yarn / pnpm

### Setup

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/${repoName}.git
cd ${repoName}

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

## 📦 Tech Stack

${languages.map(lang => `- **${lang}**: Primary development language`).join('\n')}
- **React/Next.js**: Frontend framework
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Developer**: Your Name
**GitHub**: [@yourusername](https://github.com/yourusername)

---

### ⭐ If you find this project useful, please consider giving it a star!`
  }

  static async generateReleaseNotes(commits: any[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const features = commits.filter(c => c.message.toLowerCase().includes('feat') || c.message.toLowerCase().includes('add'))
    const fixes = commits.filter(c => c.message.toLowerCase().includes('fix') || c.message.toLowerCase().includes('bug'))
    const chores = commits.filter(c => c.message.toLowerCase().includes('chore') || c.message.toLowerCase().includes('update'))

    return `## 📦 Release Notes v1.0.0

### 📅 Release Date
${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

### 🆕 New Features
${features.length > 0 
  ? features.map(c => `- ${c.message}`).join('\n')
  : '- Initial project release\n- GitHub integration\n- AI-powered insights\n- Analytics dashboard'}

### 🐛 Bug Fixes
${fixes.length > 0 
  ? fixes.map(c => `- ${c.message}`).join('\n')
  : '- Fixed authentication flow\n- Resolved data loading issues\n- Improved error handling'}

### 🔧 Improvements
${chores.length > 0 
  ? chores.map(c => `- ${c.message}`).join('\n')
  : '- Optimized performance\n- Enhanced user experience\n- Updated dependencies'}

### 📊 Contributors
- @yourusername

### 📈 Next Steps
- [ ] Add more tests
- [ ] Improve documentation
- [ ] Add CI/CD pipeline`
  }
}

export default AIService
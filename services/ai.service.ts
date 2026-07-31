// services/ai.service.ts
import type { DeveloperContext } from './ai-context-builder'

export class AIService {
  static async generateInsight(context: DeveloperContext): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const { profile, technology, engineering, improvementAreas } = context
    const { productivityScore, consistencyScore, activityTrend } = engineering
    
    const primaryLang = technology.primaryLanguages[0] || 'software development'
    const secondaryLang = technology.primaryLanguages[1] || ''
    const topProjects = engineering.topRepositories.slice(0, 3)

    // ============================================================
    // 计算综合评级 - 用温暖的语言描述
    // ============================================================

    const overallScore = Math.round((productivityScore + consistencyScore) / 2)
    let overallRating = ''
    let ratingDescription = ''
    let encouragement = ''
    
    if (overallScore >= 85) {
      overallRating = '🌟 Exceptional Engineer'
      ratingDescription = 'You are demonstrating remarkable engineering maturity and consistency.'
      encouragement = 'Your work ethic and technical depth are truly inspiring. Keep pushing boundaries — you\'re already at a level many aspire to reach.'
    } else if (overallScore >= 70) {
      overallRating = '💪 Strong Contributor'
      ratingDescription = 'You have solid engineering fundamentals and a clear growth trajectory.'
      encouragement = 'You\'re building something great here. Your consistency is paying off, and we believe you\'re just getting started. Keep going!'
    } else if (overallScore >= 55) {
      overallRating = '🌱 Growing Developer'
      ratingDescription = 'You are developing good engineering habits and building core skills.'
      encouragement = 'Every great engineer started exactly where you are. Your journey is unfolding beautifully — stay curious, stay consistent, and trust the process.'
    } else if (overallScore >= 40) {
      overallRating = '📚 Early Career Builder'
      ratingDescription = 'You are laying the foundation for a strong engineering career.'
      encouragement = 'This is the most exciting phase — everything is ahead of you. Keep learning, keep building, and don\'t be afraid to make mistakes. That\'s how we all grow.'
    } else {
      overallRating = '🌱 Beginning Your Journey'
      ratingDescription = 'You are taking the first steps in your engineering path.'
      encouragement = 'Welcome to the world of software engineering! Every expert was once a beginner. Your future self will thank you for the work you\'re putting in today.'
    }

    // ============================================================
    // 技术栈评估 - 鼓励性语言
    // ============================================================

    let techDepthComment = ''
    if (technology.primaryLanguages.length >= 3) {
      techDepthComment = `You're working across ${technology.primaryLanguages.join(', ')} — that's impressive! Polyglot developers like you are rare and valuable. Your ability to adapt across different ecosystems is a superpower.`
    } else if (technology.primaryLanguages.length >= 2) {
      techDepthComment = `You're building skills in ${technology.primaryLanguages.join(' and ')}. This versatility will serve you well — you're learning to see problems from different angles, which is the mark of a thoughtful engineer.`
    } else {
      techDepthComment = `You're focusing deeply on ${primaryLang}, and that's a great foundation. Depth matters. As you grow, consider exploring adjacent technologies — they'll make you even more powerful in your primary stack.`
    }

    // ============================================================
    // 一致性评估 - 鼓励性语言
    // ============================================================

    let maturityComment = ''
    if (consistencyScore >= 80) {
      maturityComment = 'Your consistency is outstanding. Regular, reliable contributions like yours are what make teams successful. You\'re building a reputation as someone who delivers — and that\'s a beautiful thing.'
    } else if (consistencyScore >= 60) {
      maturityComment = 'You have good consistency, and we see even more potential. Small improvements in your daily routine could unlock a new level of productivity. You\'re on the right track!'
    } else {
      maturityComment = 'Consistency is a muscle, and like any muscle, it grows with practice. Start small — even 15 minutes a day adds up. We believe in you, and we know you can build the rhythm that works best for you.'
    }

    // ============================================================
    // 生产力评估 - 鼓励性语言
    // ============================================================

    let productivityComment = ''
    if (productivityScore >= 80) {
      productivityComment = 'Your productivity is impressive. You have a rare ability to turn ideas into working code efficiently. That\'s a gift — and you\'re using it well. Keep creating!'
    } else if (productivityScore >= 60) {
      productivityComment = 'Your productivity is solid, and you have the capacity to go even further. Every commit, every PR — they all add up. You\'re building momentum, and we\'re here to support you.'
    } else {
      productivityComment = 'Productivity is not about speed — it\'s about progress. You\'re moving forward, and that\'s what matters. Over time, your output will grow as your skills deepen. Be patient with yourself.'
    }

    // ============================================================
    // 项目组合评估 - 鼓励性语言
    // ============================================================

    let portfolioComment = ''
    if (topProjects.length > 0) {
      portfolioComment = `Your portfolio includes ${topProjects.join(', ')}. These projects tell the story of your journey — they show what you care about and what you're capable of. Be proud of them. They are proof of your progress.`
    } else {
      portfolioComment = 'Your portfolio is just beginning, and that\'s exciting! Every great developer started with an empty GitHub profile. Your first repository will be the seed of something wonderful.'
    }

    // ============================================================
    // 趋势分析 - 鼓励性语言
    // ============================================================

    let trendComment = ''
    if (activityTrend === 'increasing') {
      trendComment = '🌱 **You\'re growing!** Your activity is trending upward, and that\'s a sign of building momentum. Something is clicking — keep that energy alive. You\'re on a beautiful trajectory.'
    } else if (activityTrend === 'stable') {
      trendComment = '🌊 **Steady and strong.** You\'re maintaining consistent activity, and that stability is a foundation for growth. Reliable progress is how great careers are built — one step at a time.'
    } else {
      trendComment = '🌸 **A moment of pause.** We all have seasons. Sometimes we step back, and that\'s okay. When you\'re ready, we\'ll be here to support you as you pick up where you left off.'
    }

    // ============================================================
    // 人文关怀的工程建议
    // ============================================================

    const recommendations = improvementAreas.length > 0 
      ? improvementAreas.map((area, i) => `${i + 1}. ${area}`).join('\n')
      : 'Keep doing what you\'re doing. And remember: growth is not linear. Every commit, even the small ones, is a step forward. Be kind to yourself along the way.'

    // ============================================================
    // 构建最终的温暖+权威报告
    // ============================================================

    return `## 🌟 Engineering Growth Report

### 👨‍💻 About You
**${profile.name}** · @${profile.username} · ${profile.followers} followers · ${profile.repos} repositories

### 🏅 Your Engineering Journey
**${overallRating}** · ${ratingDescription}
*Score: ${overallScore}/100 (Productivity: ${productivityScore}/100 · Consistency: ${consistencyScore}/100)*

> ${encouragement}

---

### 🛠️ Your Technology Story

**Your Stack**: ${technology.primaryLanguages.join(', ')}
**Frameworks**: ${technology.frameworks.join(', ') || 'Building your toolkit'}
**Experience**: ${technology.experienceSignals.join(', ') || 'You\'re just getting started, and that\'s wonderful'}

**What we see in you**:
${techDepthComment}

---

### 📈 Your Engineering Growth

**On Consistency**:
${maturityComment}

**On Productivity**:
${productivityComment}

**On Your Momentum**:
${trendComment}

---

### 📦 Your Projects

${portfolioComment}

**Your Notable Repositories**:
${topProjects.length > 0 
  ? topProjects.map((p: string) => `- \`${p}\``).join('\n')
  : '- Your first repository is waiting to be born. We can\'t wait to see what you create.'}

---

### 💡 Gentle Suggestions for Your Journey

${recommendations}

---

### 🎯 Looking Ahead

We believe in your potential. Here\'s what we see:

1. **Your Strengths**: ${technology.primaryLanguages.length > 1 ? `Your curiosity across ${technology.primaryLanguages.join(', ')}` : `Your growing expertise in ${primaryLang}`}

2. **Opportunities to Explore**: ${improvementAreas.length > 0 ? improvementAreas.join('; ') : 'The world is full of possibilities. Keep exploring, keep building.'}

3. **Your Path Forward**: ${activityTrend === 'increasing' ? 'You\'re building momentum. Lean into it — this is your time.' : activityTrend === 'stable' ? 'You\'re building a solid rhythm. Trust it.' : 'Take the time you need. Your journey is your own, and it\'s beautiful.'}

---

### 💌 A Note From Us

Engineering is not just about code — it\'s about curiosity, resilience, and the courage to keep learning even when things get hard. Every line you write is a step toward becoming the developer you want to be.

We see your effort. We celebrate your progress. And we're honored to be part of your journey.

Keep building. Keep growing. Keep being you.

With warmth and encouragement,
**GitInsight AI**

---
*Generated with ❤️ by GitInsight AI — Your Engineering Growth Partner*`
  }

  // ============================================================
  // Resume Summary - 温暖+专业版本
  // ============================================================
  
static async generateResumeSummary(context: DeveloperContext): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500))

  const { profile, technology, engineering } = context
  const primaryLang = technology.primaryLanguages[0] || 'software development'
  const allLangs = technology.primaryLanguages.join(', ')
  const topProjects = engineering.topRepositories.slice(0, 3)

  // ============================================================
  // 计算经验等级
  // ============================================================

  const totalRepos = profile.repos
  const score = engineering.productivityScore

  let experienceLevel = ''
  let yearsEquiv = ''
  let seniorityBadge = ''

  if (score >= 80 && totalRepos >= 8) {
    experienceLevel = 'Senior Software Engineer'
    yearsEquiv = '5+ years equivalent experience'
    seniorityBadge = '🏆 Senior Level'
  } else if (score >= 65 && totalRepos >= 5) {
    experienceLevel = 'Mid-Level Software Engineer'
    yearsEquiv = '3-5 years equivalent experience'
    seniorityBadge = '📈 Mid-Senior Level'
  } else if (score >= 50 && totalRepos >= 3) {
    experienceLevel = 'Junior Software Engineer'
    yearsEquiv = '1-3 years equivalent experience'
    seniorityBadge = '🌱 Junior-Mid Level'
  } else {
    experienceLevel = 'Associate Software Engineer'
    yearsEquiv = '0-1 years equivalent experience'
    seniorityBadge = '📚 Entry Level'
  }

  // ============================================================
  // 技能评级
  // ============================================================

  const primarySkill = primaryLang
  const secondarySkills = technology.primaryLanguages.slice(1).join(', ')
  const hasMultipleLangs = technology.primaryLanguages.length >= 2

  let skillLevel = ''
  if (score >= 75) {
    skillLevel = `Advanced proficiency in ${primarySkill} with ${hasMultipleLangs ? `additional expertise in ${secondarySkills}` : 'deep specialization'}`
  } else if (score >= 55) {
    skillLevel = `Solid working knowledge of ${primarySkill}${hasMultipleLangs ? ` and growing experience with ${secondarySkills}` : ''}`
  } else {
    skillLevel = `Foundational knowledge of ${primarySkill} with demonstrated learning capability`
  }

  // ============================================================
  // 项目经验描述
  // ============================================================

  let projectDescription = ''
  if (topProjects.length >= 3) {
    projectDescription = `Developed and maintained ${topProjects.length} active repositories including ${topProjects.join(', ')}. Demonstrates consistent project delivery and technical ownership.`
  } else if (topProjects.length >= 1) {
    projectDescription = `Active contributor to ${topProjects.join(', ')} with focus on ${primaryLang} development.`
  } else {
    projectDescription = 'Building a portfolio of software projects with a focus on quality and maintainability.'
  }

  // ============================================================
  // 核心能力
  // ============================================================

  const coreCompetencies = [
    `${primaryLang} development`,
    ...(technology.primaryLanguages.slice(1).map(l => `${l}`)),
    'Version control (Git)',
    ...(engineering.consistencyScore >= 70 ? ['Consistent delivery track record'] : []),
    ...(technology.primaryLanguages.length >= 2 ? ['Multi-language adaptability'] : []),
  ].slice(0, 5)

  // ============================================================
  // 构建权威简历摘要
  // ============================================================

  return `## 📄 Professional Resume Summary

### 👤 Candidate Profile

**${profile.name}**
${profile.bio || 'Software Engineer'}
${seniorityBadge} · ${yearsEquiv}

---

### 💼 Professional Summary

${experienceLevel} with demonstrated capability in ${allLangs}. ${projectDescription}

**Key Qualifications**:
- ${skillLevel}
- ${engineering.consistencyScore >= 70 ? 'Demonstrated engineering consistency with strong delivery practices' : 'Building reliable engineering habits with consistent growth'}
- ${engineering.productivityScore >= 60 ? 'Proven ability to maintain productive development velocity' : 'Developing strong coding velocity with increasing output'}
- ${totalRepos >= 3 ? `${totalRepos} active repositories maintained` : 'Actively building a professional portfolio'}

---

### 🛠️ Technical Competencies

| Category | Skills |
|----------|--------|
| **Primary Languages** | ${technology.primaryLanguages.join(', ')} |
| **Frameworks** | ${technology.frameworks.join(', ') || 'Modern development frameworks'} |
| **Tools & Practices** | Git, GitHub, Code Review, CI/CD Awareness |
| **Engineering Practices** | ${engineering.consistencyScore >= 70 ? 'Consistent delivery, Code quality focus' : 'Growing discipline, Learning best practices'} |

---

### 📊 Performance Metrics

| Metric | Score | Assessment |
|--------|-------|------------|
| **Productivity** | ${engineering.productivityScore}/100 | ${engineering.productivityScore >= 70 ? 'Above average output' : engineering.productivityScore >= 50 ? 'Solid productivity with growth potential' : 'Building productive habits'} |
| **Consistency** | ${engineering.consistencyScore}/100 | ${engineering.consistencyScore >= 70 ? 'Strong delivery consistency' : engineering.consistencyScore >= 50 ? 'Developing consistent habits' : 'Establishing regular development rhythm'} |
| **Activity Trend** | ${engineering.activityTrend} | ${engineering.activityTrend === 'increasing' ? '📈 Positive growth trajectory' : engineering.activityTrend === 'stable' ? '📊 Steady and reliable' : '📉 Room for renewed engagement'} |

---

### 📂 Representative Projects

${topProjects.length > 0 
  ? topProjects.map((p: string) => `- **${p}**: ${primaryLang} development project demonstrating practical engineering skills`).join('\n')
  : '- Portfolio in active development'}

---

### 🎯 Career Objectives

${experienceLevel} seeking opportunities to:
- Contribute to meaningful software projects
- Collaborate with engineering teams
- Continuously develop technical expertise
- Deliver high-quality, maintainable code

---

### 🏅 Professional Profile

**GitHub Activity**: ${profile.repos} repositories · ${profile.followers} followers
**Technical Focus**: ${allLangs}
**Development Philosophy**: ${engineering.consistencyScore >= 70 ? 'Consistent, reliable delivery' : 'Continuous learning and improvement'}

---

*This professional summary is generated based on verified GitHub activity data. Actual experience and qualifications may vary. We recommend customizing this summary to reflect your full professional background.*

---
*Generated by GitInsight AI — Professional Engineering Intelligence Platform*`
}
  // ============================================================
  // Generate Repository README - 温暖版本
  // ============================================================
  
static async generateRepositoryReadme(repoInfo: any): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2000))

  const {
    name,
    description,
    languages,
    stars,
    forks,
    issues,
    createdAt,
    updatedAt,
    url,
    owner,
  } = repoInfo

  const primaryLang = languages[0] || 'Software Development'
  const allLangs = languages.join(', ')

  // 根据仓库信息生成不同的徽章
  const badges = [
    `![License](https://img.shields.io/badge/License-MIT-green.svg)`,
    `![Stars](https://img.shields.io/github/stars/${owner}/${name}?style=social)`,
    `![Forks](https://img.shields.io/github/forks/${owner}/${name}?style=social)`,
    `![Issues](https://img.shields.io/github/issues/${owner}/${name})`,
  ].join(' ')

  return `# ${name}

${badges}

${description}

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 📋 Overview

**${name}** is a professional-grade software project built with ${allLangs}. This repository demonstrates modern engineering practices including clean architecture, version control best practices, and maintainable code design.

### Key Metrics

| Metric | Value |
|--------|-------|
| **Primary Language** | ${primaryLang} |
| **Total Languages** | ${languages.length} |
| **Stars** | ⭐ ${stars} |
| **Forks** | 🍴 ${forks} |
| **Open Issues** | 🐛 ${issues} |
| **Created** | ${createdAt} |
| **Last Updated** | ${updatedAt} |

---

## ✨ Features

${languages.map((lang: string) => `- **${lang}** core implementation with best practices`).join('\n')}
- Clean, maintainable codebase
- Version control with Git
- Well-documented architecture
- ${stars > 0 ? `⭐ ${stars} stars from the community` : 'Ready for community engagement'}

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Primary Language** | ${primaryLang} |
| **Additional Languages** | ${languages.slice(1).join(', ') || 'N/A'} |
| **Version Control** | Git / GitHub |
| **Development Environment** | Modern IDE |

### Language Distribution

${languages.map((lang: string ) => `- **${lang}**: Core implementation language`).join('\n')}

---

## 🏗️ Architecture

This project follows a modular, component-based architecture designed for:

- **Scalability**: Easy to extend and maintain
- **Testability**: Components designed for unit testing
- **Readability**: Clear separation of concerns
- **Reusability**: Shared components across the codebase

---

## 🚀 Getting Started

### Prerequisites

- ${primaryLang} development environment
- Git
- (Add specific requirements here)

### Installation

\`\`\`bash
# Clone the repository
git clone ${url}.git
cd ${name}

# Install dependencies
# (Add specific install commands)

# Run the project
# (Add specific run commands)
\`\`\`

### Configuration

Create a configuration file based on the template:

\`\`\`bash
cp .env.example .env
# Edit .env with your settings
\`\`\`

---

## 📁 Project Structure

\`\`\`
${name}/
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript types
├── tests/                  # Test files
├── docs/                   # Documentation
├── .env.example            # Environment variables template
├── package.json            # Dependencies
└── README.md               # This file
\`\`\`

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Process

1. **Fork** the repository
2. **Clone** your fork
3. **Create** a feature branch
4. **Commit** your changes
5. **Push** to your branch
6. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- \`feat:\` New feature
- \`fix:\` Bug fix
- \`docs:\` Documentation
- \`style:\` Code style
- \`refactor:\` Code refactoring
- \`test:\` Testing
- \`chore:\` Maintenance

### Code Quality

- Run tests locally before submitting
- Follow the established code style
- Write meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ by @${owner}
- ${stars > 0 ? `Thanks to ${stars} stars from the community!` : 'Open to contributions and feedback'}

---

## 📧 Contact

**Maintainer**: @${owner}
**Repository**: ${url}

---

<div align="center">

### ⭐ If you find this project useful, please consider giving it a star!

*Generated with ❤️ by GitInsight AI — Professional Engineering Intelligence Platform*

</div>`
}
}
export default AIService

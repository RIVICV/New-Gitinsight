// services/ai.service.ts
// 使用 DeepSeek API - 英文输出

import { DeveloperContext } from './ai-context-builder'

// ============================================================
// 配置 - 在函数内部读取，而不是模块顶部
// ============================================================

async function callDeepSeek(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  
  console.log('🔍 [callDeepSeek] API Key 存在:', !!apiKey)
  
  if (!apiKey) {
    console.error('❌ DEEPSEEK_API_KEY 未配置！')
    throw new Error('DEEPSEEK_API_KEY 未配置')
  }

  console.log('🔍 [callDeepSeek] 发送请求到 DeepSeek API...')
  
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  console.log('🔍 [callDeepSeek] 响应状态:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ DeepSeek API 错误:', response.status, errorText)
    throw new Error(`DeepSeek API 调用失败 (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  console.log('✅ [callDeepSeek] 调用成功')
  return data.choices[0].message.content
}

// ============================================================
// 降级方案
// ============================================================

function generateFallbackResponse(context: DeveloperContext): string {
  return `## 📊 AI Service Not Configured

### Current Status
You are seeing a **template response** because the DeepSeek API Key is not configured or invalid.

### How to Enable Real AI:
1. Visit https://platform.deepseek.com/ to get an API Key
2. Add to \`.env.local\`:
   \`\`\`
   DEEPSEEK_API_KEY=sk-your-key
   \`\`\`
3. Restart the development server

### Template Data (Based on Your GitHub):
**Developer**: ${context.profile.name}
**Tech Stack**: ${context.technology.primaryLanguages.join(', ') || 'Not detected'}
**Productivity Score**: ${context.engineering.productivityScore}/100
**Consistency Score**: ${context.engineering.consistencyScore}/100

Configure your API Key to get real AI analysis.`
}

// ============================================================
// 智能调用
// ============================================================

async function callAI(prompt: string, systemPrompt?: string, context?: DeveloperContext): Promise<string> {
  try {
    console.log('🔍 [callAI] 尝试调用 DeepSeek API...')
    return await callDeepSeek(prompt, systemPrompt)
  } catch (error: any) {
    console.warn('⚠️ [callAI] DeepSeek API 调用失败，使用降级方案:', error.message)
    if (context) {
      return generateFallbackResponse(context)
    }
    return `## ⚠️ AI Service Unavailable\n\nError: ${error.message}\n\nPlease check:\n1. DeepSeek API Key is correctly configured\n2. Network connection is working\n3. Try again later`
  }
}

// ============================================================
// 业务方法 - 英文版
// ============================================================

export class AIService {
  // 生成 AI 洞察 - 英文
  static async generateInsight(context: DeveloperContext): Promise<string> {
    const systemPrompt = `You are a senior software engineering mentor. Analyze the developer's GitHub data and provide professional, actionable insights. 
Your analysis must be data-driven, specific, and practical. 
Use Markdown format with headings, lists, and bold text.
Keep a professional, encouraging, and constructive tone.
IMPORTANT: Always respond in English.`

    const prompt = `
Analyze the following developer's GitHub data and generate a professional report.

## Developer Information
- Username: ${context.profile.username}
- Name: ${context.profile.name}
- Bio: ${context.profile.bio || 'Software Developer'}
- Followers: ${context.profile.followers}
- Repositories: ${context.profile.repos}

## Technology Stack
- Primary Languages: ${context.technology.primaryLanguages.join(', ') || 'Not detected'}
- Frameworks: ${context.technology.frameworks.join(', ') || 'Not specified'}
- Experience Signals: ${context.technology.experienceSignals.join(', ') || 'Developing'}

## Engineering Metrics
- Productivity Score: ${context.engineering.productivityScore}/100
- Consistency Score: ${context.engineering.consistencyScore}/100
- Activity Trend: ${context.engineering.activityTrend}
- Top Repositories: ${context.engineering.topRepositories.join(', ') || 'None'}

## Improvement Areas
${context.improvementAreas.length > 0 
  ? context.improvementAreas.map((area, i) => `${i + 1}. ${area}`).join('\n')
  : 'No specific improvement areas detected'}

Please generate a report with the following sections:
1. **Developer Profile Summary** - One sentence that captures this developer
2. **Technical Capability Analysis** - Strengths and weaknesses in the tech stack
3. **Work Habits Assessment** - Development rhythm and consistency
4. **Actionable Recommendations** - 3-5 specific, actionable suggestions
5. **Career Development Advice** - Next learning directions

Make the report professional, specific, and data-driven.`
    
    return callAI(prompt, systemPrompt, context)
  }

  // 生成简历摘要 - 英文
  static async generateResumeSummary(context: DeveloperContext): Promise<string> {
    const systemPrompt = `You are a professional resume consultant. Transform technical experience into compelling resume descriptions.
Output should be concise, professional, and impactful for technical interviews.
Use Markdown format with headings and lists.
IMPORTANT: Always respond in English.`

    const prompt = `
Generate a professional resume summary based on the following developer information:

- Name: ${context.profile.name}
- Bio: ${context.profile.bio || 'Software Developer'}
- Tech Stack: ${context.technology.primaryLanguages.join(', ') || 'Multi-language development'}
- Frameworks: ${context.technology.frameworks.join(', ') || 'Modern tech stack'}
- Repositories: ${context.profile.repos}
- Key Projects: ${context.engineering.topRepositories.join(', ') || 'Multiple active projects'}
- Experience Signals: ${context.technology.experienceSignals.join(', ') || 'Continuous learning'}

Generate:
1. **Professional Summary**: 3-5 sentences highlighting technical skills and engineering experience
2. **Technical Keywords**: 5-8 tags (e.g., "React", "TypeScript", "Full Stack")
3. **Project Highlights**: 2-3 quantifiable achievement descriptions`
    
    return callAI(prompt, systemPrompt, context)
  }

  // 生成 README - 英文
  static async generateRepositoryReadme(
    repoName: string, 
    description: string, 
    languages: string[]
  ): Promise<string> {
    const systemPrompt = `You are a senior technical documentation expert. Write professional README documents for open source projects.
README should be well-structured, comprehensive, and attractive.
Use Markdown format with emojis and code blocks.
IMPORTANT: Always respond in English.`

    const prompt = `
Generate a professional README for the following GitHub repository:

- Repository Name: ${repoName}
- Description: ${description || 'A modern software project'}
- Tech Stack: ${languages.join(', ') || 'Modern tech stack'}

Include these sections:
1. Project title and compelling introduction
2. Core features (3-5 items with emojis)
3. Technical architecture overview
4. Quick start guide (installation, configuration, running)
5. Contributing guidelines
6. License (MIT)`
    
    return callAI(prompt, systemPrompt)
  }
}

export default AIService
// services/ai.service.ts
// 使用 Agnes 2.5 Flash API（完全免费，国内直连）

import { DeveloperContext } from './ai-context-builder'

// ============================================================
// 配置
// ============================================================

const AGNES_API_KEY = process.env.AGNES_API_KEY
const AGNES_BASE_URL = 'https://apihub.agnes-ai.cn/v1'

// ============================================================
// Agnes API 调用
// ============================================================

async function callAgnes(prompt: string, systemPrompt?: string): Promise<string> {
  // 检查 API Key 是否配置
  if (!AGNES_API_KEY) {
    throw new Error(
      '请先配置 Agnes API Key：\n' +
      '1. 访问 https://agnes-ai.cn/ 注册账号\n' +
      '2. 进入平台获取 API Key\n' +
      '3. 在 .env.local 中添加 AGNES_API_KEY=你的密钥'
    )
  }

  console.log('🔑 Calling Agnes API with prompt length:', prompt.length)

  const response = await fetch(`${AGNES_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AGNES_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'agnes-2.5-flash',  // 或 agnes-2.0-flash（备选）
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Agnes API Error:', response.status, errorText)
    
    // 如果是 404，尝试使用稳定版模型
    if (response.status === 404) {
      console.log('🔄 尝试使用稳定版模型 agnes-2.0-flash...')
      const fallbackResponse = await fetch(`${AGNES_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AGNES_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'agnes-2.0-flash',  // 稳定版
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
          stream: false,
        }),
      })
      
      if (!fallbackResponse.ok) {
        const fallbackError = await fallbackResponse.text()
        throw new Error(`Agnes API 调用失败 (${fallbackResponse.status}): ${fallbackError}`)
      }
      
      const data = await fallbackResponse.json()
      return data.choices[0].message.content
    }
    
    throw new Error(`Agnes API 调用失败 (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  console.log('✅ Agnes API 调用成功')
  return data.choices[0].message.content
}

// ============================================================
// 降级方案：当 API 不可用时使用模板
// ============================================================

function generateFallbackResponse(context: DeveloperContext): string {
  const primaryLang = context.technology.primaryLanguages[0] || '多种语言'
  const score = context.engineering.productivityScore
  const consistency = context.engineering.consistencyScore
  const trend = context.engineering.activityTrend

  return `## 📊 开发者分析报告

### 👤 开发者概览
**${context.profile.name}** 是一名 ${primaryLang} 开发者，拥有 ${context.profile.repos} 个仓库，${context.profile.followers} 位粉丝。

### 📈 工程指标
- **生产力得分**: ${score}/100 ${score >= 70 ? '🔥 表现优秀' : score >= 50 ? '📈 稳步提升' : '🌱 有待加强'}
- **一致性得分**: ${consistency}/100 ${consistency >= 70 ? '⭐ 一致性很好' : consistency >= 50 ? '🔄 保持稳定' : '📅 需要更规律'}
- **活动趋势**: ${trend === 'increasing' ? '📈 上升趋势' : trend === 'stable' ? '➡️ 保持稳定' : '📉 需要关注'}

### 🛠️ 技术栈
**主要语言**: ${context.technology.primaryLanguages.join(', ')}
**框架**: ${context.technology.frameworks.join(', ') || '正在积累'}
**经验信号**: ${context.technology.experienceSignals.join(', ') || '持续学习中'}

### 💡 改进建议
${context.improvementAreas.length > 0 
  ? context.improvementAreas.map((area, i) => `${i + 1}. ${area}`).join('\n')
  : '1. 继续保持良好的开发习惯\n2. 尝试学习新的技术栈\n3. 参与开源项目积累经验'}

### 🎯 下一步建议
基于你的技术栈，建议继续深化 ${context.technology.primaryLanguages.join(', ')} 相关的项目经验，同时关注 ${context.technology.primaryLanguages.length > 1 ? '全栈' : '相关'}技术生态的发展。

---
⚠️ *此响应由模板生成，配置 API Key 后可获得真正的 AI 分析*`
}

// ============================================================
// 智能调用：优先使用 API，失败时降级到模板
// ============================================================

async function callAI(prompt: string, systemPrompt?: string, context?: DeveloperContext): Promise<string> {
  try {
    // 先尝试调用 Agnes API
    return await callAgnes(prompt, systemPrompt)
  } catch (error: any) {
    console.warn('⚠️ Agnes API 调用失败，使用降级方案:', error.message)
    
    // 如果有 context，使用模板响应
    if (context) {
      return generateFallbackResponse(context)
    }
    
    // 如果没有 context，返回简单的错误提示
    return `## ⚠️ AI 服务暂时不可用

### 可能的原因：
1. Agnes API Key 未配置或已过期
2. 网络连接问题
3. API 服务暂时不稳定

### 解决方法：
1. 检查 \`.env.local\` 中的 \`AGNES_API_KEY\`
2. 访问 https://agnes-ai.cn/ 确认 API Key 有效
3. 稍后重试

### 如何获取 API Key：
1. 访问 https://agnes-ai.cn/ 注册账号
2. 进入平台 -> API Keys
3. 创建新 Key
4. 复制到 \`.env.local\`

### 当前使用模板响应，配置后即可获得真正的 AI 分析 🚀`
  }
}

// ============================================================
// 业务方法
// ============================================================

export class AIService {
  // 生成 AI 洞察
  static async generateInsight(context: DeveloperContext): Promise<string> {
    const systemPrompt = `你是一位资深软件工程导师，专门分析开发者的 GitHub 活动并提供专业建议。
你的分析要基于数据，具体、可操作，不要泛泛而谈。
输出格式使用 Markdown，包括标题、列表、加粗等。
保持专业、鼓励、有建设性的语气。`

    const prompt = `
请分析以下开发者的 GitHub 数据并生成一份专业报告。

## 开发者信息
- 用户名: ${context.profile.username}
- 姓名: ${context.profile.name}
- 简介: ${context.profile.bio || '软件开发者'}
- 粉丝数: ${context.profile.followers}
- 仓库数: ${context.profile.repos}

## 技术栈
- 主要语言: ${context.technology.primaryLanguages.join(', ') || '未检测到'}
- 框架: ${context.technology.frameworks.join(', ') || '未指定'}
- 经验信号: ${context.technology.experienceSignals.join(', ') || '发展中'}

## 工程指标
- 生产力得分: ${context.engineering.productivityScore}/100
- 一致性得分: ${context.engineering.consistencyScore}/100
- 活动趋势: ${context.engineering.activityTrend}
- 主要仓库: ${context.engineering.topRepositories.join(', ') || '无'}

## 改进建议
${context.improvementAreas.length > 0 
  ? context.improvementAreas.map((area, i) => `${i + 1}. ${area}`).join('\n')
  : '目前没有检测到明显需要改进的领域'}

请生成包含以下部分的分析报告：
1. **工程师画像总结** - 一句话概括这个开发者
2. **技术能力分析** - 技术栈优势和短板
3. **工作习惯评估** - 开发节奏和规律性
4. **具体改进建议** - 3-5条可操作的建议
5. **职业发展建议** - 下一步学习方向

报告要专业、具体、基于真实数据。`
    
    return callAI(prompt, systemPrompt, context)
  }

  // 生成简历摘要
  static async generateResumeSummary(context: DeveloperContext): Promise<string> {
    const systemPrompt = `你是一位专业的简历顾问，擅长将技术经历转化为有说服力的简历描述。
输出要简洁、专业、有冲击力，适合在技术面试中使用。
使用 Markdown 格式，包含标题和列表。`

    const prompt = `
根据以下开发者信息生成一份专业的简历摘要：

- 姓名: ${context.profile.name}
- 简介: ${context.profile.bio || '软件开发者'}
- 技术栈: ${context.technology.primaryLanguages.join(', ') || '多语言开发'}
- 框架: ${context.technology.frameworks.join(', ') || '现代技术栈'}
- 仓库数: ${context.profile.repos}
- 主要项目: ${context.engineering.topRepositories.join(', ') || '多个活跃项目'}
- 经验信号: ${context.technology.experienceSignals.join(', ') || '持续学习'}

请生成：
1. **专业摘要**：3-5句话，突出技术能力和工程经验
2. **技术标签**：5-8个关键词标签（如 "React", "TypeScript", "Full Stack"）
3. **项目亮点**：2-3个可量化的成果描述`
    
    return callAI(prompt, systemPrompt, context)
  }

  // 生成 README
  static async generateRepositoryReadme(
    repoName: string, 
    description: string, 
    languages: string[]
  ): Promise<string> {
    const systemPrompt = `你是一位资深技术文档专家，擅长为开源项目撰写专业的 README 文档。
README 要结构清晰、内容完整、有吸引力。
使用 Markdown 格式，包含 emoji 和代码块。`

    const prompt = `
为以下 GitHub 仓库生成一份专业的 README 文档：

- 仓库名: ${repoName}
- 描述: ${description || '一个现代化的软件项目'}
- 技术栈: ${languages.join(', ') || '现代技术栈'}

请包含以下章节：
1. 项目标题和简介（吸引人）
2. 核心功能列表（3-5项，带 emoji）
3. 技术架构说明
4. 快速开始指南（安装、配置、运行）
5. 贡献指南
6. 许可证说明（MIT）`
    
    return callAI(prompt, systemPrompt)
  }

  // 生成发布说明
  static async generateReleaseNotes(commits: any[]): Promise<string> {
    const systemPrompt = `你是一位技术项目经理，擅长为软件版本生成专业的发布说明。
发布说明要清晰、专业、易于理解。
使用 Markdown 格式。`

    const commitMessages = commits.length > 0 
      ? commits.map((c: any) => `- ${c.message}`).join('\n')
      : '- 初始项目发布\n- GitHub 集成\n- AI 驱动分析\n- 数据可视化'

    const prompt = `
根据以下提交记录生成一份专业的发布说明：

提交记录：
${commitMessages}

请生成包含以下部分的发布说明：
1. 版本号和发布日期（使用当前日期）
2. 新功能列表
3. 改进项
4. Bug 修复
5. 贡献者致谢

版本号建议 v1.0.0，日期使用今天。`
    
    return callAI(prompt, systemPrompt)
  }
}

// 导出默认对象，兼容现有导入方式
export default AIService
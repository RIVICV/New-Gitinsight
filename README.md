<div align="center">

# GitInsight AI


**An AI-Powered Developer Intelligence Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRIVICV%2FNew-Gitinsight)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**GitInsight AI** is a production-grade developer intelligence platform that transforms GitHub activity data into actionable engineering insights. Unlike traditional dashboards that merely display repository statistics, GitInsight AI combines:

- **Real-time GitHub Analytics** - Comprehensive visibility into your development activity
- **Engineering Intelligence** - Advanced metrics that measure productivity and consistency
- **AI-Powered Insights** - Personalized recommendations for technical growth
- **Professional Portfolio Tools** - Generate resumes, READMEs, and release notes

The platform is designed to help developers understand their coding patterns, identify improvement opportunities, and showcase their technical capabilities to employers and collaborators.

### Why GitInsight AI?

| Problem | Solution |
|---------|----------|
| GitHub data is scattered and hard to interpret | Centralized dashboard with meaningful metrics |
| Developers lack personalized feedback | AI-generated recommendations based on your activity |
| Creating professional portfolios is time-consuming | One-click generation of resumes and project descriptions |
| Engineering growth is hard to track | Real-time productivity and consistency scores |

---

## ✨ Features

### 🔐 Authentication
- **GitHub OAuth 2.0** - Secure, seamless login with your GitHub account
- **Session Management** - Persistent authentication with NextAuth.js

### 📊 Analytics Dashboard
- **Real-time Statistics** - Track repositories, stars, followers, and PRs
- **Activity Charts** - Visualize commit patterns and contribution trends
- **Language Distribution** - Understand your technology stack composition
- **Repository Growth** - Monitor your project portfolio expansion

### 🤖 AI-Powered Insights
- **Profile Analysis** - Get comprehensive engineering intelligence
- **Resume Generator** - Create professional developer summaries
- **README Generator** - Automatically generate project documentation
- **Release Notes** - Generate release notes from commit history
- **Markdown Rendering** - Beautiful, formatted AI responses

### 🎨 Developer Experience
- **Dark/Light Mode** - Seamless theme switching
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Skeleton Loading** - Smooth loading states for better UX
- **TypeScript** - Full type safety across the entire codebase

### 📈 Engineering Metrics
- **Productivity Score** - Measure your coding efficiency
- **Consistency Score** - Track your development regularity
- **Repository Health** - Get maintenance recommendations
- **Activity Trends** - Understand your growth trajectory

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) | Full-stack React framework |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Modern UI components |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) | GitHub OAuth integration |
| **API Client** | [Octokit](https://octokit.github.io/rest.js/) | GitHub REST API client |
| **Data Fetching** | [TanStack Query](https://tanstack.com/query) | Server state management |
| **Charts** | [Recharts](https://recharts.org/) | Data visualization |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight state management |
| **Markdown** | [react-markdown](https://github.com/remarkjs/react-markdown) | AI response rendering |
| **Deployment** | [Vercel](https://vercel.com/) | Production hosting |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- A GitHub account

### Installation

```bash
# Clone the repository
git clone https://github.com/RIVICV/New-Gitinsight.git
cd New-Gitinsight

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your GitHub OAuth credentials
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm run start
```

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Application                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Server    │  │   Client    │  │   API Routes        │ │
│  │ Components  │  │ Components  │  │   /api/auth         │ │
│  │ (Data Fetch)│  │ (Interact)  │  │   /api/github       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│   GitHub API    │ │   AI Service    │ │   Data Processing   │
│   (Octokit)     │ │   (Template)    │ │   (Analytics)       │
└─────────────────┘ └─────────────────┘ └─────────────────────┘
```

### Data Flow

1. **Authentication** - User signs in via GitHub OAuth
2. **Data Collection** - GitHub API fetches user, repo, and event data
3. **Processing** - Analytics engine calculates engineering metrics
4. **Visualization** - Recharts renders interactive dashboards
5. **AI Generation** - Context builder creates prompts from real data

### Project Structure

```
gitinsight/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth configuration
│   │   └── github/             # GitHub API endpoints
│   ├── dashboard/              # Dashboard pages
│   │   ├── ai/                 # AI Insights
│   │   ├── analytics/          # Analytics
│   │   ├── issues/             # Issues
│   │   ├── overview/           # Overview
│   │   ├── pull-requests/      # Pull Requests
│   │   ├── repositories/       # Repositories
│   │   └── settings/           # Settings
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/                 # Reusable components
│   ├── dashboard/              # Dashboard components
│   ├── landing/                # Landing page components
│   └── ui/                     # shadcn/ui components
├── lib/                        # Utility functions
├── services/                   # Service layer
│   ├── ai.service.ts           # AI services
│   ├── analytics.service.ts    # Analytics engine
│   └── ai-context-builder.ts   # AI context builder
├── types/                      # TypeScript definitions
├── .env.local                  # Environment variables
└── package.json                # Dependencies
```

---

## 📸 Screenshots

### Landing Page
> *Professional SaaS-style landing page with GitHub authentication*

### Dashboard Overview
> *Real-time GitHub analytics with statistics and charts*

### Analytics Page
> *Detailed engineering metrics and data visualization*

### AI Insights
> *AI-powered recommendations and document generation*

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Optional: AI API Keys (for enhanced AI capabilities)
# OPENAI_API_KEY=your_openai_key
# DEEPSEEK_API_KEY=your_deepseek_key
```

### Setting up GitHub OAuth

1. Go to **GitHub Settings → Developer settings → OAuth Apps**
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: `GitInsight Dev`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback`
4. Click **Register application**
5. Copy **Client ID** and generate **Client Secret**
6. Add them to your `.env.local` file

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
# Or use: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRIVICV%2FNew-Gitinsight)

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the repository
4. Add environment variables
5. Deploy

### Deploy to Other Platforms

<details>
<summary><b>AWS Amplify</b></summary>

```bash
# Install AWS Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```
</details>

<details>
<summary><b>Docker</b></summary>

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
</details>

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactoring
- `test:` Testing
- `chore:` Maintenance

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Tailwind CSS for styling
- Component-first architecture

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Recharts](https://recharts.org/) - Data visualization
- [Vercel](https://vercel.com/) - Deployment platform
- [GitHub](https://github.com/) - Data source and authentication

---

## 📧 Contact

**RIVICV** - [GitHub](https://github.com/RIVICV)

Project Link: [https://github.com/RIVICV/New-Gitinsight](https://github.com/RIVICV/New-Gitinsight)

---

<div align="center">

### ⭐ If you find this project useful, please consider giving it a star!

Made with ❤️ by RIVICV

</div>
---

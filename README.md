
# GitInsight - Developer Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **An intelligent GitHub analytics and developer productivity platform.**

GitInsight is a modern, AI-powered dashboard that helps developers visualize their GitHub activity, analyze productivity metrics, and gain actionable insights through intelligent automation.


---

## ✨ Features

### 🔐 Authentication
- **GitHub OAuth 2.0** - Secure, seamless login with your GitHub account
- **Session Management** - Persistent sessions with NextAuth.js

### 📊 Analytics Dashboard
- **Real-time Statistics** - Repositories, Stars, Followers, Pull Requests
- **Activity Charts** - Visualize commit patterns and contribution trends
- **Recent Activity Feed** - Stay updated with latest GitHub events

### 🏠 Repository Management
- **List & Search** - Browse and filter all your repositories
- **Language Detection** - See primary language usage across projects
- **Key Metrics** - Stars, Forks, Open Issues at a glance

### 🤖 AI-Powered Insights (Coming Soon)
- **Productivity Analysis** - AI-generated summaries of your coding habits
- **Smart Recommendations** - Personalized improvement suggestions
- **Automated Documentation** - Generate README and release notes

### 🎨 Developer Experience
- **Dark/Light Mode** - Seamless theme switching
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Skeleton Loading** - Smooth loading states for better UX

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

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) |
| **API Client** | [Octokit](https://octokit.github.io/rest.js/) |
| **Data Fetching** | [TanStack Query](https://tanstack.com/query) |
| **Charts** | [Recharts](https://recharts.org/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Testing** | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
gitinsight/
├── app/
│   ├── api/
│   │   └── auth/[...nextauth]/
│   │       └── route.ts          # NextAuth configuration
│   ├── dashboard/
│   │   ├── overview/             # Dashboard home
│   │   ├── repositories/         # Repository list
│   │   ├── pull-requests/        # PR management
│   │   ├── issues/               # Issue tracking
│   │   ├── analytics/            # Data visualization
│   │   ├── ai/                   # AI insights
│   │   ├── settings/             # User settings
│   │   └── layout.tsx            # Dashboard layout
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/                # Dashboard components
│   │   ├── sidebar.tsx
│   │   ├── stats-cards.tsx
│   │   ├── activity-chart.tsx
│   │   └── recent-activity.tsx
│   └── landing/
│       └── hero.tsx              # Landing page hero
├── lib/
│   ├── auth.ts                   # Authentication config
│   └── utils.ts                  # Utility functions
├── types/
│   └── github.ts                 # TypeScript definitions
├── .env.local                    # Environment variables
└── package.json
```

---

## 🔄 Roadmap

- [x] GitHub OAuth Authentication
- [x] Dashboard Overview with Statistics
- [x] Repository List with Search & Filter
- [x] Activity Charts
- [ ] Dark/Light Mode Toggle
- [ ] Repository Detail Page
- [ ] AI-Powered Insights
- [ ] PR & Issue Management
- [ ] Unit & E2E Testing
- [ ] CI/CD Pipeline

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

### ⭐ If you find this project useful, please consider giving it a star!



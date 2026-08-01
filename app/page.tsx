// app/page.tsx
// 应用程序的首页（Landing Page）- 所有用户访问的第一个页面
// Application home page (Landing Page) - The first page all users visit

// 导入认证函数，用于检查用户是否已登录
// Import authentication function to check if user is logged in
import { auth } from "@/lib/auth"

// 导入 Next.js 的重定向函数，用于页面跳转
// Import Next.js redirect function for page navigation
import { redirect } from "next/navigation"

// 导入首页 Hero 组件（包含标题、描述和登录按钮）
// Import the Hero component (contains title, description and login button)
import { Hero } from "@/components/landing/hero"

// ============================================================
// Home 组件 - 页面入口
// Home component - Page entry point
// ============================================================

// 这是一个异步的 Server Component（服务端组件）
// 在服务器端执行，渲染完成后将 HTML 发送给浏览器
// This is an asynchronous Server Component
// Executes on the server, sends rendered HTML to the browser
export default async function Home() {
  // ============================================================
  // 第一步：验证用户身份
  // Step 1: Verify user identity
  // ============================================================
  
  // 调用 auth() 函数获取当前用户的会话信息
  // 如果用户已登录，session 包含用户数据；否则为 null
  // Call auth() function to get current user's session information
  // If user is logged in, session contains user data; otherwise null
  const session = await auth()
  
  // ============================================================
  // 第二步：根据登录状态决定页面行为
  // Step 2: Determine page behavior based on login status
  // ============================================================
  
  // 如果用户已登录（session 存在）
  // If user is logged in (session exists)
  if (session) {
    // 重定向到 Dashboard 的 Overview 页面
    // 已登录用户不应该再看到首页，直接跳转到主应用
    // Redirect to Dashboard Overview page
    // Logged-in users shouldn't see the landing page, redirect to main app
    redirect("/dashboard/overview")
  }

  // ============================================================
  // 第三步：渲染首页内容
  // Step 3: Render the landing page content
  // ============================================================
  
  // 用户未登录时，显示首页（Landing Page）
  // 包含 Hero 组件：产品名称、描述、"Sign in with GitHub" 按钮
  // When user is not logged in, show the Landing Page
  // Includes Hero component: product name, description, "Sign in with GitHub" button
  return (
    <main className="min-h-screen">
      <Hero />
    </main>
  )
}
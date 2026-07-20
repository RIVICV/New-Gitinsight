// app/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Hero } from "@/components/landing/hero"

export default async function Home() {
  const session = await auth()
  
  if (session) {
    redirect("/dashboard/overview")
  }

  return (
    <main className="min-h-screen">
      <Hero />
    </main>
  )
}
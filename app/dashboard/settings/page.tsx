// app/dashboard/settings/page.tsx
"use client"

import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { Moon, Sun, Laptop, Bell, User, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 自定义 GitHub SVG 图标（不依赖 lucide-react）
const GithubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

export default function SettingsPage() {
  const { data: session } = useSession()
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)

  const themeOptions = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Laptop, label: "System" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Theme</p>
            <div className="flex gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon
                return (
                  <Button
                    key={option.value}
                    variant={theme === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme(option.value as any)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your GitHub activity
              </p>
            </div>
            <Button
              variant={notifications ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications(!notifications)}
            >
              {notifications ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Updates</p>
              <p className="text-sm text-muted-foreground">
                Receive weekly digest of your GitHub activity
              </p>
            </div>
            <Button
              variant={emailUpdates ? "default" : "outline"}
              size="sm"
              onClick={() => setEmailUpdates(!emailUpdates)}
            >
              {emailUpdates ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GithubIcon className="w-5 h-5" />
            GitHub Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Connected as {session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">
                You are currently signed in with GitHub
              </p>
            </div>
            <Badge className="bg-green-500">Connected</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
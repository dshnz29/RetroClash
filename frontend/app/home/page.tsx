"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Users, Target, LogOut } from "lucide-react"

export default function HomePage() {
  const [user, setUser] = useState<{ username: string; fullName?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleModeSelect = (mode: "single" | "dual") => {
    localStorage.setItem("gameMode", mode)
    router.push("/level-select")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PongMaster</h1>
                <p className="text-sm text-gray-400">Welcome back, {user.fullName || user.username}!</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Mode</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12">Select how you want to play Pong today</p>
          </div>

          {/* Mode Selection */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Single Player */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:bg-black/50 transition-all cursor-pointer group">
              <CardContent className="p-8" onClick={() => handleModeSelect("single")}>
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Single Player</h3>
                  <p className="text-gray-400">Play against the AI and improve your skills</p>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
                  onClick={() => handleModeSelect("single")}
                >
                  Play Solo
                </Button>
              </CardContent>
            </Card>

            {/* Dual Player */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:bg-black/50 transition-all cursor-pointer group">
              <CardContent className="p-8" onClick={() => handleModeSelect("dual")}>
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Dual Player</h3>
                  <p className="text-gray-400">Challenge a friend in head-to-head combat</p>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  onClick={() => handleModeSelect("dual")}
                >
                  Play Together
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-gray-400">All games are limited to 1 minute. The player with the highest score wins!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

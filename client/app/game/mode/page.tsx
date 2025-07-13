"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Users } from "lucide-react"

export default function ModeSelectionPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleModeSelect = (mode: "single" | "dual") => {
    localStorage.setItem("gameMode", mode)
    router.push("/game/level")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-cyan-400">Mode</span>
          </h1>
          <p className="text-xl text-gray-300">Select how you want to play Pong</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card
            className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 cursor-pointer group"
            onClick={() => handleModeSelect("single")}
          >
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 rounded-full bg-cyan-500/20 w-20 h-20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                <User size={40} className="text-cyan-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-white">Single Player</CardTitle>
              <CardDescription className="text-gray-300 text-lg">Play against the AI</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6">
                Test your skills against our intelligent AI opponent. Perfect for practice and improving your game.
              </p>
              <Button
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-lg py-6"
                onClick={() => handleModeSelect("single")}
              >
                Play Solo
              </Button>
            </CardContent>
          </Card>

          <Card
            className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 cursor-pointer group"
            onClick={() => handleModeSelect("dual")}
          >
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 rounded-full bg-purple-500/20 w-20 h-20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <Users size={40} className="text-purple-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-white">Dual Player</CardTitle>
              <CardDescription className="text-gray-300 text-lg">Challenge a friend</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6">
                Face off against another player in classic head-to-head Pong action. May the best player win!
              </p>
              <Button
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold text-lg py-6"
                onClick={() => handleModeSelect("dual")}
              >
                Play Together
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

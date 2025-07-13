"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Target, Flame } from "lucide-react"

export default function LevelSelectionPage() {
  const [gameMode, setGameMode] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const mode = localStorage.getItem("gameMode")

    if (!userData) {
      router.push("/auth/login")
      return
    }

    if (!mode) {
      router.push("/game/mode")
      return
    }

    setGameMode(mode)
  }, [router])

  const handleLevelSelect = (level: "easy" | "medium" | "hard") => {
    localStorage.setItem("gameLevel", level)
    router.push("/game/play")
  }

  const levels = [
    {
      id: "easy",
      name: "Easy",
      description: "Perfect for beginners",
      details: "Slower ball speed, larger paddles",
      icon: Zap,
      color: "green",
      bgColor: "bg-green-500/20",
      hoverColor: "hover:bg-green-500/30",
      buttonColor: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "medium",
      name: "Medium",
      description: "Balanced challenge",
      details: "Normal speed, standard paddles",
      icon: Target,
      color: "yellow",
      bgColor: "bg-yellow-500/20",
      hoverColor: "hover:bg-yellow-500/30",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      id: "hard",
      name: "Hard",
      description: "For experienced players",
      details: "Fast ball, smaller paddles",
      icon: Flame,
      color: "red",
      bgColor: "bg-red-500/20",
      hoverColor: "hover:bg-red-500/30",
      buttonColor: "bg-red-500 hover:bg-red-600",
    },
  ]

  if (!gameMode) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Select <span className="text-cyan-400">Difficulty</span>
          </h1>
          <p className="text-xl text-gray-300">
            Choose your challenge level for {gameMode === "single" ? "Single Player" : "Dual Player"} mode
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {levels.map((level) => {
            const IconComponent = level.icon
            return (
              <Card
                key={level.id}
                className={`backdrop-blur-md bg-white/10 border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 cursor-pointer group ${level.hoverColor}`}
                onClick={() => handleLevelSelect(level.id as "easy" | "medium" | "hard")}
              >
                <CardHeader className="text-center pb-6">
                  <div
                    className={`mx-auto mb-4 p-4 rounded-full ${level.bgColor} w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent size={40} className={`text-${level.color}-400`} />
                  </div>
                  <CardTitle className="text-3xl font-bold text-white">{level.name}</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">{level.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400 mb-6">{level.details}</p>
                  <Button
                    className={`w-full ${level.buttonColor} text-white font-semibold text-lg py-6`}
                    onClick={() => handleLevelSelect(level.id as "easy" | "medium" | "hard")}
                  >
                    Play {level.name}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => router.push("/game/mode")}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Back to Mode Selection
          </Button>
        </div>
      </div>
    </div>
  )
}

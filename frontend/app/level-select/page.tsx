"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, ArrowLeft, Zap, Shield, Flame } from "lucide-react"

export default function LevelSelectPage() {
  const [gameMode, setGameMode] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const mode = localStorage.getItem("gameMode")
    if (!mode) {
      router.push("/home")
      return
    }
    setGameMode(mode)
  }, [router])

  const handleLevelSelect = (level: "easy" | "medium" | "hard") => {
    localStorage.setItem("gameLevel", level)
    router.push("/game")
  }

  const handleBack = () => {
    router.push("/home")
  }

  const levels = [
    {
      id: "easy",
      name: "Easy",
      description: "Perfect for beginners. Slow ball speed and forgiving gameplay.",
      icon: <Shield className="w-8 h-8 text-green-400" />,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      bgColor: "bg-green-500/10 border-green-500/20",
      badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
      features: ["Slow ball speed", "Large paddle size", "Forgiving angles"],
    },
    {
      id: "medium",
      name: "Medium",
      description: "Balanced gameplay for intermediate players. Moderate challenge.",
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      color: "from-yellow-500 to-yellow-600",
      hoverColor: "hover:from-yellow-600 hover:to-yellow-700",
      bgColor: "bg-yellow-500/10 border-yellow-500/20",
      badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      features: ["Medium ball speed", "Standard paddle", "Balanced physics"],
    },
    {
      id: "hard",
      name: "Hard",
      description: "For experienced players. Fast-paced and challenging gameplay.",
      icon: <Flame className="w-8 h-8 text-red-400" />,
      color: "from-red-500 to-red-600",
      hoverColor: "hover:from-red-600 hover:to-red-700",
      bgColor: "bg-red-500/10 border-red-500/20",
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
      features: ["Fast ball speed", "Small paddle size", "Tricky angles"],
    },
  ]

  if (!gameMode) {
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
              <Button onClick={handleBack} variant="ghost" size="sm" className="text-white hover:bg-white/10 mr-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Level Selection</h1>
                <p className="text-sm text-gray-400">Mode: {gameMode === "single" ? "Single Player" : "Dual Player"}</p>
              </div>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Choose Difficulty</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Select Your
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Level</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">Choose the difficulty that matches your skill level</p>
          </div>

          {/* Level Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {levels.map((level) => (
              <Card
                key={level.id}
                className={`${level.bgColor} backdrop-blur-sm hover:bg-opacity-20 transition-all cursor-pointer group`}
              >
                <CardHeader className="text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      {level.icon}
                    </div>
                    <Badge className={level.badgeColor}>{level.name}</Badge>
                  </div>
                  <CardTitle className="text-white text-2xl">{level.name}</CardTitle>
                  <CardDescription className="text-gray-300">{level.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold">Features:</h4>
                    <ul className="space-y-1">
                      {level.features.map((feature, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-center">
                          <div className="w-1.5 h-1.5 bg-current rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    size="lg"
                    className={`w-full bg-gradient-to-r ${level.color} ${level.hoverColor}`}
                    onClick={() => handleLevelSelect(level.id as "easy" | "medium" | "hard")}
                  >
                    Play {level.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Game Info */}
          <div className="mt-16 text-center">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">Game Rules</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-2">Duration</h4>
                    <p className="text-gray-300 text-sm">Each game lasts exactly 1 minute</p>
                  </div>
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-2">Scoring</h4>
                    <p className="text-gray-300 text-sm">Highest score at the end wins</p>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2">Controls</h4>
                    <p className="text-gray-300 text-sm">Use physical table controls</p>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">Winner</h4>
                    <p className="text-gray-300 text-sm">Results shown after time expires</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

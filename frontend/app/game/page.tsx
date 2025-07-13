"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Timer, Trophy, Users, User } from "lucide-react"

export default function GamePage() {
  const [gameMode, setGameMode] = useState<string | null>(null)
  const [gameLevel, setGameLevel] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(60) // 1 minute = 60 seconds
  const [score, setScore] = useState({ player1: 0, player2: 0 })
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 })
  const [ballDirection, setBallDirection] = useState({ x: 1, y: 1 })
  const [gameStarted, setGameStarted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const mode = localStorage.getItem("gameMode")
    const level = localStorage.getItem("gameLevel")
    if (!mode || !level) {
      router.push("/home")
      return
    }
    setGameMode(mode)
    setGameLevel(level)
    setGameStarted(true)
  }, [router])

  // Game timer
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Game over - redirect to winner screen
          const winner = score.player1 > score.player2 ? "player1" : score.player2 > score.player1 ? "player2" : "tie"
          localStorage.setItem(
            "gameResult",
            JSON.stringify({
              winner,
              finalScore: score,
              mode: gameMode,
              level: gameLevel,
              duration: 60,
            }),
          )
          router.push("/winner")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, timeLeft, score, gameMode, gameLevel, router])

  // Ball animation and scoring simulation
  useEffect(() => {
    if (!gameStarted) return

    const ballSpeed = gameLevel === "easy" ? 30 : gameLevel === "medium" ? 20 : 15
    const interval = setInterval(() => {
      setBallPosition((prev) => {
        const newX = prev.x + ballDirection.x * 0.8
        let newY = prev.y + ballDirection.y * 0.8

        // Bounce off top and bottom
        if (newY <= 0 || newY >= 100) {
          setBallDirection((dir) => ({ ...dir, y: -dir.y }))
          newY = Math.max(0, Math.min(100, newY))
        }

        // Score when ball hits sides
        if (newX <= 0 || newX >= 100) {
          if (newX <= 0) {
            setScore((s) => ({ ...s, player2: s.player2 + 1 }))
          } else {
            setScore((s) => ({ ...s, player1: s.player1 + 1 }))
          }
          // Reset ball to center
          setBallDirection({ x: Math.random() > 0.5 ? 1 : -1, y: Math.random() > 0.5 ? 1 : -1 })
          return { x: 50, y: 50 }
        }

        return { x: newX, y: newY }
      })
    }, ballSpeed)

    return () => clearInterval(interval)
  }, [gameStarted, ballDirection, gameLevel])

  // WebSocket placeholder for real-time updates
  useEffect(() => {
    if (!gameStarted) return

    // Simulate WebSocket connection
    console.log("WebSocket connected - listening for real-time game updates")

    // Placeholder for real WebSocket implementation
    const simulateWebSocketUpdates = () => {
      // This would be replaced with actual WebSocket logic
      // Example: ws.onmessage = (event) => { updateGameState(JSON.parse(event.data)) }
    }

    simulateWebSocketUpdates()

    return () => {
      console.log("WebSocket disconnected")
    }
  }, [gameStarted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getProgressColor = () => {
    if (timeLeft > 40) return "bg-green-500"
    if (timeLeft > 20) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (!gameMode || !gameLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading game...</div>
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
                <h1 className="text-xl font-bold text-white">Live Game</h1>
                <p className="text-sm text-gray-400">
                  {gameMode === "single" ? "Single Player" : "Dual Player"} • {gameLevel} Level
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">WebSocket Connected</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Game Stats Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Timer */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Timer className="w-5 h-5 mr-2 text-blue-400" />
                  Time Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-mono font-bold text-white mb-4">{formatTime(timeLeft)}</div>
                <Progress value={(timeLeft / 60) * 100} className="h-3" />
                <div className="text-sm text-gray-400 mt-2">Game ends automatically at 0:00</div>
              </CardContent>
            </Card>

            {/* Score */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Live Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">{score.player1}</div>
                    <div className="text-sm text-gray-400 flex items-center justify-center">
                      {gameMode === "single" ? <User className="w-4 h-4 mr-1" /> : <Users className="w-4 h-4 mr-1" />}
                      Player 1
                    </div>
                  </div>
                  <div className="text-white/50 text-2xl">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{score.player2}</div>
                    <div className="text-sm text-gray-400">{gameMode === "single" ? "AI" : "Player 2"}</div>
                  </div>
                </div>
                <Progress
                  value={
                    score.player1 + score.player2 > 0 ? (score.player1 / (score.player1 + score.player2)) * 100 : 50
                  }
                  className="h-2"
                />
              </CardContent>
            </Card>

            {/* Game Info */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Game Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mode:</span>
                  <span className="text-white">{gameMode === "single" ? "Single Player" : "Dual Player"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Level:</span>
                  <span className="text-white capitalize">{gameLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">1 minute</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Playing</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Arena */}
          <div className="lg:col-span-3">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Game Arena</CardTitle>
                <div className="text-sm text-gray-400">Physical Pong Table - Real-time View</div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg border-2 border-cyan-500/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5" />

                  {/* Game Field */}
                  <div className="relative w-full h-full">
                    {/* Left Paddle */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-3 h-20 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />

                    {/* Right Paddle */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-3 h-20 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50" />

                    {/* Ball */}
                    <div
                      className="absolute w-4 h-4 bg-white rounded-full shadow-lg shadow-white/50 transition-all duration-75"
                      style={{
                        left: `${ballPosition.x}%`,
                        top: `${ballPosition.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />

                    {/* Center Line */}
                    <div
                      className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/20 transform -translate-x-1/2"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, white 0px, white 15px, transparent 15px, transparent 30px)",
                      }}
                    />

                    {/* Score Display */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-12 text-white text-6xl font-mono">
                      <span className="text-cyan-400">{score.player1}</span>
                      <span className="text-white/30">:</span>
                      <span className="text-purple-400">{score.player2}</span>
                    </div>

                    {/* Time Display */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className={`px-4 py-2 rounded-lg ${getProgressColor()} bg-opacity-20 border border-current`}>
                        <div className="text-white font-mono text-xl">{formatTime(timeLeft)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Status */}
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                    <div className="text-green-400 font-semibold">WebSocket Status</div>
                    <div className="text-white text-sm">Connected & Receiving Data</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                    <div className="text-blue-400 font-semibold">Game State</div>
                    <div className="text-white text-sm">Live & Synchronized</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
                    <div className="text-purple-400 font-semibold">Auto-End</div>
                    <div className="text-white text-sm">At 0:00 Remaining</div>
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

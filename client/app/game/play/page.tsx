"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useScore } from "@/hooks/use-score"
import { Play, Pause, RotateCcw } from "lucide-react"

export default function GamePlayPage() {
  const [gameSettings, setGameSettings] = useState<{
    mode: string
    level: string
    user: any
  } | null>(null)

  const router = useRouter()
  const { player1Score, player2Score, timeRemaining, isGameActive, startGame, stopGame, resetGame } = useScore()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const mode = localStorage.getItem("gameMode")
    const level = localStorage.getItem("gameLevel")

    if (!userData || !mode || !level) {
      router.push("/auth/login")
      return
    }

    setGameSettings({
      user: JSON.parse(userData),
      mode,
      level,
    })
  }, [router])

  useEffect(() => {
    if (timeRemaining === 0 && !isGameActive) {
      // Game ended, save results and redirect to winner page
      const gameResult = {
        player1Score,
        player2Score,
        mode: gameSettings?.mode,
        level: gameSettings?.level,
        winner: player1Score > player2Score ? "Player 1" : player2Score > player1Score ? "Player 2" : "Tie",
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem("lastGameResult", JSON.stringify(gameResult))

      // Save to game history
      const history = JSON.parse(localStorage.getItem("gameHistory") || "[]")
      history.push(gameResult)
      localStorage.setItem("gameHistory", JSON.stringify(history))

      router.push("/game/winner")
    }
  }, [timeRemaining, isGameActive, player1Score, player2Score, gameSettings, router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!gameSettings) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Game Info Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-cyan-400">PONG</span> Arena
          </h1>
          <p className="text-gray-300">
            {gameSettings.mode === "single" ? "Single Player" : "Dual Player"} •{" "}
            {gameSettings.level.charAt(0).toUpperCase() + gameSettings.level.slice(1)} Mode
          </p>
        </div>

        {/* Scoreboard */}
        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl max-w-4xl mx-auto mb-8">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-white">Live Scoreboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-8 items-center">
              {/* Player 1 */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {gameSettings.mode === "single" ? gameSettings.user.username : "Player 1"}
                </h3>
                <div className="text-6xl font-bold text-cyan-400">{player1Score}</div>
              </div>

              {/* Timer */}
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{formatTime(timeRemaining)}</div>
                <div className={`text-sm ${timeRemaining <= 10 ? "text-red-400" : "text-gray-400"}`}>
                  Time Remaining
                </div>
              </div>

              {/* Player 2 */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {gameSettings.mode === "single" ? "AI" : "Player 2"}
                </h3>
                <div className="text-6xl font-bold text-purple-400">{player2Score}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          {!isGameActive ? (
            <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3">
              <Play size={20} className="mr-2" />
              Start Game
            </Button>
          ) : (
            <Button onClick={stopGame} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3">
              <Pause size={20} className="mr-2" />
              Pause Game
            </Button>
          )}

          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3"
          >
            <RotateCcw size={20} className="mr-2" />
            Reset
          </Button>
        </div>

        {/* Game Visualization */}
        <Card className="backdrop-blur-md bg-black/30 border-white/20 shadow-2xl max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="relative bg-black/50 rounded-lg h-96 border-2 border-cyan-400/50">
              {/* Pong Game Visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏓</div>
                  <p className="text-white text-lg">{isGameActive ? "Game in Progress..." : "Game Paused"}</p>
                  <p className="text-gray-400 text-sm mt-2">Physical Pong game connected via WebSocket</p>
                </div>
              </div>

              {/* Center Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 transform -translate-x-0.5" />

              {/* Score Indicators */}
              <div className="absolute top-4 left-8 text-cyan-400 text-2xl font-bold">{player1Score}</div>
              <div className="absolute top-4 right-8 text-purple-400 text-2xl font-bold">{player2Score}</div>
            </div>
          </CardContent>
        </Card>

        {/* Game Status */}
        <div className="text-center mt-8">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full ${
              isGameActive
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${isGameActive ? "bg-green-400" : "bg-gray-400"}`} />
            {isGameActive ? "Game Active" : "Game Paused"}
          </div>
        </div>
      </div>
    </div>
  )
}

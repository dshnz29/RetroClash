"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Users, User, Clock, Target, ArrowRight } from "lucide-react"

interface GameResult {
  winner: "player1" | "player2" | "tie"
  finalScore: { player1: number; player2: number }
  mode: string
  level: string
  duration: number
}

export default function WinnerPage() {
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [user, setUser] = useState<{ username: string; fullName?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const result = localStorage.getItem("gameResult")
    const userData = localStorage.getItem("user")

    if (!result || !userData) {
      router.push("/home")
      return
    }

    setGameResult(JSON.parse(result))
    setUser(JSON.parse(userData))

    // Save game to history (in real app, this would be an API call)
    const gameHistory = JSON.parse(localStorage.getItem("gameHistory") || "[]")
    const newGame = {
      id: Date.now(),
      date: new Date().toISOString(),
      player1: JSON.parse(userData).username,
      player2: JSON.parse(result).mode === "single" ? "AI" : "Player 2",
      mode: JSON.parse(result).mode,
      level: JSON.parse(result).level,
      score: JSON.parse(result).finalScore,
      winner: JSON.parse(result).winner,
      duration: JSON.parse(result).duration,
    }
    gameHistory.unshift(newGame)
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory.slice(0, 50))) // Keep last 50 games
  }, [router])

  const handlePlayAgain = () => {
    router.push("/home")
  }

  const handleViewLeaderboard = () => {
    router.push("/leaderboard")
  }

  if (!gameResult || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading results...</div>
      </div>
    )
  }

  const getWinnerInfo = () => {
    if (gameResult.winner === "tie") {
      return {
        title: "It's a Tie!",
        subtitle: "Great game from both players",
        icon: <Medal className="w-16 h-16 text-yellow-400" />,
        color: "from-yellow-500 to-orange-500",
      }
    } else if (gameResult.winner === "player1") {
      return {
        title: `${user.fullName || user.username} Wins!`,
        subtitle: "Congratulations on your victory",
        icon: <Trophy className="w-16 h-16 text-yellow-400" />,
        color: "from-cyan-500 to-blue-500",
      }
    } else {
      return {
        title: gameResult.mode === "single" ? "AI Wins!" : "Player 2 Wins!",
        subtitle: "Better luck next time",
        icon: <Trophy className="w-16 h-16 text-purple-400" />,
        color: "from-purple-500 to-pink-500",
      }
    }
  }

  const winnerInfo = getWinnerInfo()

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
                <h1 className="text-xl font-bold text-white">Game Results</h1>
                <p className="text-sm text-gray-400">Match completed</p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Game Complete</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Winner Announcement */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <div
                className={`w-32 h-32 bg-gradient-to-r ${winnerInfo.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}
              >
                {winnerInfo.icon}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{winnerInfo.title}</h1>
              <p className="text-xl text-gray-300">{winnerInfo.subtitle}</p>
            </div>
          </div>

          {/* Game Summary */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Final Score */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Final Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">{gameResult.finalScore.player1}</div>
                    <div className="text-sm text-gray-400 flex items-center justify-center">
                      {gameResult.mode === "single" ? (
                        <User className="w-4 h-4 mr-1" />
                      ) : (
                        <Users className="w-4 h-4 mr-1" />
                      )}
                      {user.fullName || user.username}
                    </div>
                    {gameResult.winner === "player1" && (
                      <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Winner</Badge>
                    )}
                  </div>
                  <div className="text-white/50 text-3xl">:</div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">{gameResult.finalScore.player2}</div>
                    <div className="text-sm text-gray-400">{gameResult.mode === "single" ? "AI" : "Player 2"}</div>
                    {gameResult.winner === "player2" && (
                      <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/30">Winner</Badge>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    Total Points: {gameResult.finalScore.player1 + gameResult.finalScore.player2}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Details */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-400" />
                  Game Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mode:</span>
                  <span className="text-white capitalize">{gameResult.mode} Player</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Difficulty:</span>
                  <span className="text-white capitalize">{gameResult.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{gameResult.duration} seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white">{new Date().toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={handlePlayAgain}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <Target className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            <Button
              onClick={handleViewLeaderboard}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Trophy className="w-5 h-5 mr-2" />
              View Leaderboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Performance Stats */}
          <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-center">Performance Analysis</CardTitle>
              <CardDescription className="text-gray-300 text-center">
                Your game statistics for this match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{gameResult.finalScore.player1}</div>
                  <div className="text-gray-300 text-sm">Your Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {Math.round(
                      (gameResult.finalScore.player1 /
                        (gameResult.finalScore.player1 + gameResult.finalScore.player2)) *
                        100,
                    ) || 0}
                    %
                  </div>
                  <div className="text-gray-300 text-sm">Score Share</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {(
                      ((gameResult.finalScore.player1 + gameResult.finalScore.player2) / gameResult.duration) *
                      60
                    ).toFixed(1)}
                  </div>
                  <div className="text-gray-300 text-sm">Points/Min</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {gameResult.winner === "player1" ? "W" : gameResult.winner === "tie" ? "T" : "L"}
                  </div>
                  <div className="text-gray-300 text-sm">Result</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

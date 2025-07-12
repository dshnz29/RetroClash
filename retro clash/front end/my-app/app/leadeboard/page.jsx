"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Medal, Award, Target, ArrowLeft, Calendar, Users, User } from "lucide-react"

interface GameHistory {
  id: number
  date: string
  player1: string
  player2: string
  mode: string
  level: string
  score: { player1: number; player2: number }
  winner: "player1" | "player2" | "tie"
  duration: number
}

export default function LeaderboardPage() {
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
  const [user, setUser] = useState<{ username: string; fullName?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userData))

    // Load game history
    const history = JSON.parse(localStorage.getItem("gameHistory") || "[]")
    setGameHistory(history)
  }, [router])

  const handleBack = () => {
    router.push("/home")
  }

  const handlePlayAgain = () => {
    router.push("/home")
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-400" />
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-white font-bold text-sm">#{index + 1}</span>
        )
    }
  }

  const getWinnerBadge = (game: GameHistory) => {
    if (game.winner === "tie") {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Tie</Badge>
    } else if (game.winner === "player1") {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{game.player1}</Badge>
    } else {
      return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{game.player2}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const userStats = gameHistory.reduce(
    (stats, game) => {
      const isPlayer1 = game.player1 === user?.username
      const won = (isPlayer1 && game.winner === "player1") || (!isPlayer1 && game.winner === "player2")
      const tied = game.winner === "tie"

      return {
        totalGames: stats.totalGames + 1,
        wins: stats.wins + (won ? 1 : 0),
        ties: stats.ties + (tied ? 1 : 0),
        totalScore: stats.totalScore + (isPlayer1 ? game.score.player1 : game.score.player2),
      }
    },
    { totalGames: 0, wins: 0, ties: 0, totalScore: 0 },
  )

  const winRate = userStats.totalGames > 0 ? ((userStats.wins / userStats.totalGames) * 100).toFixed(1) : "0.0"
  const avgScore = userStats.totalGames > 0 ? (userStats.totalScore / userStats.totalGames).toFixed(1) : "0.0"

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
                <h1 className="text-xl font-bold text-white">Leaderboard</h1>
                <p className="text-sm text-gray-400">Game history and statistics</p>
              </div>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <Trophy className="w-4 h-4 mr-1" />
              Hall of Fame
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* User Stats */}
          {user && (
            <div className="mb-8">
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Your Statistics</CardTitle>
                  <CardDescription className="text-gray-300">
                    Performance overview for {user.fullName || user.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-cyan-400 mb-2">{userStats.totalGames}</div>
                      <div className="text-gray-300 text-sm">Total Games</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-400 mb-2">{userStats.wins}</div>
                      <div className="text-gray-300 text-sm">Wins</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-400 mb-2">{winRate}%</div>
                      <div className="text-gray-300 text-sm">Win Rate</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-400 mb-2">{avgScore}</div>
                      <div className="text-gray-300 text-sm">Avg Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Game History Table */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                Game History
              </CardTitle>
              <CardDescription className="text-gray-300">
                {gameHistory.length > 0 ? `Showing ${gameHistory.length} recent games` : "No games played yet"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gameHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-gray-300">#</TableHead>
                        <TableHead className="text-gray-300">Date & Time</TableHead>
                        <TableHead className="text-gray-300">Players</TableHead>
                        <TableHead className="text-gray-300">Mode</TableHead>
                        <TableHead className="text-gray-300">Level</TableHead>
                        <TableHead className="text-gray-300">Score</TableHead>
                        <TableHead className="text-gray-300">Winner</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gameHistory.map((game, index) => (
                        <TableRow key={game.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="text-white">
                            <div className="flex items-center">{getRankIcon(index)}</div>
                          </TableCell>
                          <TableCell className="text-gray-300 text-sm">{formatDate(game.date)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {game.mode === "single" ? (
                                <User className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <Users className="w-4 h-4 text-purple-400" />
                              )}
                              <span className="text-white text-sm">
                                {game.player1} vs {game.player2}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                              {game.mode === "single" ? "Single" : "Dual"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-xs ${
                                game.level === "easy"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : game.level === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                              }`}
                            >
                              {game.level}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white font-mono">
                            {game.score.player1} - {game.score.player2}
                          </TableCell>
                          <TableCell>{getWinnerBadge(game)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Games Yet</h3>
                  <p className="text-gray-400 mb-6">Start playing to see your game history here</p>
                  <Button
                    onClick={handlePlayAgain}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Play Your First Game
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Button */}
          {gameHistory.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                onClick={handlePlayAgain}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                <Target className="w-5 h-5 mr-2" />
                Play Another Game
              </Button>
            </div>
          )}
        </div>
      </div>
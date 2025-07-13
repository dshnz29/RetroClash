"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Target, RotateCcw } from "lucide-react"

export default function WinnerPage() {
  const [gameResult, setGameResult] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const result = localStorage.getItem("lastGameResult")
    if (!result) {
      router.push("/game/mode")
      return
    }
    setGameResult(JSON.parse(result))
  }, [router])

  if (!gameResult) return null

  const isDraw = gameResult.winner === "Tie"
  const player1Won = gameResult.winner === "Player 1"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          {isDraw ? (
            <>
              <div className="text-8xl mb-6">🤝</div>
              <h1 className="text-6xl font-bold text-white mb-4">
                It's a <span className="text-yellow-400">Draw!</span>
              </h1>
              <p className="text-xl text-gray-300">Both players played exceptionally well!</p>
            </>
          ) : (
            <>
              <div className="text-8xl mb-6">🏆</div>
              <h1 className="text-6xl font-bold text-white mb-4">
                <span className={player1Won ? "text-cyan-400" : "text-purple-400"}>{gameResult.winner}</span> Wins!
              </h1>
              <p className="text-xl text-gray-300">Congratulations on your victory!</p>
            </>
          )}
        </div>

        {/* Game Summary */}
        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl max-w-2xl mx-auto mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white flex items-center justify-center">
              <Trophy className="mr-3 text-yellow-400" size={32} />
              Game Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">{gameResult.player1Score}</div>
                <div className="text-white">{gameResult.mode === "single" ? "You" : "Player 1"}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">{gameResult.player2Score}</div>
                <div className="text-white">{gameResult.mode === "single" ? "AI" : "Player 2"}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-4">
                <Medal className="mx-auto mb-2 text-blue-400" size={24} />
                <div className="text-sm text-gray-400">Mode</div>
                <div className="text-white font-semibold">
                  {gameResult.mode === "single" ? "Single Player" : "Dual Player"}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <Target className="mx-auto mb-2 text-green-400" size={24} />
                <div className="text-sm text-gray-400">Difficulty</div>
                <div className="text-white font-semibold">
                  {gameResult.level.charAt(0).toUpperCase() + gameResult.level.slice(1)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button
            onClick={() => router.push("/leaderboard")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3"
          >
            <Trophy size={20} className="mr-2" />
            View Leaderboard
          </Button>

          <Button
            onClick={() => router.push("/game/mode")}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3"
          >
            <RotateCcw size={20} className="mr-2" />
            Play Again
          </Button>
        </div>
      </div>
    </div>
  )
}

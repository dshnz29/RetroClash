"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from "lucide-react"
import { useMatchData } from "@/lib/useMatchData"
import { useAllMatchIds } from "@/lib/getAllMatchInfo"
import { writeGameResult } from "@/lib/writeGameResult"


export default function GamePlayPage() {
  const [gameSettings, setGameSettings] = useState<{
    mode: string
    level: string
    user: any
  } | null>(null)


  const router = useRouter()
  const { matchIds, matchCount, loading, error } = useAllMatchIds();
  let matchData = useMatchData((1).toString()) // ⬅ Real-time match info from Firebase
  useEffect(() => {


    const userData = localStorage.getItem("user")
    const mode = localStorage.getItem("gameMode")
    const level = localStorage.getItem("gameLevel")
    console.log(matchData);

    // if (matchData) {
    //   if (matchData.isPlaying == false) router.push("/game/winner") // Redirect if game is not active
    // }
    if (matchData && matchData.isPlaying === false) {
      // Determine winner


      // Save winner data to localStorage
      localStorage.setItem(
        "lastGameResult",
        JSON.stringify({
          winner:
            matchData.player1.score > matchData.player2.score
              ? matchData.player1.name
              : matchData.player1.score < matchData.player2.score
                ? matchData.player2.name
                : "Tie",
          player1Score: matchData.player1.score,
          player2Score: matchData.player2.score,
          player1Name: matchData.player1.name,
          player2Name: matchData.player2.name,
          mode: localStorage.getItem("gameMode") || "dual",
          level: localStorage.getItem("gameLevel") || "easy",
          matchId: (1).toString()
        })
      );
      const writeWinner = async () => {


        await writeGameResult((matchCount).toString(), ({
          winner:
            matchData.player1.score > matchData.player2.score
              ? matchData.player1.name
              : matchData.player1.score < matchData.player2.score
                ? matchData.player2.name
                : "Tie",
          player1Score: matchData.player1.score,
          player2Score: matchData.player2.score,
          player1Name: matchData.player1.name,
          player2Name: matchData.player2.name,
          mode: localStorage.getItem("gameMode") || "dual",
          level: localStorage.getItem("gameLevel") || "easy",
          matchId: (matchCount).toString()
        }));
      };
      writeWinner();


      // Redirect
      router.push("/game/winner")
    }


    if (!userData || !mode || !level) {
      router.push("/auth/login")
      return
    }

    setGameSettings({
      user: JSON.parse(userData),
      mode,
      level,
    })
  }, [router, matchData])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!gameSettings || !matchData) return null
  return (
    <div className="min-h-screen relative overflow-hidden pt-14">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bgimg2.png"
          alt="Background Mesh"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Game Info Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-cyan-400">PONG</span> Arena
          </h1>
          <p className="text-gray-300">
            {gameSettings.mode === "single"
              ? "Single Player"
              : "Dual Player"}{" "}
            •{" "}
            {gameSettings.level.charAt(0).toUpperCase() +
              gameSettings.level.slice(1)}{" "}
            Mode
          </p>
          <p className="text-white">
            Match ID {1}
          </p>
        </div>

        {/* Scoreboard */}
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] max-w-4xl mx-auto mb-8">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-white">Live Scoreboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {matchData.player1?.name || "Player 1"}
                </h3>
                <div className="text-6xl font-bold text-cyan-400">
                  {matchData.player1?.score ?? 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {formatTime(matchData.timeRemaining || 0)}
                </div>
                <div
                  className={`text-sm ${matchData.timeRemaining <= 10 ? "text-red-400" : "text-gray-400"
                    }`}
                >
                  Time Remaining
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {matchData.player2?.name || "Player 2"}
                </h3>
                <div className="text-6xl font-bold text-purple-400">
                  {matchData.player2?.score ?? 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Status */}
        <div className="text-center mt-8">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full ${matchData.isPlaying
              ? "bg-green-500/20 text-green-400 border border-green-500/50"
              : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
              }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${matchData.isPlaying ? "bg-green-400" : "bg-gray-400"
                }`}
            />
            {matchData.isPlaying ? "Game Active" : "Game Paused"}
          </div>
        </div>
      </div>
    </div>
  )
}

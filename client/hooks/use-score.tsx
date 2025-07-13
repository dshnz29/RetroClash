"use client"

import { useState, useEffect, useRef } from "react"

interface ScoreData {
  player1Score: number
  player2Score: number
  timeRemaining: number
  isGameActive: boolean
}

export function useScore() {
  const [scoreData, setScoreData] = useState<ScoreData>({
    player1Score: 0,
    player2Score: 0,
    timeRemaining: 60, // 1 minute
    isGameActive: false,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const scoreIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = () => {
    setScoreData((prev) => ({ ...prev, isGameActive: true, timeRemaining: 60 }))

    // Timer countdown
    intervalRef.current = setInterval(() => {
      setScoreData((prev) => {
        if (prev.timeRemaining <= 1) {
          return { ...prev, timeRemaining: 0, isGameActive: false }
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)

    // Simulate random score updates
    scoreIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance each second
        setScoreData((prev) => {
          if (!prev.isGameActive) return prev

          const isPlayer1Score = Math.random() > 0.5
          return {
            ...prev,
            player1Score: isPlayer1Score ? prev.player1Score + 1 : prev.player1Score,
            player2Score: !isPlayer1Score ? prev.player2Score + 1 : prev.player2Score,
          }
        })
      }
    }, 1000)
  }

  const stopGame = () => {
    setScoreData((prev) => ({ ...prev, isGameActive: false }))
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current)
  }

  const resetGame = () => {
    setScoreData({
      player1Score: 0,
      player2Score: 0,
      timeRemaining: 60,
      isGameActive: false,
    })
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current)
    }
  }, [])

  return {
    ...scoreData,
    startGame,
    stopGame,
    resetGame,
  }
}

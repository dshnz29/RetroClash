// hooks/useMatchData.js
"use client";
import { useEffect, useState } from "react";
import { ref, onValue, getDatabase } from "firebase/database";
import { app } from "@/lib/firebase";

export function useMatchData(matchId: string) {
    const [matchData, setMatchData] = useState({
        matchId: matchId,
        player1: {
            name: "",
            score: 0
        },
        player2: {
            name: "",
            score: 0
        },
        timeRemaining: 0,
        isPlaying: true
    });
    const db = getDatabase(app);

    useEffect(() => {
        const matchRef = ref(db, `matches/${matchId}`);
        const unsubscribe = onValue(matchRef, (snapshot) => {
            setMatchData(snapshot.val());
        });
        return () => unsubscribe();
    }, [matchId]);

    return matchData;
}

import { getDatabase, ref, update } from "firebase/database";
import { app } from "./firebase"; // adjust path as needed

const db = getDatabase(app);

interface Player {
    name: string;
    score: number;
}

interface MatchData {
    matchId: string;
    player1: Player;
    player2: Player;
    gameMode: "easy" | "medium" | "hard";
    mirrorMode: boolean;
    isPlaying: boolean;
}

export async function writeRealTimedb(matchData: MatchData) {
    if (!matchData.matchId) throw new Error("matchId is required");

    const matchRef = ref(db, `matches/${matchData.matchId}`);
    console.log("Updating match data:", matchData);
    try {
        await update(matchRef, {
            player1: matchData.player1,
            player2: matchData.player2,
            gameMode: matchData.gameMode,
            mirrorMode: matchData.mirrorMode,
            isPlaying: matchData.isPlaying,

        });
        console.log("Realtime DB updated successfully");
    } catch (error) {
        console.error("Error updating Realtime DB:", error);
        throw error;
    }
}

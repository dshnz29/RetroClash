import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

/**
 * Writes the game result to Firestore
 * @param matchId string - the match ID (document ID inside "results")
 * @param data object - the game result payload
 */
export async function writeGameResult(matchId: string, data: object) {
    if (!matchId) throw new Error("matchId is required");

    try {
        const resultRef = doc(db, "results", matchId); // ✅ Now has 2 segments
        await setDoc(resultRef, {
            ...data,
            timestamp: Date.now(),
        });
        console.log("Game result saved for match:", matchId);
    } catch (error) {
        console.error("Error saving game result:", error);
        throw error;
    }
}

import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

export async function getAllMatchResults() {
    try {
        const resultsCol = collection(db, "results");
        const resultsSnapshot = await getDocs(resultsCol);
        const results = resultsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return results; // Array of all match result objects with their IDs
    } catch (error) {
        console.error("Error fetching match results:", error);
        throw error;
    }
}

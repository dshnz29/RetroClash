import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { app } from "./firebase";
import { da } from "date-fns/locale";

const db = getFirestore(app);
interface Player {
    id: string;
    email: string;
    username: string;
}

export const useOnlinePlayers = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function fetchPlayers() {
            try {
                let username = "";
                if (localStorage.getItem("user")) {
                    const { username: storedUsername } = JSON.parse(localStorage.getItem("user") || "{}");
                    username = storedUsername;
                }
                const querySnapshot = await getDocs(collection(db, "users"));

                const playersList: Player[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    console.log(data);
                    if (username == data.username) return;
                    playersList.push({
                        id: doc.id,
                        email: data.email,
                        username: data.username,
                    });
                });
                setPlayers(playersList);
            } catch (error) {
                console.error("Error fetching online players:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPlayers();
    }, []);

    return { players, loading };
};

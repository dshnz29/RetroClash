"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "./firebase"; // adjust path

const db = getDatabase(app);

export function useAllMatchIds() {
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchIds = async () => {
      try {
        const matchesRef = ref(db, "matches");
        const snapshot = await get(matchesRef);

        if (snapshot.exists()) {
          setMatchIds(Object.keys(snapshot.val()));
        } else {
          setMatchIds([]);
        }
      } catch (err) {
        console.error("Error fetching match IDs:", err);
        setError("Failed to load matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchIds();
  }, []);

  return {
    matchIds,
    matchCount: matchIds.length,
    loading,
    error,
  };
}

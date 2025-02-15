import { useState, useEffect } from "react";
import { Emoji } from "@/types/types";

export const useEmojis = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const response = await fetch("https://emojihub.yurace.pro/api/all");
        const data: Emoji[] = await response.json();
        const uniqueCategories = Array.from(
          new Set(data.map((emoji) => emoji.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching emojis:", error);
        setError("Failed to load emoji categories");
      } finally {
        setLoading(false);
      }
    };
    fetchEmojis();
  }, []);
  return { categories, loading, error };
};

import { useQuery } from "@tanstack/react-query";
import type { SearchResult } from "../types/search";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function fetchTrending() {
  const res = await fetch(`${API_BASE_URL}/movie/popular?page=1`);
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  return res.json();
}

export function useTrendingMovies(enabled: boolean) {
  return useQuery<{ results: SearchResult[] }>({
    queryKey: ["trending"],
    queryFn: fetchTrending,
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}

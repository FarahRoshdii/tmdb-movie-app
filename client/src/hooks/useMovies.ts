import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import type { TMDBResponse } from "../types/movie";

const moviesKey = (category: string) => ["movies", category] as const;

async function fetchMoviesInfinite(
  ctx: QueryFunctionContext<ReturnType<typeof moviesKey>, number>
): Promise<TMDBResponse> {
  const [, category] = ctx.queryKey;
  const pageParam = ctx.pageParam ?? 1;

  try {
    const res = await fetch(
      `${API_BASE_URL}/movie/${category}?page=${pageParam}`
    );
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch ${category} movies: ${errorText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}

// Custom hook for infinite movie fetching
export function useMoviesInfinite(category: string) {
  return useInfiniteQuery({
    queryKey: moviesKey(category),
    queryFn: fetchMoviesInfinite,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // Keep old data while fetching new
  });
}

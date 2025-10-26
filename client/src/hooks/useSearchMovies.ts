import {
  type QueryFunctionContext,
  useInfiniteQuery,
} from "@tanstack/react-query";

import type { SearchResponse } from "../types/search";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const searchKey = (query: string) => ["search", query] as const;

async function fetchSearchResults(
  ctx: QueryFunctionContext<ReturnType<typeof searchKey>, number>
): Promise<SearchResponse> {
  const [, query] = ctx.queryKey;
  const pageParam = ctx.pageParam ?? 1;

  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  const res = await fetch(
    `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageParam}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  return res.json();
}

export function useSearchMovies(query: string) {
  return useInfiniteQuery({
    queryKey: searchKey(query),
    queryFn: fetchSearchResults,
    enabled: !!query.trim(),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}

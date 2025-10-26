import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { WatchlistItem, WatchlistStatus } from "../types/watchlist";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useWatchlist(userId?: number) {
  return useQuery<WatchlistItem[]>({
    queryKey: ["watchlist", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`${API_BASE_URL}/watchlist/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch watchlist");
      return response.json();
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useIsInWatchlist(userId?: number, movieId?: number) {
  const { data: watchlist, isLoading } = useWatchlist(userId);
  const isInWatchlist = !!watchlist?.some((item) => item.movie_id === movieId);
  return { isInWatchlist, isLoading };
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      movieId,
    }: {
      userId: number;
      movieId: number;
    }) => {
      const response = await fetch(`${API_BASE_URL}/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, movieId, status: "to watch" }),
      });
      if (!response.ok) throw new Error("Failed to add to watchlist");
      return response.json();
    },
    onMutate: async ({ userId, movieId }) => {
      // Cancel any outgoing refetches to prevent overwriting our update
      await queryClient.cancelQueries({ queryKey: ["watchlist", userId] });

      // Save previous watchlist data in case we need to roll back on error
      const prevData =
        queryClient.getQueryData<WatchlistItem[]>(["watchlist", userId]) || [];

      // Update local cache by adding the movie optimistically

      queryClient.setQueryData<WatchlistItem[]>(
        ["watchlist", userId],
        [
          ...prevData,
          {
            id: Date.now(),
            user_id: userId,
            movie_id: movieId,
            status: "to watch",
          },
        ]
      );

      // Return previous data to restore it later if mutation fails
      return { prevData };
    },

    // rollback to previous data on error
    onError: (_, vars, context) => {
      queryClient.setQueryData(["watchlist", vars.userId], context?.prevData);
    },

    // Revalidate watchlist query to ensure fresh data
    onSettled: (_, __, vars) => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", vars.userId] });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      movieId,
    }: {
      userId: number;
      movieId: number;
    }) => {
      const response = await fetch(
        `${API_BASE_URL}/watchlist/${userId}/${movieId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to remove from watchlist");
      return response.json();
    },
    onMutate: async ({ userId, movieId }) => {
      await queryClient.cancelQueries({ queryKey: ["watchlist", userId] });
      const prevData =
        queryClient.getQueryData<WatchlistItem[]>(["watchlist", userId]) || [];
      queryClient.setQueryData<WatchlistItem[]>(
        ["watchlist", userId],
        prevData.filter((item) => item.movie_id !== movieId)
      );
      return { prevData };
    },

    onError: (_, vars, context) => {
      queryClient.setQueryData(["watchlist", vars.userId], context?.prevData);
    },

    onSettled: (_, __, vars) => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", vars.userId] });
    },
  });
}

// Update watchlist movie status (e.g., "watched" → "to watch")

export function useUpdateWatchlistStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      movieId,
      status,
    }: {
      userId: number;
      movieId: number;
      status: WatchlistStatus;
    }) => {
      const response = await fetch(
        `${API_BASE_URL}/watchlist/${userId}/${movieId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onMutate: async ({ userId, movieId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["watchlist", userId] });
      const prevData =
        queryClient.getQueryData<WatchlistItem[]>(["watchlist", userId]) || [];
      queryClient.setQueryData<WatchlistItem[]>(
        ["watchlist", userId],
        prevData.map((item) =>
          item.movie_id === movieId ? { ...item, status } : item
        )
      );
      return { prevData };
    },
    onError: (_, vars, context) => {
      queryClient.setQueryData(["watchlist", vars.userId], context?.prevData);
    },
    onSettled: (_, __, vars) => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", vars.userId] });
    },
  });
}

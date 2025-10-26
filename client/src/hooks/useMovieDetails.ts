import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useMovieDetails(id?: string) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/movie/${id}`);
      if (!res.ok) throw new Error("Failed to fetch movie details");
      return res.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

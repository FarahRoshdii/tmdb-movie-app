import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  useWatchlist,
  useRemoveFromWatchlist,
  useUpdateWatchlistStatus,
} from "../hooks/useWatchlist";

import MovieCard from "../components/WatchList/MovieCard";
import FilterButtons from "../components/WatchList/Filterbuttons";
import EmptyList from "../components/WatchList/EmptyList";
import type { WatchlistItem } from "../types/watchlist";

export default function Watchlist() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "to watch" | "watched">("all");

  const { data: watchlistData, isLoading, error } = useWatchlist(user?.id);
  const removeFromWatchlist = useRemoveFromWatchlist();
  const updateStatus = useUpdateWatchlistStatus();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const filteredMovies = useMemo(() => {
    if (!watchlistData) return [];
    return filter === "all"
      ? watchlistData
      : watchlistData.filter((item: WatchlistItem) => item.status === filter);
  }, [watchlistData, filter]);

  const counts = useMemo(() => {
    if (!watchlistData) return { all: 0, toWatch: 0, watched: 0 };
    return {
      all: watchlistData.length,
      toWatch: watchlistData.filter(i => i.status === "to watch").length,
      watched: watchlistData.filter(i => i.status === "watched").length,
    };
  }, [watchlistData]);

  const handleRemove = (movieId: number) => {
    if (!user?.id) return;
    removeFromWatchlist.mutate({ userId: user.id, movieId });
  };

  const handleStatusToggle = (movieId: number, currentStatus: string) => {
    if (!user?.id) return;
    const newStatus = currentStatus === "watched" ? "to watch" : "watched";
    updateStatus.mutate({ userId: user.id, movieId, status: newStatus });
  };

  if (!isAuthenticated || isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-100">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {(error as Error).message}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FilterButtons filter={filter} setFilter={setFilter} counts={counts} />

        {filteredMovies.length === 0 ? (
          <EmptyList filter={filter} navigate={navigate} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredMovies.map(item => (
              <MovieCard
                key={item.movie_id}
                item={item}
                onRemove={() => handleRemove(item.movie_id)}
                onStatusToggle={() => handleStatusToggle(item.movie_id, item.status)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

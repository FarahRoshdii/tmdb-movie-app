import {
  useIsInWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
} from "./useWatchlist";

export function useWatchlistToggle(
  userId: number | undefined,
  movieId: number
) {
  const { isLoading, isInWatchlist } = useIsInWatchlist(userId, movieId);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!userId) return;
    if (isInWatchlist) {
      removeFromWatchlist.mutate({ userId, movieId });
    } else {
      addToWatchlist.mutate({ userId, movieId });
    }
  };

  return { isLoading, isInWatchlist, toggle };
}

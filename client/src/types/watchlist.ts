export type WatchlistStatus = "to watch" | "watched";

export type WatchlistItem = {
  id: number;
  user_id: number;
  movie_id: number;
  status: WatchlistStatus;
  created_at?: string;
  title?: string;
  poster_path?: string | null;
  vote_average?: number;
};

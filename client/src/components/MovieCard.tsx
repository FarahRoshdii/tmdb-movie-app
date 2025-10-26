import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWatchlistToggle } from "../hooks/useWatchlistToggle";
import BookmarkButton from "./BookmarkButton";

type MovieCardProps = {
  movie: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string | null;
    vote_average?: number;
    release_date?: string;
  };
};

export default function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isLoading, isInWatchlist, toggle } = useWatchlistToggle(user?.id, movie.id);

  return (
    <div
      className="relative group bg-[#121212] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="relative h-64 sm:h-72">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/no-poster.png"
          }
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {isAuthenticated && (
          <BookmarkButton
            isInWatchlist={isInWatchlist}
            isLoading={isLoading}
            onToggle={toggle}
          />
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-100 line-clamp-2 min-h-[2.5rem]">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A"}
          </span>
          {movie.vote_average && movie.vote_average > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

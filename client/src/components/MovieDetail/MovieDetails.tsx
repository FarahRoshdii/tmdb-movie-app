import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import { useIsInWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from "@/hooks/useWatchlist";
import { MovieHeader } from "./MovieHeader";
import { MovieScore } from "./MovieScore";
import { MovieStats } from "./MovieStats";
import { MovieActions } from "./MovieActions";

export default function MovieDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const { data: movie, isLoading, isError, error } = useMovieDetails(id);
  const { isInWatchlist, isLoading: watchlistLoading } = useIsInWatchlist(user?.id, Number(id));
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const handleToggleWatchlist = () => {
    if (!user?.id || !id) return;
    if (isInWatchlist) {
      removeFromWatchlist.mutate({ userId: user.id, movieId: Number(id) });
    } else {
      addToWatchlist.mutate({ userId: user.id, movieId: Number(id) });
    }
  };

  if (isLoading)
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0a0a0a] text-gray-400">
        Loading movie details...
      </div>
    );

  if (isError)
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0a0a0a] text-red-400">
        Failed to load movie details: {(error as Error).message}
      </div>
    );

  if (!movie)
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0a0a0a] text-gray-400">
        Movie not found.
      </div>
    );

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#0a0a0a] text-gray-100 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-30"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-10">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-2xl shadow-2xl w-full sm:w-80 lg:w-1/3 xl:w-1/4 mx-auto lg:mx-0"
        />

        <div className="flex-1 text-left">
          <MovieHeader
            title={movie.title}
            releaseYear={releaseYear}
            runtime={movie.runtime}
            genres={movie.genres}
          />
          <MovieScore score={movie.vote_average} />
          {movie.tagline && (
            <p className="italic text-gray-400 mb-6 text-lg">“{movie.tagline}”</p>
          )}
          <h3 className="text-2xl font-semibold mb-3">Overview</h3>
          <p className="text-gray-300 leading-relaxed mb-10 max-w-2xl">
            {movie.overview}
          </p>
          <MovieStats
            status={movie.status}
            budget={movie.budget}
            revenue={movie.revenue}
          />
          <MovieActions
            homepage={movie.homepage}
            imdbId={movie.imdb_id}
            isAuthenticated={isAuthenticated}
            isInWatchlist={isInWatchlist}
            watchlistLoading={watchlistLoading}
            handleToggleWatchlist={handleToggleWatchlist}
          />
        </div>
      </div>
    </div>
  );
}

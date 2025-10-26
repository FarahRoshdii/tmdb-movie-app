import { ArrowPathIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";

export function MovieActions({
  homepage,
  imdbId,
  isAuthenticated,
  isInWatchlist,
  watchlistLoading,
  handleToggleWatchlist,
}: {
  homepage?: string;
  imdbId?: string;
  isAuthenticated: boolean;
  isInWatchlist: boolean;
  watchlistLoading: boolean;
  handleToggleWatchlist: () => void;
}) {
  return (
    <div className="mt-10 flex flex-wrap gap-4 items-center">
      {homepage && (
        <a
          href={homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          Official Site
        </a>
      )}
      {imdbId && (
        <a
          href={`https://www.imdb.com/title/${imdbId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-lg border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white transition"
        >
          View on IMDb
        </a>
      )}

      {isAuthenticated && (
        <button
          onClick={handleToggleWatchlist}
          disabled={watchlistLoading}
          className={`px-5 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            isInWatchlist
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {watchlistLoading ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              <span>Loading...</span>
            </>
          ) : isInWatchlist ? (
            <>
              <BookmarkSolidIcon className="w-5 h-5" />
              <span>Added to Watchlist</span>
            </>
          ) : (
            <>
              <BookmarkIcon className="w-5 h-5" />
              <span>Add to Watchlist</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

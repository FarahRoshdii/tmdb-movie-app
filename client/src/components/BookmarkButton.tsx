import { useState } from "react";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Props = {
  isInWatchlist: boolean;
  isLoading: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function BookmarkButton({ isInWatchlist, isLoading, onToggle }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="absolute top-2 right-2"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={onToggle}
        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
          isInWatchlist
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-black/50 hover:bg-black/70"
        }`}
      >
        {isLoading ? (
          <ArrowPathIcon className="w-5 h-5 text-white animate-spin" />
        ) : isInWatchlist ? (
          <BookmarkSolidIcon className="w-5 h-5 text-white" />
        ) : (
          <BookmarkIcon className="w-5 h-5 text-white" />
        )}
      </button>

      {hover && !isLoading && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2 bg-black/80 text-xs text-white px-2 py-1 rounded shadow-lg whitespace-nowrap z-20">
          {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </div>
      )}
    </div>
  );
}

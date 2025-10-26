import { EyeIcon, TrashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import type { WatchlistItem } from "../../types/watchlist";

interface MovieCardProps {
  item: WatchlistItem;
  onRemove: () => void;
  onStatusToggle: () => void;
}

export default function MovieCard({ item, onRemove, onStatusToggle }: MovieCardProps) {
  return (
    <div className="relative group bg-[#121212] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="cursor-pointer relative h-64 sm:h-72">
        <img
          src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "/no-poster.png"}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded shadow-lg ${
              item.status === "watched" ? "bg-green-600 text-white" : "bg-blue-600 text-white"
            }`}
          >
            {item.status === "watched" ? "✓ Watched" : "To Watch"}
          </span>
        </div>

        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <button onClick={onStatusToggle} className="p-2 rounded-full bg-green-600 hover:bg-green-700" title="Toggle Status">
            <CheckCircleIcon className="w-5 h-5 text-white" />
          </button>
          <button onClick={onRemove} className="p-2 rounded-full bg-red-600 hover:bg-red-700" title="Remove from watchlist">
            <TrashIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-100 line-clamp-2 min-h-[2.5rem]">{item.title}</h3>
        {item.vote_average && item.vote_average > 0 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">Rating</span>
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              {item.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

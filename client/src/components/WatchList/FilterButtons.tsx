import type { Dispatch, SetStateAction } from "react";

interface FilterButtonsProps {
  filter: "all" | "to watch" | "watched";
  setFilter: Dispatch<SetStateAction<"all" | "to watch" | "watched">>;
  counts: { all: number; toWatch: number; watched: number };
}

export default function FilterButtons({ filter, setFilter, counts }: FilterButtonsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl font-bold text-gray-100">My Watchlist</h1>
        <span className="text-sm text-gray-400">
          ({counts.all} {counts.all === 1 ? "movie" : "movies"})
        </span>
      </div>

      <div className="flex space-x-2">
        {["all", "to watch", "watched"].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {status === "all" ? `All (${counts.all})` : `${status === "to watch" ? "To Watch" : "Watched"} (${counts[status === "to watch" ? "toWatch" : "watched"]})`}
          </button>
        ))}
      </div>
    </div>
  );
}

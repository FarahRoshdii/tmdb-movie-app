import { BookmarkIcon } from "@heroicons/react/24/outline";
import type { NavigateFunction } from "react-router-dom";

interface EmptyListProps {
  filter: "all" | "to watch" | "watched";
  navigate: NavigateFunction;
}

export default function EmptyList({ filter, navigate }: EmptyListProps) {
  return (
    <div className="text-center py-20">
      <BookmarkIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-xl text-gray-400 mb-2">
        {filter === "all" ? "Your watchlist is empty" : `No ${filter} movies`}
      </h2>
      <p className="text-gray-500 mb-6">
        {filter === "all" ? "Start adding movies you want to watch!" : `You don't have any ${filter} movies yet.`}
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Browse Movies
      </button>
    </div>
  );
}

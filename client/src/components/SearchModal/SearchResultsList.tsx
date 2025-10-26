import { StarIcon } from "@heroicons/react/24/outline";

type Props = {
  results: any[];
  highlightIndex: number;
  loading: boolean;
  showTrending: boolean;
  resultsRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onSelect: (id: number) => void;
  isFetchingNextPage: boolean;
};

export default function SearchResultsList({
  results,
  highlightIndex,
  loading,
  showTrending,
  resultsRef,
  handleScroll,
  onSelect,
  isFetchingNextPage,
}: Props) {
  if (loading && results.length === 0)
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (results.length === 0)
    return (
      <p className="text-gray-500 text-center py-10 text-sm">
        No results found.
      </p>
    );

  return (
    <div ref={resultsRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-3">
      {showTrending && (
        <div className="flex items-center gap-2 px-3 pb-2">
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">
            Top trending
          </h3>
          <StarIcon className="w-5 h-5 text-blue-400" />
        </div>
      )}

      <ul className="space-y-2">
        {results.map((item, idx) => (
          <li
            key={`${item.id}-${idx}`}
            onClick={() => onSelect(item.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
              idx === highlightIndex
                ? "bg-blue-600/20 border border-blue-700"
                : "hover:bg-white/5"
            }`}
          >
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w154${item.poster_path}`
                  : "/no-poster.png"
              }
              alt={item.title}
              className="w-9 h-14 object-cover rounded-md"
            />
            <span className="text-gray-200 text-sm font-medium truncate">
              {item.title}
            </span>
          </li>
        ))}
      </ul>

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

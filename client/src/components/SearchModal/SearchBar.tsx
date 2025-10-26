import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar({ onClick }: { onClick: () => void }) {
  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onClick}
        className="w-full text-left relative group bg-[#121212]/90 text-gray-100 pl-12 pr-4 py-3 rounded-full border border-gray-700 hover:border-blue-500 hover:shadow-lg transition-all"
      >
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-400" />
        <span className="truncate text-sm text-gray-400">
          Search for a movie...
        </span>
      </button>
    </div>
  );
}

import SearchBar from "./SearchBar";
import SearchInput from "./SearchInput";
import SearchResultsList from "./SearchResultsList";
import { useSearch } from "@/hooks/useSearch";

export default function SearchModal() {
  const {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    highlightIndex,
    results,
    loadingSearch,
    loadingTrending,
    resultsRef,
    handleScroll,
    handleKeyDown,
    isFetchingNextPage,
    navigate,
  } = useSearch();

  return (
    <>
      <SearchBar onClick={() => setOpen(true)} />

      {open && (
        <div
          className="
            fixed inset-0 z-[1000]
            flex items-center justify-center
            bg-black/70 backdrop-blur-sm
            sm:px-0
            overflow-y-auto
          "
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="
              relative bg-[#0d0d0d]
              border border-gray-800 rounded-none sm:rounded-2xl
              shadow-[0_0_40px_rgba(0,0,0,0.6)]
              w-full sm:max-w-[750px]
              h-full sm:h-auto
              flex flex-col
              sm:max-h-[85vh]
              overflow-hidden
              animate-[fadeIn_0.25s_ease-out]
            "
          >
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              onClose={() => setOpen(false)}
              onKeyDown={handleKeyDown}
            />

            <div className="flex-1 overflow-y-auto">
              <SearchResultsList
                results={results}
                highlightIndex={highlightIndex}
                loading={loadingSearch || loadingTrending}
                showTrending={!searchTerm.trim()}
                resultsRef={resultsRef}
                handleScroll={handleScroll}
                onSelect={(id) => {
                  navigate(`/movie/${id}`);
                  setOpen(false);
                }}
                isFetchingNextPage={isFetchingNextPage}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

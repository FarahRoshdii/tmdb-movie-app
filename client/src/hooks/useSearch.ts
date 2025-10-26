import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { useSearchMovies } from "./useSearchMovies";
import { useTrendingMovies } from "./useTrendingMovies";

export function useSearch() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [debouncedTerm] = useDebounce(searchTerm, 500);
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);

  const {
    data: searchData,
    isLoading: loadingSearch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchMovies(debouncedTerm);

  const { data: trendingData, isLoading: loadingTrending } = useTrendingMovies(
    open && !debouncedTerm.trim()
  );

  const results = debouncedTerm.trim()
    ? (searchData?.pages.flatMap((page) => page.results) ?? [])
    : (trendingData?.results?.slice(0, 10) ?? []);

  useEffect(() => setHighlightIndex(0), [debouncedTerm]);
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setHighlightIndex(0);
    }
  }, [open]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      el.scrollTop + el.clientHeight >= el.scrollHeight - 50 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = results[highlightIndex];
      if (selected) {
        navigate(`/movie/${selected.id}`);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return {
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
  };
}

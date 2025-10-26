import React, { useRef } from "react";
import { useMoviesInfinite } from "../hooks/useMovies";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";


import { Movie } from "../types/movie";


type Props = {
  category: string;
  title?: string;
};

export default function ScrollableMoviesRow({ category, title }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useMoviesInfinite(category);

  const rowRef = useRef<HTMLDivElement>(null);

  const movies: Movie[] = data?.pages.flatMap((page) => page.results) ?? [];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 50 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isError) {
    return (
      <div className="text-center text-red-500 mb-4">
        Failed to load movies.
        <button type="button" onClick={() => refetch()} className="text-blue-500 underline ml-2">
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="mb-8">
      { title && 
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="w-1 h-8 bg-blue-600 mr-3"></span>
        {title}
      </h2>
      }

      <div
        className="overflow-x-auto flex gap-6 px-2 scrollbar-hide"
        ref={rowRef}
        onScroll={handleScroll}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies.map((movie) => (
              <div key={movie.id} className="w-48 flex-shrink-0">
                <MovieCard movie={movie} />
              </div>
            ))}

        {isFetchingNextPage && (
          <div className="flex items-center justify-center w-48">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
}

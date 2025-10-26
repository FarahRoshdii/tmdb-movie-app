export type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
};

export type TMDBResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

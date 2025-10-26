export type SearchResult = {
  id: number;
  title?: string;
  poster_path?: string | null;
};

export type SearchResponse = {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
};

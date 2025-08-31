import type { RootState } from "../../app/store";

export const selectAllMovies = (s: RootState) => s.movies.items;
export const selectSearch = (s: RootState) => s.movies.search;
export const selectLoading = (s: RootState) => s.movies.loading;
export const selectShowFavoritesOnly = (s: RootState) =>
  s.movies.showFavoritesOnly;
export const selectMoviesError = (s: RootState) => s.movies.error;

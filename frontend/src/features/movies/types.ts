export interface Movie {
  id: string;
  title: string;
  year?: string;
  runtime?: string;
  genre?: string;
  director?: string;
  is_favorite?: boolean;
}
export type UpsertMoviePayload = {
  title: string;
  year?: string;
  runtime?: string;
  genre?: string;
  director?: string;
};

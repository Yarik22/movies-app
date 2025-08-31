export interface UpsertMoviePayload {
  title: string;
  year: string;
  genre: string;
  runtime: string;
  director: string;
}

export interface Movie extends UpsertMoviePayload {
  id: string;
  user_id: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

import type { Movie } from "../features/movies/types";
import styled from "styled-components";
import MovieCard from "./MovieCard";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`;

export default function MovieList({
  movies,
  onEdit,
  onDelete,
  onToggleFavorite,
}: {
  movies: Movie[];
  onEdit: (m: Movie) => void;
  onDelete: (m: Movie) => void;
  onToggleFavorite: (m: Movie) => void;
}) {
  if (!movies || movies.length === 0) return <p>No movies found</p>;
  return (
    <Grid>
      {movies.map((m) => (
        <MovieCard
          key={m.id}
          m={m}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </Grid>
  );
}

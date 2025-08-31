import ConfirmDialog from "../components/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchMovies,
  deleteMovie,
  toggleFavorite,
} from "../features/movies/moviesSlice";
import {
  selectAllMovies,
  selectShowFavoritesOnly,
  selectLoading,
} from "../features/movies/selectors";
import type { Movie } from "../features/movies/types";
import { useState, useEffect } from "react";
import FavoriteToggle from "../components/FavoriteToggle";
import MovieList from "../components/MovieList";
import SearchBar from "../components/SearchBar";
import MovieFormModal from "../components/MovieFormModal";

export default function Home() {
  const dispatch = useAppDispatch();
  const movies = useAppSelector(selectAllMovies);
  const loading = useAppSelector(selectLoading);
  const showFavOnly = useAppSelector(selectShowFavoritesOnly);

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Movie | null>(null);
  const [confirm, setConfirm] = useState<Movie | null>(null);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const visible = showFavOnly ? movies.filter((m) => !!m.is_favorite) : movies;

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <SearchBar />
        </div>
        <FavoriteToggle />
        <button
          onClick={() => setAdding(true)}
          style={{
            marginLeft: 8,
            padding: "8px 12px",
            borderRadius: 10,
            background: "#10b981",
            color: "#022",
            border: "none",
          }}
        >
          +
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <MovieList
          movies={visible}
          onEdit={(m) => setEditing(m)}
          onDelete={(m) => setConfirm(m)}
          onToggleFavorite={(m) => dispatch(toggleFavorite(m))} // pass full movie
        />
      )}

      {adding && <MovieFormModal onClose={() => setAdding(false)} />}
      {editing && (
        <MovieFormModal
          initialData={editing}
          onClose={() => setEditing(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          text={`Delete "${confirm.title}"?`}
          onOk={() => {
            dispatch(deleteMovie(confirm.id));
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

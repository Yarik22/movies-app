import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../api/client";
import type { Movie, UpsertMoviePayload } from "./types";
import type { RootState } from "../../app/store";
import { normalizeTitle } from "../../utils/format";

export const fetchMovies = createAsyncThunk<
  Movie[],
  string | void,
  { state: RootState }
>("movies/fetch", async (search = "") => {
  const res = await api.get<Movie[]>("/movies", {
    params: { search },
  });
  return res.data;
});

export const addMovie = createAsyncThunk<
  Movie,
  UpsertMoviePayload,
  { rejectValue: string }
>("movies/add", async (payload, thunkAPI) => {
  try {
    const res = await api.post<Movie>("/movies", payload);
    return res.data;
  } catch (err: any) {
    const msg = err?.response?.data?.message || err.message || "Add failed";
    return thunkAPI.rejectWithValue(String(msg));
  }
});

export const updateMovie = createAsyncThunk<
  Movie,
  { id: string; changes: UpsertMoviePayload },
  { rejectValue: string }
>("movies/update", async ({ id, changes }, thunkAPI) => {
  try {
    const res = await api.put<Movie>(`/movies/${id}`, changes);
    return res.data;
  } catch (err: any) {
    const msg = err?.response?.data?.message || err.message || "Update failed";
    return thunkAPI.rejectWithValue(String(msg));
  }
});

export const deleteMovie = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("movies/delete", async (id, thunkAPI) => {
  try {
    await api.delete(`/movies/${id}`);
    return id;
  } catch (err: any) {
    const msg = err?.response?.data?.message || err.message || "Delete failed";
    return thunkAPI.rejectWithValue(String(msg));
  }
});

export const toggleFavorite = createAsyncThunk<
  Movie,
  Movie,
  { rejectValue: string; state: RootState }
>("movies/toggleFavorite", async (movie, thunkAPI) => {
  try {
    // If the movie has an ID, just patch favorite
    if (movie.id && !isNaN(Number(movie.id))) {
      const res = await api.patch(`/movies/${movie.id}/favorite`);
      return res.data as Movie;
    }

    // If movie has no ID, create it first
    const createPayload: UpsertMoviePayload = {
      title: normalizeTitle(movie.title),
      year: movie.year,
      runtime: movie.runtime,
      genre: movie.genre,
      director: movie.director,
    };

    const created = await api.post("/movies", createPayload);
    const createdId = created.data.id;

    const fav = await api.patch(`/movies/${createdId}/favorite`);
    return fav.data as Movie;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message || err.message || "Favorite failed";
    return thunkAPI.rejectWithValue(String(msg));
  }
});

type MoviesState = {
  items: Movie[];
  loading: boolean;
  error?: string | null;
  search: string;
  showFavoritesOnly: boolean;
};

const initialState: MoviesState = {
  items: [],
  loading: false,
  error: null,
  search: "",
  showFavoritesOnly: false,
};

const slice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setShowFavoritesOnly(state, action: PayloadAction<boolean>) {
      state.showFavoritesOnly = action.payload;
    },
    setItems(state, action: PayloadAction<Movie[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchMovies.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchMovies.rejected, (s, a) => {
        s.loading = false;
        s.error = String(a.error?.message || a.payload || "Fetch failed");
      })

      .addCase(addMovie.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })
      .addCase(addMovie.rejected, (s, a) => {
        s.error = String(a.payload || a.error?.message);
      })

      .addCase(updateMovie.fulfilled, (s, a) => {
        const idx = s.items.findIndex((m) => m.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(updateMovie.rejected, (s, a) => {
        s.error = String(a.payload || a.error?.message);
      })

      .addCase(deleteMovie.fulfilled, (s, a) => {
        s.items = s.items.filter((m) => m.id !== a.payload);
      })
      .addCase(deleteMovie.rejected, (s, a) => {
        s.error = String(a.payload || a.error?.message);
      })
      .addCase(toggleFavorite.pending, (state, action) => {
        const movie = action.meta.arg; // Movie object
        const idx = state.items.findIndex((m) => m.title === movie.title);

        // Optimistically toggle favorite
        if (idx >= 0) {
          state.items[idx].is_favorite = !state.items[idx].is_favorite;
        } else {
          // If it's a new movie (not in state), add it as favorite
          state.items.unshift({ ...movie, is_favorite: true });
        }
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const newMovie = { ...action.payload, id: String(action.payload.id) };
        const idx = state.items.findIndex(
          (m) => String(m.id) === newMovie.id || m.title === newMovie.title
        );
        if (idx >= 0) state.items[idx] = newMovie;
        else state.items.unshift(newMovie);
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        // Rollback favorite change on failure
        const movie = action.meta.arg;
        const idx = state.items.findIndex((m) => m.title === movie.title);
        if (idx >= 0)
          state.items[idx].is_favorite = !state.items[idx].is_favorite;
        state.error = action.payload || "Failed to toggle favorite";
      });
  },
});

export const { setSearch, setShowFavoritesOnly, setItems } = slice.actions;
export default slice.reducer;

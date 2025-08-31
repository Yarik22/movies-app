import { describe, it, expect } from "vitest";
import reducer, { toggleFavorite } from "./moviesSlice";

describe("moviesSlice reducer", () => {
  const initialState = {
    items: [{ id: "1", title: "Test", is_favorite: false }],
    loading: false,
    error: null,
    search: "",
    showFavoritesOnly: false,
  };

  it("should toggle is_favorite for existing movie", () => {
    const action = {
      type: toggleFavorite.fulfilled.type,
      payload: { id: "1", title: "Test", is_favorite: true },
    };
    const state = reducer(initialState, action);
    expect(state.items[0].is_favorite).toBe(true);
  });

  it("should optimistically add new movie when toggling favorite", () => {
    const newMovie = { id: "", title: "New Movie", is_favorite: false };
    const action = {
      type: toggleFavorite.pending.type,
      meta: { arg: newMovie },
    };
    const state = reducer(initialState, action);
    expect(state.items[0].title).toBe("New Movie");
    expect(state.items[0].is_favorite).toBe(true);
  });

  it("should rollback favorite on toggleFavorite.rejected", () => {
    const movie = { id: "1", title: "Test", is_favorite: true };
    const pendingAction = {
      type: toggleFavorite.pending.type,
      meta: { arg: movie },
    };
    const rejectedAction = {
      type: toggleFavorite.rejected.type,
      meta: { arg: movie },
      payload: "Error",
    };
    let state = reducer(initialState, pendingAction);
    expect(state.items[0].is_favorite).toBe(true);

    state = reducer(state, rejectedAction);
    expect(state.items[0].is_favorite).toBe(false);
    expect(state.error).toBe("Error");
  });
});

import { useState } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../app/hooks";
import { setSearch, fetchMovies } from "../features/movies/moviesSlice";

const Wrap = styled.form`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  input {
    flex: 1;
    padding: 0.6rem 0.9rem;
    border-radius: 10px;
    border: 1px solid #ddd;
  }
  button {
    padding: 0.6rem 0.9rem;
    border-radius: 10px;
    background: #60a5fa;
    border: none;
    color: #072;
    font-weight: 700;
  }
`;

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const [q, setQ] = useState<string>("");

  return (
    <Wrap
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(setSearch(q));
        dispatch(fetchMovies(q));
      }}
    >
      <input
        placeholder="Search movie titles"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit">Search</button>
    </Wrap>
  );
}

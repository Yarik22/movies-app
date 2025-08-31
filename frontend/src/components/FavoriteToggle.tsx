import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setShowFavoritesOnly } from "../features/movies/moviesSlice";
import { selectShowFavoritesOnly } from "../features/movies/selectors";

const Btn = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: ${(p) => (p.$active ? "gold" : "#111827")};
  color: ${(p) => (p.$active ? "#111" : "#ddd")};
`;

export default function FavoriteToggle() {
  const dispatch = useAppDispatch();
  const active = useAppSelector(selectShowFavoritesOnly);
  return (
    <Btn
      $active={active}
      onClick={() => dispatch(setShowFavoritesOnly(!active))}
    >
      ★
    </Btn>
  );
}

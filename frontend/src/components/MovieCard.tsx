import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../features/movies/types";

const Card = styled.div`
  background: var(--card);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #1f2937;
`;
const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8px;
`;
const Btn = styled.button`
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #374151;
  background: #111827;
  color: var(--muted);
`;
const Star = styled(Btn)<{ $on?: boolean }>`
  color: ${(p) => (p.$on ? "gold" : "var(--muted)")};
  font-size: 1.1rem;
`;

export default function MovieCard({
  m,
  onEdit,
  onDelete,
  onToggleFavorite,
}: {
  m: Movie;
  onEdit: (m: Movie) => void;
  onDelete: (m: Movie) => void;
  onToggleFavorite: (m: Movie) => void;
}) {
  const nav = useNavigate();

  const isSaved = typeof m.id === "number" || !isNaN(Number(m.id));

  return (
    <Card>
      <h3 style={{ margin: 0 }}>{m.title}</h3>
      <div style={{ marginTop: 6 }}>
        {m.year} • {m.runtime} • {m.genre}
      </div>
      <div style={{ marginTop: 6 }}>Director: {m.director}</div>
      <Row>
        <Star $on={!!m.is_favorite} onClick={() => onToggleFavorite(m)}>
          ★
        </Star>

        {isSaved && (
          <>
            <Btn onClick={() => nav(`/movie/${m.id}`)}>Details</Btn>
            <Btn onClick={() => onEdit(m)}>Edit</Btn>
            <Btn onClick={() => onDelete(m)}>Delete</Btn>
          </>
        )}
      </Row>
    </Card>
  );
}

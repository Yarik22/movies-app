import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

export default function Details() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Not found</p>;

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <Link to="/">← Back</Link>
      <h1>{movie.title}</h1>
      <p>
        {movie.year} • {movie.runtime}
      </p>
      <p>{movie.genre}</p>
      <p>Director: {movie.director}</p>
    </div>
  );
}

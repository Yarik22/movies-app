import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateMovie, addMovie } from "../features/movies/moviesSlice";
import { selectAllMovies } from "../features/movies/selectors";
import type { Movie, UpsertMoviePayload } from "../features/movies/types";
import { normalizeTitle, isValidYear } from "../utils/format";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
`;
const Box = styled.div`
  background: var(--card);
  color: var(--text);
  padding: 1rem;
  border-radius: 12px;
  width: min(720px, 96vw);
  max-height: 90vh;
  overflow: auto;
`;
const Row = styled.div`
  display: flex;
  gap: 0.5rem;
`;
const Btn = styled.button`
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  border: none;
  font-weight: 700;
`;

export default function MovieFormModal({
  initialData,
  onClose,
}: {
  initialData?: Movie | null;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<UpsertMoviePayload>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          year: initialData.year,
          runtime: initialData.runtime,
          genre: initialData.genre,
          director: initialData.director,
        }
      : { title: "", year: "", runtime: "", genre: "", director: "" },
  });

  const dispatch = useAppDispatch();
  const all = useAppSelector(selectAllMovies);

  useEffect(() => {
    reset(
      initialData
        ? {
            title: initialData.title,
            year: initialData.year,
            runtime: initialData.runtime,
            genre: initialData.genre,
            director: initialData.director,
          }
        : { title: "", year: "", runtime: "", genre: "", director: "" }
    );
  }, [initialData, reset]);

  async function onSubmit(vals: UpsertMoviePayload) {
    const titleNorm = normalizeTitle(vals.title);
    const dup = all.find(
      (m) =>
        m.title &&
        m.title.toLowerCase() === titleNorm.toLowerCase() &&
        (!initialData || m.id !== initialData.id)
    );
    if (dup) {
      setError("title", {
        type: "manual",
        message: "A movie with the same name already exists.",
      });
      return;
    }

    try {
      if (initialData) {
        await dispatch(
          updateMovie({
            id: initialData.id,
            changes: { ...vals, title: titleNorm },
          })
        ).unwrap();
      } else {
        await dispatch(addMovie({ ...vals, title: titleNorm })).unwrap();
      }
      onClose();
    } catch (err: any) {
      // show backend error on title if it's duplicate from server
      const msg = err?.payload || err?.message || String(err);
      if (msg?.includes("same name"))
        setError("title", {
          type: "manual",
          message: "A movie with the same name already exists.",
        });
      else alert(msg);
    }
  }

  return (
    <Overlay>
      <Box>
        <h2>{initialData ? "Edit movie" : "Add movie"}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Title
            <input
              {...register("title", {
                required: "Title required",
                minLength: { value: 3, message: "Min 3 chars" },
              })}
            />
            {errors.title && (
              <div style={{ color: "#fca5a5" }}>{errors.title.message}</div>
            )}
          </label>

          <Row style={{ marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <label>
                Year
                <input
                  {...register("year", {
                    validate: (v) => !v || isValidYear(v) || "Invalid year",
                  })}
                />
                {errors.year && (
                  <div style={{ color: "#fca5a5" }}>{errors.year.message}</div>
                )}
              </label>
            </div>
            <div style={{ flex: 1 }}>
              <label>
                Runtime
                <input
                  {...register("runtime", {
                    required: "Runtime required",
                    minLength: { value: 3, message: "Min 3 chars" },
                  })}
                />
                {errors.runtime && (
                  <div style={{ color: "#fca5a5" }}>
                    {errors.runtime.message}
                  </div>
                )}
              </label>
            </div>
          </Row>

          <label style={{ marginTop: 8 }}>
            Genre
            <input
              {...register("genre", {
                required: "Genre required",
                minLength: { value: 3, message: "Min 3 chars" },
              })}
            />
            {errors.genre && (
              <div style={{ color: "#fca5a5" }}>{errors.genre.message}</div>
            )}
          </label>

          <label style={{ marginTop: 8 }}>
            Director
            <input
              {...register("director", {
                required: "Director required",
                minLength: { value: 3, message: "Min 3 chars" },
              })}
            />
            {errors.director && (
              <div style={{ color: "#fca5a5" }}>{errors.director.message}</div>
            )}
          </label>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 12,
            }}
          >
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <Btn type="submit" style={{ background: "#60a5fa", color: "#022" }}>
              {initialData ? "Save" : "Add"}
            </Btn>
          </div>
        </form>
      </Box>
    </Overlay>
  );
}

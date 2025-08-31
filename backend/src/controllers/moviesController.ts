import { type Request, type Response } from "express";
import axios from "axios";
import * as userModel from "../models/userModel.js";
import * as movieModel from "../models/movieModel.js";

const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Helper: ensure user exists based on header
async function getUser(req: Request) {
  const username = req.header("x-username") || "guest";
  return userModel.ensureUser(username);
}

export async function getMovies(req: Request, res: Response) {
  try {
    const { search } = req.query as { search?: string };
    const user = await getUser(req);

    const localMovies = await movieModel.findAll(user.id, search);

    let omdbMovies: any[] = [];
    if (search && OMDB_API_KEY) {
      const resp = await axios.get(
        `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
          search
        )}`
      );
      if (resp.data.Search) {
        // Получаем массив imdbID
        const ids = resp.data.Search.map((m: any) => m.imdbID);
        // Запрашиваем детали для каждого фильма параллельно
        omdbMovies = await Promise.all(
          ids.map(async (imdbID: string) => {
            const detailResp = await axios.get(
              `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=short`
            );
            const d = detailResp.data;
            return {
              id: `omdb:${d.imdbID}`,
              title: d.Title,
              year: d.Year,
              genre: d.Genre,
              runtime: d.Runtime,
              director: d.Director,
              is_favorite: false,
            };
          })
        );
      }
    }

    res.json([...localMovies, ...omdbMovies]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getMovieById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Movie ID is required" });

    const user = await getUser(req);

    if (id.startsWith("omdb:") && OMDB_API_KEY) {
      const imdbID = id.split(":")[1];
      const resp = await axios.get(
        `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`
      );
      return res.json(resp.data);
    }

    const movie = await movieModel.findById(user.id, id);
    if (!movie) return res.status(404).json({ error: "Not found" });

    res.json(movie);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function addMovie(req: Request, res: Response) {
  try {
    const user = await getUser(req);
    const movie = await movieModel.create(user.id, req.body);
    res.status(201).json(movie);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateMovie(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Movie ID is required" });

    const user = await getUser(req);
    const updated = await movieModel.update(user.id, id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function toggleFavorite(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Movie ID is required" });

    const user = await getUser(req);
    const updated = await movieModel.toggleFavorite(user.id, id);

    // Ensure the ID is a string (important for Redux matching)
    res.json({ ...updated, id: String(updated.id) });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteMovie(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Movie ID is required" });

    const user = await getUser(req);
    await movieModel.remove(user.id, id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

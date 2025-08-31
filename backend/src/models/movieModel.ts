import db from "../db.js";
import type { UpsertMoviePayload } from "../types/movies.js";

export async function findAll(userId: string, search?: string) {
  const { rows } = await db.query(
    `SELECT * FROM movies 
     WHERE user_id = $1 AND ($2::text IS NULL OR title ILIKE '%' || $2 || '%')
     ORDER BY created_at DESC`,
    [userId, search || null]
  );
  return rows;
}

export async function findById(userId: string, id: string) {
  const { rows } = await db.query(
    `SELECT * FROM movies WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return rows[0];
}

export async function create(userId: string, data: UpsertMoviePayload) {
  const { rows } = await db.query(
    `INSERT INTO movies (title, year, genre, runtime, director, user_id)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [data.title, data.year, data.genre, data.runtime, data.director, userId]
  );
  return rows[0];
}

export async function update(
  userId: string,
  id: string,
  changes: UpsertMoviePayload
) {
  const { rows } = await db.query(
    `UPDATE movies 
     SET title=$1, year=$2, genre=$3, runtime=$4, director=$5, updated_at=NOW()
     WHERE id=$6 AND user_id=$7
     RETURNING *`,
    [
      changes.title,
      changes.year,
      changes.genre,
      changes.runtime,
      changes.director,
      id,
      userId,
    ]
  );
  return rows[0];
}

export async function toggleFavorite(userId: string, id: string) {
  const { rows } = await db.query(
    `UPDATE movies 
     SET is_favorite = NOT is_favorite 
     WHERE id=$1 AND user_id=$2
     RETURNING *`,
    [id, userId]
  );
  return rows[0];
}

export async function remove(userId: string, id: string) {
  await db.query(`DELETE FROM movies WHERE id=$1 AND user_id=$2`, [id, userId]);
}

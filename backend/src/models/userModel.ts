import db from "../db.js";

export async function ensureUser(username: string) {
  const { rows } = await db.query(`SELECT * FROM users WHERE username=$1`, [
    username,
  ]);
  if (rows.length > 0) return rows[0];

  const insert = await db.query(
    `INSERT INTO users (username) VALUES ($1) RETURNING *`,
    [username]
  );
  return insert.rows[0];
}

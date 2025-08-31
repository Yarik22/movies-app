import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "DATABASE_URL is not set."
  );
}

export const pool = new Pool({
  connectionString: connectionString || "postgres://postgres@localhost/postgres",
  ssl: connectionString && !connectionString.includes("localhost")
    ? { rejectUnauthorized: false }
    : false,
});

export default pool;

// src/index.ts
import express from "express";
import cors from "cors";
import moviesRouter from "./routes/movies.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "x-username"],
  })
);

app.use(express.json());
app.use("/movies", moviesRouter);

const CLIENT = process.env.CLIENT || "http://localhost:4000";
const PORT = process.env.PORT || "4000";
app.listen(PORT, () => {
  console.log(`Server running on ${CLIENT}`);
});

import express from "express";
import cors from "cors";
import moviesRouter from "./routes/movies.js";

const app = express();

const CLIENT = process.env.CLIENT || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "x-username"],
  })
);

app.use(express.json());
app.use("/movies", moviesRouter);

const PORT = process.env.PORT || "4000";
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

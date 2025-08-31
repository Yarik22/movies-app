import express from "express";
import bodyParser from "body-parser";
import moviesRouter from "./routes/movies.js";

const app = express();

app.use(bodyParser.json());

app.use("/movies", moviesRouter);

app.get("/", (req, res) => {
  res.send("Movies API is running");
});

export default app;

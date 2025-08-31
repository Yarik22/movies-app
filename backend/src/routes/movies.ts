import { Router } from "express";
import * as moviesController from "../controllers/moviesController.js";

const router = Router();

router.get("/", moviesController.getMovies);
router.get("/:id", moviesController.getMovieById);
router.post("/", moviesController.addMovie);
router.put("/:id", moviesController.updateMovie);
router.patch("/:id/favorite", moviesController.toggleFavorite);
router.delete("/:id", moviesController.deleteMovie);

export default router;

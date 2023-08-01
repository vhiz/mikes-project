import express from "express";
import {
  CreateBook,
  Favourite,
  ListBook,
  getbook,
  searchBooks,
} from "../controllers/book.js";

const router = express.Router();

router.get("", searchBooks);
router.get("/:id", getbook);
router.get("/list/:id", ListBook);
router.post("/:id", Favourite);
router.post("/", CreateBook);

export default router;

import express from "express";
import {
  CreateBook,
  Favourite,
  ListBook,
  deleteBook,
  getbook,
  searchBooks,
} from "../controllers/book.js";

const router = express.Router();

router.get("", searchBooks);
router.get("/:id", getbook);
router.get("/list/:id", ListBook);
router.post("/:id", Favourite);
router.delete("/:id", deleteBook);
router.post("/", CreateBook);

export default router;

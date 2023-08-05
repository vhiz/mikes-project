import express from "express";
import { Books } from "../controllers/lib.js";

const router = express.Router();

router.get("/", Books);

export default router;

import express from "express";
import { Login, Register, getUser } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", Login);
router.post("/register", Register);
router.get("/:id", getUser);

export default router;

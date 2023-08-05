import express from "express";
import {
  Login,
  Register,
  getUser,
  registerAdmin,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", Login);
router.post("/register", Register);
router.post("/adminReg", registerAdmin);
router.get("/:id", getUser);

export default router;

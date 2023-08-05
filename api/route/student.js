import express from "express";
import {
  DeleteStudent,
  EditPassword,
  GetStudents,
} from "../controllers/student.js";

const router = express.Router();

router.get("/", GetStudents);
router.delete("/:id", DeleteStudent);
router.put("/:id", EditPassword);

export default router;

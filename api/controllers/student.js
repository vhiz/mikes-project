import User from "../model/User.js";
import bcryptjs from "bcryptjs";

export const GetStudents = async (req, res) => {
  try {
    let students;

    if (!req.query.student || req.query.student === "") {
      students = await User.find();
    } else {
      students = await User.find({
        $or: [
          { username: { $regex: new RegExp(`^${req.query.student}`, "i") } },
          { reg_no: { $regex: new RegExp(`^${req.query.student}`, "i") } },
        ],
      });
    }

    const filteredStudents = students.filter((user) => !user.isAdmin);

    return res.status(200).json(filteredStudents);
  } catch (error) {
    console.error("Error while processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const DeleteStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) return res.status(400).json("Something went wrongs");
    return res.status(200).json("Student deleted");
  } catch (error) {
    console.error("Error while processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const EditPassword = async (req, res) => {
  try {
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
    const student = await User.findByIdAndUpdate(req.params.id, {
      $set: { password: hashedPassword, passwordUpdated: true },
    });
    if (!student) return res.status(400).json("Something went wrongs");
    return res.status(200).json("Student deleted");
  } catch (error) {
    console.error("Error while processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

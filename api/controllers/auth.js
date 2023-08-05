import bcryptjs from "bcryptjs";
import User from "../model/User.js";
import "dotenv/config.js";

export const Register = async (req, res) => {
  try {
    const regExpPattern = /^[A-Z]+\/\d{4}\/\d+$/;
    if (!regExpPattern.test(req.body.reg_no)) {
      return res.status(409).json("input proper inputs ");
    }

    const existingUser = await User.findOne({
      $or: [{ reg_no: { $regex: new RegExp(`^${req.body.reg_no}$`, "i") } }],
    });

    if (existingUser) {
      return res.status(409).json("User already exists");
    }

    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);

    const newUser = {
      ...req.body,
      password: hashedPassword,
    };

    await User.create(newUser);

    return res.status(201).json("User created");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${req.body.username}$`, "i") } },
      ],
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const validPassword = bcryptjs.compareSync(
      req.body.password,
      existingUser.password
    );
    if (!validPassword) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    const { password, updatedAt, ...user } = existingUser._doc;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const Logout = (req, res) => {
  res.status(200).json("loged out");
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User not Found");
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${req.body.username}$`, "i") } },
      ],
    });

    if (existingUser) {
      return res.status(409).json("Admin already exists");
    }

    if (
      req.body.adminPass !== "password@1234" ||
      req.body.adminPass.trim() === ""
    ) {
      return res.status(401).json("You need a correct key to be an admin");
    }

    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);

    const newUser = {
      ...req.body,
      password: hashedPassword,
      isAdmin: true,
    };

    await User.create(newUser);

    res.status(201).json("Admin created");
  } catch (error) {
    res.status(500).json(error.message);
  }
};



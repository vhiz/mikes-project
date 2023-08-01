import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, minlength: 4, maxlength: 10 },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    books: { type: Array },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;

import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    id: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const Book = model("Book", bookSchema);

export default Book;

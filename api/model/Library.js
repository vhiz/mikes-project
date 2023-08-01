import { Schema, model } from "mongoose";

const librarySchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    authors: { type: [String] },
    publisher: { type: String },
    publishedDate: { type: String },
    description: { type: String },
    pageCount: { type: String },
    categories: { type: [String] },
    img: { type: String },
    isLibrary: { type: Boolean, default: true },
    stars: { type: Number, default: 0 },
    pdf: { type: String, required: true },
  },
  { timestamps: true }
);

const Library = model("Library", librarySchema);

export default Library;

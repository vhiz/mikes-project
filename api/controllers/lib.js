import Library from "../model/Library.js";

export const Books = async (req, res) => {
  try {
    let libraryBooks;
    if (!req.query.book || req.query.book === "") {
      libraryBooks = await Library.find();
    } else {
      libraryBooks = await Library.find({ title: req.query.book });
    }
    return res.status(200).json(libraryBooks);
  } catch (error) {
    console.error("Error while processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

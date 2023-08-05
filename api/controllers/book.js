import axios from "axios";
import "dotenv/config";
import Book from "../model/Book.js";
import User from "../model/User.js";
import { v4 as uuid } from "uuid";
import Library from "../model/Library.js";

export const searchBooks = async ({ query }, res) => {
  try {
    // Check if query.q exists, if not, send an empty array as the response
    if (!query.q) {
      return res.status(200).send([]);
    }

    // Fetch books from the Google Books API based on the search query
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query.q}&key=${process.env.KEY}`
    );

    // Find matching books in the local database using the Library model
    const libBooks = await Library.find({
      $or: [
        { title: { $regex: new RegExp(query.q, "i") } },
        { subtitle: { $regex: new RegExp(query.q, "i") } },
        { authors: { $in: [new RegExp(query.q, "i")] } },
        { categories: { $in: [new RegExp(query.q, "i")] } },
        { publisher: { $regex: new RegExp(query.q, "i") } },
      ],
    });

    // Extract relevant information from the Google Books API response items
    const items = response.data.items;
    const info = items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      subtitle: item.volumeInfo.subtitle,
      authors: item.volumeInfo.authors,
      publisher: item.volumeInfo.publisher,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories,
      img: item.volumeInfo.imageLinks?.thumbnail,
      previewLink: item.volumeInfo.previewLink,
      reade_mode: item.accessInfo.webReaderLink,
    }));

    // Combine the results from both sources and send them as the response
    return res.send([...info, ...libBooks]);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).send("Error fetching books");
  }
};

export const getbook = async (req, res) => {
  try {
    const params = req.params.id;

    // If params is a book ID in the local database, fetch it from the database
    if (params.length > 12) {
      const response = await Library.findOne({ id: params });
      const data = {
        id: response.id,
        volumeInfo: {
          title: response.title,
          subtitle: response.subtitle,
          imageLinks: {
            thumbnail: response.img,
          },
          authors: response.authors,
          description: response.description,
          pageCount: response.pageCount,
          categories: response.categories,
          previewLink: response.pdf,
          isLibrary: response.isLibrary,
          publisher: response.publisher,
          publishedDate: response.publishedDate,
        },
        accessInfo: {
          pdf: {
            acsTokenLink: false,
          },
        },
      };
      res.status(200).json(data);
    } else {
      // Otherwise, assume it is an identifier for the Google Books API, and fetch it from the API
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes/${params}`
      );
      res.status(200).json(response.data);
    }
  } catch (error) {
    // Handle any errors that occur during the book fetching process
    console.error("Error fetching books:", error.message);
    res.status(500).send("Error fetching books");
  }
};

export const ListBook = async (req, res) => {
  try {
    const params = req.params.id;
    const books = await Book.find({ userId: params });
    res.status(200).json(books.sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).send("Error fetching books");
  }
};

export const Favourite = async (req, res) => {
  try {
    const userId = req.params.id;
    const bookId = req.body.bookId;

    // Check if userId and bookId are valid
    if (!userId || !bookId) {
      return res.status(400).json({ error: "Invalid input." });
    }

    const userBooks = await Book.find({ userId });
    const bookIds = userBooks.map((book) => book.id);

    if (bookIds.includes(bookId)) {
      // Book with the given bookId is already in the user's favorites.
      await Book.findOneAndDelete({ userId, id: bookId });
      await User.findByIdAndUpdate(userId, {
        $pull: { books: bookId },
      });
      return res
        .status(200)
        .json({ message: "Book has been deleted from favorites." });
    } else {
      // Book with the given bookId is not in the user's favorites.
      const newBook = {
        id: bookId,
        userId,
      };
      await Book.create(newBook);
      await User.findByIdAndUpdate(userId, {
        $push: { books: bookId },
      });
      return res
        .status(200)
        .json({ message: "Book added to favorites successfully." });
    }
  } catch (error) {
    console.error("Error while processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const CreateBook = async (req, res) => {
  try {
    const newBook = {
      ...req.body,
      id: uuid(),
    };
    await Library.create(newBook);
    res.status(200).json("New Book created");
  } catch (error) {
    console.error("Error while processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const deleteBook = await Library.findOneAndDelete({ id: req.params.id });
    if (!deleteBook) return res.status(404).json("No book Found");
    res.status(200).json("Book deleted");
  } catch (error) {
    console.error("Error while processing request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


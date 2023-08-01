import express from "express";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import { connect } from "mongoose";

const app = express();

import bookRoute from "./route/book.js";
import authRoute from "./route/auth.js";

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const db = async () => {
  try {
    await connect(process.env.MONGODB_URL);
    console.log(`Connected to MongoDB`);
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the application with an error code
  }
};
db();

app.use("/api/book", bookRoute);
app.use("/api/auth", authRoute);

const Port = process.env.PORT || 3000;

app.listen(Port, () => {
  console.log(`app listening Port ${Port}`);
});

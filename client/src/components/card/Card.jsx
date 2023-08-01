import "./card.scss";
import { Link } from "react-router-dom";
export default function Card(book) {
  return (
    <div className="card">
      <div className="imgContanier">
        <img
          src={
            book.book.img ||
            "data:image/png;base64,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"
          }
          alt=""
        />
      </div>
      <div className="details">
        <h2>{book?.book?.title}</h2>
        <p>{book?.book?.subtitle || "Click to know more about the topic"}</p>
        <span>
          BY:{" "}
          {book.book.authors ? book?.book?.authors.map((author) => author).join(", ") : "Unknown"}
        </span>
        <Link className="button" to={`/book/${book.book.id}`} target="blank">
          Read More
        </Link>
      </div>
    </div>
  );
}

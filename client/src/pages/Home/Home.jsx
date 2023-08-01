import Card from "../../components/card/Card";
import "./home.scss";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../../axios";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { error, isLoading, data } = useQuery(
    ["books", submittedQuery],
    async () => {
      if (submittedQuery.trim() === "") {
        return [];
      }
      const res = await apiUrl.get(`book?q=${submittedQuery}`);
      return res.data;
    }
  );

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = () => {
    setSubmittedQuery(searchQuery);
  };

  return (
    <div className="home">
      <div className="search">
        <input type="text" onChange={handleChange} />
        <img src="/search.png" alt="" onClick={handleSubmit} />
      </div>
      <div className="HomeDesc">
        Get the best results when making your research....
      </div>
      <div className="searchItems">
        {isLoading ? (
          <div className="loader">
            <img src="/loader.png" alt="" />
          </div>
        ) : error ? (
          <div className="loader">
            <img src="/error.png" alt="" />
          </div>
        ) : (
          data.map((book) => <Card key={book.id} book={book} />)
        )}
      </div>
    </div>
  );
}

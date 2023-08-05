import Card from "../../components/card/Card";
import "./home.scss";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../../axios";
import { AuthContext } from "../../context/authContext";

export default function Home({ open, setOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { currentUser } = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    password: "",
    password_again: "",
  });

  const handlePassword = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (inputs.password.trim() === "") {
        alert("Please complete the form.");
        return;
      }
      if (inputs.password_again !== inputs.password) {
        alert("The password should be the same");

        return;
      }
      if (inputs.password.length < 5) {
        alert("each input should have more than 5 characters");
        return;
      }
      await apiUrl.put(`student/${currentUser._id}`, inputs);
      setOpen(!open);
      localStorage.setItem("user", null);
      window.location.reload();
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <>
      <div className="home">
        <div className="search">
          <input type="search" onChange={handleChange} />
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
      {open && (
        <div className="setPassword">
          <div className="container">
            <h1>Set new password</h1>
            <div className="inputs">
              <input
                type="password"
                placeholder="Password"
                id="password"
                name="password"
                min={5}
                value={inputs.password}
                onChange={handlePassword}
              />
              <input
                type="password"
                placeholder="Confrim"
                id="password_again"
                name="password_again"
                min={5}
                value={inputs.password_again}
                onChange={handlePassword}
              />
            </div>
            <button onClick={handlePasswordSubmit}>Set</button>
            <p onClick={() => setOpen(!open)}>X</p>
          </div>
        </div>
      )}
    </>
  );
}

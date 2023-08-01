import { useQuery } from "@tanstack/react-query";
import List from "../../components/list/List";
import "./books.scss";
import { apiUrl } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function Books() {
  const { currentUser } = useContext(AuthContext);
  const { error, isLoading, data } = useQuery(
    ["listbooks", currentUser],
    async () => {
      const res = await apiUrl.get(`book/list/${currentUser._id}`);
      return res.data;
    }
  );
  return (
    <div className="books">
      {isLoading
        ? "loading..."
        : error
        ? "error"
        : data.map((list) => <List key={list._id} list={list} />)}
    </div>
  );
}

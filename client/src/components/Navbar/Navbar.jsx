import { Link, useNavigate } from "react-router-dom";
import "./navbar.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div className="logo">
        <Link to={"/"}>📚</Link>
        {currentUser?.isAdmin && <p>Admin</p>}
      </div>
      {currentUser && (
        <div className="items">
          <span>
            <Link to={"/books"}>{currentUser.username}</Link>
          </span>
          {currentUser?.isAdmin && <Link className="link" to={"/admin"}>Add Book</Link>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

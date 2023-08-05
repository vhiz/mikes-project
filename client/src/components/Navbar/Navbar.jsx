import { Link, useNavigate } from "react-router-dom";
import "./navbar.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

export default function Navbar({ o, So }) {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <>
      <div className="navbar">
        <div className="logo">
          <Link to={"/"}>📚</Link>
          {currentUser?.isAdmin && <p>Admin</p>}
        </div>
        {!currentUser.passwordUpdated && (
          <div className="password">
            Update your password by clicking{" "}
            <b
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => So(!o)}
            >
              This
            </b>
          </div>
        )}
        {currentUser && (
          <div className="items">
            <span>
              <Link to={"/books"}>{currentUser.username}</Link>
            </span>
            {currentUser?.isAdmin && (
              <p className="link" onClick={() => setOpen(!open)}>
                ➕
              </p>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
      {open && (
        <div className="manage">
          <p onClick={() => setOpen(false)}>
            <Link to={"/addBook"}>Add Book</Link>
          </p>
          <p onClick={() => setOpen(false)}>
            <Link to={"/students"}>Manage Students'</Link>
          </p>
          <p onClick={() => setOpen(false)}>
            <Link to={"/adminBooks"}>Manage Books'</Link>
          </p>
        </div>
      )}
    </>
  );
}

import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
export default function Login() {
  const [lock, setLock] = useState(true);
  const { login } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (inputs.username.trim() === "" || inputs.password.trim() === "") {
        alert("Please complete the form.");
        setLoading(false);
        return;
      }
      await login(inputs);
      setError(false)
      navigate("/");
    } catch (error) {
      setError(error.response.data.error);
    }
    setLoading(false);
  };
  return (
    <div className="login">
      <div className="contanier">
        <div className="item">
          <h1>Login</h1>
          <div className="inputs">
            <input
              type="text"
              placeholder="John"
              id="username"
              name="username"
              value={inputs.username}
              onChange={handleChange}
              required
            />
            <div className="lock">
              <input
                type={lock ? "password" : "text"}
                placeholder="Password"
                id="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
              />
              <img
                src={lock ? "/lock.png" : "nolock.png"}
                alt=""
                onClick={() => {
                  setLock(!lock);
                }}
              />
            </div>
            <button onClick={handleClick}>Login</button>
            <p>{error ? error : loading ? "Loading..." : null}</p>
          </div>
          <span>
            Don't have an account? <Link to={"/register"}>Register</Link>
          </span>
        </div>
        <div className="item">
          <h1>Get The Best Resources From Our Free Open Library</h1>
        </div>
      </div>
    </div>
  );
}

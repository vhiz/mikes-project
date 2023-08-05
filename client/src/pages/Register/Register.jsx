import { useState } from "react";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../../axios";

export default function Register() {
  const [lock, setLock] = useState(true);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    password_again: "",
    adminPass: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (
        inputs.username.trim() === "" ||
        inputs.password.trim() === "" ||
        inputs.adminPass.trim() === ""
      ) {
        alert("Please complete the form.");
        setLoading(false);
        return;
      }
      if (inputs.password_again !== inputs.password) {
        alert("The password should be the same");
        setLoading(false);
        return;
      }
      if (inputs.username.length < 5 || inputs.password.length < 5) {
        alert("each input should have more than 5 characters");
        return;
      }
      await apiUrl.post("auth/adminReg", inputs);

      navigate("/login");
      setLoading(false);
    } catch (error) {
      setError(error.response.data);
    }
    setLoading(false);
  };

  return (
    <div className="register">
      <div className="contanier">
        <div className="item">
          <h1>Register Admin</h1>
          <div className="inputs">
            <input
              type="text"
              placeholder="John"
              id="username"
              name="username"
              value={inputs.username}
              min={5}
              onChange={handleChange}
              required
            />
            <div className="lock">
              <input
                type={lock ? "password" : "text"}
                placeholder="Password"
                id="password"
                name="password"
                min={5}
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
            <input
              type={lock ? "password" : "text"}
              placeholder="Password Again"
              id="password_again"
              name="password_again"
              min={5}
              value={inputs.password_again}
              onChange={handleChange}
            />
            <input
              type={lock ? "password" : "text"}
              placeholder="Key"
              id="adminPass"
              name="adminPass"
              min={5}
              value={inputs.adminPass}
              onChange={handleChange}
            />

            <button onClick={handleSubmit}>Register</button>
            {error && error}
          </div>
          <span>
            Already signed up? <Link to={"/login"}>login</Link>
          </span>
        </div>
        <div className="item">
          <h1>
            You must have a key to register as an admin or meet an admin to
            create your account
          </h1>
        </div>
      </div>
    </div>
  );
}

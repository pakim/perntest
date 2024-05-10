import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye } from "react-icons/fa";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageDisplayed, setMessageDisplayed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        username: username,
        password: password,
      });
      console.log(response);
      navigate("/");
    } catch (err) {
      console.error(err.message);
      setMessage("Incorrect Password");
      setMessageDisplayed(true);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        {messageDisplayed && (
          <div className="error-message">
            <span>{message}</span>
          </div>
        )}
        <div className="username-input input">
          <FaUser />
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
            name="username"
            placeholder="Username"
            required
          />
        </div>
        <div className="password-input input">
          <FaLock />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
          />
          <FaEye
            className="show-password"
            size={20}
            onClick={() => {
              setShowPassword(prev => !prev);
            }}
          />
        </div>
        <button type="submit">Login</button>
        <Link to="/register" className="link">
          Don't have an account?
        </Link>
      </form>
    </div>
  );
};

export default Login;

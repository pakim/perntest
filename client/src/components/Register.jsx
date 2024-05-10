import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./Login.css";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageDisplayed, setMessageDisplayed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // Use if server uses urlencoded middleware:
      // const params = new URLSearchParams({
      //   email: email,
      //   username: username,
      //   password: password,
      // });
      const response = await axios.post("/api/register", {
        email: email,
        username: username,
        password: password,
      });
      console.log(response);

      navigate("/");
    } catch (err) {
      console.error(err.message);
      setMessage(err.response.data);
      setMessageDisplayed(true);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        {messageDisplayed && (
          <div className="error-message">
            <span>{message}</span>
          </div>
        )}
        <div className="email-input input">
          <MdEmail size={18} />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            name="email"
            placeholder="Email"
            required
          />
        </div>
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
        <button type="submit">Register</button>
        <Link to="/login" className="link">
          Already have an account?
        </Link>
      </form>
    </div>
  );
};

export default Register;

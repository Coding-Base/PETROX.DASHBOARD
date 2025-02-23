import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import image from "./Logo.png";
import "./styles.css";

const Signup = () => {
  const [username, setUsername] = useState("");  // Changed from fullName to username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://petrox-dashboard-backend.onrender.com/api/signup/", {
        username,  // Send username here
        email,
        password,
      });
      alert("Account created successfully");
      // Redirect to the login page after successful signup
      navigate("/login");
    } catch (error) {
      alert("Error creating account, ensure there is no spacing between your username");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}>
          <div style={{
            color: "#fff",
            fontSize: "2rem",
            fontWeight: "bold",
          }}>
            Loading...
          </div>
        </div>
      )}
      <img className="petroxlogo" src={image} alt="petroxlogo" />
      <h2 style={{ fontSize: "40px", fontWeight: "400" }}>Create an Account</h2>
      <p>
        By using our services, you agree to our <strong>Terms</strong> and{" "}
        <strong>Privacy Statement</strong>.
      </p>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="password" placeholder=" Confirm Password" />
        <p className="message"></p>
        <p>
          Already have an account? <Link to="/login">Sign in</Link>.
        </p>
        <button style={{ width: "100%" }} type="submit">
          Create Account
        </button>
        <div className="square-small"></div>
        <div className="square"></div>
      </form>
      <div className="circle large"></div>
      <div className="circle medium"></div>
      <div className="circle small"></div>
      <div className="triangle"></div>
      <div className="triangle-small"></div>
      <div className="square"></div>
      <div className="square"></div>
    </div>
  );
};

export default Signup;

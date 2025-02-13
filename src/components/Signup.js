import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import image from "./Logo.png";
import "./styles.css";

const Signup = () => {
  const [username, setUsername] = useState("");  // Changed from fullName to username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://petrox-dashboard-backend.onrender.com/api/signup/", {
        username,  // Send username here
        email,
        password,
      });
      alert("Account created successfully");
      navigate("/");
    } catch (error) {
      alert("Error creating account, ensure there is no spacing between your username");
    }
  };

  return (
    <div className="container">
      <img className="petroxlogo" src={image} alt="petroxlogo" />
      <h2 style={{ fontSize: "40px", fontWeight: "400" }}>Create an Account</h2>
      {/* <div className="triangle"></div><div className="square"></div> */}
      
      <p>
        By using our services, you agree to our <strong>Terms</strong> and{" "}
        <strong>Privacy Statement</strong>.
      </p>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"  // Changed from "Full Name" to "Username"
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
        {/* <div className="square"></div> */}
        <p>
          Already have an account? <Link to="/">Sign in</Link>.
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
      <div className="vector">
        <svg
          width="46"
          height="36"
          viewBox="0 0 46 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 18L43 18M3 18L14.4286 3M3 18L14.4286 33"
            stroke="black"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="triangle-small"></div>
      {/* <div className="triangle small"></div> */}
      <div className="square"></div>
      {/* <div className="rectangle"></div> */}
      <div className="square"></div>
    </div>
  );
};

export default Signup;

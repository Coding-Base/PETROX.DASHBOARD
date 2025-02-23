import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import image from './Logo.png';
import "./styles.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://petrox-dashboard-backend.onrender.com/api/login/", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
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
      <img className="petroxlogo" src={image} alt="petroxlogo"/>
      <h2 className="h3">Sign In</h2>
      <p>
        By using our services, you agree to our <strong>Terms</strong> and <strong>Privacy Statement</strong>.
      </p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a
          style={{
            width: '174px',
            height: '24px',
            color: '#000000',
            fontSize: '20px',
            fontWeight: '600',
            lineHeight: '24px',
            marginRight: '56%',
            position: 'relative'
          }}
          href="#forget"
        >
          Forgot Password?
        </a>
        <br /><br /><br /><br />
        <button style={{ width: '100%', background: '#0404F2' }} type="submit">
          Login
        </button>
        <p style={{ color: '#000000', fontWeight: '500' }}>
          New Here? <Link style={{ fontWeight: '500' }} to="/signup">Create an account</Link>.
        </p>
      </form>
      <div className="circle large"></div>
      <div className="circle medium"></div>
      <div className="circle small"></div>
      <div className="triangle"></div>
      <div className="sign-triangle"></div>
      <div className="square"></div>
    </div>
  );
};

export default Login;

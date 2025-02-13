import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import image from './Logo.png';
import "./styles.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="container">
      <img className="petroxlogo" src={image} alt="petroxlogo"/>
      <h2 className="h3" >Sign In</h2>
      <p>By using our services, you agree to our <strong>Terms</strong> and <strong>Privacy Statement</strong>.</p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br></br>
       
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a style={{width:'174px',height:'24px', color:'#000000', fontSize:'20px', fontWeight:'600', lineHeight:'24px', marginRight:'56%', position:'relative,'}} href="#forget">Forgot Password?</a>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <button style={{width:'100%', background:'#0404F2'}} type="submit">Login</button>
        <p style={{color:'#000000',fontWeight:'500'}}>
    New Here? <a  style={{fontWeight:'500'}} href="/signup">Create an accounts</a>.
  </p>
      </form>
      <div class="circle large"></div>
<div className="circle medium"></div>
<div className="circle small"></div>
<div className="triangle"></div>
<div className="sign-triangle" ></div>
<div className="vector"><svg width="46" height="36" viewBox="0 0 46 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 18L43 18M3 18L14.4286 3M3 18L14.4286 33" stroke="black" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
<div className="square"></div>
    </div>
  );
};

export default Login;

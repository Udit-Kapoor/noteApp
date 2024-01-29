// src/Login.js
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const history = useHistory();
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });

      if (response.data.status) {
        document.cookie = `authToken=${response.data.token}; path=/; secure; SameSite=None`;
        toast.success("Logged-In Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        history.push("/dashboard");
      } else {
        console.error("Login failed:", response.data);
        toast.error('Invalid credentials. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset input values on failed login
      setUsername('');
      setPassword('');
      }
    } catch (error) {
        toast.error('Invalid credentials. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset input values on failed login
      setUsername('');
      setPassword('');
      console.error("Login failed:", error.response.data);
    }  
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:4000/signup", {
        email,
        password,
      });

      if (response.data.status) {
        document.cookie = `authToken=${response.data.token}; path=/; secure; SameSite=None`;
        toast.success("SignedUp Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        history.push("/dashboard");
      } else {
        console.error("Signup failed:", response.data);
        toast.error("Can not SignUp at the moment.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Backend-Server might be asleep. Try Again in a minute", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to NoteX</h2>
      <form>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Pass:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        <button
          style={{marginTop: "10px"}}
          type="button"
          onClick={handleSignup}
        >
          SignUp
        </button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { login as apiLogin } from "./api";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await apiLogin(username, password);
      await login();
      navigate("/");
    } catch (e) {
      setError("Invalid login credentials");
    }
  }

  return (
    <div className="login-container" style={{ maxWidth: 350, margin: "auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" placeholder="Username" value={username}
          onChange={e => setUsername(e.target.value)}
          required autoFocus className="input"
        />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required className="input"
        />
        <button className="btn btn-large" type="submit" style={{ marginTop: 15, width: "100%" }}>Log In</button>
      </form>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
    </div>
  );
}

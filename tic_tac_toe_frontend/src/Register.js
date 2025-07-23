import React, { useState } from "react";
import { register as apiRegister } from "./api";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await apiRegister(username, password);
      setRegistered(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (e) {
      setError("Registration failed (username may already exist)");
    }
  }

  return (
    <div className="register-container" style={{ maxWidth: 350, margin: "auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" placeholder="Username" value={username}
          onChange={e => setUsername(e.target.value)} required className="input"
        />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required className="input"
        />
        <button className="btn btn-large" type="submit" style={{ marginTop: 15, width: "100%" }}>Register</button>
        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
        {registered && <div style={{ color: "green", marginTop: 12 }}>Registration successful! Redirecting…</div>}
      </form>
    </div>
  );
}

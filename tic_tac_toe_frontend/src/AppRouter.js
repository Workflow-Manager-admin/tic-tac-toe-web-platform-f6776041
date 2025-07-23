import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./Login";
import Register from "./Register";
import Game from "./Game";
import Leaderboard from "./Leaderboard";
import History from "./History";

// PUBLIC_INTERFACE
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar" style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", padding: "1rem 2rem" }}>
      <Link to="/" className="navbar-brand" style={{ fontWeight: 700, fontSize: "2rem", color: "var(--text-primary)" }}>TicTacToe</Link>
      <div>
        <Link to="/" className="navbar-link">Game</Link>
        <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
        {user && <Link to="/history" className="navbar-link">History</Link>}
        {!user && <Link to="/login" className="navbar-link">Login</Link>}
        {!user && <Link to="/register" className="navbar-link">Register</Link>}
        {user && <span className="navbar-user" style={{ marginLeft: 20, marginRight: 6, color: "var(--text-secondary)" }}>Hi, {user.username}</span>}
        {user && <button className="btn" onClick={onLogout}>Logout</button>}
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

// PUBLIC_INTERFACE
export default function AppRouter() {
  return (
    <Router>
      <Navbar />
      <div className="container" style={{ marginTop: 20 }}>
        <Routes>
          <Route path="/" element={
            <RequireAuth>
              <Game />
            </RequireAuth>
          }/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/history" element={
            <RequireAuth>
              <History />
            </RequireAuth>
          }/>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

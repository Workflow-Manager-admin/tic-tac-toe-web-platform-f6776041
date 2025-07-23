import React, { useEffect, useState } from "react";
import { fetchGameHistory } from "./api";

// PUBLIC_INTERFACE
export default function History() {
  const [games, setGames] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchGameHistory()
      .then(setGames)
      .catch(() => setErr("Could not load history"));
  }, []);

  return (
    <div className="history-container" style={{ maxWidth: 600, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Game History</h2>
      {err && <div style={{ color: "red" }}>{err}</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {games.length === 0 && <li>No games played yet.</li>}
        {games.map((g, i) => (
          <li key={g.id}
            style={{
              border: "1px solid var(--border-color)",
              padding: "10px 16px", margin: "12px 0",
              borderRadius: 8,
              background: "var(--bg-secondary)"
            }}
          >
            <b>Date:</b> {new Date(g.finish_date || g.start_date).toLocaleString()}<br/>
            <b>Opponent:</b> {g.opponent || <i>AI</i>}<br/>
            <b>Result:</b> {g.result}<br/>
            <b>Mode:</b> {g.mode === "pvp" ? "Player vs Player" : "Player vs AI"}
          </li>
        ))}
      </ul>
    </div>
  );
}

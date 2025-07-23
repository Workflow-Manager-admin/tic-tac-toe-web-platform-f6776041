import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "./api";

// PUBLIC_INTERFACE
export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchLeaderboard()
      .then(setLeaders)
      .catch(() => setErr("Could not load leaderboard"));
  }, []);

  return (
    <div className="leaderboard-container" style={{ maxWidth: 500, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Leaderboard</h2>
      {err && <div style={{ color: "red" }}>{err}</div>}
      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Rank</th>
            <th style={{ textAlign: "left" }}>Player</th>
            <th style={{ textAlign: "right" }}>Wins</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, i) => (
            <tr key={user.username}>
              <td>{i + 1}</td>
              <td>{user.username}</td>
              <td style={{ textAlign: "right" }}>{user.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

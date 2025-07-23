import React, { useState, useEffect } from "react";
import { startGame, makeMove, fetchMe } from "./api";

const EMPTY_BOARD = Array(9).fill(null);

// Utility for AI move (naive random)
function aiMove(board) {
  const emptyCells = [];
  board.forEach((cell, idx) => {
    if (!cell) emptyCells.push(idx);
  });
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// PUBLIC_INTERFACE
export default function Game() {
  const [me, setMe] = useState(null);
  const [mode, setMode] = useState("ai"); // 'ai' or 'pvp'
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [yourTurn, setYourTurn] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // On mount, fetch the user profile
  useEffect(() => {
    fetchMe().then(setMe).catch(() => setMe(null));
  }, []);

  // Start or restart game handler
  async function start(modeValue = mode) {
    setLoading(true);
    setResult(null);
    try {
      const resp = await startGame(modeValue, modeValue === "pvp" ? null : "ai");
      setGame(resp.game);
      setBoard(resp.game.board || EMPTY_BOARD);
      setYourTurn(resp.game.current_turn === resp.game.your_symbol);
      setMode(modeValue);
    } catch (e) {
      setApiError("Could not start new game.");
    } finally {
      setLoading(false);
    }
  }

  // Handle cell click
  async function onCellClick(idx) {
    if (board[idx] || result || loading || !yourTurn) return;
    setLoading(true);
    setApiError("");
    try {
      const resp = await makeMove(game.id, idx);
      setGame(resp.game);
      setBoard(resp.game.board);
      setResult(resp.game.result); // e.g. 'win', 'draw', etc. or null
      setYourTurn(resp.game.current_turn === resp.game.your_symbol); // Update turn
    } catch (e) {
      setApiError("Move failed.");
    } finally {
      setLoading(false);
    }
  }

  function selectMode(newMode) {
    setMode(newMode);
    start(newMode);
  }

  // On first mount, start a game (default mode)
  useEffect(() => {
    start("ai");
    // eslint-disable-next-line
  }, []);

  return (
    <div className="game-container" style={{
      maxWidth: 700, margin: "auto",
      display: "flex", flexDirection: "column", alignItems: "center"
    }}>
      <h2>Tic Tac Toe Game</h2>
      <div style={{
        display: "flex", gap: 20, margin: "15px 0",
        justifyContent: "center", alignItems: "center"
      }}>
        <button
          className={mode === "ai" ? "btn btn-large" : "btn"}
          onClick={() => selectMode("ai")}
        >Player vs AI</button>
        <button
          className={mode === "pvp" ? "btn btn-large" : "btn"}
          onClick={() => selectMode("pvp")}
        >Player vs Player</button>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 65px)",
        gridTemplateRows: "repeat(3, 65px)",
        gap: 8,
        margin: "32px 0"
      }}>
        {board.map((cell, idx) => (
          <div
            key={idx}
            className="tic-cell"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "2px solid var(--border-color)",
              borderRadius: 8,
              height: 65,
              width: 65,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
              cursor: (!cell && !result && yourTurn && !loading) ? "pointer" : "default"
            }}
            onClick={() => onCellClick(idx)}
          >
            {cell}
          </div>
        ))}
      </div>
      {apiError && <div style={{ color: "red" }}>{apiError}</div>}
      <div style={{ margin: "10px 0" }}>
        {result ? (
          <span>
            {result === "win" && <b style={{ color: "green" }}>You Win!</b>}
            {result === "lose" && <b style={{ color: "red" }}>You Lose!</b>}
            {result === "draw" && <b>Draw</b>}
          </span>
        ) : (
          <span>
            {loading
              ? "Waiting..."
              : (yourTurn ? <b>Your Turn</b> : <span>Opponent's Turn</span>)
            }
          </span>
        )}
      </div>
      <button className="btn" onClick={() => start()} style={{ marginTop: 20 }}>
        {result ? "Play Again" : "Restart"}
      </button>
    </div>
  );
}

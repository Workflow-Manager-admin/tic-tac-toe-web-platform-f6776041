//
// API utility functions for interacting with the FastAPI backend
//

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

/**
 * Helper to get current token from localStorage.
 */
export function getToken() {
  return localStorage.getItem('tic_token');
}

/**
 * Helper to set the token.
 */
export function setToken(token) {
  localStorage.setItem('tic_token', token);
}

/**
 * Helper to clear the token.
 */
export function clearToken() {
  localStorage.removeItem('tic_token');
}

/**
 * Authenticated fetch wrapper.
 */
async function authFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    ...options.headers,
  };
  const resp = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (resp.status === 401) {
    clearToken();
    throw new Error('Unauthorized');
  }
  return resp;
}

// PUBLIC_INTERFACE
export async function login(username, password) {
  // Returns {access_token, user info...}
  const resp = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!resp.ok) throw new Error('Login failed');
  const data = await resp.json();
  setToken(data.access_token);
  return data;
}

// PUBLIC_INTERFACE
export async function register(username, password) {
  const resp = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!resp.ok) throw new Error('Registration failed');
  return await resp.json();
}

// PUBLIC_INTERFACE
export async function fetchMe() {
  const resp = await authFetch('/auth/me');
  if (!resp.ok) throw new Error('Not authenticated');
  return await resp.json();
}

// PUBLIC_INTERFACE
export async function fetchLeaderboard() {
  const resp = await fetch(`${API_BASE}/leaderboard`);
  if (!resp.ok) throw new Error('Failed to fetch leaderboard');
  return await resp.json();
}

// PUBLIC_INTERFACE
export async function fetchGameHistory() {
  const resp = await authFetch('/games/history');
  if (!resp.ok) throw new Error('Failed to fetch history');
  return await resp.json();
}

// PUBLIC_INTERFACE
export async function startGame(mode, opponent = null) {
  // mode: "pvp" or "ai"
  const resp = await authFetch('/games/start', {
    method: 'POST',
    body: JSON.stringify({ mode, opponent }),
  });
  if (!resp.ok) throw new Error('Failed to start game');
  return await resp.json();
}

// PUBLIC_INTERFACE
export async function makeMove(gameId, cellIdx) {
  const resp = await authFetch(`/games/${gameId}/move`, {
    method: 'POST',
    body: JSON.stringify({ cell: cellIdx }),
  });
  if (!resp.ok) throw new Error('Failed to make move');
  return await resp.json();
}


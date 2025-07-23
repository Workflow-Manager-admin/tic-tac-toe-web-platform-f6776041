import React, { useState, useEffect, createContext, useContext } from "react";
import { getToken, fetchMe, clearToken } from "./api";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists and validate upon mount
  useEffect(() => {
    async function validateSession() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await fetchMe();
        setUser(me);
      } catch (e) {
        clearToken();
        setUser(null);
      }
      setLoading(false);
    }
    validateSession();
  }, []);

  // PUBLIC_INTERFACE
  const login = async (tokenOrData) => {
    // Could be called after successful login()
    const me = await fetchMe();
    setUser(me);
  };

  // PUBLIC_INTERFACE
  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

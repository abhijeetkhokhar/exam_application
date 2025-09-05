import React, { useMemo, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../contexts/authContext";

// Constants
const TOKEN_KEY = "token";
const USER_KEY = "user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return typeof window !== "undefined"
        ? sessionStorage.getItem(TOKEN_KEY) || null
        : null;
    } catch (error) {
      console.error("Error reading auth token:", error);
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const userData = sessionStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
      }
      return null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  });

  // Handle token changes
  useEffect(() => {
    try {
      if (token) {
        sessionStorage.setItem(TOKEN_KEY, token);
      } else {
        sessionStorage.removeItem(TOKEN_KEY);
      }
    } catch (error) {
      console.error("Error updating token in sessionStorage:", error);
    }
  }, [token]);

  // Handle user changes
  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(USER_KEY);
      }
    } catch (error) {
      console.error("Error updating user in sessionStorage:", error);
    }
  }, [user]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      setToken,
      user,
      setUser,
      logout,
    }),
    [token, user, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

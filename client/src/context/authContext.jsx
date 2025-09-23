import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Logout
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/checkToken",
          { withCredentials: true }
        );

        if (res.data.loggedIn) {
          setIsLoggedIn(true);
          setUser(res.data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.log(`Error checking Auth ---- ${error}`);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

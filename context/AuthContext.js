"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Box, Skeleton } from "@chakra-ui/react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sansadapptoken");
    const userData = localStorage.getItem("sansadappuser");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setAccessToken(token);
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("sansadapptoken", token);
    localStorage.setItem("sansadappuser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("sansadapptoken");
    localStorage.removeItem("sansadappuser");
    setUser(null);
  };

  if (loading) {
    return (
      <Box p={8}>
        <Skeleton height="70vh" mt={"8vh"} />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

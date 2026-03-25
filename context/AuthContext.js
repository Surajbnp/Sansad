"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

const AuthContext = createContext();

const PUBLIC_ROUTES = ["/", "/signup", "/login", "/ticket-status"];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  /* ------------------ LOGOUT ------------------ */
  const logout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  /* ------------------ BOOTSTRAP AUTH ------------------ */
  useEffect(() => {
    const bootstrapAuth = async () => {
      setLoading(true);
      try {
        // always call — if cookie exists backend returns user, if not returns 401
        const res = await fetch("/api/user/get");
        const data = await res.json();
        setUser(res.ok ? data.user : null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [pathname]);

  /* ------------------ LOGIN ------------------ */
  const login = async () => {
    const res = await fetch("/api/user/get");
    const data = await res.json();
    setUser(res.ok ? data.user : null);
  };

  /* ------------------ LOADING UI ------------------ */
  // only block render on protected routes — public pages load instantly
  if (loading && !isPublicRoute) {
    return (
      <Box p={8}>
        <Skeleton height="70vh" mt="8vh" />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

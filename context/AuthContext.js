"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Box, Skeleton, useToast } from "@chakra-ui/react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

/* 🌍 Routes that DO NOT require login */
const PUBLIC_ROUTES = ["/", "/login", "/ticket-status"];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  /* ------------------ HELPERS ------------------ */
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const logout = () => {
    localStorage.removeItem("sansadapptoken");
    setUser(null);
    setAccessToken(null);
  };

  /* ------------------ BOOTSTRAP AUTH ------------------ */
  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem("sansadapptoken");

      /* 🌍 Public route → skip auth */
      if (isPublicRoute) {
        setLoading(false);
        return;
      }

      /* 🔒 Protected route but no token */
      if (!token) {
        router.replace("/login");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/user/get", {
          headers: { authorization: token },
        });

        if (res.status === 401) {
          throw new Error("SESSION_EXPIRED");
        }

        const data = await res.json();

        setUser(data.user);
        setAccessToken(token);
      } catch (err) {
        logout();

        toast({
          title: "Session expired",
          description: "Please login again",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });

        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [pathname]); // 👈 re-run when route changes

  /* ------------------ LOGIN ------------------ */
  const login = (userData, token) => {
    localStorage.setItem("sansadapptoken", token);
    setUser(userData);
    setAccessToken(token);
  };

  /* ------------------ LOADING UI ------------------ */
  if (loading) {
    return (
      <Box p={8}>
        <Skeleton height="70vh" mt="8vh" />
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

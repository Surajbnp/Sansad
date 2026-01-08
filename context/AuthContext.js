"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Box, Skeleton, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  console.log("calling authprovider");

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem("sansadapptoken");
      if (!token) {
        router.push("/login");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/user/get", {
          headers: { authorization: token },
        });

        if (res.status === 401) {
          router.push("/login");
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

        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("sansadapptoken", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("sansadapptoken");
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

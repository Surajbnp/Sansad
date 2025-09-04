"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {  useToast } from "@chakra-ui/react";

const privateRoutes = ["/profile", "/tickets"];

const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const toast = useToast();

    useEffect(() => {
      if (!loading && !user && privateRoutes.includes(pathname)) {
        toast({
          title: "Unauthorized",
          description: "Please login to continue.",
          status: "warning",
          duration: 6000,
          isClosable: true,
        });
        router.push("/login");
      }
    }, [user, loading, pathname]);

    if (!user && privateRoutes.includes(pathname)) return null;

    return <Component {...props} />;
  };
};

export default withAuth;

"use client";

import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,

  colors: {
    brand: {
      primary: "#fa7602",
    },
  },

  components: {
    Input: {
      baseStyle: {
        field: {
          _focus: {
            borderColor: "brand.primary",
            boxShadow: "0 0 0 1px #fa7602",
          },
          _focusVisible: {
            borderColor: "brand.primary",
            boxShadow: "0 0 0 1px #fa7602",
          },
        },
      },
    },
    Textarea: {
      baseStyle: {
        field: {
          _focus: {
            borderColor: "brand.primary",
            boxShadow: "0 0 0 0.4px #fa7602",
          },
          _focusVisible: {
            borderColor: "brand.primary",
            boxShadow: "0 0 0 0.4px #fa7602",
          },
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          _focus: {
            borderColor: "brand.primary",
            boxShadow: "0 0 0 1px #fa7602",
          },
          _focusVisible: {
            borderColor: "brand.primary",
            boxShadow: "0 0 0 1px #fa7602",
          },
        },
      },
    },
  },
});

const NO_FOOTER_ROUTES = ["/login", "/signup"];

export default function Providers({ children }) {
  const pathname = usePathname();
  const showFooter = !NO_FOOTER_ROUTES.includes(pathname);

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Box>
          <Navbar />
        </Box>
        {children}
        {showFooter && <Footer />}
      </AuthProvider>
    </ChakraProvider>
  );
}
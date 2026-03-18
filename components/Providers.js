"use client";

import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
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

export default function Providers({ children }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Box>
          <Navbar />
        </Box>
        {children}
        <Footer />
      </AuthProvider>
    </ChakraProvider>
  );
}
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import NProgressLoader from "@/components/NProgressLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <Box>
              <Navbar />
            </Box>
            <NProgressLoader />
            {children}
            <Footer />
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}

export default RootLayout;

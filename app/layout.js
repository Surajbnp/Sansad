// "use client";

// import { Geist, Geist_Mono } from "next/font/google";
// import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { AuthProvider } from "@/context/AuthContext";
// import NProgressLoader from "@/components/NProgressLoader";

// export const metadata = {
//   icons: {
//     icon: "/SSASatna_Favicon_Color.png",
//   },
// };

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const config = {
//   initialColorMode: "light",
//   useSystemColorMode: false,
// };

// const theme = extendTheme({
//   config,

//   colors: {
//     brand: {
//       primary: "#fa7602",
//     },
//   },

//   components: {
//     Input: {
//       baseStyle: {
//         field: {
//           _focus: {
//             borderColor: "brand.primary",
//             boxShadow: "0 0 0 1px #fa7602",
//           },
//           _focusVisible: {
//             borderColor: "brand.primary",
//             boxShadow: "0 0 0 1px #fa7602",
//           },
//         },
//       },
//     },
//     Textarea: {
//       baseStyle: {
//         field: {
//           _focus: {
//             borderColor: "brand.primary",
//             boxShadow: "0 0 0 0.4px #fa7602",
//           },
//           _focusVisible: {
//             borderColor: "brand.primary",
//             boxShadow: "0 0 0 0.4px #fa7602",
//           },
//         },
//       },
//     },
//     Select: {
//       baseStyle: {
//         field: {
//           _focus: {
//             borderColor: "brand.primary",
//             boxShadow: "0 0 0 1px #fa7602",
//           },
//           _focusVisible: {
//             borderColor: "brand.primary",
//             boxShadow: "0 0 0 1px #fa7602",
//           },
//         },
//       },
//     },
//   },
// });

// function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         <script
//           src="https://upload-widget.cloudinary.com/latest/global/all.js"
//           type="text/javascript"
//         ></script>
//       </head>
//       <body className={`${geistSans.variable} ${geistMono.variable}`}>
//         <ChakraProvider theme={theme}>
//           <AuthProvider>
//             <Box>
//               <Navbar />
//             </Box>
//             <NProgressLoader />
//             {children}
//             <Footer />
//           </AuthProvider>
//         </ChakraProvider>
//       </body>
//     </html>
//   );
// }

// export default RootLayout;


import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  icons: {
    icon: "/SSASatna_Favicon_Color.ico",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://upload-widget.cloudinary.com/latest/global/all.js"
          type="text/javascript"
        ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
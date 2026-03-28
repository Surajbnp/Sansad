import { Geist, Geist_Mono, Khand, Mukta } from "next/font/google";
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

const khand = Khand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-khand",
});

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mukta",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${khand.variable} ${mukta.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export default RootLayout;
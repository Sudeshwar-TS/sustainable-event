import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { ToastProvider } from "../components/ToastContext";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "SustainaWed",
  description: "AI-powered sustainable wedding management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${playfair.variable} antialiased`}>
        <ToastProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-5xl px-6">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}

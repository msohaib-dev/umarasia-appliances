import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { PageTransition } from "@/components/layout/page-transition";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ToastViewport } from "@/components/ui/toast-viewport";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  title: "UmarAsia-Appliances",
  description:
    "Engineering-grade DC electronics appliances for practical buyers across Pakistan."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <ToastViewport />
      </body>
    </html>
  );
}


"use client";

import { ThemeProvider } from "@emotion/react";
import "./globals.css";
import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import theme from "../../config/theme";
import NavBarComponent from "./navbar/NavBarComponent";
import FooterComponent from "./footer/FooterComponent";

const mulish = Mulish({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={mulish.className}>
        <ThemeProvider theme={theme}>
          <NavBarComponent />
          <div className="px-[1em] py-[1em] lg:px-[15em] lg:py-[3em]">
            {children}
          </div>
          <FooterComponent />
        </ThemeProvider>
      </body>
    </html>
  );
}

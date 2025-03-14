"use client";

import "./globals.css";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-gray-900`}>
        <Provider store={store}> {/* Wrap with Redux Provider */}
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
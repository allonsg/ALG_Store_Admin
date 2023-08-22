import React from "react";

import NextAuthSessionProvider from "./components/NextAuthSessionProvider";

import "./globals.css";

export const metadata = {
  title: "ALG_Store",
  description: "Ecommerce project",
};

interface RootLayout {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayout> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;

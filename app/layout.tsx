import React from "react";

import Provider from "./components/Provider";

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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
};

export default RootLayout;

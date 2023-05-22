"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

interface IProvederProps {
  children: React.ReactNode;
}

const Provider: React.FC<IProvederProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Provider;

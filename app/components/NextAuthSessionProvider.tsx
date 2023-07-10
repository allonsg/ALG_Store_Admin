"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

interface IProviderProps {
  children?: React.ReactNode;
}

const NextAuthSessionProvider: React.FC<IProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthSessionProvider;

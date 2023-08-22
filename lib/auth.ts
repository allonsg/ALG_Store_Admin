import type { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const adminEmails = ["vl0805tttui@gmail.com"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user, newSession }) => {
      if (session?.user?.email && adminEmails.includes(session.user.email)) {
        return session;
      } else {
        return false as unknown as DefaultSession;
      }
    },
  },
};

export const isAdminRequest = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
    //todo Add error handler
    throw "not authorized";
  }
};

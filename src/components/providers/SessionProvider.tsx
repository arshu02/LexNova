"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
};

export const SessionProvider = NextAuthProvider;
export default NextAuthProvider;

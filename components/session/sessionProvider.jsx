"use client";

import { SessionProvider } from "next-auth/react";

export const ClientSessionProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

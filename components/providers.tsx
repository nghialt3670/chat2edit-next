"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

interface ProvidersProps extends SessionProviderProps, ThemeProviderProps {}

export function Providers({ children, session, ...props }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </SessionProvider>
  );
}

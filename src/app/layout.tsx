import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '@/components/providers'

import '@radix-ui/themes/styles.css'

import './globals.css'
import AppBar from '@/components/app-bar'
import { Separator } from '@radix-ui/themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chat2Edit'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers attribute="class">
            <AppBar />
            <Separator orientation="horizontal" />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}

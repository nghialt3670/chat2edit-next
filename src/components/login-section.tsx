import { Button, Stack } from '@mui/material'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

export default function LoginSection({ className }: ComponentProps<'section'>) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL

  return (
    <section className={cn(className, 'flex justify-center items-center')}>
      <SignedOut>
        <Stack direction="row">
          <SignInButton mode="modal" fallbackRedirectUrl={baseURL}>
            <Button color="primary" sx={{ textWrap: 'nowrap' }}>
              Log In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" fallbackRedirectUrl={baseURL}>
            <Button color="inherit" sx={{ textWrap: 'nowrap' }}>
              Sign Up
            </Button>
          </SignUpButton>
        </Stack>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl={baseURL} />
      </SignedIn>
    </section>
  )
}

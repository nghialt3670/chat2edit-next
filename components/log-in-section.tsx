"use client";

import { ComponentProps, useTransition } from "react";

import { cn } from "@/utils/client/styling";
import { Button } from "@/components/ui/button";
import UserOptions from "@/components/user-options";
import { Skeleton } from "@/components/ui/skeleton";
import { signIn, useSession } from "next-auth/react";

export default function LogInSection({ className }: ComponentProps<"section">) {
  const { data: session, status } = useSession();

  const renderContent = () => {
    switch (status) {
      case "authenticated":
        return <UserOptions className="mr-2" user={session.user!} />;
      case "loading":
        return <Skeleton className="size-6 rounded-full" />;
      case "unauthenticated":
        return (
          <Button
            className="h-8"
            size={"sm"}
            onClick={async () => await signIn()}
          >
            Log In
          </Button>
        );
    }
  };

  return (
    <section
      className={cn("flex justify-center items-center space-x-2", className)}
    >
      {renderContent()}
    </section>
  );
}

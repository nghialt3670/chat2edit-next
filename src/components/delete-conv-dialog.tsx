import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

import React, { useRef, useState, useTransition } from "react";
import IconButton from "./icon-button";
import { deleteConversation } from "@/actions/deleteConversation";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DeleteConvDialog({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState<boolean>(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      const isDeleted = await deleteConversation(id);
      if (isDeleted) {
        if (pathname.endsWith(id)) router.push("/chat")
        if (cancelButtonRef.current) cancelButtonRef.current.click();
      } else {
        setIsError(true); 
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <IconButton>
          <Trash2 />
        </IconButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            conversation and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Can not delete the conversation. Please try later!
            </AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelButtonRef}>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} disabled={isPending || isError}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

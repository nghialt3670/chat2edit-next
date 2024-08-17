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
import { AlertCircle, Forward, Trash2 } from "lucide-react";

import React, { useEffect, useState, useTransition } from "react";
import createConvShareId from "@/actions/createConvShareId";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import IconButton from "./icon-button";
import delelteConvShareId from "@/actions/deleteConvShareId";
import { Button } from "./ui/button";
import getConvShareId from "@/actions/getConvShareId";

export default function ShareConvDialog({ id }: { id: string }) {
  const [shareLink, setShareLink] = useState<string>();
  const [isCopied, setIsCopied] = useState<boolean>();
  const [isCreateError, setIsCreateError] = useState<boolean>();
  const [isDeleteError, setIsDeleteError] = useState<boolean>();
  const [isCreating, startCreating] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  useEffect(() => {
    const updateShareLink = async () => {
      if (shareLink) return;
      const shareId = await getConvShareId(id);
      if (!shareId) return;
      setShareLink(`${window.location.origin}/share/conversations/${shareId}`);
    };
    updateShareLink();
  }, [id]);

  const handleCopyClick = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
  };

  const handleCreateClick = async () => {
    startCreating(async () => {
      const shareId = await createConvShareId(id);
      if (!shareId) {
        setIsCreateError(true);
        return;
      }
      setShareLink(`${window.location.origin}/share/conversations/${shareId}`);
    });
  };

  const handleDeleteClick = async () => {
    startDeleting(async () => {
      if (await delelteConvShareId(id)) setShareLink(undefined);
      else setIsDeleteError(true);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Forward />
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle>Share this conversation</AlertDialogTitle>
          <AlertDialogDescription>
            All user who have this link can have a copy of this conversation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {shareLink && !isDeleting && (
          <div className="flex flex-row items-center w-full font-light">
            <div className="truncate overflow-hidden">{shareLink}</div>
            <IconButton onClick={handleDeleteClick} disabled={isDeleting}>
              <Trash2 size={16} />
            </IconButton>
          </div>
        )}
        {isCreateError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Can not create a share link. Please try later!
            </AlertDescription>
          </Alert>
        )}
        {isDeleteError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Can not delete this share link. Please try later!
            </AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{isCopied ? "Close" : "Cancel"}</AlertDialogCancel>
          {shareLink ? (
            <Button onClick={handleCopyClick} disabled={isCopied}>
              {isCopied ? "Link Copied" : "Copy Link"}
            </Button>
          ) : (
            <Button
              onClick={handleCreateClick}
              disabled={isCreating || isCreateError}
            >
              {isCreating ? "Creating.." : "Create Link"}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

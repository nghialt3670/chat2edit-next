import React, { startTransition, useEffect, useState, useTransition } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import getConvShareId from "@/actions/getConvShareId";
import { usePathname } from "next/navigation";
import createConvShareId from "@/actions/createConvShareId";
import { CircularProgress, IconButton, LinearProgress } from "@mui/material";
import { Copy, Trash, Trash2 } from "lucide-react";
import delelteConvShareId from "@/actions/deleteConvShareId";

export default function ShareConvDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const pathname = usePathname();
  const [shareId, setShareId] = useState<string>();
  const [isCreating, startCreating] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  
  const conversationId = pathname.startsWith("/chat/")
    ? pathname.split("/").pop()
    : "";
  
  useEffect(() => {
    const updateShareId = async () => {
      if (!conversationId) return;
      const shareId = await getConvShareId(conversationId);
      if (shareId) setShareId(shareId);
      else setShareId(undefined)
    };
    updateShareId();
  }, [pathname]);

  if (!conversationId) return null;
  
  const handleCreateClick = async () => {
    startCreating(async () => {
      const newShareId = await createConvShareId(conversationId);
      if (!newShareId) {
        alert("Error while creating share link, please try later!");
        return;
      }
      setShareId(newShareId);
    })
  };

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(shareLink);
    handleClose();
  };

  const handleDeleteClick = async () => {
    startDeleting(async () => {
      if(await delelteConvShareId(conversationId)) setShareId(undefined);
      else alert("Error while removing share link, please try later!")
    })
  }

  const shareLink = shareId ? `${window.location.origin}/share/conversations/${shareId}` : '';

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Share this conversation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          All files in this conversation will be shared.
        </DialogContentText>
        {shareLink && !isDeleting && (
          <div className="flex flex-row items-center font-light">
            <div className="truncate overflow-hidden">{shareLink}</div>
            <IconButton onClick={handleDeleteClick} disabled={isDeleting}>
              <Trash2 size={16} />
            </IconButton>
          </div>
        )}
        {(isCreating || isDeleting) && (
          <LinearProgress />
        )}
      </DialogContent>
      <DialogActions>
        {shareLink ? (
          <Button onClick={handleCopyClick}>
            Copy Link
          </Button>
        ) : (
          <Button onClick={handleCreateClick} disabled={isCreating}>
            Create Link
          </Button>
        )}
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

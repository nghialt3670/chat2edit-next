import useFileStore from "@/stores/FileStore";
import { CircularProgress, IconButton } from "@mui/material";
import { Download, Edit, Reply } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MessageFile({
  fileId,
  onReply,
}: {
  fileId: string;
  onReply: (fileId: string) => void;
}) {
  const router = useRouter();
  const fileStore = useFileStore();

  const file = fileStore.getFile(fileId);
  if (!file) {
    return <div>Error</div>;
  }

  const isImage =
    file.type.startsWith("image/") || file.name.endsWith(".canvas");

  const handleEditClick = () => {
    if (isImage) router.push(`/edit/canvas/${fileId}`);
  };

  const renderFile = () => {
    if (isImage) {
      const imgDataURL = fileStore.getDataURL(fileId);

      if (!imgDataURL) {
        return <div>Error</div>;
      }
      return (
        <div className="flex justify-center items-center rounded-xl overflow-hidden shadow-[1px_2px_5px_1px_rgba(0,0,0,0.3)]">
          {imgDataURL ? (
            <img className="object-cover" src={imgDataURL} />
          ) : (
            <CircularProgress size={28} disableShrink />
          )}
        </div>
      );
    }
    return <div>Other</div>;
  };

  return (
    <div className="w-64 rounded-2xl">
      <div className="flex h-fit p-1">
        <div className="ml-auto">
          <IconButton>
            <Download size={16} />
          </IconButton>
          <IconButton onClick={handleEditClick}>
            <Edit size={16} />
          </IconButton>
          <IconButton onClick={() => onReply(fileId)}>
            <Reply size={16} />
          </IconButton>
        </div>
      </div>
      {renderFile()}
    </div>
  );
}

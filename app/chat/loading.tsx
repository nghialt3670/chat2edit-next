import { CircularProgress } from "@mui/material";

export default function ChatLoading() {
  return (
    <div className="size-full flex justify-center items-center">
      <CircularProgress color="inherit" />
    </div>
  );
}

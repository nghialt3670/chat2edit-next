import { CircularProgress } from "@mui/material";
import React from "react";

export default function RootLoading() {
  return (
    <main className="flex justify-center items-center size-full">
      <CircularProgress color="inherit" />
    </main>
  );
}

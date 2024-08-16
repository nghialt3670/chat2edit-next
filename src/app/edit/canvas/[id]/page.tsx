import Canvas from "@/components/canvas/Canvas";
import React from "react";

export default function CanvasEditPage({ params }: { params: { id: string } }) {
  return (
    <div className="size-full flex justify-center items-center">
      <Canvas fileId={params.id} />
    </div>
  );
}

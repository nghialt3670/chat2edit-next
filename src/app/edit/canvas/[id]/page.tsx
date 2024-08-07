import Canvas from "@/components/Canvas";
import React from "react";

export default function CanvasEditPage({ params }: { params: { id: string } }) {
  return <Canvas fileId={params.id} />;
}

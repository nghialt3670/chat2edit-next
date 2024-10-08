import Canvas from "@/components/canvas";

export default function CanvasEditPage({ params }: { params: { id: string } }) {
  return (
    <div className="size-full flex justify-center items-center">
      <Canvas fileId={params.id} />
    </div>
  );
}

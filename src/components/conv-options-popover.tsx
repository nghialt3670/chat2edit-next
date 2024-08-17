import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis, Forward, Trash2 } from "lucide-react";
import DeleteConvDialog from "./delete-conv-dialog";
import ShareConvDialog from "./share-conv-dialog";

export default function ConvOptionsPopover({ id }: { id: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Ellipsis />
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2 space-x-2">
        <DeleteConvDialog id={id} />
        <ShareConvDialog id={id} />
      </PopoverContent>
    </Popover>
  );
}

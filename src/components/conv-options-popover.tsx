import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis, Forward, Trash2 } from "lucide-react";
import DeleteConvDialog from "./delete-conv-dialog";

export default function ConvOptionsPopover({ id }: { id: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="link">
          <Ellipsis />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2">
        <DeleteConvDialog id={id} />
        <Button size="icon" variant="ghost">
          <Forward size={20} />
        </Button>
      </PopoverContent>
    </Popover>
  );
}

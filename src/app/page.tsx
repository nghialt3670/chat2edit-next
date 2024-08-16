import NavButton from "@/components/nav-button";
import Sidebar from "@/components/sidebar";
import { Separator } from "@radix-ui/themes";
import { BotMessageSquare, Edit } from "lucide-react";

export default function HomePage() {
  return (
    <main className="size-full">
      <Sidebar>
        <nav className="m-2">
          <NavButton
            path="/chat"
            icon={<BotMessageSquare strokeWidth={2} size={20} />}
            text="Chat"
          />
          <NavButton
            path="/edit"
            icon={<Edit strokeWidth={2} size={20} />}
            text="Edit"
          />
        </nav>
      </Sidebar>
      <div></div>
    </main>
  );
}

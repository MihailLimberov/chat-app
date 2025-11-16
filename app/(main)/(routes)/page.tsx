import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { DESTRUCTION } from "dns";




export default function Home() {
  return (
    <div>
      <UserButton
      afterSwitchSessionUrl="/"
      />
      <ModeToggle/>
    </div>
  )
}

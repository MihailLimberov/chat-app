import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DESTRUCTION } from "dns";


const state = true;

export default function Home() {
  return (
    <div className="text-4xl text-green-700 bg-gray-700">
      Protected Route
      {/* <h1 className="text-3xl font-bold text-green-900">
        Hello Chat!
      </h1>
      <Button className={cn("bg-amber-400", state && "bg-red-800")}>
        Click This
      </Button> */}
    </div>
  );
}

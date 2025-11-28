import { currentProfile } from "@/lib/current-profile";
import { Separator } from "../ui/separator";
import { redirect } from "next/navigation";
import { db } from "@/lib/db"
import { NavigationAction } from "./navigation-action";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
    const profile = await currentProfile();

    if (!profile) {
       return redirect("/")
    }


 const servers = await db.server.findMany({
      where: {
       members: {
        some: {
            profileId: profile.id
        }
       }
      }
 });

    return(
        <div className="space-y-4 flex flex-col items-center h-full text primary w-full dark:bg-[#1E1F22] py-3">
        <NavigationAction/>
        <Separator className="h-0.5 bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
        <ScrollArea className="flex-1 w-full">
            {servers.map((server) =>(
                <div key={server.id} className="mb-4">
                    <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl}/>
                </div>
            ))}
        </ScrollArea>
        <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
            <ModeToggle/>
            <UserButton 
            afterSignOutUrl="/" 
            appearance={{
                elements: {
                    avatarBox: "h-12 w-12"
                }
            }}/>
        </div>
        </div>
    );
}
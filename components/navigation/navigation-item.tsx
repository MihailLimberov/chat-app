"use client"

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltip";

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
};

export const NavigationItem = ({
    id,
    imageUrl,
    name,
}: NavigationItemProps) => {

    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/servers/${id}`);
    }

    return (
        <ActionTooltip side="right" align="center" label={name}>
            <button onClick={onClick} className="group relative flex items-center">
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-1",
                    params?.serverId !== id && "group-hover:h-5",
                    params?.serverId === id ? "h-9" : "h-2"
                )} />
                <div className={cn(
                     "relative mx-3 h-12 w-12 overflow-hidden rounded-xl transition-[border-radius] duration-300",
                     "group-hover:rounded-full",
                     params?.serverId === id && "bg-primary/10 text-primary rounded-full"
                )}>     
                    <Image
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                        src={imageUrl} fill alt="Channel" />

                </div>
            </button>
        </ActionTooltip>
    )
}
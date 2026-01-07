import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@/lib/generated/prisma/enums";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";


interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}

const ChannelIdPage = async ({
    params,
}: ChannelIdPageProps) => {

    const profile = await currentProfile();
    const { serverId } = await params;
    const { channelId } = await params;

    if (!profile) {
        return RedirectToSignIn;
    }

    const channel = await db.channel.findFirst({
        where: {
            id: channelId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id,
        }
    });

    if (!channel || !member) {
        redirect("/");
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id} />
                    <ChatInput
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                    />
                </>
            )}
            {channel.type === ChannelType.AUDIO && (
                <MediaRoom
                    chatId={channelId}
                    video={false}
                    audio={true} />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom
                    chatId={channelId}
                    video={true}
                    audio={true} />
            )}
        </div>
    );
}

export default ChannelIdPage;
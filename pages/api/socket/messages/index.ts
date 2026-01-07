import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { db } from "@/lib/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        const key = process.env.ENCRYPTION_KEY;
        let encryptor: any = null;
        if (key) {
             try {
                encryptor = require('simple-encryptor')(key);
             } catch (e) {
                console.log("Encryption key error", e);
             }
        }

        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!serverId) {
            return res.status(400).json({ error: "Server ID missing" });
        }
        if (!channelId) {
            return res.status(400).json({ error: "Channel ID missing" });
        }
        if (!content) {
            return res.status(400).json({ error: "Content Missing" });
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id,
                    }
                }
            },
            include: {
                members: true,
            }
        });

        if (!server) {
            return res.status(404).json({ message: "Server Not Found" });
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            }
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel Not Found" });
        }

        const member = server.members.find((member) => member.profileId === profile.id);

        if (!member) {
            return res.status(404).json({ message: "Member not Found" });
        }

        let encryptedContent = content;
        if (encryptor) {
            encryptedContent = encryptor.encrypt(content);
        }

        const message = await db.message.create({
            data: {
                content: encryptedContent,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                },
                seenBy: {
                    include: {
                        profile: true,
                    }
                }
            }
        });

        const channelKey = `chat:${channelId}:messages`;

        if (encryptor) {
             message.content = encryptor.decrypt(message.content) || message.content;
        }

        res?.socket?.server?.io?.emit(channelKey, message);
        return res.status(200).json(message);
    }
    catch (error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Error" });
    }
}
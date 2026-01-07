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
        const { conversationId } = req.query;

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
        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID missing" });
        }
        if (!content) {
            return res.status(400).json({ error: "Content Missing" });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id,
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id,
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    }
                },
                memberTwo: {
                    include: {
                        profile: true,
                    }
                }
            }
        })

        if (!conversation) {
            return res.status(404).json({ message: "Conversation Not Found" });
        }

        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

        if (!member) {
            return res.status(404).json({ message: "Member not Found" });
        }

        let encryptedContent = content;
        if (encryptor) {
            encryptedContent = encryptor.encrypt(content);
        }

        const message = await db.directMessage.create({
            data: {
                content: encryptedContent,
                fileUrl,
                conversationId: conversationId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                },
                // FIX: Include seenBy here too
                seenBy: {
                    include: {
                        profile: true,
                    }
                }
            }
        });

        const channelKey = `chat:${conversationId}:messages`;

        if (encryptor) {
            message.content = encryptor.decrypt(message.content) || message.content;
        }

        res?.socket?.server?.io?.emit(channelKey, message);
        return res.status(200).json(message);
    }
    catch (error) {
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Error" });
    }
}
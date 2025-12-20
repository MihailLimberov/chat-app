import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@/lib/generated/prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(
    req: Request
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!conversationId) {
            return new NextResponse("Conversation ID missing", { status: 400 });
        }

        const key = process.env.ENCRYPTION_KEY;
        let encryptor: any = null;
        if (key) {
            try {
                encryptor = require('simple-encryptor')(key);
            } catch (e) {
                console.log("Encryption key error", e);
            }
        }

        let messages: DirectMessage[] = [];

        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    conversationId: conversationId,
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
                },
                orderBy: {
                    createdAt: "desc",
                }
            });
        }
        else {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId: conversationId,
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
                },
                orderBy: {
                    createdAt: "desc",
                }
            });
        }

        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        if (encryptor) {
            messages = messages.map((message) => {
                try {
                    const decrypted = encryptor.decrypt(message.content);
                    return { ...message, content: decrypted || message.content };
                } catch (e) {
                    return message;
                }
            })
        }

        return NextResponse.json({
            items: messages,
            nextCursor,
        });
    }
    catch (error) {
        console.log("[DIRECT_MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
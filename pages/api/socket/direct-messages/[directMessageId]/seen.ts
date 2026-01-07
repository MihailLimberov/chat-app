import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    
    // ROBUST ID CHECK: Try both names in case folder naming differs
    const { directMessageId, messageId, conversationId } = req.query;
    const updateId = (directMessageId || messageId) as string;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }
    
    if (!updateId) {
      return res.status(400).json({ error: "Message ID missing" });
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
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Identify which member acts as the "viewer"
    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // 1. Update the message
    const message = await db.directMessage.update({
      where: {
        id: updateId, // Use the robust ID
        conversationId: conversationId as string,
      },
      data: {
        seenBy: {
          connect: {
            id: member.id,
          },
        },
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
        seenBy: {
          include: {
            profile: true,
          }
        }
      },
    });

    const key = process.env.ENCRYPTION_KEY;
    if (key) {
        try {
            const encryptor = require('simple-encryptor')(key);
            message.content = encryptor.decrypt(message.content) || message.content;
        } catch (error) {
            console.error("Socket Decryption Error (DM):", error);
        }
    }

    const updateKey = `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGE_SEEN]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
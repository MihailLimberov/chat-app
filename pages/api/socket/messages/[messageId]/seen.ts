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
    const { messageId, serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.message.update({
      where: {
        id: messageId as string,
        channelId: channelId as string,
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
            console.error("Encryption/Decryption error in seen.ts:", error);
        }
    }

    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID_SEEN]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
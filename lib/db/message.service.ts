import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function createMessage(content: string) {
  return prisma.message.create({
    data: { content },
  });
}

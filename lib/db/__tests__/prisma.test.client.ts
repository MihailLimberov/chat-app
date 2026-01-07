import { PrismaClient } from "@prisma/client";

export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/test.db",
    },
  },
});

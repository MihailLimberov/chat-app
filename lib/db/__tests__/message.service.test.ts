import { testPrisma } from "./prisma.test.client";

describe("Prisma Message tests", () => {
  beforeAll(async () => {
    await testPrisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Message (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  it("creates a message", async () => {
    const msg = await testPrisma.message.create({
      data: { content: "Test message" },
    });

    expect(msg.content).toBe("Test message");
  });
});

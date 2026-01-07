export type Role = "ADMIN" | "MODERATOR" | "GUEST";

export function canDeleteMessage(role: Role): boolean {
  return role === "ADMIN" || role === "MODERATOR";
}

describe("server.service", () => {
  it("dummy test", () => {
    expect(true).toBe(true);
  });
});

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const currentProfile = async () => {
  // Await auth() because it returns a Promise
  const authData = await auth(); // <- key fix

  if (!authData || !authData.userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: { userId: authData.userId },
  });

  return profile;
};
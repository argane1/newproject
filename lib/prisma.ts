import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma client.
 *
 * In development Next.js hot-reloads modules, which would otherwise create a
 * new PrismaClient (and a new pool of DB connections) on every save. We stash
 * the instance on `globalThis` to survive HMR.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

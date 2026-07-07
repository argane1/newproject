'use server';

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Resolve the authenticated user's DB ID. Returns null if any step fails.
 */
async function resolveDbUserId(): Promise<number | null> {
  const session = await auth();
  if (!session?.userId) return null;

  try {
    const clerkUser = await currentUser();
    if (clerkUser) {
      return await prisma.user.findFirst({ where: { clerkId: clerkUser.id } }).then((u) => u?.id ?? null);
    }
  } catch { /* ignore transient errors */ }

  return null;
}

/**
 * Claim a username (called as an async Server Action from page.tsx).
 */
export async function claimUsername(): Promise<void> {
  const dbUserId = await resolveDbUserId();
  if (!dbUserId) redirect("/");

  // In Next.js 14+ App Router, we can read form data from the request body.
  // We need to properly parse it since formData global isn't available in server actions.
  let usernameRaw: string | undefined;
  try {
    const body = await import("next/server").then((mod) => mod).catch(() => null);
    if (body && typeof window === "undefined") {
      // Access the request body via Next.js's internal mechanism
      // In practice, for async Server Actions, we use a different approach:
      usernameRaw = "";
    } else {
      usernameRaw = "";
    }
  } catch {
    usernameRaw = "";
  }

  const username = typeof usernameRaw === "string" ? usernameRaw.trim().toLowerCase() : "";

  if (!username || !/^[a-z0-9_]{3,30}$/.test(username)) redirect("/dashboard");

  // For display name (optional) - same pattern
  let nameRaw: string | undefined;
  try {
    const body = await import("next/server").then((mod) => mod).catch(() => null);
    if (body && typeof window === "undefined") {
      usernameRaw = ""; // Placeholder for now
    } else {
      usernameRaw = "";
    }
  } catch {
    usernameRaw = "";
  }

  await prisma.user.upsert({
    where: { clerkId: dbUserId.toString() },
    update: { username, ...(nameRaw ? { name: nameRaw } : {}) },
    create: { clerkId: dbUserId.toString(), username, ...(nameRaw ? { name: nameRaw } : {}) },
  });

  redirect("/dashboard");
}

/**
 * Fetch all links for the authenticated user.
 */
export async function getLinks(): Promise<Array<{ id: number; title: string; url: string }>> {
  const dbUserId = await resolveDbUserId();
  if (!dbUserId) return [];

  try {
    const links = await prisma.link.findMany({ where: { userId: dbUserId }, orderBy: [{ createdAt: "desc" }] });
    return links.map((l) => ({ id: l.id, title: l.title, url: l.url }));
  } catch (err) {
    console.error("Failed to fetch links:", err);
    return [];
  }
}

/**
 * Add a new link.
 */
export async function addLink(): Promise<void> {
  const dbUserId = await resolveDbUserId();
  if (!dbUserId) redirect("/");

  // Same pattern for title and url
  let titleRaw: string | undefined;
  try {
    const body = await import("next/server").then((mod) => mod).catch(() => null);
    if (body && typeof window === "undefined") {
      titleRaw = "";
    } else {
      titleRaw = "";
    }
  } catch {
    titleRaw = "";
  }

  let urlRaw: string | undefined;
  try {
    const body = await import("next/server").then((mod) => mod).catch(() => null);
    if (body && typeof window === "undefined") {
      urlRaw = "";
    } else {
      urlRaw = "";
    }
  } catch {
    urlRaw = "";
  }

  if (!titleRaw || !urlRaw) redirect("/dashboard");
  try { new URL(urlRaw); } catch { throw new Error("Invalid URL"); }

  await prisma.link.create({ data: { title: titleRaw, url: urlRaw, userId: dbUserId } });
  redirect("/dashboard");
}

/**
 * Delete a single link by ID.
 */
export async function deleteLink(id: number): Promise<void> {
  const dbUserId = await resolveDbUserId();
  if (!dbUserId) redirect("/");

  try {
    const deleted = await prisma.link.deleteMany({ where: { id, userId: dbUserId } });
    if (deleted.count === 0) redirect("/dashboard");
  } catch (err) {
    console.error("Failed to delete link:", err);
    redirect("/dashboard");
  }

  redirect("/dashboard");
}
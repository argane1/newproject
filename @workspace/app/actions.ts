"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Helper: resolve the authenticated user's DB ID. Returns null if any step fails.
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
 * Retrieve the authenticated user's claimable username (if not yet claimed).
 */
export async function claimUsername(prevState?: any, formData?: FormData): Promise<void> {
  const dbUserId = await resolveDbUserId();
  if (!dbUserId) redirect("/");

  // Extract values directly from FormData as primary source; fall back to prev state.
  let usernameRaw: string | undefined;
  if (prevState && typeof prevState === "object") {
    const rawUsername = (prevState as Record<string, unknown>)?.username;
    if (typeof rawUsername !== "string") { usernameRaw = ""; } else { usernameRaw = rawUsername; }
  } else if (formData) {
    usernameRaw = formData.get("username") as string ?? "";
  }

  const username = typeof usernameRaw === "string" ? usernameRaw.trim().toLowerCase() : "";

  if (!username || !/^[a-z0-9_]{3,30}$/.test(username)) redirect("/dashboard");

  let nameRaw: string | undefined;
  if (prevState && typeof prevState === "object") {
    const rawName = (prevState as Record<string, unknown>)?.name;
    if (typeof rawName !== "string") { nameRaw = ""; } else { nameRaw = rawName; }
  } else if (formData) {
    nameRaw = formData.get("name") as string ?? "";
  }

  const name = nameRaw ? nameRaw.trim() : null;

  await prisma.user.upsert({
    where: { clerkId: dbUserId.toString() },
    update: { username, name },
    create: { clerkId: dbUserId.toString(), username, name: name ?? "" },
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
 * Add a new link for the authenticated user.
 */
export async function addLink(prevState?: any, formData?: FormData): Promise<void> {
  const dbUserId = await resolveDbUserId();
  if (!dbUserId) redirect("/");

  let titleRaw: string | undefined;
  if (prevState && typeof prevState === "object") {
    const rawTitle = (prevState as Record<string, unknown>)?.title;
    if (typeof rawTitle !== "string") { titleRaw = ""; } else { titleRaw = rawTitle; }
  } else if (formData) {
    titleRaw = formData.get("title") as string ?? "";
  }

  const title = typeof titleRaw === "string" ? titleRaw.trim() : "";

  let urlRaw: string | undefined;
  if (prevState && typeof prevState === "object") {
    const rawUrl = (prevState as Record<string, unknown>)?.url;
    if (typeof rawUrl !== "string") { urlRaw = ""; } else { urlRaw = rawUrl; }
  } else if (formData) {
    urlRaw = formData.get("url") as string ?? "";
  }

  const url = typeof urlRaw === "string" ? urlRaw.trim() : "";

  if (!title || !url) redirect("/dashboard");
  try { new URL(url); } catch { throw new Error("Invalid URL"); }

  await prisma.link.create({ data: { title, url, userId: dbUserId } });
  redirect("/dashboard");
}

/**
 * Delete a single link for the authenticated user.
 */
export async function deleteLink(id: number) {
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
"use server";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.userId) return new NextResponse("Unauthorized", { status: 401 });

  let dbUserId: number | null = null;
  try {
    const clerkUser = await currentUser();
    if (clerkUser) {
      dbUserId = await prisma.user.findFirst({ where: { clerkId: clerkUser.id } }).then((u) => u?.id ?? null);
    }
  } catch { /* ignore transient errors */ }

  if (!dbUserId) return new NextResponse("Not authenticated", { status: 401 });

  const body = await request.json();
  const { title, url } = body;

  if (!title || !url) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const newLink = await prisma.link.create({ data: { title, url, userId: dbUserId } });
    return NextResponse.json(newLink);
  } catch (error) {
    console.error("Error creating link:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.userId) return new NextResponse("Unauthorized", { status: 401 });

  let dbUserId: number | null = null;
  try {
    const clerkUser = await currentUser();
    if (clerkUser) {
      dbUserId = await prisma.user.findFirst({ where: { clerkId: clerkUser.id } }).then((u) => u?.id ?? null);
    }
  } catch { /* ignore transient errors */ }

  if (!dbUserId) return new NextResponse("Not authenticated", { status: 401 });

  const id = Number(params.id);
  const deleted = await prisma.link.deleteMany({ where: { id, userId: dbUserId } });

  if (deleted.count === 0) {
    return new NextResponse("Link not found", { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
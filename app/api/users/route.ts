import { NextResponse, type NextRequest } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

/**
 * POST /api/users
 *
 * Creates a User row for the currently-authenticated Clerk user.
 * Body: { username: string; name?: string; email?: string }
 *
 * - `clerkId` is always taken from the Clerk session (never the body) so
 *   a client cannot impersonate another user.
 * - `email` defaults to the Clerk user's primary email when not provided.
 * - Returns 201 with the created user on success.
 * - Returns 400 for invalid input, 401 when unauthenticated, 409 on a
 *   unique-constraint violation (username / email / clerkId already taken).
 */
export async function POST(request: NextRequest) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Body must be a JSON object' }, { status: 400 });
  }

  const { username, name, email } = body as {
    username?: unknown;
    name?: unknown;
    email?: unknown;
  };

  if (typeof username !== 'string' || !USERNAME_RE.test(username.trim().toLowerCase())) {
    return NextResponse.json(
      { error: 'Invalid username: must be 3-30 chars of a-z, 0-9, or _' },
      { status: 400 }
    );
  }

  const normalizedUsername = username.trim().toLowerCase();
  const normalizedName =
    typeof name === 'string' && name.trim().length > 0 ? name.trim() : null;

  // Prefer an explicitly-provided email, otherwise fall back to Clerk's
  // primary email address.
  const resolvedEmail =
    typeof email === 'string' && email.trim().length > 0
      ? email.trim()
      : clerkUser.emailAddresses?.[0]?.emailAddress ?? null;

  if (!resolvedEmail) {
    return NextResponse.json(
      { error: 'No email available for this Clerk user' },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: resolvedEmail,
        username: normalizedUsername,
        name: normalizedName,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Username, email, or clerkId is already taken' },
        { status: 409 }
      );
    }
    console.error('POST /api/users failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

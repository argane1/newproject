'use server';

import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// Username rule: 3-30 chars, lowercase letters, digits, underscore. No leading/trailing underscore.
const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

export interface ClaimUsernameFormData {
  username: string;
  name?: string;
}

/**
 * Server action that creates a DB `User` record for a Clerk-authenticated
 * visitor who doesn't have one yet.
 *
 * Validation: username must match `USERNAME_RE`.
 * On success: `redirect('/')` re-runs the page, which will now find the
 * DB profile and render the dashboard.
 */
export async function claimUsername(formData: FormData): Promise<void> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error('You are not authenticated with Clerk.');
  }

  const rawUsername = formData.get('username');
  const rawName = formData.get('name');

  const username =
    typeof rawUsername === 'string' ? rawUsername.trim().toLowerCase() : '';
  const name =
    typeof rawName === 'string' && rawName.trim().length > 0
      ? rawName.trim()
      : undefined;

  if (!USERNAME_RE.test(username)) {
    throw new Error(
      'Invalid username: must be 3-30 characters, lowercase letters, digits, or underscores.'
    );
  }

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new Error('No email address found on your Clerk account.');
  }

  try {
    await prisma.user.create({
      data: {
        email,
        username,
        clerkId: clerkUser.id,
        name: name ?? null,
      },
    });
  } catch (error) {
    // Prisma's P2002 is the unique-constraint violation code. The spec says
    // "errors just throw", so we surface a friendlier message for the
    // most likely case (username or email already taken).
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    ) {
      throw new Error('That username or email is already taken.');
    }
    throw error;
  }

  // `redirect()` throws a special NEXT_REDIRECT error internally, so it
  // must run outside the try/catch above.
  redirect('/');
}


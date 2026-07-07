"use client";

import { UserButton, SignOutButton } from '@clerk/nextjs';

/**
 * Clerk auth UI — extracted to its own Client Component so Dashboard stays a Server Component.
 */
export default function ClerkAuth() {
  return (
    <>
      <UserButton />

      <div className="flex justify-center pt-2">
        <SignOutButton>
          <button type="button" className="rounded-md border border-input px-4 py-2 text-sm font-medium transition hover:bg-accent">Sign out</button>
        </SignOutButton>
      </div>
    </>
  );
}
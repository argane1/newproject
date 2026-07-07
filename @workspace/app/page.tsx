import { currentUser } from '@clerk/nextjs/server';
import { SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';
import { claimUsername, getLinks, addLink, deleteLink } from './actions';
import prisma from '@/lib/prisma';
import Dashboard from './dashboard';

/**
 * Top-level page.
 *   logged out                         -> LandingPage
 *   logged in, no DB profile           -> ClaimUsernameForm
 *   logged in + DB profile             -> Dashboard (Client Component)
 */
export default async function HomePage() {
  const clerkUser = await currentUser();

  if (!clerkUser) return <LandingPage />;

  const dbUser = await prisma.user.findFirst({ where: { clerkId: clerkUser.id } });
  if (!dbUser) return <ClaimUsernameForm />;

  const { links } = await getLinks();
  return (
    <Dashboard name={dbUser.name} username={dbUser.username} email={dbUser.email} links={links} />
  );
}

function LandingPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 px-8 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Welcome</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          Sign in to claim your username and access your dashboard.
        </p>
      </div>
      <SignInButton mode="modal">
        <button
          type="button"
          className="rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90"
        >
          Sign In
        </button>
      </SignInButton>
    </main>
  );
}

function ClaimUsernameForm() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center px-8">
      <div className="w-full max-w-sm space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Claim your username</h1>
          <p className="text-muted-foreground text-sm">Pick a unique handle. You can change it later.</p>
        </header>

        <form action={claimUsername} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              minLength={3}
              maxLength={30}
              pattern="[a-z0-9_]{3,30}"
              autoComplete="username"
              placeholder="your_handle"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
            />
            <p className="text-muted-foreground text-xs">3-30 characters. Lowercase letters, digits, and underscores only.</p>
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="name" className="text-sm font-medium">Display name <span className="text-muted-foreground">(optional)</span></label>
            <input
              id="name"
              name="name"
              type="text"
              maxLength={64}
              autoComplete="name"
              placeholder="Ada Lovelace"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          <button type="submit" className="w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90">Claim username</button>
        </form>

        <div className="flex justify-center pt-2">
          <SignOutButton>
            <button type="button" className="text-muted-foreground text-xs underline-offset-4 hover:underline">Sign out</button>
          </SignOutButton>
        </div>
      </div>
    </main>
  );
}

/**
 * Dashboard — Client Component (renders user info, forms, and link list).
 */
// Imported from dashboard.tsx which has "use client" at the top.
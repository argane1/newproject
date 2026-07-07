import { currentUser } from '@clerk/nextjs/server';
import { SignInButton, SignOutButton } from '@clerk/nextjs';
import { claimUsername, getLinks } from './actions';
import prisma from '@/lib/prisma';
import Dashboard from './dashboard';

export default async function HomePage() {
  const clerkUser = await currentUser();

  if (!clerkUser) return <LandingPage />;

  const dbUser = await prisma.user.findFirst({ where: { clerkId: clerkUser.id } });

  if (!dbUser) return <ClaimUsernameForm />;

  const links = await getLinks();

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 px-8 text-center">
      <div className="flex justify-center mb-6">
        {clerkUser?.imageUrl ? (
          <img src={clerkUser.imageUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-lg" />
        ) : (
          <div className="w-32 h-32 rounded-full bg-yellow-300 flex items-center justify-center text-4xl font-bold text-white border-4 border-yellow-400 shadow-lg">
            {dbUser?.username ? dbUser.username[0].toUpperCase() : 'U'}
          </div>
        )}
      </div>

      <Dashboard name={dbUser.name ?? ''} username={dbUser.username} email={dbUser.email} links={links} />
    </main>
  );
}

function LandingPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 px-8 text-center">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold tracking-tight">Welcome</h1>
        <p className="text-gray-600 max-w-md text-lg">Sign in to claim your username and access your dashboard.</p>
      </div >
      <SignInButton mode="modal">
        <button type="button" className="btn-primary">Sign In</button>
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
          <p className="text-gray-600 text-sm">Pick a unique handle. You can change it later.</p>
        </header>

        <form action={claimUsername} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <input
              id="username" name="username" type="text" required minLength={3} maxLength={30}
              pattern="[a-z0-9_]{3,30}" autoComplete="username" placeholder="your_handle"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-200/50 transition-all"
            />
            <p className="text-gray-600 text-xs">3–30 characters. Lowercase letters, digits, and underscores only.</p>
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="name" className="text-sm font-medium">Display name <span className="text-gray-600">(optional)</span></label>
            <input
              id="name" name="name" type="text" maxLength={64} autoComplete="name" placeholder="Ada Lovelace"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-200/50 transition-all"
            />
          </div>

          <button type="submit" className="btn-primary w-full">Claim username</button>
        </form>

        <div className="flex justify-center pt-2">
          <SignOutButton>
            <button type="button" className="text-gray-600 text-xs underline-offset-4 hover:underline rounded-full px-4 py-1.5 transition-colors">Sign out</button>
          </SignOutButton>
        </div>
      </div>
    </main>
  );
}
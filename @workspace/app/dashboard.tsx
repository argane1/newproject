"use client";

import { UserButton, SignOutButton } from '@clerk/nextjs';
import { addLink, deleteLink } from './actions';
import CopyButton from './components/copy-button';

interface LinkItem {
  id: number;
  title: string;
  url: string;
}

export interface DashboardProps {
  name: string | null;
  username: string;
  email: string;
  links: Array<LinkItem>;
}

/**
 * Clerk auth UI — extracted to a separate Client Component so it doesn't
 * force the whole Dashboard into client mode.
 */
function ClerkAuth() {
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

/**
 * Dashboard — Client Component (renders user info, forms, and link list).
 */
function Dashboard({ name, username, email, links }: DashboardProps) {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-6 px-8 text-center">
      <UserButton />

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Welcome back{name ? `, ${name}` : ''}!</h1>
        <p className="text-muted-foreground text-lg">You are signed in as <span className="font-mono">@{username}</span></p>
        <p className="text-muted-foreground text-sm">{email}</p>
      </div>

      {/* Add Link Form */}
      <section className="w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">Add a link</h2>
        <form action={addLink} className="space-y-3">
          <div className="space-y-1.5 text-left">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Next.js Docs"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
          <div className="space-y-1.5 text-left">
            <label htmlFor="url" className="text-sm font-medium">URL</label>
            <input
              id="url"
              name="url"
              type="url"
              required
              placeholder="https://..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
          <button type="submit" className="w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90">Add link</button>
        </form>
      </section>

      {/* Links List */}
      <section className="w-full max-w-lg space-y-3">
        <h2 className="text-xl font-semibold">Your links</h2>
        {links.length === 0 ? (
          <p className="text-muted-foreground text-sm">No links yet.</p>
        ) : (
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.id} className="flex items-center justify-between rounded-md border border-input px-4 py-3">
                <div className="min-w-0 flex-1 text-left">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">{link.title || link.url}</a>
                </div>
                <CopyButton url={link.url} />

                <button type="button" onClick={async () => { await deleteLink(link.id); }} className="rounded-md border px-2 py-1 text-sm transition hover:bg-accent">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ClerkAuth />
    </main>
  );
}

export default Dashboard;
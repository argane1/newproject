'use client';

import Link from 'next/link';
import { useState } from 'react';
import { claimUsername, getLinks, addLink, deleteLink } from './actions';
import Dashboard from './dashboard';

export default function Home() {
  const [links, setLinks] = useState<Array<{ id: number; title: string; url: string }>>([]);

  // Fetch links on mount (using the new Clerk-auth version from @/app/actions.ts)
  const { links: fetchedLinks, username, email } = await getLinks();

  return (
    <div>
      {/* Claim Username Form */}
      <form action={claimUsername}>
        <input name="username" defaultValue="" />
        <button type="submit">Claim</button>
      </form>

      {/* Add Link Form */}
      <form action={addLink}>
        <input name="title" placeholder="Title" />
        <input name="url" placeholder="URL" required />
        <button type="submit">Add</button>
      </form>

      {/* Links List */}
      {links.map((link) => (
        <div key={link.id}>
          <Link href={link.url}>{link.title}</Link>
          <form action={deleteLink}>
            <input type="hidden" name="id" value={link.id} />
            <button type="submit">Delete</button>
          </form>
        </div>
      ))}

      {/* Dashboard */}
      {username && (
        <Dashboard 
          username={username} 
          email={email || ''}
          links={links}
        />
      )}
    </div>
  );
}
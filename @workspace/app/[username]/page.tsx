'use client';

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile',
}

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  const user = await prisma.user.findUnique({ where: { username }, include: { links: true } })

  if (!user) notFound()

  return (
    <main className="mx-auto max-w-lg text-center p-8">
      {/* Avatar — first letter of name */}
      <div className="text-7xl font-bold mb-4">{user.name?.[0]?.toUpperCase()}</div>

      {/* Username and display name */}
      <h1 className="text-2xl font-semibold mb-2">{username}</h1>
      {user.name && (
        <p className="text-lg text-gray-500 mb-8">— {user.name}</p>
      )}

      {/* Links list */}
      <div className="flex flex-col gap-3">
        {user.links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-black font-semibold py-2 px-5 rounded-full hover:opacity-90 transition-opacity cursor-pointer block"
          >
            {link.title}
          </a>
        ))}

        {/* Create your own */}
        <a
          href="/dashboard"
          target="_self"
          className="text-sm text-gray-500 hover:text-primary hover:underline transition-colors block mt-4"
        >
          Create your own
        </a>
      </div>
    </main>
  )
}
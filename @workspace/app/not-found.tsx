import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 px-8 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          The page you're looking for couldn't be found.
        </p>
      </div>
      <Link href="/" className="rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90">
        Go home
      </Link>
    </main>
  )
}
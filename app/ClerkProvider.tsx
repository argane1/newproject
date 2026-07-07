'use client';

import { ClerkProvider as DefaultClerkProvider } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

/**
 * Minimal wrapper that loads Clerk after the shell has rendered.
 * The `isLoaded` guard is what prevents hydration mismatch — on the
 * server this component renders nothing (returns null), and only in
 * the browser does it swap to the real `<ClerkProvider>`.
 */
export default function ClerkWrapper({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted so we can render Clerk.
    if (typeof window !== 'undefined') {
      setMounted(true);
    }
  }, []);

  return mounted ? (
    <DefaultClerkProvider>{children}</DefaultClerkProvider>
  ) : null;
}
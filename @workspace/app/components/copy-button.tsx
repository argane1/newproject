'use client';

import { useState } from 'react';

interface CopyButtonProps {
  url: string;
}

export default function CopyButton({ url }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90 ${copied ? 'cursor-default' : ''}`}
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  );
}
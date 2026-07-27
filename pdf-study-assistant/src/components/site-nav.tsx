import Link from 'next/link';

export function SiteNav() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          PDF Study Assistant
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Upload
          </Link>
          <Link
            href="/library"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Library
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from 'next/link';

export default function StudySetNotFound() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-semibold">Study set not found</h1>
      <p className="text-muted-foreground">
        It may have been removed, or the link is incorrect.
      </p>
      <Link
        href="/library"
        className="inline-block text-sm font-medium underline underline-offset-4"
      >
        Browse the library
      </Link>
    </div>
  );
}

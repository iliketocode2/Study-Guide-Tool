import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const sets = await prisma.studySet.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          flashcards: true,
          quizQuestions: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Library</h1>
        <p className="text-muted-foreground">
          All study sets created in this app. Anyone can open any set.
        </p>
      </div>

      {sets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-muted-foreground">No study sets yet.</p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
          >
            Upload a PDF to get started
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {sets.map((set) => (
            <li key={set.id}>
              <Link
                href={`/sets/${set.id}`}
                className="flex items-start justify-between gap-4 px-4 py-4 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0 space-y-1">
                  <p className="truncate font-medium">{set.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {set._count.flashcards} flashcards ·{' '}
                    {set._count.quizQuestions} quiz questions
                  </p>
                </div>
                <time
                  dateTime={set.createdAt.toISOString()}
                  className="shrink-0 text-sm text-muted-foreground"
                >
                  {set.createdAt.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

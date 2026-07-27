import Link from 'next/link';
import { notFound } from 'next/navigation';
import StudyTabs from '@/components/study-tabs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface StudySetPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudySetPage({ params }: StudySetPageProps) {
  const { id } = await params;

  const studySet = await prisma.studySet.findUnique({
    where: { id },
    include: {
      flashcards: true,
      quizQuestions: true,
    },
  });

  if (!studySet) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link
          href="/library"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to library
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">
          {studySet.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Created{' '}
          {studySet.createdAt.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      </div>

      <StudyTabs
        flashcards={studySet.flashcards}
        quizQuestions={studySet.quizQuestions}
      />
    </div>
  );
}

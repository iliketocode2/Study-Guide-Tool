import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const studySet = await prisma.studySet.findUnique({
      where: { id },
      include: {
        flashcards: true,
        quizQuestions: true,
      },
    });

    if (!studySet) {
      return NextResponse.json(
        { error: 'Study set not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: studySet.id,
      title: studySet.title,
      createdAt: studySet.createdAt.toISOString(),
      flashcards: studySet.flashcards.map((card) => ({
        id: card.id,
        front: card.front,
        back: card.back,
      })),
      quizQuestions: studySet.quizQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
      })),
    });
  } catch (error) {
    console.error('Failed to load study set:', error);
    return NextResponse.json(
      { error: 'Failed to load study set' },
      { status: 500 }
    );
  }
}

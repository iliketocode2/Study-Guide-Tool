import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractTextFromPdf } from '@/lib/pdf-utils';
import { generateStudyMaterials } from '@/lib/ai-integration';

export const runtime = 'nodejs';

export async function GET() {
  try {
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

    return NextResponse.json(
      sets.map((set) => ({
        id: set.id,
        title: set.title,
        createdAt: set.createdAt.toISOString(),
        flashcardCount: set._count.flashcards,
        quizQuestionCount: set._count.quizQuestions,
      }))
    );
  } catch (error) {
    console.error('Failed to list study sets:', error);
    return NextResponse.json(
      { error: 'Failed to load study library' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'A PDF file is required' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are accepted' },
        { status: 400 }
      );
    }

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: 'PDF must be 10MB or smaller' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfText = await extractTextFromPdf(buffer);
    const materials = await generateStudyMaterials({ pdfText });

    const title = file.name.replace(/\.pdf$/i, '') || 'Untitled study set';

    const studySet = await prisma.studySet.create({
      data: {
        title,
        flashcards: {
          create: materials.flashcards.map((card) => ({
            front: card.front,
            back: card.back,
          })),
        },
        quizQuestions: {
          create: materials.quizQuestions.map((q) => ({
            question: q.question,
            answer: q.answer,
          })),
        },
      },
      include: {
        flashcards: true,
        quizQuestions: true,
      },
    });

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
    console.error('Failed to create study set:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to create study set';

    let status = 500;
    if (message.includes('GOOGLE_GENERATIVE_AI_API_KEY')) {
      status = 503;
    } else if (
      message.includes('429') ||
      message.toLowerCase().includes('quota') ||
      message.toLowerCase().includes('too many requests')
    ) {
      status = 429;
    }

    return NextResponse.json({ error: message }, { status });
  }
}

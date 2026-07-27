'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlashcardViewer from './flashcard-viewer';
import QuizViewer from './quiz-viewer';
import type { Flashcard, QuizQuestion } from '@/types';

interface StudyTabsProps {
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
}

export default function StudyTabs({
  flashcards,
  quizQuestions,
}: StudyTabsProps) {
  return (
    <Tabs defaultValue="flashcards" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="flashcards">
          Flashcards ({flashcards.length})
        </TabsTrigger>
        <TabsTrigger value="quiz">
          Quiz ({quizQuestions.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="flashcards" className="mt-6">
        <FlashcardViewer flashcards={flashcards} />
      </TabsContent>
      <TabsContent value="quiz" className="mt-6">
        <QuizViewer questions={quizQuestions} />
      </TabsContent>
    </Tabs>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { QuizQuestion } from '@/types';

interface QuizViewerProps {
  questions: QuizQuestion[];
}

export default function QuizViewer({ questions }: QuizViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!questions.length) {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">
          No quiz questions available.
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handlePrevious = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev === 0 ? questions.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) =>
      prev === questions.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">{currentQuestion.question}</p>

          <Button
            variant="secondary"
            onClick={() => setShowAnswer((value) => !value)}
          >
            {showAnswer ? 'Hide answer' : 'Show answer'}
          </Button>

          {showAnswer && (
            <div className="rounded-md border border-border bg-muted/40 p-4">
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Answer
              </p>
              <p className="leading-relaxed">{currentQuestion.answer}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" onClick={handlePrevious}>
          Previous
        </Button>
        <Button variant="outline" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}

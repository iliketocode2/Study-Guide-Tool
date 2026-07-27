'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Flashcard } from '@/types';

interface FlashcardViewerProps {
  flashcards: Flashcard[];
}

export default function FlashcardViewer({ flashcards }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!flashcards.length) {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">
          No flashcards available.
        </CardContent>
      </Card>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handlePrevious = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) =>
      prev === flashcards.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Card {currentIndex + 1} of {flashcards.length}
      </p>

      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className="w-full text-left"
        aria-label={flipped ? 'Show question' : 'Show answer'}
      >
        <Card className="min-h-48 transition-colors hover:bg-muted/30">
          <CardContent className="flex min-h-48 items-center justify-center p-8 text-center">
            <p className="text-lg leading-relaxed">
              {flipped ? currentCard.back : currentCard.front}
            </p>
          </CardContent>
        </Card>
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Click the card to flip
      </p>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" onClick={handlePrevious}>
          Previous
        </Button>
        <Button variant="secondary" onClick={() => setFlipped((v) => !v)}>
          {flipped ? 'Show question' : 'Show answer'}
        </Button>
        <Button variant="outline" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}

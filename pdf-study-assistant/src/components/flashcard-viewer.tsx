import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Flashcard } from '@/types';
import { useStudyStore } from '@/lib/store';

export default function FlashcardViewer() {
  const { currentMaterial } = useStudyStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  
  if (!currentMaterial || !currentMaterial.flashcards.length) {
    return (
      
        
          No flashcards available. Upload a PDF to generate study materials.
        
      
    );
  }
  
  const flashcards = currentMaterial.flashcards;
  const currentCard = flashcards[currentIndex];
  
  const handlePrevious = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
  };
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  return (
    
      
        
          Card {currentIndex + 1} of {flashcards.length}
        
      
      
      
        
          
            {currentCard.front}
          
        
        
        
          
            {currentCard.back}
          
        
      
      
      
        
          Previous
        
        
          {flipped ? 'Show Question' : 'Show Answer'}
        
        
          Next
        
      
    
  );
}
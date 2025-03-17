import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudyStore } from '@/lib/store';

export default function QuizViewer() {
  const { currentMaterial } = useStudyStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  if (!currentMaterial || !currentMaterial.quizQuestions.length) {
    return (
      
        
          No quiz questions available. Upload a PDF to generate study materials.
        
      
    );
  }
  
  const questions = currentMaterial.quizQuestions;
  const currentQuestion = questions[currentIndex];
  
  const handlePrevious = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev === 0 ? questions.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev === questions.length - 1 ? 0 : prev + 1));
  };
  
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };
  
  return (
    
      
        
          Question {currentIndex + 1} of {questions.length}
        
      
      
      
        
          Question
        
        
          {currentQuestion.question}
          
          
            
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            
            
            {showAnswer && (
              
                
                  Answer
                
                
                  {currentQuestion.answer}
                
              
            )}
          
        
      
      
      
        
          Previous
        
        
          Next
        
      
    
  );
}
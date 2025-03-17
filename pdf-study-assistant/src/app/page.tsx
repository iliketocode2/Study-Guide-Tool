'use client';

import { useState, useEffect } from 'react';
import PdfUploader from '@/components/pdf-uploader';
import StudyTabs from '@/components/study-tabs';
import { Toaster } from '@/components/ui/toaster';
import { useStudyStore } from '@/lib/store';

export default function Home() {
  const { materials } = useStudyStore();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    
      
        PDF Study Assistant
        
          Upload your study documents and let AI generate flashcards and practice questions to help you study efficiently.
        
      
      
      {materials.length === 0 ? (
        
      ) : (
        
          
          
        
      )}
      
      
    
  );
}
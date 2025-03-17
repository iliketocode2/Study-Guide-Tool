import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlashcardViewer from './flashcard-viewer';
import QuizViewer from './quiz-viewer';
import { useStudyStore } from '@/lib/store';
import { Avatar } from '@/components/ui/avatar';

export default function StudyTabs() {
  const { currentMaterial, materials, setCurrentMaterial } = useStudyStore();
  
  if (!materials.length) return null;
  
  return (
    
      {materials.length > 1 && (
        
          {materials.map((material) => (
            <button
              key={material.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
                currentMaterial?.id === material.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => setCurrentMaterial(material.id)}
            >
              
                
                  
                  
                
              
              {material.fileName}
            
          ))}
        
      )}
      
      {currentMaterial && (
        
          
            
              Flashcards
              Quiz Questions
            
          
          
          
            
          
          
          
            
          
        
      )}
    
  );
}
export interface Flashcard {
    id: string;
    front: string;
    back: string;
  }
  
  export interface QuizQuestion {
    id: string;
    question: string;
    answer: string;
  }
  
  export interface StudyMaterials {
    id: string;
    fileName: string;
    flashcards: Flashcard[];
    quizQuestions: QuizQuestion[];
    createdAt: Date;
  }
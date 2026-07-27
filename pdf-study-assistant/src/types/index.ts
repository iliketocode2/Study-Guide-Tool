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

export interface StudySetSummary {
  id: string;
  title: string;
  createdAt: string;
  flashcardCount: number;
  quizQuestionCount: number;
}

export interface StudySet {
  id: string;
  title: string;
  createdAt: string;
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
}

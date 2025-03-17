import { create } from 'zustand';
import { Flashcard, QuizQuestion, StudyMaterials } from '@/types';

interface StudyStore {
  materials: StudyMaterials[];
  currentMaterialId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMaterials: (materials: StudyMaterials[]) => void;
  addMaterial: (material: StudyMaterials) => void;
  setCurrentMaterial: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Derived state
  currentMaterial: StudyMaterials | null;
}

export const useStudyStore = create((set, get) => ({
  materials: [],
  currentMaterialId: null,
  isLoading: false,
  error: null,
  
  setMaterials: (materials) => set({ materials }),
  addMaterial: (material) => set((state) => ({ 
    materials: [...state.materials, material],
    currentMaterialId: material.id
  })),
  setCurrentMaterial: (id) => set({ currentMaterialId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  get currentMaterial() {
    const { materials, currentMaterialId } = get();
    return materials.find(m => m.id === currentMaterialId) || null;
  }
}));
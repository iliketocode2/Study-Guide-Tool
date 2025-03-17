import Anthropic from '@anthropic-ai/sdk';
import { Flashcard, QuizQuestion } from '@/types';

// Initialize Anthropic SDK - you'll need to add your API key to .env
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface GenerateStudyMaterialsProps {
  pdfText: string;
  numberOfFlashcards?: number;
  numberOfQuestions?: number;
}

export async function generateStudyMaterials({
  pdfText,
  numberOfFlashcards = 10,
  numberOfQuestions = 5,
}: GenerateStudyMaterialsProps): Promise<{
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
}> {
  try {
    // Trim and clean up the PDF text
    const trimmedText = pdfText.trim().replace(/\s+/g, ' ');
    
    // If the text is too long, truncate it to avoid hitting API limits
    const maxTextLength = 15000;
    const text = trimmedText.length > maxTextLength
      ? trimmedText.substring(0, maxTextLength) + '...'
      : trimmedText;
    
    const prompt = `
I need to create study materials from the following text. The materials should include:
1. A set of ${numberOfFlashcards} flashcards (question on front, answer on back)
2. A set of ${numberOfQuestions} quiz questions with detailed answers

The material should focus on the most important concepts, definitions, and relationships. The questions should test understanding, not just memorization.

Here is the text to analyze:
"""
${text}
"""

Please format your response in JSON with the following structure:
{
  "flashcards": [
    {
      "id": "string",
      "front": "string",
      "back": "string"
    }
  ],
  "quizQuestions": [
    {
      "id": "string",
      "question": "string",
      "answer": "string"
    }
  ]
}
`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      system: 'You analyze text and extract key information to create effective study materials. Your output is valid, well-structured JSON only.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the JSON response
    const content = response.content[0].text;
    const jsonStartIndex = content.indexOf('{');
    const jsonEndIndex = content.lastIndexOf('}') + 1;
    const jsonString = content.slice(jsonStartIndex, jsonEndIndex);
    
    const parsedResponse = JSON.parse(jsonString);
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const generatedMaterialsSchema = z.object({
  flashcards: z
    .array(
      z.object({
        front: z.string().min(1),
        back: z.string().min(1),
      })
    )
    .min(1),
  quizQuestions: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      })
    )
    .min(1),
});

export type GeneratedMaterials = z.infer<typeof generatedMaterialsSchema>;

interface GenerateStudyMaterialsProps {
  pdfText: string;
  numberOfFlashcards?: number;
  numberOfQuestions?: number;
}

/** Prefer current free-tier models available to new AI Studio users. */
const DEFAULT_MODEL_CANDIDATES = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Missing GOOGLE_GENERATIVE_AI_API_KEY. Add it to .env (see .env.example).'
    );
  }
  return apiKey;
}

function getModelCandidates(): string[] {
  const preferred = process.env.GEMINI_MODEL?.trim();
  if (preferred) {
    return [
      preferred,
      ...DEFAULT_MODEL_CANDIDATES.filter((model) => model !== preferred),
    ];
  }
  return DEFAULT_MODEL_CANDIDATES;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('AI response was not valid JSON');
    }
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

function isRetryableModelError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('429') ||
    message.includes('too many requests') ||
    message.includes('quota') ||
    message.includes('resource exhausted') ||
    message.includes('404') ||
    message.includes('not found') ||
    message.includes('no longer available')
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithModel(
  modelName: string,
  prompt: string
): Promise<GeneratedMaterials> {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.4,
    },
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction:
      'You analyze text and extract key information to create effective study materials. Output valid JSON only.',
  });

  const responseText = result.response.text();
  const parsed = extractJson(responseText);
  return generatedMaterialsSchema.parse(parsed);
}

export async function generateStudyMaterials({
  pdfText,
  numberOfFlashcards = 10,
  numberOfQuestions = 5,
}: GenerateStudyMaterialsProps): Promise<GeneratedMaterials> {
  const trimmedText = pdfText.trim().replace(/\s+/g, ' ');
  const maxTextLength = 100_000;
  const text =
    trimmedText.length > maxTextLength
      ? `${trimmedText.slice(0, maxTextLength)}...`
      : trimmedText;

  const prompt = `Create study materials from the following text.

Include:
1. Exactly ${numberOfFlashcards} flashcards (question on front, answer on back)
2. Exactly ${numberOfQuestions} quiz questions with detailed answers

Focus on the most important concepts, definitions, and relationships. Prefer understanding over rote memorization.

Text:
"""
${text}
"""

Respond with JSON only in this shape:
{
  "flashcards": [{ "front": "string", "back": "string" }],
  "quizQuestions": [{ "question": "string", "answer": "string" }]
}`;

  const candidates = getModelCandidates();
  let lastError: unknown;

  for (let index = 0; index < candidates.length; index++) {
    const modelName = candidates[index];
    try {
      return await generateWithModel(modelName, prompt);
    } catch (error) {
      lastError = error;
      console.warn(`Gemini model ${modelName} failed:`, error);

      if (!isRetryableModelError(error)) {
        throw error;
      }

      // Brief pause before trying the next free-tier model.
      if (index < candidates.length - 1) {
        await sleep(1200);
      }
    }
  }

  throw new Error(
    lastError instanceof Error
      ? `No available Gemini model succeeded. Set GEMINI_MODEL in .env to a model from AI Studio (e.g. gemini-3.6-flash). Last error: ${lastError.message}`
      : 'No available Gemini model succeeded.'
  );
}

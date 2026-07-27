import pdfParse from 'pdf-parse';

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text?.trim() ?? '';

    if (!text) {
      throw new Error('No readable text found in this PDF');
    }

    return text;
  } catch (error) {
    if (error instanceof Error && error.message.includes('No readable text')) {
      throw error;
    }
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

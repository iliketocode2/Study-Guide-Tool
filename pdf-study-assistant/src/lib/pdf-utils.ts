import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import pdfParse from 'pdf-parse';

export async function savePdfFile(file: Buffer, fileName: string): Promise {
  // Create a unique ID for the file
  const fileId = crypto.randomUUID();
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
  
  // Save the file to disk
  const filePath = path.join(uploadsDir, `${fileId}.pdf`);
  await fs.writeFile(filePath, file);
  
  return fileId;
}

export async function extractTextFromPdf(fileId: string): Promise {
  const filePath = path.join(process.cwd(), 'uploads', `${fileId}.pdf`);
  const dataBuffer = await fs.readFile(filePath);
  
  try {
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}
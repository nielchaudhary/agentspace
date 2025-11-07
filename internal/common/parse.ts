import { readFile } from 'fs/promises';
import { PDFParse, type TextResult } from 'pdf-parse';

export const parsePDFBuffer = async (filePath: string): Promise<TextResult | undefined> => {
  const fileBuffer = await readFile(filePath);
  const pdfData = await new PDFParse({ data: fileBuffer });
  const extractedText = pdfData.getText();
  return extractedText;
};

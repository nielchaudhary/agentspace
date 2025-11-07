import { Agent, run } from '@openai/agents';
import asyncHandler from 'express-async-handler';
import type { Request, Response } from 'express';
import { Logger } from '../common/logger.js';
import { parsePDFBuffer } from '../common/parse.js';
import { unlink } from 'fs/promises';

const logger = new Logger('context-summarizer');

const contextAgent = new Agent({
  name: 'contentSummarizerAgent',
  instructions: `
You are an expert in reading, analyzing, and summarizing academic research papers. Given any research paper, extract and present the following in clear, plain language:
- The main research question or objective.
- A brief description of the methods and approach.
- Key findings and results.
- Significance and implications of the study.
Focus on accuracy, clarity, and relevance; avoid technical jargon unless needed for context. Summaries should be concise and accessible to a general audience.
`,
});

export const getContextSummaryPostHandler = asyncHandler(async (req: Request, res: Response) => {
  const uploadedFile = req.file;

  if (!uploadedFile?.filename.endsWith('.pdf')) {
    res.status(400).json({ error: 'Only PDF files are supported' });
    return;
  }

  if (!uploadedFile) {
    res.status(400).json({ error: 'Research paper is required' });
    return;
  }

  logger.info('Received file for context summarization:', uploadedFile?.originalname);

  try {
    const extractedData = await parsePDFBuffer(uploadedFile.path);

    if (!extractedData) {
      res.status(500).json({ error: 'Failed to extract text from PDF' });
      return;
    }

    logger.info('PDF content extracted:\n', extractedData.text);

    const summaryPrompt = `Summarize the following research paper:\n\n${extractedData.text}`;
    const result = await run(contextAgent, summaryPrompt);

    res.status(200).json({ summary: result.finalOutput });
  } finally {
    await unlink(uploadedFile.path).catch(() => {});
  }
});

import { Agent, run } from '@openai/agents';
import asyncHandler from 'express-async-handler';
import type { Request, Response } from 'express';
import { readFile, unlink } from 'node:fs/promises';
import multer from 'multer';
import { Logger } from '../common/logger.js';

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

const multerConfig = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'tmp/');
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const multerUpload = multer({ storage: multerConfig }).single('file');

const uploadFile = (req: Request, res: Response) =>
  new Promise<void>((resolve, reject) => {
    multerUpload(req, res, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

export const getContextSummaryPostHandler = asyncHandler(async (req: Request, res: Response) => {
  await uploadFile(req, res);

  const uploadedFile = req.file;

  if (!uploadedFile) {
    res.status(400).json({ error: 'Research paper is required' });
    return;
  }

  const paperContent = await readFile(uploadedFile.path, 'utf8');

  try {
    const summaryPrompt = `Summarize the following research paper:\n\n${paperContent}`;
    const result = await run(contextAgent, summaryPrompt);
    logger.info(result);

    res.status(200).json({ content: paperContent });
  } finally {
    await unlink(uploadedFile.path).catch(() => {});
  }
});

import express from 'express';
import { getHistoryPostHandler } from '../agents/history.js';
import { getTranslatedDataPostHandler } from '../agents/translate-agent.js';
import { getContextSummaryPostHandler } from '../agents/context-summarizer.js';
import { uploadMiddleware } from '../common/upload-file.js';

const router = express.Router();

router.get('/history', getHistoryPostHandler);
router.get('/translate', getTranslatedDataPostHandler);
router.post('/context-summarizer', uploadMiddleware, getContextSummaryPostHandler);

export const agentRouter: [string, express.Router] = ['/agents', router];

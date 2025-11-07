import { Agent, run } from '@openai/agents';
import { type Request, type Response } from 'express';

const historyAgent = new Agent({
  name: 'HistoryAgent',
  instructions: 'You are an expert in world history.',
});

export const getHistoryPostHandler = async (req: Request, res: Response) => {
  const { question } = req.body as { question: string };

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const result = await run(historyAgent, question);

    return res.send({ answer: result.finalOutput });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

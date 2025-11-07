import { Agent, run } from '@openai/agents';
import { type Request, type Response } from 'express';

const languageAgent = new Agent({
  name: 'LanguageAgent',
  instructions: 'You are a skilled linguist and translator.',
});

export const getTranslatedDataPostHandler = async (req: Request, res: Response) => {
  const { question } = req.body as { question: string };

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const result = await run(languageAgent, question);

    return res.send({ answer: result.finalOutput });
  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

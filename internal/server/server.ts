import express from 'express';
import { agentRouter } from '../router/agents.js';

import { Logger } from '../common/logger.js';

const logger = new Logger('cmd/server');

export const initAgentspaceServer = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(agentRouter[0], agentRouter[1]);
  logger.info('agentspace live at http://localhost:8090');
  return app;
};

import express from "express";
import { agentRouter } from "../router/agents.js";

export function initAgentspaceServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(agentRouter[0], agentRouter[1]);

  return app;
}

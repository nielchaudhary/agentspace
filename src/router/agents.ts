import express from "express";
import { getHistoryPostHandler } from "../agents/history.js";
import { getTranslatedDataPostHandler } from "../agents/translate-agent.js";

const router = express.Router();

router.get("/history", getHistoryPostHandler);
router.get("/translate", getTranslatedDataPostHandler);

export const agentRouter: [string, express.Router] = ["/agents", router];

import express from "express";
import { agentRouter } from "./router/agents.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(agentRouter[0], agentRouter[1]);

function cb() {
  console.log("agentspace live at http://localhost:8090");
}

app.listen(8090, cb);

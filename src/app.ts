import express from "express";
import { testAgent } from "./agents/test-agent.js";
const app = express();

app.use(express.json());

(async () => {
  testAgent();
})();

function cb() {
  console.log("agentspace live at http://localhost:8090");
}

app.listen(8090, cb);

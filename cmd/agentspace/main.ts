import { initAgentspaceServer } from "../../internal/server/server.js";

const app = initAgentspaceServer();

function cb() {
  console.log("agentspace live at http://localhost:8090");
}

app.listen(8090, cb);

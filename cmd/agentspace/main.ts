import { initAgentspaceServer } from "../../internal/server/server.js";

const app = initAgentspaceServer();

app.listen(8090);

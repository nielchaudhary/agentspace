import express from "express";
const app = express();

function cb() {
  console.log("agentspace live at http://localhost:8090");
}

app.listen(8090, cb);

import http from "http";

import app from "./app";
import config from "./configs";

// const port = config.app.port || 3000;
const port = 3001;

const server = http.createServer(app).listen(port, () => {
  console.log(`[server]: Server is running on port ${port}`);
})

process.on("SIGINT", () => {
  server.close(() => {
    console.log("[server]: Server is closed");
  });
});
